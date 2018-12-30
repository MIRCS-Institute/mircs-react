import {observable} from 'mobx';

class UiStore {

  tileLayerName = observable("Mapbox");
  searchStrings = observable.array([]);
  records = observable.array([]);
  points = observable.array([]);

}

export default UiStore;
