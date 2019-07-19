import { createStore } from "redux";
import { Subject } from "rxjs";
import { main } from "./reducers";
import {
  addLayer,
  removeLayer,
  setLayerPosition,
  setViewCenter,
  setViewZoom,
  updateLayer
} from "./actions";

export class Facade {
  constructor() {
    this.store = createStore(
      main,
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__()
    );

    this.viewZoom$ = new Subject();
    this.viewCenter$ = new Subject();
    this.layerAdded$ = new Subject();
    this.layerRemoved$ = new Subject();
    this.layerUpdated$ = new Subject();
    this.layerMoved$ = new Subject();
    this.layers$ = new Subject();

    const broadcastLayers = state => {
      this.layers$.next(state.layerOrder.map(id => state.layers[id]));
    };

    let previousState = this.store.getState();
    this.store.subscribe(() => {
      const state = this.store.getState();

      if (state.viewZoom !== previousState.viewZoom) {
        this.viewZoom$.next(state.viewZoom);
      }
      if (state.viewCenter !== previousState.viewCenter) {
        this.viewCenter$.next(state.viewCenter);
      }
      if (state.layers !== previousState.layers) {
        for (let id in state.layers) {
          if (!previousState.layers[id]) {
            this.layerAdded$.next(state.layers[id]);
          } else if (
            previousState.layers[id]._version !== state.layers[id]._version
          ) {
            this.layerUpdated$.next(state.layers[id]);
          }
        }
        for (let id in previousState.layers) {
          if (!state.layers[id]) {
            this.layerRemoved$.next(previousState.layers[id]);
          }
        }
        broadcastLayers(state);
      }
      if (state.layerOrder !== previousState.layerOrder) {
        for (let id in state.layers) {
          const pos = state.layerOrder.indexOf(id);
          const prevPos = previousState.layerOrder.indexOf(id);
          if (pos !== prevPos) {
            this.layerMoved$.next({
              ...state.layers[id],
              _position: pos,
              _previousPosition: prevPos
            });
          }
        }
        broadcastLayers(state);
      }

      previousState = state;
    });
  }

  addLayer(layer) {
    this.store.dispatch(
      addLayer({
        visible: true,
        opacity: 1,
        ...layer
      })
    );
  }

  setLayerVisible(id, visible) {
    this.store.dispatch(
      updateLayer({
        id,
        visible
      })
    );
  }

  removeLayer(id) {
    this.store.dispatch(removeLayer(id));
  }

  setLayerPosition(id, position) {
    this.store.dispatch(setLayerPosition({ id, position }));
  }

  setViewZoom(zoom) {
    this.store.dispatch(setViewZoom(zoom));
  }

  setViewCenter(center) {
    this.store.dispatch(setViewCenter(center));
  }
}