import React from 'react';
import { InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

class Map extends React.Component {
  render() {
    return (
      <div ref='map'>
        Loading map...
      </div>
    )
  }
}

export default Map
