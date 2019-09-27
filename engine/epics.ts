import { combineEpics, ofType } from 'redux-observable'
import {
  ADD_LAYER,
  AddLayer,
  SetLayerCapabilities,
  SetLayerDataSchema,
  UPDATE_LAYER,
  UpdateLayer,
} from './actions'
import {
  catchError,
  filter,
  map,
  mergeMap,
  withLatestFrom,
} from 'rxjs/operators'
import {
  getRemoteLayerKey,
  parseWmsLayerCapabilities,
  parseWmtsLayerCapabilities,
} from './utils'
import { Observable, of } from 'rxjs'

const layerCapabilitiesEpic = (
  action$: Observable<AddLayer | UpdateLayer>,
  state$
) =>
  action$.pipe(
    ofType(ADD_LAYER, UPDATE_LAYER),
    filter(action => !!action.payload.url),
    filter(
      action => action.payload.type === 'wmts' || action.payload.type == 'wms'
    ),
    withLatestFrom(state$),
    map(([action, state]) => [action.payload, state.layersCapabilities]),
    mergeMap(([payload, layersCapabilities]) => {
      const key = getRemoteLayerKey(payload.url, payload.resourceName)
      const isMissing = Object.keys(layersCapabilities).indexOf(key) === -1
      if (isMissing) {
        // this is an array of observables for each getcap request
        const query = this.utils
          .queryGetCapabilities(payload.url, payload.type)
          .pipe(
            map(
              getCapabilitiesResponse =>
                new SetLayerCapabilities({
                  url: payload.url,
                  resourceName: payload.resourceName,
                  capabilities:
                    payload.type === 'wms'
                      ? parseWmsLayerCapabilities(
                          getCapabilitiesResponse,
                          payload.resourceName
                        )
                      : parseWmtsLayerCapabilities(
                          getCapabilitiesResponse,
                          payload.resourceName
                        ),
                })
            ),
            catchError(err => [
              new SetLayerCapabilities({
                url: payload.url,
                resourceName: payload.resourceName,
                capabilities: {
                  _error: 'GetCapabilities failed: ' + err.message,
                },
              }),
            ])
          )

        return query
      } else {
        return of()
      }
    })
  )

const layerDataSchemaEpic = (action$, state$) =>
  action$.pipe(
    ofType(ADD_LAYER, UPDATE_LAYER),
    filter(action => !!action.payload.url),
    filter(
      action => action.payload.type === 'wfs' || action.payload.type == 'wms'
    ),
    withLatestFrom(state$),
    map(([action, state]) => [action.payload, state.layersCapabilities]),
    mergeMap(([layer, ogcLayersDataSchema]) => {
      const key = getRemoteLayerKey(layer.url, layer.resourceName)
      const isMissing = Object.keys(ogcLayersDataSchema).indexOf(key) === -1
      if (isMissing) {
        const query = this.utils
          .queryDataSchema(layer.url, layer.resourceName)
          .pipe(
            map(
              dataSchema =>
                new SetLayerDataSchema({
                  url: layer.url,
                  resourceName: layer.resourceName,
                  dataSchema,
                })
            ),
            catchError(err => [
              new SetLayerDataSchema({
                url: layer.url,
                resourceName: layer.resourceName,
                dataSchema: {
                  _error: 'DescribeFeatureType failed: ' + err,
                },
              }),
            ])
          )

        return query
      } else {
        return of()
      }
    })
  )

export const rootEpic = combineEpics(layerCapabilitiesEpic, layerDataSchemaEpic)
