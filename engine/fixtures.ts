import { Dataset, Layer, Style } from './model'

export const sampleLayer: Layer = {
  id: 'layer-000',
  type: 'local',
  title: 'Sample',
  visible: true,
  opacity: 1,
}

export const sampleDataset: Dataset = {
  id: 'dataset-000',
  features: [
    {
      type: 'Polygon',
    },
  ],
}

export const sampleStyle: Style = {
  id: 'style-000',
}
