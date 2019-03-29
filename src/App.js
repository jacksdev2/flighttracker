import React, { Component } from 'react';
import './App.css';

import DeckGL, {ScatterplotLayer} from 'deck.gl';
import * as d3 from 'd3';
import {StaticMap} from 'react-map-gl';

// Set your mapbox access token here
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiamZyb2xvdiIsImEiOiJjanFta2JhMTAzdGVsNDRsYjZjbnB2aGk2In0.E1v_EBQE7FeLEx_q0S3ELg';

// Initial viewport settings
const initialViewState = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 13,
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
    console.log()
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
          orgin: d[16]
        }))
      })

    });

  }
  

  render() {

    const layer = new ScatterplotLayer({
      id: 'scatterplot-layer-planes',
      data: this.state.planes,
      pickable: false,
      opacity: 0.3,
      filled: true,
      radiusMinPixels: 10,
      getPosition: d => [d.long, d.lat],
      getColor: d => [255, 140, 0],
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
