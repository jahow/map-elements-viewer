import { MapFoldComponent } from '../base'

class LayerTree extends MapFoldComponent {
  connectedCallback() {
    this.style.padding = '12px'
    const root = document.createElement('ul')
    root.style.margin = '0'
    this.appendChild(root)

    this.engine.layers$.subscribe(layers => {
      while (root.firstChild) {
        root.removeChild(root.firstChild)
      }

      if (layers.length === 0) {
        const text = document.createElement('span')
        text.textContent = 'Aucune couche dans la carte.'
        text.style.opacity = '0.6'
        root.appendChild(text)
      }

      layers.reverse().forEach((l, pos) => {
        const el = document.createElement('li')
        const text = document.createElement('span')
        text.innerText = `${l.title} [${l.id}]`
        const visible = document.createElement('a')
        visible.href = '#'
        visible.innerText = !!l.visible ? 'masquer' : 'afficher'
        visible.addEventListener('click', () => {
          this.engine.setLayerVisible(l.id, !l.visible)
        })
        const del = document.createElement('a')
        del.href = '#'
        del.innerText = 'supprimer'
        del.addEventListener('click', () => {
          this.engine.removeLayer(l.id)
        })
        const up = document.createElement('a')
        up.innerText = 'monter'
        if (pos > 0) {
          up.href = '#'
          up.addEventListener('click', () => {
            this.engine.setLayerPosition(l.id, layers.length - pos)
          })
        }
        const down = document.createElement('a')
        down.innerText = 'descendre'
        if (pos < layers.length - 1) {
          down.href = '#'
          down.addEventListener('click', () => {
            this.engine.setLayerPosition(l.id, layers.length - pos - 2)
          })
        }
        el.appendChild(text)
        el.appendChild(document.createElement('br'))
        el.appendChild(visible)
        el.appendChild(document.createTextNode(' - '))
        el.appendChild(up)
        el.appendChild(document.createTextNode(' - '))
        el.appendChild(down)
        el.appendChild(document.createTextNode(' - '))
        el.appendChild(del)
        root.appendChild(el)
      })
    })
  }
}

customElements.define('mapfold-layertree', LayerTree)
