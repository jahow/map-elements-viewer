import { main, State } from './reducer'
import { applyMiddleware, compose, createStore } from 'redux'
import { createEpicMiddleware, StateObservable } from 'redux-observable'
import {
  distinctUntilChanged,
  map,
  mergeMap,
  pairwise,
  tap,
  withLatestFrom,
} from 'rxjs/operators'
import { rootEpic } from './epics'
import { of } from 'rxjs'
import { fromArray } from 'rxjs/internal/observable/fromArray'

const epicMiddleware = createEpicMiddleware()

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const getStore = () => {
  const store = createStore(
    main,
    composeEnhancers(applyMiddleware(epicMiddleware))
  )
  epicMiddleware.run(rootEpic)
  return store
}

export const selectViewCenter = (state$: StateObservable<State>) =>
  state$.pipe(
    map(state => state.viewCenter),
    distinctUntilChanged()
  )

export const selectViewZoom = (state$: StateObservable<State>) =>
  state$.pipe(
    map(state => state.viewZoom),
    distinctUntilChanged()
  )

export const selectOrderedLayers = (state$: StateObservable<State>) =>
  state$.pipe(
    distinctUntilChanged(
      (state, prevState) =>
        state.layers === prevState.layers &&
        state.layerOrder === prevState.layerOrder
    ),
    map(state =>
      state.layerOrder.map((id, pos) => ({
        ...state.layers[id],
      }))
    )
  )

const selectLayerOrder = (state$: StateObservable<State>) =>
  state$.pipe(
    map(state => state.layerOrder),
    distinctUntilChanged()
  )

const splitLayers = (state$: StateObservable<State>) =>
  state$.pipe(
    map(state => state.layers),
    distinctUntilChanged(),
    pairwise(),
    withLatestFrom(selectLayerOrder(state$), (pair, layerOrder) => ({
      layers: pair[1],
      prevLayers: pair[0],
      layerOrder,
    }))
  )

export const selectAddedLayer = (state$: StateObservable<State>) =>
  splitLayers(state$).pipe(
    mergeMap(({ layers, prevLayers, layerOrder }) =>
      fromArray(
        Object.keys(layers)
          .filter(id => !prevLayers[id])
          .map(id => ({
            ...layers[id],
            _position: layerOrder.indexOf(id),
          }))
      )
    )
  )

export const selectUpdatedLayer = (state$: StateObservable<State>) =>
  splitLayers(state$).pipe(
    tap(console.log),
    mergeMap(({ layers, prevLayers, layerOrder }) =>
      fromArray(
        Object.keys(layers)
          .filter(
            id =>
              prevLayers[id] && prevLayers[id]._version !== layers[id]._version
          )
          .map(id => ({
            ...layers[id],
            _position: layerOrder.indexOf(id),
          }))
      )
    )
  )

export const selectRemovedLayer = (state$: StateObservable<State>) =>
  splitLayers(state$).pipe(
    mergeMap(({ layers, prevLayers, layerOrder }) =>
      fromArray(
        Object.keys(layers)
          .filter(
            id =>
              prevLayers[id] && prevLayers[id]._version !== layers[id]._version
          )
          .map(id => ({
            ...layers[id],
            _position: layerOrder.indexOf(id),
          }))
      )
    )
  )

export const selectMovedLayer = (state$: StateObservable<State>) =>
  selectLayerOrder(state$).pipe(
    pairwise(),
    withLatestFrom(state$, (pair, state) => ({
      layerOrder: pair[0],
      prevLayerOrder: pair[1],
      layers: state.layers,
    })),
    mergeMap(({ layerOrder, prevLayerOrder, layers }) =>
      fromArray(
        Object.keys(layers)
          .filter(id => layerOrder.indexOf(id) !== prevLayerOrder.indexOf(id))
          .map(id => ({
            ...layers[id],
            _position: layerOrder.indexOf(id),
            _previousPosition: prevLayerOrder.indexOf(id),
          }))
      )
    )
  )

export const selectDatasets = (state$: StateObservable<State>) =>
  state$.pipe(
    map(state => state.datasets),
    distinctUntilChanged()
  )

export const selectStyles = (state$: StateObservable<State>) =>
  state$.pipe(
    map(state => state.styles),
    distinctUntilChanged()
  )
