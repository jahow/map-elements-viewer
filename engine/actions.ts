import {
  Layer,
  Source,
  SourceMetadata,
  Style,
  ViewCenter,
  ViewExtent,
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
  payload: Layer
}
export function updateLayer(payload: Layer): UpdateLayerAction {
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

export const SET_VIEW_EXTENT = 'Set View Extent'
export interface SetViewExtentAction {
  type: 'Set View Extent'
  payload: ViewExtent
}
export function setViewExtent(payload: ViewExtent): SetViewExtentAction {
  return { type: SET_VIEW_EXTENT, payload }
}

export const ADD_SOURCE = 'Add Source'
export interface AddSourceAction {
  type: 'Add Source'
  payload: Source
}
export function addSource(payload: Source): AddSourceAction {
  return { type: ADD_SOURCE, payload }
}

export const UPDATE_SOURCE = 'Update Source'
export interface UpdateSourceAction {
  type: 'Update Source'
  payload: Source
}
export function updateSource(payload: Source): UpdateSourceAction {
  return { type: UPDATE_SOURCE, payload }
}

export const REMOVE_SOURCE = 'Remove Source'
export interface RemoveSourceAction {
  type: 'Remove Source'
  id: string
}
export function removeSource(id: string): RemoveSourceAction {
  return { type: REMOVE_SOURCE, id }
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

export const SET_SOURCE_METADATA = 'Set SourceMetadata'
export interface SetSourceMetadataAction {
  type: 'Set SourceMetadata'
  payload: SourceMetadata
}
export function setSourceMetadata(
  payload: SourceMetadata
): SetSourceMetadataAction {
  return {
    type: SET_SOURCE_METADATA,
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
  | SetViewExtentAction
  | AddSourceAction
  | UpdateSourceAction
  | RemoveSourceAction
  | AddStyleAction
  | UpdateStyleAction
  | RemoveStyleAction
  | SetSourceMetadataAction
