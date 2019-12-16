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

engine.setViewCenter([-20, 15])
engine.setViewZoom(3)

engine.addSource({
  id: 'ifremer',
  type: 'elastic',
  url: 'http://localhost:9200/gn-features/_search',
  mustParams: [
    {
      query_string: {
        query:
          'featureTypeId:"http%3A%2F%2Fsextant-test.ifremer.fr%2Fcgi-bin%2Fsextant%2Fwfs%2Fmtreguer_co%23argo_shape"',
      },
    },
  ],
})
engine.addLayer({
  id: 'ifremer',
  title: 'Source Elastic',
  sourceId: 'ifremer',
})
