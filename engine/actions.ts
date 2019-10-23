import {
  Dataset,
  Layer,
  LayerCapabilities,
  LayerDataSchema,
  LayerPatch,
  Style,
  ViewCenter,
  ViewZoom,
} from './model'

export const ADD_LAYER = 'Add Layer'
export interface AddLayerAction {
  type: 'Add Layer'
  payload: Layer
}
export function addLayer(payload: Layer): AddLayerAction {
  return {
    type: ADD_LAYER,
    payload,
  }
}

export const UPDATE_LAYER = 'Update Layer'
export interface UpdateLayerAction {
  type: 'Update Layer'
  payload: LayerPatch
}
export function updateLayer(payload: LayerPatch): UpdateLayerAction {
  return {
    type: UPDATE_LAYER,
    payload,
  }
}

export const REMOVE_LAYER = 'Remove Layer'
export interface RemoveLayerAction {
  type: 'Remove Layer'
  id: string
}
export function removeLayer(id: string): RemoveLayerAction {
  return { type: REMOVE_LAYER, id }
}

export const SET_LAYER_POSITION = 'Set Layer Position'
export interface SetLayerPositionPayload {
  id: string
  position: number
}
export interface SetLayerPositionAction {
  type: 'Set Layer Position'
  payload: SetLayerPositionPayload
}
export function setLayerPosition(
  payload: SetLayerPositionPayload
): SetLayerPositionAction {
  return { type: SET_LAYER_POSITION, payload }
}

export const SET_VIEW_CENTER = 'Set View Center'
export interface SetViewCenterAction {
  type: 'Set View Center'
  payload: ViewCenter
}
export function setViewCenter(payload: ViewCenter): SetViewCenterAction {
  return { type: SET_VIEW_CENTER, payload }
}

export const SET_VIEW_ZOOM = 'Set View Zoom'
export interface SetViewZoomAction {
  type: 'Set View Zoom'
  payload: ViewZoom
}
export function setViewZoom(payload: ViewZoom): SetViewZoomAction {
  return { type: SET_VIEW_ZOOM, payload }
}

export const ADD_DATASET = 'Add Dataset'
export interface AddDatasetAction {
  type: 'Add Dataset'
  payload: Dataset
}
export function addDataset(payload: Dataset): AddDatasetAction {
  return { type: ADD_DATASET, payload }
}

export const UPDATE_DATASET = 'Update Dataset'
export interface UpdateDatasetAction {
  type: 'Update Dataset'
  payload: Dataset
}
export function updateDataset(payload: Dataset): UpdateDatasetAction {
  return { type: UPDATE_DATASET, payload }
}

export const REMOVE_DATASET = 'Remove Dataset'
export interface RemoveDatasetAction {
  type: 'Remove Dataset'
  id: string
}
export function removeDataset(id: string): RemoveDatasetAction {
  return { type: REMOVE_DATASET, id }
}

export const ADD_STYLE = 'Add Style'
export interface AddStyleAction {
  type: 'Add Style'
  payload: Style
}
export function addStyle(payload: Style): AddStyleAction {
  return { type: ADD_STYLE, payload }
}

export const UPDATE_STYLE = 'Update Style'
export interface UpdateStyleAction {
  type: 'Update Style'
  payload: Style
}
export function updateStyle(payload: Style): UpdateStyleAction {
  return { type: UPDATE_STYLE, payload }
}

export const REMOVE_STYLE = 'Remove Style'
export interface RemoveStyleAction {
  type: 'Remove Style'
  id: string
}
export function removeStyle(id: string): RemoveStyleAction {
  return { type: REMOVE_STYLE, id }
}

export const SET_LAYER_CAPABILITIES = 'Set Layer Capabilities'
export interface SetLayerCapabilitiesPayload {
  url: string
  resourceName: string
  capabilities: LayerCapabilities
}
export interface SetLayerCapabilitiesAction {
  type: 'Set Layer Capabilities'
  payload: SetLayerCapabilitiesPayload
}
export function setLayerCapabilities(
  payload: SetLayerCapabilitiesPayload
): SetLayerCapabilitiesAction {
  return {
    type: SET_LAYER_CAPABILITIES,
    payload,
  }
}

export const SET_LAYER_DATA_SCHEMA = 'Set Layer Data Schema'
export interface SetLayerDataSchemaPayload {
  url: string
  resourceName: string
  capabilities: LayerDataSchema
}
export interface SetLayerDataSchemaAction {
  type: 'Set Layer Data Schema'
  payload: SetLayerDataSchemaPayload
}
export function setLayerDataSchema(
  payload: SetLayerDataSchemaPayload
): SetLayerDataSchemaAction {
  return {
    type: SET_LAYER_DATA_SCHEMA,
    payload,
  }
}

export type Actions =
  | AddLayerAction
  | UpdateLayerAction
  | RemoveLayerAction
  | SetLayerPositionAction
  | SetViewCenterAction
  | SetViewZoomAction
  | AddDatasetAction
  | UpdateDatasetAction
  | RemoveDatasetAction
  | AddStyleAction
  | UpdateStyleAction
  | RemoveStyleAction
  | SetLayerCapabilitiesAction
  | SetLayerDataSchemaAction
