import { applyMiddleware, createStore } from 'redux'
import { Subject } from 'rxjs'
import { main } from './reducer'
import {
  AddDataset,
  AddLayer,
  AddStyle,
  RemoveDataset,
  RemoveLayer,
  RemoveStyle,
  SetLayerPosition,
  SetViewCenter,
  SetViewZoom,
  UpdateLayer,
} from './actions'
import { Dataset, Layer, LayerType, Style } from './model'

import { createEpicMiddleware } from 'redux-observable'
import { rootEpic } from './epics'

const epicMiddleware = createEpicMiddleware()

export class Facade {
  store = createStore(
    main,
    applyMiddleware(
      (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
        (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
      epicMiddleware
    )
  )

  viewZoom$ = new Subject()
  viewCenter$ = new Subject()
  layerAdded$ = new Subject()
  layerRemoved$ = new Subject()
  layerUpdated$ = new Subject()
  layerMoved$ = new Subject()
  layers$ = new Subject()

  datasetAdded$ = new Subject()
  datasetRemoved$ = new Subject()
  datasetUpdated$ = new Subject()
  datasets$ = new Subject()

  styleAdded$ = new Subject()
  styleRemoved$ = new Subject()
  styleUpdated$ = new Subject()
  styles$ = new Subject()

  constructor() {
    epicMiddleware.run(rootEpic)

    const broadcastLayers = state => {
      this.layers$.next(
        state.layerOrder.map((id, pos) => ({
          ...state.layers[id],
          _position: pos,
        }))
      )
    }

    let previousState = this.store.getState()
    this.store.subscribe(() => {
      const state = this.store.getState()

      if (state.viewZoom !== previousState.viewZoom) {
        this.viewZoom$.next(state.viewZoom)
      }
      if (state.viewCenter !== previousState.viewCenter) {
        this.viewCenter$.next(state.viewCenter)
      }

      // LAYERS
      if (state.layers !== previousState.layers) {
        for (let id in state.layers) {
          if (!previousState.layers[id]) {
            this.layerAdded$.next({
              ...state.layers[id],
              _position: state.layerOrder.indexOf(id),
            })
          } else if (
            previousState.layers[id]._version !== state.layers[id]._version
          ) {
            this.layerUpdated$.next({
              ...state.layers[id],
              _position: state.layerOrder.indexOf(id),
            })
          }
        }
        for (let id in previousState.layers) {
          if (!state.layers[id]) {
            this.layerRemoved$.next(previousState.layers[id])
          }
        }
        broadcastLayers(state)
      }
      if (state.layerOrder !== previousState.layerOrder) {
        for (let id in state.layers) {
          const pos = state.layerOrder.indexOf(id)
          const prevPos = previousState.layerOrder.indexOf(id)
          if (pos !== prevPos) {
            this.layerMoved$.next({
              ...state.layers[id],
              _position: pos,
              _previousPosition: prevPos,
            })
          }
        }
        broadcastLayers(state)
      }

      // DATASETS
      if (state.datasets !== previousState.datasets) {
        for (let id in state.datasets) {
          if (!previousState.datasets[id]) {
            this.datasetAdded$.next(state.datasets[id])
          } else if (
            previousState.datasets[id]._version !== state.datasets[id]._version
          ) {
            this.datasetUpdated$.next(state.datasets[id])
          }
        }
        for (let id in previousState.datasets) {
          if (!state.datasets[id]) {
            this.datasetRemoved$.next(previousState.datasets[id])
          }
        }
        this.datasets$.next(state.datasets)
      }

      // STYLES
      if (state.styles !== previousState.styles) {
        for (let id in state.styles) {
          if (!previousState.styles[id]) {
            this.styleAdded$.next(state.styles[id])
          } else if (
            previousState.styles[id]._version !== state.styles[id]._version
          ) {
            this.styleUpdated$.next(state.styles[id])
          }
        }
        for (let id in previousState.styles) {
          if (!state.styles[id]) {
            this.styleRemoved$.next(previousState.styles[id])
          }
        }
        this.styles$.next(state.styles)
      }

      previousState = state
    })
  }

  addLayer(layer: Layer, type: LayerType) {
    this.store.dispatch(
      new AddLayer({
        visible: true,
        opacity: 1,
        type,
        ...layer,
      })
    )
  }

  setLayerVisible(id: string, visible: boolean) {
    this.store.dispatch(
      new UpdateLayer({
        id,
        visible,
      })
    )
  }

  removeLayer(id: string) {
    this.store.dispatch(new RemoveLayer(id))
  }

  setLayerPosition(id: string, position: number) {
    this.store.dispatch(new SetLayerPosition({ id, position }))
  }

  setViewZoom(zoom: number) {
    this.store.dispatch(new SetViewZoom(zoom))
  }

  setViewCenter(center: [number, number]) {
    this.store.dispatch(new SetViewCenter(center))
  }

  addDataset(dataset: Dataset) {
    this.store.dispatch(new AddDataset(dataset))
  }

  removeDataset(id: string) {
    this.store.dispatch(new RemoveDataset(id))
  }

  addStyle(style: Style) {
    this.store.dispatch(new AddStyle(style))
  }

  removeStyle(id: string) {
    this.store.dispatch(new RemoveStyle(id))
  }
}
