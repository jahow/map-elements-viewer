import {
  Actions,
  ADD_DATASET,
  ADD_LAYER,
  ADD_STYLE,
  REMOVE_DATASET,
  REMOVE_LAYER,
  REMOVE_STYLE,
  SET_LAYER_POSITION,
  SET_VIEW_CENTER,
  SET_VIEW_ZOOM,
  UPDATE_DATASET,
  UPDATE_LAYER,
  UPDATE_STYLE,
} from './actions'
import {
  Dataset,
  Layer,
  LayersCapabilities,
  LayersDataSchema,
  Style,
  Versioned,
  ViewCenter,
  ViewZoom,
} from './model'

export interface State {
  layers: { [id: string]: Layer & Versioned }
  layerOrder: string[]
  datasets: { [id: string]: Dataset & Versioned }
  styles: { [id: string]: Style & Versioned }
  viewCenter: ViewCenter
  viewZoom: ViewZoom
  layersCapabilities: LayersCapabilities
  layersDataSchema: LayersDataSchema
}

export const initialState: State = {
  layers: {},
  layerOrder: [],
  datasets: {},
  styles: {},
  viewCenter: [0, 0],
  viewZoom: 0,
  layersCapabilities: {},
  layersDataSchema: {},
}

export function main(state = initialState, action: Actions): State {
  switch (action.type) {
    case ADD_LAYER: {
      const layerId = action.payload.id
      return {
        ...state,
        layers: {
          ...state.layers,
          [layerId]: {
            ...action.payload,
            _version: 0,
          },
        },
        layerOrder: [...state.layerOrder, layerId],
      }
    }
    case UPDATE_LAYER: {
      const layerId = action.payload.id
      const _version = state.layers[layerId]._version + 1
      return {
        ...state,
        layers: {
          ...state.layers,
          [layerId]: {
            ...state.layers[layerId],
            ...action.payload,
            _version,
          },
        },
      }
    }
    case REMOVE_LAYER: {
      const layerId = action.id
      const { [layerId]: removed, ...layers } = state.layers
      return {
        ...state,
        layers: layers as { [id: string]: Layer & Versioned },
        layerOrder: state.layerOrder.filter(id => id !== layerId),
      }
    }
    case SET_LAYER_POSITION: {
      const layerId = action.payload.id
      const pos = action.payload.position
      const layerOrder = state.layerOrder.filter(id => id !== layerId)
      layerOrder.splice(pos, 0, layerId)
      return {
        ...state,
        layerOrder,
      }
    }
    case SET_VIEW_CENTER: {
      return {
        ...state,
        viewCenter: [action.payload[0], action.payload[1]],
      }
    }
    case SET_VIEW_ZOOM: {
      return {
        ...state,
        viewZoom: action.payload,
      }
    }
    case ADD_DATASET: {
      const datasetId = action.payload.id
      return {
        ...state,
        datasets: {
          ...state.datasets,
          [datasetId]: {
            ...action.payload,
            _version: 0,
          },
        },
      }
    }
    case UPDATE_DATASET: {
      const datasetId = action.payload.id
      const _version = state.datasets[datasetId]._version + 1
      return {
        ...state,
        datasets: {
          ...state.datasets,
          [datasetId]: {
            ...state.datasets[datasetId],
            ...action.payload,
            _version,
          },
        },
      }
    }
    case REMOVE_DATASET: {
      const datasetId = action.id
      const { [datasetId]: removed, ...datasets } = state.datasets
      return {
        ...state,
        datasets: datasets as { [id: string]: Dataset & Versioned },
      }
    }
    case ADD_STYLE: {
      const styleId = action.payload.id
      return {
        ...state,
        styles: {
          ...state.styles,
          [styleId]: {
            ...action.payload,
            _version: 0,
          },
        },
      }
    }
    case UPDATE_STYLE: {
      const styleId = action.payload.id
      const _version = state.styles[styleId]._version + 1
      return {
        ...state,
        styles: {
          ...state.styles,
          [styleId]: {
            ...state.styles[styleId],
            ...action.payload,
            _version,
          },
        },
      }
    }
    case REMOVE_STYLE: {
      const styleId = action.id
      const { [styleId]: removed, ...styles } = state.styles
      return {
        ...state,
        styles: styles as { [id: string]: Style & Versioned },
      }
    }
  }
  return state
}
