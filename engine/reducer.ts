import { Actions, Types as ActionTypes } from './actions'
import { Dataset, Layer, Style, Versioned } from './model'

interface State {
  layers: { [id: string]: Layer & Versioned }
  layerOrder: string[]
  datasets: { [id: string]: Dataset & Versioned }
  styles: { [id: string]: Style & Versioned }
  viewCenter: [number, number]
  viewZoom: number
}

const initialState: State = {
  layers: {},
  layerOrder: [],
  datasets: {},
  styles: {},
  viewCenter: [0, 0],
  viewZoom: 0,
}

export function main(state = initialState, action: Actions): State {
  switch (action.type) {
    case ActionTypes.ADD_LAYER: {
      const layerId = action.payload.id
      return {
        ...state,
        layers: {
          ...state.layers,
          [layerId]: {
            ...action.payload,
          },
        },
        layerOrder: [...state.layerOrder, layerId],
      }
    }
    case ActionTypes.UPDATE_LAYER: {
      const layerId = action.payload.id
      const _version = (state.layers[layerId]._version || 0) + 1
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
    case ActionTypes.REMOVE_LAYER: {
      const layerId = action.id
      const { [layerId]: removed, ...layers } = state.layers
      return {
        ...state,
        layers,
        layerOrder: state.layerOrder.filter(id => id !== layerId),
      }
    }
    case ActionTypes.SET_LAYER_POSITION: {
      const layerId = action.payload.id
      const pos = action.payload.position
      const layerOrder = state.layerOrder.filter(id => id !== layerId)
      layerOrder.splice(pos, 0, layerId)
      return {
        ...state,
        layerOrder,
      }
    }
    case ActionTypes.SET_VIEW_CENTER: {
      return {
        ...state,
        viewCenter: [action.payload[0], action.payload[1]],
      }
    }
    case ActionTypes.SET_VIEW_ZOOM: {
      return {
        ...state,
        viewZoom: action.payload,
      }
    }
    case ActionTypes.ADD_DATASET: {
      const datasetId = action.payload.id
      return {
        ...state,
        datasets: {
          ...state.datasets,
          [datasetId]: action.payload,
        },
      }
    }
    case ActionTypes.UPDATE_DATASET: {
      const datasetId = action.payload.id
      const _version = (state.datasets[datasetId]._version || 0) + 1
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
    case ActionTypes.REMOVE_DATASET: {
      const datasetId = action.id
      const { [datasetId]: removed, ...datasets } = state.datasets
      return {
        ...state,
        datasets,
      }
    }
    case ActionTypes.ADD_STYLE: {
      const styleId = action.payload.id
      return {
        ...state,
        styles: {
          ...state.styles,
          [styleId]: action.payload,
        },
      }
    }
    case ActionTypes.UPDATE_STYLE: {
      const styleId = action.payload.id
      const _version = (state.styles[styleId]._version || 0) + 1
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
    case ActionTypes.REMOVE_STYLE: {
      const styleId = action.id
      const { [styleId]: removed, ...styles } = state.styles
      return {
        ...state,
        styles,
      }
    }
  }
  return state
}
