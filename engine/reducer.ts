import {
  Actions,
  ADD_LAYER,
  ADD_SOURCE,
  ADD_STYLE,
  REMOVE_LAYER,
  REMOVE_SOURCE,
  REMOVE_STYLE,
  SET_LAYER_POSITION,
  SET_SOURCE_METADATA,
  SET_VIEW_CENTER,
  SET_VIEW_EXTENT,
  SET_VIEW_ZOOM,
  UPDATE_LAYER,
  UPDATE_SOURCE,
  UPDATE_STYLE,
} from './actions'
import {
  Layer,
  Source,
  SourceMetadata,
  Style,
  Versioned,
  ViewCenter,
  ViewExtent,
  ViewZoom,
} from './model'

export type StateLayers = { [id: string]: Layer & Versioned }
export type StateSources = { [id: string]: Source & Versioned }
export type StateSourcesMetadata = { [id: string]: SourceMetadata }
export type StateStyles = { [id: string]: Style & Versioned }
export type StateLayerOrder = string[]

export interface State {
  layers: StateLayers
  layerOrder: StateLayerOrder
  sources: StateSources
  sourcesMetadata: StateSourcesMetadata
  styles: StateStyles
  viewCenter: ViewCenter
  viewZoom: ViewZoom
  viewExtent: ViewExtent | null
}

export const initialState: State = {
  layers: {},
  layerOrder: [],
  sources: {},
  sourcesMetadata: {},
  styles: {},
  viewCenter: [0, 0],
  viewZoom: 0,
  viewExtent: null,
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
    case SET_VIEW_EXTENT: {
      return {
        ...state,
        viewExtent: action.payload,
      }
    }
    case ADD_SOURCE: {
      const sourceId = action.payload.id
      return {
        ...state,
        sources: {
          ...state.sources,
          [sourceId]: {
            ...action.payload,
            _version: 0,
          },
        },
      }
    }
    case UPDATE_SOURCE: {
      const sourceId = action.payload.id
      const _version = state.sources[sourceId]._version + 1
      return {
        ...state,
        sources: {
          ...state.sources,
          [sourceId]: {
            ...state.sources[sourceId],
            ...action.payload,
            _version,
          },
        },
      }
    }
    case REMOVE_SOURCE: {
      const sourceId = action.id
      const { [sourceId]: removed, ...sources } = state.sources
      return {
        ...state,
        sources: sources as { [id: string]: Source & Versioned },
      }
    }
    case SET_SOURCE_METADATA: {
      const sourceId = action.payload.sourceId
      return {
        ...state,
        sourcesMetadata: {
          ...state.sourcesMetadata,
          [sourceId]: action.payload,
        },
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
