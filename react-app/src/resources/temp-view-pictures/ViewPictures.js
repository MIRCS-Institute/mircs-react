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

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  DurhamClip,
  HeathertonClip,
  HolyCrossCemeteryClip,
  NewRossClip,
  NorthEndClip,
  getPicturesList,
}
