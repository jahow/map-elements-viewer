export type LayerType = 'wms' | 'wmts' | 'wfs' | 'xyz' | 'dataset'

export interface LayerPatch {
  id: string
  url?: string
  resourceName?: string
  title?: string
  styleId?: string
  datasetId?: string
  opacity?: number
  visible?: boolean
}

export interface Layer {
  id: string
  type: LayerType
  url?: string
  resourceName?: string
  title: string
  styleId?: string
  datasetId?: string
  opacity: number
  visible: boolean
}

export interface Dataset {
  id: string
  //FIXME: use geojson format
  features: any[]
}

export interface Style {
  id: string
  //FIXME: use geostyler format
}

export interface Versioned {
  _version?: number
}
