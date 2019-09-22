import { main as reducer, initialState } from './reducer'
import * as fromActions from './actions'
import { sampleDataset, sampleLayer, sampleStyle } from './fixtures'

describe('Main Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {} as any
      const state = reducer(undefined, action)

      expect(state).toBe(initialState)
    })
  })

  describe('SET_VIEW_CENTER action', () => {
    it('modifies the view center', () => {
      const action = new fromActions.SetViewCenter([123, 456])
      const state = reducer(
        {
          ...initialState,
          viewCenter: [0, 1],
        },
        action
      )

      expect(state.viewCenter).toEqual([123, 456])
    })
  })

  describe('SET_VIEW_ZOOM action', () => {
    it('modifies the view zoom', () => {
      const action = new fromActions.SetViewZoom(5)
      const state = reducer(
        {
          ...initialState,
          viewZoom: 2,
        },
        action
      )

      expect(state.viewZoom).toEqual(5)
    })
  })

  describe('ADD_LAYER action', () => {
    it('adds a new layer & initializes version', () => {
      const action = new fromActions.AddLayer(sampleLayer)
      const state = reducer(initialState, action)

      expect(state.layers[sampleLayer.id]).toEqual({
        ...sampleLayer,
        _version: 0,
      })
    })
  })

  describe('UPDATE_LAYER action', () => {
    it('updates a layer & increases version', () => {
      const action = new fromActions.UpdateLayer({
        id: sampleLayer.id,
        visible: false,
      })
      const state = reducer(
        {
          ...initialState,
          layers: {
            [sampleLayer.id]: { ...sampleLayer, _version: 4 },
          },
        },
        action
      )

      expect(state.layers[sampleLayer.id].visible).toEqual(false)
      expect(state.layers[sampleLayer.id]._version).toEqual(5)
    })
  })

  describe('REMOVE_LAYER action', () => {
    it('removes a layer', () => {
      const action = new fromActions.RemoveLayer(sampleLayer.id)
      const state = reducer(
        {
          ...initialState,
          layers: {
            [sampleLayer.id]: { ...sampleLayer, _version: 8 },
          },
        },
        action
      )

      expect(state.layers[sampleLayer.id]).not.toBeDefined()
    })
  })

  describe('SET_LAYER_POSITION action', () => {
    it('moves a layer in the map (back to front)', () => {
      const action = new fromActions.SetLayerPosition({
        id: 'abc',
        position: 2,
      })
      const state = reducer(
        {
          ...initialState,
          layerOrder: ['abc', 'def', 'ghi'],
        },
        action
      )

      expect(state.layerOrder).toEqual(['def', 'ghi', 'abc'])
    })
    it('moves a layer in the map (front to back)', () => {
      const action = new fromActions.SetLayerPosition({
        id: 'ghi',
        position: 0,
      })
      const state = reducer(
        {
          ...initialState,
          layerOrder: ['abc', 'def', 'ghi'],
        },
        action
      )

      expect(state.layerOrder).toEqual(['ghi', 'abc', 'def'])
    })
  })

  describe('ADD_DATASET action', () => {
    it('adds a new dataset & initializes version', () => {
      const action = new fromActions.AddDataset(sampleDataset)
      const state = reducer(initialState, action)

      expect(state.datasets[sampleDataset.id]).toEqual({
        ...sampleDataset,
        _version: 0,
      })
    })
  })

  describe('REMOVE_DATASET action', () => {
    it('removes a dataset', () => {
      const action = new fromActions.RemoveDataset(sampleDataset.id)
      const state = reducer(
        {
          ...initialState,
          datasets: {
            [sampleDataset.id]: { ...sampleDataset, _version: 8 },
          },
        },
        action
      )

      expect(state.datasets[sampleDataset.id]).not.toBeDefined()
    })
  })

  describe('ADD_STYLE action', () => {
    it('adds a new style & initializes version', () => {
      const action = new fromActions.AddStyle(sampleStyle)
      const state = reducer(initialState, action)

      expect(state.styles[sampleStyle.id]).toEqual({
        ...sampleStyle,
        _version: 0,
      })
    })
  })

  describe('REMOVE_STYLE action', () => {
    it('removes a style', () => {
      const action = new fromActions.RemoveStyle(sampleStyle.id)
      const state = reducer(
        {
          ...initialState,
          styles: {
            [sampleStyle.id]: { ...sampleStyle, _version: 8 },
          },
        },
        action
      )

      expect(state.styles[sampleStyle.id]).not.toBeDefined()
    })
  })
})
