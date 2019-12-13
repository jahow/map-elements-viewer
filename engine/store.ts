import { main, State } from './reducer'
import { applyMiddleware, compose, createStore, Store } from 'redux'
import { createEpicMiddleware } from 'redux-observable'
import {
  distinctUntilChanged,
  map,
  mergeMap,
  pairwise,
  withLatestFrom,
} from 'rxjs/operators'
import { fromArray } from 'rxjs/internal/observable/fromArray'
import { Observable } from 'rxjs'
import { Versioned } from './model'
import { Actions } from './actions'

const epicMiddleware = createEpicMiddleware()

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const getStore = () => {
  const store = createStore(
    main,
    composeEnhancers(applyMiddleware(epicMiddleware))
  )
  //epicMiddleware.run(rootEpic)
  return store
}

export const getStoreObservable = (store: Store<State, Actions>) => {
  return new Observable<State>(subscriber => {
    subscriber.next(store.getState())
    store.subscribe(() => {
      subscriber.next(store.getState())
    })
  })
}

export const selectViewCenter = (state$: Observable<State>) =>
  state$.pipe(
    map(state => state.viewCenter),
    distinctUntilChanged()
  )

export const selectViewZoom = (state$: Observable<State>) =>
  state$.pipe(
    map(state => state.viewZoom),
    distinctUntilChanged()
  )

export const selectOrderedLayers = (state$: Observable<State>) =>
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

const selectLayerOrder = (state$: Observable<State>) =>
  state$.pipe(
    map(state => state.layerOrder),
    distinctUntilChanged<string[]>()
  )

const splitLayers = (state$: Observable<State>) =>
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

export const selectAddedLayer = (state$: Observable<State>) =>
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

export const selectUpdatedLayer = (state$: Observable<State>) =>
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

export const selectRemovedLayer = (state$: Observable<State>) =>
  splitLayers(state$).pipe(
    mergeMap(({ layers, prevLayers }) =>
      fromArray(
        Object.keys(prevLayers)
          .filter(id => !layers[id])
          .map(id => prevLayers[id])
      )
    )
  )

export const selectMovedLayer = (state$: Observable<State>) =>
  selectLayerOrder(state$).pipe(
    pairwise(),
    withLatestFrom(state$, (pair, state) => ({
      layerOrder: pair[1],
      prevLayerOrder: pair[0],
      layers: state.layers,
    })),
    mergeMap(({ layerOrder, prevLayerOrder, layers }) =>
      fromArray(
        Object.keys(layers)
          .filter(
            id =>
              layerOrder.indexOf(id) !== prevLayerOrder.indexOf(id) &&
              layerOrder.indexOf(id) > -1 &&
              prevLayerOrder.indexOf(id) > -1
          )
          .map(id => ({
            ...layers[id],
            _position: layerOrder.indexOf(id),
            _previousPosition: prevLayerOrder.indexOf(id),
          }))
      )
    )
  )

export function selectAddedObject<T>(
  dict$: Observable<{ [key: string]: T }>
): Observable<T> {
  return dict$.pipe(
    pairwise(),
    mergeMap(([prevDict, dict]) =>
      fromArray(
        Object.keys(dict)
          .filter(id => !prevDict[id])
          .map(id => dict[id])
      )
    )
  )
}

export function selectUpdatedObject<T extends Versioned>(
  dict$: Observable<{ [key: string]: T }>
): Observable<T> {
  return dict$.pipe(
    pairwise(),
    mergeMap(([prevDict, dict]) =>
      fromArray(
        Object.keys(dict)
          .filter(
            id => prevDict[id] && prevDict[id]._version !== dict[id]._version
          )
          .map(id => dict[id])
      )
    )
  )
}

export function selectRemovedObject<T>(
  dict$: Observable<{ [key: string]: T }>
): Observable<T> {
  return dict$.pipe(
    pairwise(),
    mergeMap(([prevDict, dict]) =>
      fromArray(
        Object.keys(prevDict)
          .filter(id => !dict[id])
          .map(id => prevDict[id])
      )
    )
  )
}

export const selectSources = (state$: Observable<State>) =>
  state$.pipe(
    map(state => state.sources),
    distinctUntilChanged()
  )

export const selectAddedSources = (state$: Observable<State>) =>
  selectSources(state$).pipe(selectAddedObject)

export const selectUpdatedSources = (state$: Observable<State>) =>
  selectSources(state$).pipe(selectUpdatedObject)

export const selectRemovedSources = (state$: Observable<State>) =>
  selectSources(state$).pipe(selectRemovedObject)

export const selectSourcesMetadata = (state$: Observable<State>) =>
  state$.pipe(
    map(state => state.sourcesMetadata),
    distinctUntilChanged()
  )

export const selectStyles = (state$: Observable<State>) =>
  state$.pipe(
    map(state => state.styles),
    distinctUntilChanged()
  )

export const selectAddedStyles = (state$: Observable<State>) =>
  selectStyles(state$).pipe(selectAddedObject)

export const selectUpdatedStyles = (state$: Observable<State>) =>
  selectStyles(state$).pipe(selectUpdatedObject)

export const selectRemovedStyles = (state$: Observable<State>) =>
  selectStyles(state$).pipe(selectRemovedObject)
