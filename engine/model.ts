export type LayerType = 'wms' | 'wmts' | 'wfs' | 'xyz' | 'local'

export interface Versioned {
  _version: number
}

export interface Identified {
  id: string
}

export interface LayerPatch extends Identified {
  url?: string
  resourceName?: string
  downloadUrl?: string
  title?: string
  styleId?: string
  datasetId?: string
  opacity?: number
  visible?: boolean
}

export type Layer = LayerPatch & {
  type: LayerType
}

export interface Dataset extends Identified {
  //FIXME: use geojson format
  features: any[]
}

export interface Style extends Identified {
  //FIXME: use geostyler format
}
