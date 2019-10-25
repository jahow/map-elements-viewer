import {
  getStore,
  selectAddedLayer,
  selectMovedLayer,
  selectOrderedLayers,
  selectRemovedLayer,
  selectUpdatedLayer,
  selectViewCenter,
  selectViewZoom,
} from './store'
import { BehaviorSubject, Subject } from 'rxjs'
import { StateObservable } from 'redux-observable'
import { initialState, State } from './reducer'
import { sampleLayer1, sampleLayer2, sampleLayer3 } from './fixtures'

describe('Store', () => {
  describe('getStore', () => {
    it('should return a store object', () => {
      expect(getStore()).toBeDefined()
    })
  })

  describe('Selectors', () => {
    let subject: Subject<State>, state$: StateObservable<State>

    beforeEach(() => {
      subject = new BehaviorSubject<State>(initialState)
      state$ = new StateObservable<State>(subject, initialState)
    })

    describe('selectViewCenter', () => {
      it('emits a value when the view center changes', () => {
        let calledCount = 0
        let emitted = null
        selectViewCenter(state$).subscribe(center => {
          calledCount++
          emitted = center
        })

        expect(calledCount).toBe(1)
        expect(emitted).toEqual(initialState.viewCenter)

        subject.next({
          ...initialState,
          viewZoom: 3,
        })

        expect(calledCount).toBe(1)

        subject.next({
          ...initialState,
          viewCenter: [2, 2],
        })

        expect(calledCount).toBe(2)
        expect(emitted).toEqual([2, 2])
      })
    })

    describe('selectViewZoom', () => {
      it('emits a value when the view zoom changes', () => {
        let calledCount = 0
        let emitted = null
        selectViewZoom(state$).subscribe(zoom => {
          calledCount++
          emitted = zoom
        })

        expect(calledCount).toBe(1)
        expect(emitted).toEqual(initialState.viewZoom)

        subject.next({
          ...initialState,
          viewCenter: [2, 2],
        })

        expect(calledCount).toBe(1)

        subject.next({
          ...initialState,
          viewZoom: 3,
        })

        expect(calledCount).toBe(2)
        expect(emitted).toEqual(3)
      })
    })

    describe('selectOrderedLayers', () => {
      it('emits a value when a layer changes', () => {
        let calledCount = 0
        let emitted = null
        selectOrderedLayers(state$).subscribe(layers => {
          calledCount++
          emitted = layers
        })

        expect(calledCount).toBe(1)
        expect(emitted).toEqual([])

        subject.next({
          ...initialState,
          viewZoom: 8,
        })

        expect(calledCount).toBe(1)

        subject.next({
          ...initialState,
          layers: {
            ['1234']: {
              id: '1234',
              type: 'wms',
              _version: 0,
            },
          },
          layerOrder: ['1234'],
        })

        expect(calledCount).toBe(2)
        expect(emitted).toEqual([
          {
            id: '1234',
            type: 'wms',
            _version: 0,
          },
        ])
      })

      it('emits a value when the layer order changes', () => {
        let calledCount = 0
        let emitted = null
        selectOrderedLayers(state$).subscribe(layers => {
          calledCount++
          emitted = layers
        })

        expect(calledCount).toBe(1)

        const layer1 = {
          ...sampleLayer1,
          _version: 2,
        }
        const layer2 = {
          ...sampleLayer2,
          _version: 4,
        }

        subject.next({
          ...initialState,
          layers: {
            layer1,
            layer2,
          },
          layerOrder: ['layer1', 'layer2'],
        })

        expect(calledCount).toBe(2)
        expect(emitted).toEqual([layer1, layer2])

        subject.next({
          ...initialState,
          layers: {
            layer1,
            layer2,
          },
          layerOrder: ['layer2', 'layer1'],
        })

        expect(calledCount).toBe(3)
        expect(emitted).toEqual([layer2, layer1])
      })
    })

    describe('selectAddedLayer', () => {
      it('emits a value when a layer is added', () => {
        let calledCount = 0
        let emitted = null
        selectAddedLayer(state$).subscribe(layer => {
          calledCount++
          emitted = layer
        })

        expect(calledCount).toBe(0)

        const layer1 = {
          ...sampleLayer1,
          _version: 2,
        }
        const layer2 = {
          ...sampleLayer2,
          _version: 4,
        }

        subject.next({
          ...initialState,
          layers: {
            layer1,
          },
          layerOrder: ['layer1'],
        })

        expect(calledCount).toBe(1)
        expect(emitted).toEqual({ ...layer1, _position: 0 })

        subject.next({
          ...initialState,
          layers: {
            layer1,
            layer2,
          },
          layerOrder: ['layer1', 'layer2'],
        })

        expect(calledCount).toBe(2)
        expect(emitted).toEqual({ ...layer2, _position: 1 })

        subject.next({
          ...initialState,
          layers: {
            layer1,
            layer2: { ...layer2, _version: 12 },
          },
          layerOrder: ['layer1', 'layer2'],
        })

        expect(calledCount).toBe(2)

        subject.next({
          ...initialState,
          layers: {
            layer1,
            layer2: layer2,
          },
          layerOrder: ['layer2', 'layer1'],
        })

        expect(calledCount).toBe(2)

        subject.next({
          ...initialState,
          layers: {
            layer2,
          },
          layerOrder: ['layer2'],
        })

        expect(calledCount).toBe(2)
      })
    })

    describe('selectUpdatedLayer', () => {
      it('emits a value when a layer is updated', () => {
        let calledCount = 0
        let emitted = null
        selectUpdatedLayer(state$).subscribe(layer => {
          calledCount++
          emitted = layer
        })

        expect(calledCount).toBe(0)

        const layer1 = {
          ...sampleLayer1,
          _version: 2,
        }
        const layer2 = {
          ...sampleLayer2,
          _version: 4,
        }

        subject.next({
          ...initialState,
          layers: {
            layer1,
          },
          layerOrder: ['layer1'],
        })

        expect(calledCount).toBe(0)

        subject.next({
          ...initialState,
          layers: {
            layer1,
            layer2,
          },
          layerOrder: ['layer1', 'layer2'],
        })

        expect(calledCount).toBe(0)

        subject.next({
          ...initialState,
          layers: {
            layer1,
            layer2,
          },
          layerOrder: ['layer2', 'layer1'],
        })

        expect(calledCount).toBe(0)

        subject.next({
          ...initialState,
          layers: {
            layer1,
            layer2: { ...layer2, _version: 12 },
          },
          layerOrder: ['layer1', 'layer2'],
        })

        expect(calledCount).toBe(1)
        expect(emitted).toEqual({ ...layer2, _version: 12, _position: 1 })

        subject.next({
          ...initialState,
          layers: {
            layer1: { ...layer1, _version: 15 },
            layer2: { ...layer2, _version: 12 },
          },
          layerOrder: ['layer2', 'layer1'],
        })

        expect(calledCount).toBe(2)
        expect(emitted).toEqual({ ...layer1, _version: 15, _position: 1 })

        subject.next({
          ...initialState,
          layers: {
            layer2: { ...layer2, _version: 12 },
          },
          layerOrder: ['layer2'],
        })

        expect(calledCount).toBe(2)
      })
    })

    describe('selectRemovedLayer', () => {
      it('emits a value when a layer is removed', () => {
        let calledCount = 0
        let emitted = null
        selectRemovedLayer(state$).subscribe(layer => {
          calledCount++
          emitted = layer
        })

        expect(calledCount).toBe(0)

        const layer1 = {
          ...sampleLayer1,
          _version: 2,
        }
        const layer2 = {
          ...sampleLayer2,
          _version: 4,
        }

        subject.next({
          ...initialState,
          layers: {
            layer1,
          },
          layerOrder: ['layer1'],
        })

        expect(calledCount).toBe(0)

        subject.next({
          ...initialState,
          layers: {
            layer1,
            layer2,
          },
          layerOrder: ['layer1', 'layer2'],
        })

        expect(calledCount).toBe(0)

        subject.next({
          ...initialState,
          layers: {
            layer1: { ...layer1, _version: 12 },
            layer2,
          },
          layerOrder: ['layer1', 'layer2'],
        })

        expect(calledCount).toBe(0)

        subject.next({
          ...initialState,
          layers: {
            layer2,
          },
          layerOrder: ['layer2'],
        })

        expect(calledCount).toBe(1)
        expect(emitted).toEqual({ ...layer1, _version: 12 })

        subject.next({
          ...initialState,
          layers: {},
          layerOrder: [],
        })

        expect(calledCount).toBe(2)
        expect(emitted).toEqual(layer2)
      })
    })

    describe('selectMovedLayer', () => {
      it('emits a value when a layer is moved', () => {
        let emitted = []
        selectMovedLayer(state$).subscribe(layer => {
          emitted.push(layer)
        })

        expect(emitted.length).toBe(0)

        const layer1 = {
          ...sampleLayer1,
          _version: 2,
        }
        const layer2 = {
          ...sampleLayer2,
          _version: 4,
        }
        const layer3 = {
          ...sampleLayer3,
          _version: 6,
        }

        subject.next({
          ...initialState,
          layers: {
            layer1,
            layer2,
            layer3,
          },
          layerOrder: ['layer1', 'layer2', 'layer3'],
        })

        expect(emitted.length).toBe(0)

        emitted.length = 0
        subject.next({
          ...initialState,
          layers: {
            layer1,
            layer2,
            layer3,
          },
          layerOrder: ['layer2', 'layer1', 'layer3'],
        })

        expect(emitted.length).toBe(2)
        expect(emitted[0]).toEqual({
          ...layer1,
          _position: 1,
          _previousPosition: 0,
        })
        expect(emitted[1]).toEqual({
          ...layer2,
          _position: 0,
          _previousPosition: 1,
        })

        emitted.length = 0
        subject.next({
          ...initialState,
          layers: {
            layer1,
            layer2,
            layer3,
          },
          layerOrder: ['layer3', 'layer2', 'layer1'],
        })

        expect(emitted.length).toBe(3)
        expect(emitted[0]).toEqual({
          ...layer1,
          _position: 2,
          _previousPosition: 1,
        })
        expect(emitted[1]).toEqual({
          ...layer2,
          _position: 1,
          _previousPosition: 0,
        })
        expect(emitted[2]).toEqual({
          ...layer3,
          _position: 0,
          _previousPosition: 2,
        })

        emitted.length = 0
        subject.next({
          ...initialState,
          layers: {
            layer1,
            layer2,
            layer3,
          },
          layerOrder: ['layer3', 'layer2', 'layer1'],
        })

        expect(emitted).toEqual([])
      })
    })
  })
})
