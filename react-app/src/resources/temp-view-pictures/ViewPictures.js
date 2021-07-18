import _ from 'lodash'
import DurhamClip from './DurhamClip.jpg'
import HeathertonClip from './HeathertonClip.jpg'
import HolyCrossCemeteryClip from './HolyCrossCemeteryClip.jpg'
import NewRossClip from './NewRossClip.jpg'
import NorthEndClip from './NorthEndClip.jpg'

const getPicturesList = () => {
  return [
    { name: 'Durham', url: DurhamClip },
    { name: 'Heatherton', url: HeathertonClip },
    { name: 'HolyCrossCemetery', url: HolyCrossCemeteryClip },
    { name: 'NewRoss', url: NewRossClip },
    { name: 'NorthEnd', url: NorthEndClip },
  ]
}

const getPictureUrl = (image) => {
  const picturesList = getPicturesList()
  const result = _.find(picturesList, { name: image.name })
  return result && result.url
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  DurhamClip,
  HeathertonClip,
  HolyCrossCemeteryClip,
  NewRossClip,
  NorthEndClip,
  getPicturesList,
  getPictureUrl,
}
