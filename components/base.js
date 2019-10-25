export class MapFoldComponent extends HTMLElement {
  constructor() {
    super()
  }

  init(engine) {
    this.engine = engine

    this.style.width = '100%'
    this.style.height = '100%'
    this.style.display = 'block'
    this.style.boxSizing = 'border-box'
  }
}
