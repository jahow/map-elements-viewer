import { Feature } from 'geojson'

export type ViewCenter = [number, number]
export type ViewZoom = number
export type ViewExtent = [number, number, number, number]

export interface Versioned {
  _version: number
}

export interface Identified {
  id: string
}

export interface ErrorProne {
  _error?: string
}

export interface Layer extends Identified {
  title?: string
  styleId?: string
  sourceId?: string
  opacity?: number
  visible?: boolean
}

export interface LayerFull extends Layer {
  source?: Source
  _position: number
}

export interface Style extends Identified {
  //FIXME: use geostyler format
}

export interface LocalSource extends Identified {
  type: 'local'
  features: Feature[]
}

export interface OgcSource extends Identified {
  type: 'wms' | 'wfs' | 'wmts'
  url: string
  resourceName: string
}

export interface XyzSource extends Identified {
  type: 'xyz'
  url: string
}

export interface ElasticSource extends Identified {
  type: 'elastic'
  url: string
  mustParams: Object[]
}

export type Source = LocalSource | OgcSource | XyzSource | ElasticSource

export interface SourceMetadata extends ErrorProne {
  sourceId: string
  loading?: boolean
  hasPointsOnly?: boolean
  extent?: [number, number, number, number]
}
