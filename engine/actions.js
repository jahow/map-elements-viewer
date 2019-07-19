const ADD_LAYER = "Add Layer";
export function addLayer(payload) {
  return {
    payload,
    type: ADD_LAYER
  };
}

const UPDATE_LAYER = "Update Layer";
export function updateLayer(payload) {
  return {
    payload,
    type: UPDATE_LAYER
  };
}

const REMOVE_LAYER = "Remove Layer";
export function removeLayer(payload) {
  return {
    payload,
    type: REMOVE_LAYER
  };
}

const SET_LAYER_POSITION = "Set Layer Position";
export function setLayerPosition(payload) {
  return {
    payload,
    type: SET_LAYER_POSITION
  };
}

const SET_VIEW_CENTER = "Set View Center";
export function setViewCenter(payload) {
  return {
    payload,
    type: SET_VIEW_CENTER
  };
}

const SET_VIEW_ZOOM = "Set View Zoom";
export function setViewZoom(payload) {
  return {
    payload,
    type: SET_VIEW_ZOOM
  };
}

export const Types = {
  ADD_LAYER,
  UPDATE_LAYER,
  REMOVE_LAYER,
  SET_LAYER_POSITION,
  SET_VIEW_CENTER,
  SET_VIEW_ZOOM
};
