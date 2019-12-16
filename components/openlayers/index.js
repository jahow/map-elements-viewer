import { MapFoldComponent } from '../base'
import { Map, View } from 'ol'
import ImageLayer from 'ol/layer/Image'
import TileLayer from 'ol/layer/Tile'
import ImageWMS from 'ol/source/ImageWMS'
import VectorSource from 'ol/source/Vector'
import { merge, Subject } from 'rxjs'
import VectorLayer from 'ol/layer/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import XYZ from 'ol/source/XYZ'
import { defaults as defaultControls } from 'ol/control'
import WebGLPointsLayer from 'ol/layer/WebGLPoints'
import Feature from 'ol/Feature'
import { fromLonLat, transformExtent } from 'ol/proj'
import { map, throttleTime } from 'rxjs/operators'
import { getIntersection } from 'ol/extent'

class OlMap extends MapFoldComponent {
  connectedCallback() {
    this.style.background = 'lightgray'

    const view = new View()
    const olMap = new Map({
      view,
      target: this,
      controls: defaultControls({
        zoom: false,
        rotate: false,
      }),
    })

    const extentChanged$ = new Subject()
    view.on(['change:center', 'change:resolution'], () => {
      if (view.getResolution() && view.getCenter()) {
        extentChanged$.next()
      }
    })
    const extent$ = extentChanged$.pipe(
      throttleTime(200, undefined, {
        trailing: true,
      }),
      map(() =>
        transformExtent(
          view.calculateExtent(),
          view.getProjection(),
          'EPSG:4326'
        )
      )
    )
    extent$.subscribe(extent => this.engine.setViewExtent(extent))

    // add positron basemap
    olMap.addLayer(
      new TileLayer({
        source: new XYZ({
          urls: [
            'http://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
            'http://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
            'http://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
          ],
          crossOrigin: 'anonymous',
        }),
      })
    )

    const vectorSources = {}

    const geojson = new GeoJSON()

    const getLayerById = id => {
      const layers = olMap.getLayers().getArray()
      for (let i = 0; i < layers.length; i++) {
        if (layers[i].get('id') === id) return layers[i]
      }
      return null
    }

    this.engine.layerAdded$.subscribe(layer => {
      if (!layer.source) {
        return
      }

      const sourceType = layer.source.type
      const sourceId = layer.source.id

      if (sourceType === 'local' && !vectorSources[sourceId]) {
        vectorSources[sourceId] = new VectorSource({
          features: [],
        })
      }

      switch (sourceType) {
        case 'wms': {
          olMap.addLayer(
            new ImageLayer({
              source: new ImageWMS({
                url: source.url,
                params: {
                  LAYERS: source.resourceName,
                },
              }),
              id: layer.id,
              opacity: layer.opacity,
              visible: layer.visible,
              zIndex: layer._position,
            })
          )
          break
        }
        case 'local': {
          olMap.addLayer(
            new VectorLayer({
              source: vectorSources[sourceId],
              id: layer.id,
              opacity: layer.opacity,
              visible: layer.visible,
              zIndex: layer._position,
            })
          )
          break
        }
        case 'elastic': {
          // FIXME: assume points and use a webgl points renderer
          olMap.addLayer(
            new WebGLPointsLayer({
              source: vectorSources[sourceId],
              id: layer.id,
              opacity: layer.opacity,
              visible: layer.visible,
              zIndex: layer._position,
              style: {
                symbol: {
                  symbolType: 'circle',
                  color: 'orange',
                  size: 8,
                },
              },
            })
          )
          break
        }
      }
    })

    this.engine.layerUpdated$.subscribe(layerInfo => {
      const layer = getLayerById(layerInfo.id)
      if (layer) {
        layer.setVisible(layerInfo.visible)
        layer.setOpacity(layerInfo.opacity)

        const sourceType = layerInfo.source.type
        const sourceId = layerInfo.source.id

        if (sourceType === 'local' && !vectorSources[sourceId]) {
          vectorSources[sourceId] = new VectorSource({
            features: [],
          })
        }

        if (layer instanceof VectorLayer) {
          layer.setSource(vectorSources[sourceId])
        }
      }
    })

    this.engine.layerRemoved$.subscribe(({ id }) => {
      const layer = getLayerById(id)
      if (layer) {
        olMap.removeLayer(layer)
      }
    })

    this.engine.layerMoved$.subscribe(({ id, _position }) => {
      const layer = getLayerById(id)
      if (layer) {
        layer.setZIndex(_position)
      }
    })

    this.engine.viewZoom$.subscribe(zoom => {
      view.setZoom(zoom)
    })

    this.engine.viewCenter$.subscribe(center => {
      view.setCenter(fromLonLat(center))
    })

    merge(this.engine.sourceAdded$, this.engine.sourceUpdated$).subscribe(
      source => {
        let olSource

        switch (source.type) {
          case 'local':
            const features = geojson.readFeatures(source.features, {
              dataProjection: 'EPSG:4326',
              featureProjection: map
                .getView()
                .getProjection()
                .getCode(),
            })
            olSource = vectorSources[source.id]
            if (!olSource) {
              olSource = vectorSources[source.id] = new VectorSource({
                features,
              })
            } else {
              olSource.clear()
              olSource.addFeatures(features)
            }
            break

          case 'elastic':
            olSource = vectorSources[source.id]
            if (!olSource) {
              olSource = vectorSources[source.id] = new VectorSource({
                features: [],
              })
              const loadExtent = extent => {
                if (view.getAnimating() || view.getInteracting()) {
                  return
                }
                const safeExtent = getIntersection(extent, [-180, -90, 180, 90])
                fetch(source.url, {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    _source: 'geom',
                    query: {
                      bool: {
                        must: [
                          ...source.mustParams,
                          {
                            geo_bounding_box: {
                              location: {
                                top_left: [safeExtent[0], safeExtent[3]],
                                bottom_right: [safeExtent[2], safeExtent[1]],
                              },
                            },
                          },
                        ],
                      },
                    },
                    from: 0,
                    size: 10000,
                    track_total_hits: true,
                  }),
                })
                  .then(response => response.json())
                  .then(json => {
                    const features = json.hits.hits.map(
                      hit =>
                        new Feature({
                          geometry: geojson.readGeometry(hit._source.geom, {
                            dataProjection: 'EPSG:4326',
                            featureProjection: view.getProjection(),
                          }),
                        })
                    )
                    olSource.clear()
                    olSource.addFeatures(features)
                    olSource.removeLoadedExtent([
                      -Infinity,
                      -Infinity,
                      Infinity,
                      Infinity,
                    ])
                  })
              }
              loadExtent(
                transformExtent(
                  view.calculateExtent(),
                  view.getProjection(),
                  'EPSG:4326'
                )
              )
              extent$.subscribe(loadExtent)
            }
            break
        }
      }
    )

    this.engine.sourceRemoved$.subscribe(id => {
      vectorSources[id].clear()
      vectorSources[id] = undefined
    })
  }
}

customElements.define('mapfold-openlayers', OlMap)
