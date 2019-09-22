import { Dataset, Layer, LayerPatch, Style } from './model'

export interface Action {
  type: string
}

export const ADD_LAYER = 'Add Layer'
export class AddLayer implements Action {
  readonly type = ADD_LAYER
  constructor(public payload: Layer) {}
}

export const UPDATE_LAYER = 'Update Layer'
export class UpdateLayer implements Action {
  readonly type = UPDATE_LAYER
  constructor(public payload: LayerPatch) {}
}

export const REMOVE_LAYER = 'Remove Layer'
export class RemoveLayer implements Action {
  readonly type = REMOVE_LAYER
  constructor(public id: string) {}
}

export const SET_LAYER_POSITION = 'Set Layer Position'
export class SetLayerPosition implements Action {
  readonly type = SET_LAYER_POSITION
  constructor(public payload: { id: string; position: number }) {}
}

export const SET_VIEW_CENTER = 'Set View Center'
export class SetViewCenter implements Action {
  readonly type = SET_VIEW_CENTER
  constructor(public payload: [number, number]) {}
}

export const SET_VIEW_ZOOM = 'Set View Zoom'
export class SetViewZoom implements Action {
  readonly type = SET_VIEW_ZOOM
  constructor(public payload: number) {}
}

export const ADD_DATASET = 'Add Dataset'
export class AddDataset implements Action {
  readonly type = ADD_DATASET
  constructor(public payload: Dataset) {}
}

export const UPDATE_DATASET = 'Update Dataset'
export class UpdateDataset implements Action {
  readonly type = UPDATE_DATASET
  constructor(public payload: Dataset) {}
}

export const REMOVE_DATASET = 'Remove Dataset'
export class RemoveDataset implements Action {
  readonly type = REMOVE_DATASET
  constructor(public id: string) {}
}

export const ADD_STYLE = 'Add Style'
export class AddStyle implements Action {
  readonly type = ADD_STYLE
  constructor(public payload: Style) {}
}

export const UPDATE_STYLE = 'Update Style'
export class UpdateStyle implements Action {
  readonly type = UPDATE_STYLE
  constructor(public payload: Style) {}
}

export const REMOVE_STYLE = 'Remove Style'
export class RemoveStyle implements Action {
  readonly type = REMOVE_STYLE
  constructor(public id: string) {}
}

export type Actions =
  | AddLayer
  | UpdateLayer
  | RemoveLayer
  | SetLayerPosition
  | SetViewCenter
  | SetViewZoom
  | AddDataset
  | UpdateDataset
  | RemoveDataset
  | AddStyle
  | UpdateStyle
  | RemoveStyle
