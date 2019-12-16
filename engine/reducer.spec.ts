import { initialState, main as reducer } from './reducer'
import * as fromActions from './actions'
import { sampleLayer1, sampleSource, sampleStyle } from './fixtures'
import { LocalSource, Source, SourceMetadata, Versioned } from './model'

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
      const action = fromActions.setViewCenter([123, 456])
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
      const action = fromActions.setViewZoom(5)
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

  describe('SET_VIEW_EXTENT action', () => {
    it('does not have an extent initially', () => {
      expect(initialState.viewExtent).toBeNull()
    })

    it('modifies the view extent', () => {
      const action = fromActions.setViewExtent([0, 10, 100, 200])
      const state = reducer(initialState, action)

      expect(state.viewZoom).toEqual([0, 10, 100, 200])
    })
  })

  describe('ADD_LAYER action', () => {
    it('adds a new layer & initializes version', () => {
      const action = fromActions.addLayer(sampleLayer1)
      const state = reducer(initialState, action)

      expect(state.layers[sampleLayer1.id]).toEqual({
        ...sampleLayer1,
        _version: 0,
      })
    })
  })

  describe('UPDATE_LAYER action', () => {
    it('updates a layer & increases version', () => {
      const action = fromActions.updateLayer({
        id: sampleLayer1.id,
        visible: false,
      })
      const state = reducer(
        {
          ...initialState,
          layers: {
            [sampleLayer1.id]: { ...sampleLayer1, _version: 4 },
          },
        },
        action
      )

      expect(state.layers[sampleLayer1.id].visible).toEqual(false)
      expect(state.layers[sampleLayer1.id]._version).toEqual(5)
    })
  })

  describe('REMOVE_LAYER action', () => {
    it('removes a layer', () => {
      const action = fromActions.removeLayer(sampleLayer1.id)
      const state = reducer(
        {
          ...initialState,
          layers: {
            [sampleLayer1.id]: { ...sampleLayer1, _version: 8 },
          },
        },
        action
      )

      expect(state.layers[sampleLayer1.id]).not.toBeDefined()
    })
  })

  describe('SET_LAYER_POSITION action', () => {
    it('moves a layer in the map (back to front)', () => {
      const action = fromActions.setLayerPosition({
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
      const action = fromActions.setLayerPosition({
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

  describe('ADD_SOURCE action', () => {
    it('adds a new source & initializes version', () => {
      const action = fromActions.addSource(sampleSource)
      const state = reducer(initialState, action)

      expect(state.sources[sampleSource.id]).toEqual({
        ...sampleSource,
        _version: 0,
      })
    })
  })

  describe('UPDATE_SOURCE action', () => {
    it('updates a source', () => {
      const payload = {
        ...sampleSource,
        features: [
          {
            type: 'Feature',
            properties: {
              aa: 'bb',
            },
          },
        ],
      } as LocalSource
      const action = fromActions.updateSource(payload)
      const state = reducer(
        {
          ...initialState,
          sources: {
            [sampleSource.id]: { ...sampleSource, _version: 5 } as Source &
              Versioned,
          },
        },
        action
      )

      expect(state.sources[sampleSource.id]).toBeDefined()
      expect(state.sources[sampleSource.id]._version).toBe(6)
      expect(state.sources[sampleSource.id].features).toEqual(payload.features)
    })
  })

  describe('REMOVE_SOURCE action', () => {
    it('removes a source', () => {
      const action = fromActions.removeSource(sampleSource.id)
      const state = reducer(
        {
          ...initialState,
          sources: {
            [sampleSource.id]: { ...sampleSource, _version: 8 } as Source &
              Versioned,
          },
        },
        action
      )

      expect(state.sources[sampleSource.id]).not.toBeDefined()
    })
  })

  describe('SET_SOURCE_METADATA', () => {
    it('sets metadata for a source', () => {
      const payload: SourceMetadata = {
        sourceId: sampleSource.id,
        extent: [0, 0, 100, 200],
      }
      const action = fromActions.setSourceMetadata(payload)
      const state = reducer(initialState, action)

      expect(state.sourcesMetadata[sampleSource.id]).toEqual(payload)
    })
  })

  describe('ADD_STYLE action', () => {
    it('adds a new style & initializes version', () => {
      const action = fromActions.addStyle(sampleStyle)
      const state = reducer(initialState, action)

      expect(state.styles[sampleStyle.id]).toEqual({
        ...sampleStyle,
        _version: 0,
      })
    })
  })

  describe('REMOVE_STYLE action', () => {
    it('removes a style', () => {
      const action = fromActions.removeStyle(sampleStyle.id)
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
