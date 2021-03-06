import createEngine from '../../engine'
import '../../components/openlayers/index'
import '../../components/layertree/index'
import '../../components/dropfile/index'

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

engine.addLayer({
  type: 'osm',
  id: 'base001',
  title: 'OpenStreetMap',
})
engine.addLayer({
  type: 'wms',
  id: 'forets',
  url: 'https://wxs.ign.fr/an7nvfzojv5wa96dsga5nk8w/proxy/',
  resourceName: 'Forets_Publiques',
  title: 'Forêts publiques',
})
engine.addLayer({
  type: 'wms',
  id: 'bateaux',
  url: 'http://www.ifremer.fr/services/wms/sismer',
  resourceName: 'CAMPAGNES_BATHY_TRAITEE_GM',
  title: 'Des bateaux',
})
engine.setViewCenter([-124859.29091293899, 6077033.541315858])
engine.setViewZoom(7.8)
