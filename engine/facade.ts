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
