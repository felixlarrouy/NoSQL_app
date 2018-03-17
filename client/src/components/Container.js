import React from 'react';
import { InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import GoogleApiComponent from './utils/GoogleApiComponent'
import Map from './map'

export class Container extends React.Component {
  render() {
    if (!this.props.loaded) {
      return <div>Loading...</div>
    }
    const style = {
     width: '100vw',
     height: '100vh'
   }
   return (
     <div style={style}>
       <Map google={this.props.google}
         />
     </div>
   )
  }
}

export default GoogleApiComponent({
  apiKey: "AIzaSyDmEX4GElp2W9nWW5jEoWODBANVOE-dL9g"
})(Container)
