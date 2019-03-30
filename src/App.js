import React, { Component } from 'react';
import './App.css';

import DeckGL, {IconLayer} from 'deck.gl';
import * as d3 from 'd3';
import {StaticMap} from 'react-map-gl';

import PlaneIcon from './images/plane.png';
// Set your mapbox access token here
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiamZyb2xvdiIsImEiOiJjanFta2JhMTAzdGVsNDRsYjZjbnB2aGk2In0.E1v_EBQE7FeLEx_q0S3ELg';

// Initial viewport settings
const initialViewState = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 5,
  pitch: 36,
  bearing: 0
};

// Data to be used by the LineLayer



class App extends React.Component {


  state = {
    planes: []
  }


  componentDidMount(){
    this.fetchFlightData()
  }

  fetchFlightData = () => {

    let app = this

    fetch('https://opensky-network.org/api/states/all')
    .then(res => res.json())
    .then(function(myJson) {
      let data = myJson.states;
      console.log(typeof data)
      return app.setState({
        planes: data.map(d => ({
          callsign: d[1],
          long: d[5],
          lat: d[6],
          velocity: d[9],
          alt: d[13],
          orgin: d[16],
          true_track: d[10]
        }))
      })
    });
    setTimeout(this.fetchFlightData, 10 * 1000)
  }
  

  render() {

    const layer = new IconLayer({
      id: 'planes',
      data: this.state.planes,
      pickable: false,
      iconAtlas: PlaneIcon,
      iconMapping: {
        marker: {x: 0, y: 0, width: 532, height: 532, mask: false}
      },
      getIcon: d => "marker",
      sizeScale: 35,
      opacity: 0.3,
      getPosition: d => [d.long, d.lat],
      getAngle: d => 65 + (d.true_track * 180) / Math.PI,
      // onHover: ({d, x, y}) => {
      //   const tooltip = `${d.callsign}\n${d.orgin}`;

      // }
    });

    

    return (
      <DeckGL
        initialViewState={initialViewState}
        controller={true}
        layers={layer}
      >
        <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
      </DeckGL>
    );
  }
}


export default App;
