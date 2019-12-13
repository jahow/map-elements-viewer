import {
  addLayer,
  addSource,
  addStyle,
  removeLayer,
  removeSource,
  removeStyle,
  setLayerPosition,
  setViewCenter,
  setViewZoom,
  updateLayer,
} from './actions'
import { Layer, Source, Style } from './model'
import {
  getStore,
  getStoreObservable,
  selectAddedLayer,
  selectAddedSources,
  selectAddedStyles,
  selectMovedLayer,
  selectOrderedLayers,
  selectRemovedLayer,
  selectRemovedSources,
  selectRemovedStyles,
  selectSources,
  selectSourcesMetadata,
  selectStyles,
  selectUpdatedLayer,
  selectUpdatedSources,
  selectUpdatedStyles,
  selectViewCenter,
  selectViewZoom,
} from './store'
import { distinctUntilChanged, filter } from 'rxjs/operators'

export class Facade {
  store = getStore()
  state$ = getStoreObservable(this.store)

  viewZoom$ = selectViewZoom(this.state$)
  viewCenter$ = selectViewCenter(this.state$)
  layerAdded$ = selectAddedLayer(this.state$)
  layerRemoved$ = selectRemovedLayer(this.state$)
  layerUpdated$ = selectUpdatedLayer(this.state$)
  layerMoved$ = selectMovedLayer(this.state$)
  layers$ = selectOrderedLayers(this.state$)

  sourceAdded$ = selectAddedSources(this.state$)
  sourceRemoved$ = selectRemovedSources(this.state$)
  sourceUpdated$ = selectUpdatedSources(this.state$)
  sources$ = selectSources(this.state$)
  sourcesMetadata$ = selectSourcesMetadata(this.state$)

  styleAdded$ = selectAddedStyles(this.state$)
  styleRemoved$ = selectRemovedStyles(this.state$)
  styleUpdated$ = selectUpdatedStyles(this.state$)
  styles$ = selectStyles(this.state$)

  constructor() {}

  addLayer(layer: Layer) {
    this.store.dispatch(
      addLayer({
        visible: true,
        opacity: 1,
        ...layer,
      })
    )
  }

  setLayerVisible(id: string, visible: boolean) {
    this.store.dispatch(
      updateLayer({
        id,
        visible,
      })
    )
  }

  removeLayer(id: string) {
    this.store.dispatch(removeLayer(id))
  }

  setLayerPosition(id: string, position: number) {
    this.store.dispatch(setLayerPosition({ id, position }))
  }

  setViewZoom(zoom: number) {
    this.store.dispatch(setViewZoom(zoom))
  }

  setViewCenter(center: [number, number]) {
    this.store.dispatch(setViewCenter(center))
  }

  addSource(source: Source) {
    this.store.dispatch(addSource(source))
  }

  removeSource(id: string) {
    this.store.dispatch(removeSource(id))
  }

  getSourceMetadata(sourceId: string) {
    this.sourcesMetadata$.pipe(
      filter(sourcesMetadata => !!sourcesMetadata[sourceId]),
      distinctUntilChanged()
    )
  }

  addStyle(style: Style) {
    this.store.dispatch(addStyle(style))
  }

  removeStyle(id: string) {
    this.store.dispatch(removeStyle(id))
  }
}
