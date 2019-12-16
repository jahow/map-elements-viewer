import { MapFoldComponent } from '../base'
import { Map, View } from 'ol'
import ImageLayer from 'ol/layer/Image'
import TileLayer from 'ol/layer/Tile'
import ImageWMS from 'ol/source/ImageWMS'
import VectorSource from 'ol/source/Vector'
import { merge } from 'rxjs'
import { filter } from 'rxjs/operators'
import VectorLayer from 'ol/layer/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import XYZ from 'ol/source/XYZ'
import { defaults as defaultControls } from 'ol/control'
import WebGLPointsLayer from 'ol/layer/WebGLPoints'
import Point from 'ol/geom/Point'
import Feature from 'ol/Feature'
import { fromLonLat } from 'ol/proj'

class OlMap extends MapFoldComponent {
  connectedCallback() {
    this.style.background = 'lightgray'

    const map = new Map({
      view: new View(),
      target: this,
      controls: defaultControls({
        zoom: false,
        rotate: false,
      }),
    })

    // add positron basemap
    map.addLayer(
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
      const layers = map.getLayers().getArray()
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
          map.addLayer(
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
          map.addLayer(
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
          map.addLayer(
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
        map.removeLayer(layer)
      }
    })

    this.engine.layerMoved$.subscribe(({ id, _position }) => {
      const layer = getLayerById(id)
      if (layer) {
        layer.setZIndex(_position)
      }
    })

    this.engine.viewZoom$.subscribe(zoom => {
      map.getView().setZoom(zoom)
    })

    this.engine.viewCenter$.subscribe(center => {
      map.getView().setCenter(fromLonLat(center))
    })

    merge(this.engine.sourceAdded$, this.engine.sourceUpdated$).subscribe(
      source => {
        switch (source.type) {
          case 'local':
            const features = geojson.readFeatures(source.features, {
              dataProjection: 'EPSG:4326',
              featureProjection: map
                .getView()
                .getProjection()
                .getCode(),
            })
            if (!vectorSources[source.id]) {
              vectorSources[source.id] = new VectorSource({
                features,
              })
            } else {
              vectorSources[source.id].clear()
              vectorSources[source.id].addFeatures(features)
            }
            break
          case 'elastic':
            if (!vectorSources[source.id]) {
              vectorSources[source.id] = new VectorSource({
                features: [],
              })
            }
            fetch(source.url, {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                query: {
                  bool: {
                    must: [...source.mustParams],
                  },
                },
                from: 0,
                size: 10000,
              }),
            })
              .then(response => response.json())
              .then(json => {
                console.log(json)
                const features = json.hits.hits.map(
                  hit =>
                    new Feature({
                      geometry: geojson.readGeometry(hit._source.geom, {
                        dataProjection: 'EPSG:4326',
                        featureProjection: map
                          .getView()
                          .getProjection()
                          .getCode(),
                      }),
                    })
                )
                vectorSources[source.id].addFeatures(features)
              })
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
