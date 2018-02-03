import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import Mappy from './Mappy';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";
const _ = require("lodash");
const { compose, withProps, lifecycle } = require("recompose");
const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");
const google = window.google;
var axios = require('axios')

var CardiB = observer(class CardiB extends Component {
  constructor() {
    super()
    this.getCoords = this.getCoords.bind(this);
    this.newState = this.newState.bind(this);
    this.sendData = this.sendData.bind(this);
    this.markerCoords = this.markerCoords.bind(this);
    this.state = {
      lat: 0,
      lng: 0,
      latSend: 0,
      lngSend: 0,
    }
  }

  getCoords(e) {
    let latty = e.latLng.lat();
    let latRound = parseFloat(latty.toFixed(4));
    let longy = e.latLng.lng();
    let lngRound = parseFloat(longy.toFixed(4));
    this.setState({
      lat: latRound,
      lng: lngRound
    });
  };

  markerCoords(markerLat, markerLng){
    let markerLatRound = parseFloat(markerLat.toFixed(4));
    let markerLngRound = parseFloat(markerLng.toFixed(4));
    this.setState({
      latSend: markerLatRound,
      lngSend: markerLngRound
    })
  }

  newState(){
    this.setState({
      latSend: this.state.lat,
      lngSend: this.state.lng
    })
  };

  sendData() {
      return new Promise((resolve, reject) => {
        axios.post('/darthVader', {
          lat: this.state.latSend,
          lng: this.state.lngSend
        }).then((res) => {
          this.props.snowStore.locationArray.push(res.data);
          console.log(res.data);
          // let readableArray = this.props.snowStore.locationArray[0];
          // console.log(readableArray);
          resolve();
        });
      });
  };

  render() {
    return (
      <DailyCard>
        <Mappy
          getCoords={this.getCoords}
          newState={this.newState}
          markerCoords={this.markerCoords}
          state={this.state}
        />
        <Text>{this.state.lat}          {this.state.lng}</Text><br/>
        <Text send>{this.state.latSend}          {this.state.lngSend}</Text>
        <DarkSkyButton onClick={this.sendData}>Generate Weather Data</DarkSkyButton>
      </DailyCard>
    );
  };
});

// ------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------

const DailyCard = styled.div`
  background-color: #ddd;
  max-width: 1600px;
  min-height: 400px;
  margin-left: auto;
  margin-right: auto;
  padding: 1.5em;
`

const Text = styled.h1`
  color: red;
  
  ${props => props.send && css`
  color: blue;
`}`

const DarkSkyButton = styled.button`
font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
font-weight: bold;
border-radius: 3px;
color: white;
width: 250px;
height: 60px;
background: #E3184F;
font-size: 1.25em;
border: 2px solid #E3184F;
`



export default withRouter(inject('snowStore')(CardiB));
