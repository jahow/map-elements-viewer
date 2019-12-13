import { MapFoldComponent } from '../base'
import { defineCustomElements } from '@carto/airship-components/dist/loader'

defineCustomElements(window)

const template = document.createElement('template')
template.innerHTML = `
<link rel="stylesheet" href="https://libs.cartocdn.com/airship-style/v2.1.1/airship.css">
<as-histogram-widget
  heading="Title"
  description="Description"
  show-header
  show-clear>
</as-histogram-widget>
`

class Histogram extends MapFoldComponent {
  connectedCallback() {
    this.appendChild(template.content.cloneNode(true))
    this.style.padding = '0.8rem'

    const histogramWidget = this.querySelector('as-histogram-widget')
    histogramWidget.data = [
      { start: 0, end: 10, value: 5 },
      { start: 10, end: 20, value: 10 },
      { start: 20, end: 30, value: 15 },
      { start: 30, end: 40, value: 20 },
      { start: 40, end: 50, value: 30 },
    ]
  }
}

customElements.define('mapfold-histogram', Histogram)
