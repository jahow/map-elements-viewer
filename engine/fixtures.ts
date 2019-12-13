import { Layer, Source, Style, Versioned } from './model'

export const sampleLayer1: Layer = {
  id: 'layer1',
  title: 'Sample 1',
  visible: true,
  opacity: 1,
}
export const sampleLayer2: Layer = {
  id: 'layer2',
  title: 'Sample 2',
  visible: true,
  opacity: 0.5,
}
export const sampleLayer3: Layer = {
  id: 'layer2',
  title: 'Sample 3',
  visible: false,
  opacity: 0,
}

export const sampleStyle: Style = {
  id: 'style-000',
}

export const sampleSource: Source = {
  id: 'source-000',
  type: 'local',
  features: [],
}
