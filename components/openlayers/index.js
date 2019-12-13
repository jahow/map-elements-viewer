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
      }
    })

    this.engine.layerUpdated$.subscribe(layerInfo => {
      const layer = getLayerById(layerInfo.id)
      if (layer) {
        layer.setVisible(layerInfo.visible)
        layer.setOpacity(layerInfo.opacity)

        const sourceType = layer.source.type
        const sourceId = layer.source.id

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
      map.getView().setCenter(center)
    })

    merge(this.engine.sourceAdded$, this.engine.sourceUpdated$)
      .pipe(filter(source => source.type === 'local'))
      .subscribe(source => {
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
      })

    this.engine.sourceRemoved$.subscribe(id => {
      vectorSources[id].clear()
      vectorSources[id] = undefined
    })
  }
}

customElements.define('mapfold-openlayers', OlMap)
