import createEngine from '../../engine'
import '../../components/openlayers/index'
import '../../components/layertree/index'
import '../../components/dropfile/index'
import '../../components/histogram/index'

const engine = createEngine()

const map = document.createElement('mapfold-openlayers')
map.init(engine)
document.body.querySelector('.map-root').appendChild(map)

const layertree = document.createElement('mapfold-layertree')
layertree.init(engine)
document.body.querySelector('.layertree-root').appendChild(layertree)

const dropfile = document.createElement('mapfold-dropfile')
dropfile.init(engine)
document.body.querySelector('.dropfile-root').appendChild(dropfile)

const histogram = document.createElement('mapfold-histogram')
histogram.init(engine)
document.body.querySelector('.histogram-root').appendChild(histogram)

engine.setViewCenter([-124850, 6077030])
engine.setViewZoom(6)
