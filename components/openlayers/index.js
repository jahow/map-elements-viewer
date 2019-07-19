import { MapFoldComponent } from "../base";
import { Map, View } from "ol";
import ImageLayer from "ol/layer/Image";
import OSM from "ol/source/OSM";
import TileLayer from "ol/layer/Tile";
import ImageWMS from "ol/source/ImageWMS";

class OlMap extends MapFoldComponent {
  connectedCallback() {
    console.log("ol-map created successfully!");

    this.style.width = "100%";
    this.style.height = "100%";
    this.style.display = "block";
    this.style.background = "lightgray";

    const map = new Map({
      view: new View(),
      target: this
    });

    const getLayerById = id => {
      const layers = map.getLayers().getArray();
      for (let i = 0; i < layers.length; i++) {
        if (layers[i].get("id") === id) return layers[i];
      }
      return null;
    };

    this.engine.layerAdded$.subscribe(layer => {
      switch (layer.type) {
        case "osm": {
          map.addLayer(
            new TileLayer({
              source: new OSM(),
              id: layer.id
            })
          );
          break;
        }
        case "wms": {
          map.addLayer(
            new ImageLayer({
              source: new ImageWMS({
                url: layer.url,
                params: {
                  LAYERS: layer.resourceName
                }
              }),
              id: layer.id
            })
          );
          break;
        }
      }
    });

    this.engine.layerUpdated$.subscribe(layerInfo => {
      const layer = getLayerById(layerInfo.id);
      if (layer) {
        layer.setVisible(layerInfo.visible);
        layer.setOpacity(layerInfo.opacity);
      }
    });

    this.engine.layerRemoved$.subscribe(({ id }) => {
      const layer = getLayerById(id);
      if (layer) {
        map.removeLayer(layer);
      }
    });

    this.engine.layerMoved$.subscribe(({ id, _position }) => {
      const layer = getLayerById(id);
      if (layer) {
        layer.setZIndex(_position);
      }
    });

    this.engine.viewZoom$.subscribe(zoom => {
      map.getView().setZoom(zoom);
    });

    this.engine.viewCenter$.subscribe(center => {
      map.getView().setCenter(center);
    });
  }
}

customElements.define("mapfold-openlayers", OlMap);
