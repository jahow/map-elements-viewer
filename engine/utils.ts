import { LayerCapabilities, LayerDataSchema, WmtsMatrix } from './model'
import { from, Observable } from 'rxjs'
import { map } from 'rxjs/operators'

/**
 * Returns a key made from the concatenation of the given url (without
 * query params) and the layer name
 * @param serviceUrl
 * @param layerName
 */
export function getRemoteLayerKey(serviceUrl: string, layerName: string) {
  const url = new URL(serviceUrl)
  const baseUrl = url.origin + url.pathname
  return `${baseUrl.toLowerCase()}#${layerName}`
}

/**
 * Parse layer-related info from a full WMS GetCapabilities response
 * @param getCapabilitiesResponse
 * @param layerName
 */
export function parseWmsLayerCapabilities(
  getCapabilitiesResponse: any,
  layerName: string
): LayerCapabilities {
  let legendUrl = null
  function lookupNode(node) {
    if (node.Name === layerName && node.Style) {
      const style = Array.isArray(node.Style) ? node.Style[0] : node.Style
      if (style.LegendURL) {
        const legend = Array.isArray(style.LegendURL)
          ? style.LegendURL[0]
          : style.LegendURL
        if (legend.OnlineResource) {
          legendUrl = legend.OnlineResource
          return
        }
      }
    }
    if (node.Layer && Array.isArray(node.Layer)) {
      for (const layer of node.Layer) {
        lookupNode(layer)
      }
    } else if (node.Layer) {
      lookupNode(node.Layer)
    }
  }
  lookupNode(getCapabilitiesResponse.Capability)
  return {
    legendUrl,
  }
}

/**
 * Parse layer-related info from a full WMTS GetCapabilities response
 * @param getCapabilitiesResponse
 * @param layerName
 */
export function parseWmtsLayerCapabilities(
  getCapabilitiesResponse: any,
  layerName: string
): LayerCapabilities {
  const matrices: WmtsMatrix[] = []
  let legendUrl

  // parse node to look for legend url
  function lookupNode(node) {
    if (node.Identifier === layerName) {
      if (node.Style) {
        const style = Array.isArray(node.Style) ? node.Style[0] : node.Style
        if (style.LegendURL) {
          const legend = Array.isArray(style.LegendURL)
            ? style.LegendURL[0]
            : style.LegendURL
          legendUrl = legend.href
        }
      }
    }
    if (node.Layer && Array.isArray(node.Layer)) {
      for (let i = 0; i < node.Layer.length; i++) {
        lookupNode(node.Layer[i])
      }
    } else if (node.Layer) {
      lookupNode(node.Layer)
    }
  }
  lookupNode(getCapabilitiesResponse.Contents)

  // OL is used to parse matrices & default style
  const olOptions = optionsFromCapabilities(getCapabilitiesResponse, {
    layer: layerName,
  })
  const tileGrid = olOptions.tileGrid

  const max = tileGrid.maxZoom - tileGrid.minZoom
  for (let i = 0; i <= max; i++) {
    const z = i + tileGrid.getMinZoom()
    matrices.push({
      resolution: tileGrid.getResolution(z),
      origin: tileGrid.getOrigin(z),
      tileSize: tileGrid.getTileSize(z),
      identifier: tileGrid.getMatrixIds()[i],
    })
  }

  return {
    matrices,
    matrixSet: olOptions.matrixSet,
    defaultStyle: olOptions.style,
    legendUrl,
  }
}

/**
 * Will query the GetCapabilities document
 * @param baseUrl Must point to an endpoint (query arguments will be removed)
 * @param serviceType Service type, WMS or WMTS
 * @return a JSON object representing the GetCapabilities response (TODO: add typing?)
 */
export function queryGetCapabilities(
  baseUrl: string,
  serviceType: 'wms' | 'wmts' = 'wms'
): Observable<any> {
  const url = new URL(baseUrl)
  const changedUrl =
    url.origin +
    url.pathname +
    (serviceType === 'wmts'
      ? '?service=WMTS&request=GetCapabilities'
      : '?service=WMS&request=GetCapabilities&version=1.3.0')
  const proxiedUrl = this.proxy.getProxiedUrl(changedUrl)
  return this.http.get(proxiedUrl, { responseType: 'text' }).pipe(
    map(responseText => {
      const parser =
        serviceType === 'wmts' ? new WMTSCapabilities() : new WMSCapabilities()
      return parser.read(responseText)
    })
  )
}

/**
 * Will attempt to query the data schema using WFS
 * @param baseUrl
 * @param featureType
 */
export function queryDataSchema(
  baseUrl: string,
  featureType: string
): Observable<LayerDataSchema> {
  const url = new URL(baseUrl)
  const changedUrl = url.origin + url.pathname
  return from(
    wfsParser
      .readData({
        url: changedUrl,
        typeName: featureType,
        version: '2.0.0',
      })
      .then(res => res.schema)
  )
}
