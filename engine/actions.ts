import { Dataset, Layer, LayerPatch, Style } from './model'

export interface Action {
  type: string
}

const ADD_LAYER = 'Add Layer'
export class AddLayer implements Action {
  readonly type = ADD_LAYER
  constructor(public payload: Layer) {}
}

const UPDATE_LAYER = 'Update Layer'
export class UpdateLayer implements Action {
  readonly type = UPDATE_LAYER
  constructor(public payload: LayerPatch) {}
}

const REMOVE_LAYER = 'Remove Layer'
export class RemoveLayer implements Action {
  readonly type = REMOVE_LAYER
  constructor(public id: string) {}
}

const SET_LAYER_POSITION = 'Set Layer Position'
export class SetLayerPosition implements Action {
  readonly type = SET_LAYER_POSITION
  constructor(public payload: { id: string; position: number }) {}
}

const SET_VIEW_CENTER = 'Set View Center'
export class SetViewCenter implements Action {
  readonly type = SET_VIEW_CENTER
  constructor(public payload: [number, number]) {}
}

const SET_VIEW_ZOOM = 'Set View Zoom'
export class SetViewZoom implements Action {
  readonly type = SET_VIEW_ZOOM
  constructor(public payload: number) {}
}

const ADD_DATASET = 'Add Dataset'
export class AddDataset implements Action {
  readonly type = ADD_DATASET
  constructor(public payload: Dataset) {}
}

const UPDATE_DATASET = 'Update Dataset'
export class UpdateDataset implements Action {
  readonly type = UPDATE_DATASET
  constructor(public payload: Dataset) {}
}

const REMOVE_DATASET = 'Remove Dataset'
export class RemoveDataset implements Action {
  readonly type = REMOVE_DATASET
  constructor(public id: string) {}
}

const ADD_STYLE = 'Add Style'
export class AddStyle implements Action {
  readonly type = ADD_STYLE
  constructor(public payload: Style) {}
}

const UPDATE_STYLE = 'Update Style'
export class UpdateStyle implements Action {
  readonly type = UPDATE_STYLE
  constructor(public payload: Style) {}
}

const REMOVE_STYLE = 'Remove Style'
export class RemoveStyle implements Action {
  readonly type = REMOVE_STYLE
  constructor(public id: string) {}
}

export const Types = {
  ADD_LAYER,
  UPDATE_LAYER,
  REMOVE_LAYER,
  SET_LAYER_POSITION,
  SET_VIEW_CENTER,
  SET_VIEW_ZOOM,
  ADD_DATASET,
  UPDATE_DATASET,
  REMOVE_DATASET,
  ADD_STYLE,
  UPDATE_STYLE,
  REMOVE_STYLE,
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
