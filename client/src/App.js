import React, { Component } from 'react';
import logo from './logo.svg';
import MapContainer from './components/Container';
import './App.css';



class App extends Component {
  state = {inspections: [], locations:[]}

 async componentDidMount() {
   // const response = await fetch('/cities')
   // const inspections   = await response.json()
   const locat = [
     {"name": 'IHOP', "lat":40.8803571, "lng":-73.90401159999999},
     {"name":'IHP',"lat": 40.8805571,"lng": -73.90101159929999}
   ];

   this.setState({ locations:locat})
 }

  render() {
    return (
      <div>
          <h2>{process.env.REACT_APP_MY_VARIABLE}</h2>

        


        </div>
      );
  }
}


export default App;
