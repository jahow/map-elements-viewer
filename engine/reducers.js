import { Types as ActionTypes } from "./actions";

const initialState = {
  layers: {},
  layerOrder: [],
  viewCenter: [0, 0],
  viewZoom: 0
};

export function main(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.ADD_LAYER: {
      const layerId = action.payload.id;
      return {
        ...state,
        layers: {
          ...state.layers,
          [layerId]: {
            ...action.payload
          }
        },
        layerOrder: [...state.layerOrder, layerId]
      };
      break;
    }
    case ActionTypes.UPDATE_LAYER: {
      const layerId = action.payload.id;
      const _version = (state.layers[layerId]._version || 0) + 1;
      return {
        ...state,
        layers: {
          ...state.layers,
          [layerId]: {
            ...state.layers[layerId],
            ...action.payload,
            _version
          }
        }
      };
      break;
    }
    case ActionTypes.REMOVE_LAYER: {
      const layerId = action.payload;
      const { [layerId]: removed, ...layers } = state.layers;
      return {
        ...state,
        layers,
        layerOrder: state.layerOrder.filter(id => id !== layerId)
      };
      break;
    }
    case ActionTypes.SET_LAYER_POSITION: {
      const layerId = action.payload.id;
      const pos = action.payload.position;
      const layerOrder = state.layerOrder.filter(id => id !== layerId);
      layerOrder.splice(pos, 0, layerId);
      return {
        ...state,
        layerOrder
      };
      break;
    }
    case ActionTypes.SET_VIEW_CENTER: {
      return {
        ...state,
        viewCenter: [...action.payload]
      };
      break;
    }
    case ActionTypes.SET_VIEW_ZOOM: {
      return {
        ...state,
        viewZoom: action.payload
      };
      break;
    }
    default:
      return state;
  }
}
