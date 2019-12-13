import { MapFoldComponent } from '../base'
import GeoJSON from 'ol/format/GeoJSON'
import WKT from 'ol/format/WKT'

class DropFile extends MapFoldComponent {
  connectedCallback() {
    this.style.padding = '12px'

    const drop = document.createElement('div')
    drop.style.padding = '12px'
    drop.style.height = '100%'
    drop.style.width = '100%'
    drop.style.boxSizing = 'border-box'
    drop.style.border = '3px dashed grey'
    drop.innerText = 'déposer un fichier vecteur ici'
    drop.addEventListener('drop', event => {
      event.preventDefault()
      const files = event.dataTransfer.files
      if (!files.length) return
      const file = files[0]
      const fileNameParts = file.name.split('.')
      const extension = file.name.split('.').pop()
      const reader = new FileReader()
      reader.onload = event => {
        const text = event.target.result
        let features
        switch (extension) {
          case 'json':
          case 'geojson': {
            features = JSON.parse(text)
            break
          }
          case 'wkt': {
            const wkt = new WKT()
            const geojson = new GeoJSON()
            features = geojson.writeFeaturesObject(wkt.readFeatures(text))
            break
          }
          default: {
            console.warn('Unknown file format', file.name)
            return
          }
        }
        this.engine.addSource({
          id: file.name,
          type: 'local',
          features,
        })
        this.engine.addLayer({
          id: Math.floor(Math.random() * 1000000).toString(), // this is not ideal... we should at least prevent adding a number as id
          title: fileNameParts.slice(0, fileNameParts.length - 1).join('.'),
          sourceId: file.name,
        })
      }
      reader.readAsText(file)
    })
    drop.addEventListener('dragover', event => {
      event.preventDefault()
    })
    this.appendChild(drop)
  }
}

customElements.define('mapfold-dropfile', DropFile)
