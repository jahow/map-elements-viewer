import {
  addDataset,
  addLayer,
  addStyle,
  removeDataset,
  removeLayer,
  removeStyle,
  setLayerPosition,
  setViewCenter,
  setViewZoom,
  updateLayer,
} from './actions'
import { Dataset, Layer, LayerType, Style } from './model'
import {
  getStore,
  getStoreObservable,
  selectAddedDatasets,
  selectAddedLayer,
  selectAddedStyles,
  selectDatasets,
  selectMovedLayer,
  selectOrderedLayers,
  selectRemovedDatasets,
  selectRemovedLayer,
  selectRemovedStyles,
  selectStyles,
  selectUpdatedDatasets,
  selectUpdatedLayer,
  selectUpdatedStyles,
  selectViewCenter,
  selectViewZoom,
} from './store'

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

  datasetAdded$ = selectAddedDatasets(this.state$)
  datasetRemoved$ = selectRemovedDatasets(this.state$)
  datasetUpdated$ = selectUpdatedDatasets(this.state$)
  datasets$ = selectDatasets(this.state$)

  styleAdded$ = selectAddedStyles(this.state$)
  styleRemoved$ = selectRemovedStyles(this.state$)
  styleUpdated$ = selectUpdatedStyles(this.state$)
  styles$ = selectStyles(this.state$)

  constructor() {}

  addLayer(layer: Layer, type: LayerType) {
    this.store.dispatch(
      addLayer({
        visible: true,
        opacity: 1,
        type,
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

  addDataset(dataset: Dataset) {
    this.store.dispatch(addDataset(dataset))
  }

  removeDataset(id: string) {
    this.store.dispatch(removeDataset(id))
  }

  addStyle(style: Style) {
    this.store.dispatch(addStyle(style))
  }

  removeStyle(id: string) {
    this.store.dispatch(removeStyle(id))
  }
}
