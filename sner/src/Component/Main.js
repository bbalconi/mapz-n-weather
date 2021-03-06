import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import styled, { css } from 'styled-components';
import Mappy from './Mappy';
import WeatherCard from '../Component/WeatherCard';
var axios = require('axios')

var Main = observer(class Main extends Component {
  constructor() {
    super()
    this.getCoords = this.getCoords.bind(this);
    this.newState = this.newState.bind(this);
    this.sendData = this.sendData.bind(this);
    this.markerCoords = this.markerCoords.bind(this);
    this.markerMaker = this.markerMaker.bind(this);
    this.clickedMarker = this.clickedMarker.bind(this);
    this.state = {
      lat: 0,
      lng: 0,
      latSend: 45.817,
      lngSend: -110.929,
      locationName: "Bridger Bowl, MT, USA",
      stateHasChanged: false
    };
  };

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

  markerCoords(markerLat, markerLng) {
    let markerLatRound = parseFloat(markerLat.toFixed(4));
    let markerLngRound = parseFloat(markerLng.toFixed(4));
    this.setState({
      latSend: markerLatRound,
      lngSend: markerLngRound
    })
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.state.latSend}%2C${this.state.lngSend}&language=en&key=AIzaSyA3ptyXyCL1xEpLtOr5rsls8BRzNt-Tgc0`).then((res) => {
      this.setState({
        locationName: res.data.results["1"].formatted_address
      })
    });
  }

  newState(e) {
    if (this.state.stateHasChanged === false) {
      this.setState({ stateHasChanged: true })
    }
    this.setState({
      latSend: this.state.lat,
      lngSend: this.state.lng
    });
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.state.latSend}%2C${this.state.lngSend}&language=en&key=AIzaSyA3ptyXyCL1xEpLtOr5rsls8BRzNt-Tgc0`).then((res) => {
      if (res.data.results["1"]) {
        this.setState({
          locationName: res.data.results["1"].formatted_address
        })
      } else if (res.data.status === "ZERO_RESULTS") {
        this.setState({
          locationName: ""
        })
      } else {
        this.setState({
          locationName: res.data.results["0"].formatted_address
        })
      }
    });
  };

  sendData() {
    return new Promise((resolve, reject) => {
      axios.post('/darthVader', {
        lat: this.state.latSend,
        lng: this.state.lngSend,
      }).then((res) => {
        let locationData = res.data;
        axios.post('/saveLocation', {
          _id: this.props.snowStore._id,
          locationObject: locationData,
          locationName: this.state.locationName,
        }).then((res) => {
          axios.post('/retrieveSavedLocations', {
            id: this.props.snowStore._id
          }).then((res) => {
            this.props.snowStore.weather = res.data;
          })
        })
      });
      resolve()
    });
  };

  markerMaker() {
    let storeArray = this.props.snowStore.weather;
    let coordArray = [];
    storeArray.forEach((item) => {
      let coordObject = {
        position: {
          lat: item.locationObject.latitude,
          lng: item.locationObject.longitude
        },
        name: item.locationName,
      };
      coordArray.push(coordObject);
    });
    return coordArray;
  };

  clickedMarker() {
    if (this.state.stateHasChanged) {
      let clickedObject = {
        lat: this.state.latSend,
        lng: this.state.lngSend
      };
      return clickedObject
    }
  }

  render() {
    return (
      <DailyCard>
        <Mappy
          getCoords={this.getCoords}
          newState={this.newState}
          markerCoords={this.markerCoords}
          state={this.state}
          markerMaker={this.markerMaker}
          clickedMarker={this.clickedMarker}
        />
        <TextWrap>
          <CoordWrap>
            <Text>{this.state.lat}          {this.state.lng}</Text><br />
          </CoordWrap>
          <CoordWrap>
            <Text send>{this.state.latSend}          {this.state.lngSend}           {this.state.locationName}</Text>
            <ButtonRight><DarkSkyButton onClick={this.sendData}>Generate Weather Data</DarkSkyButton></ButtonRight>
          </CoordWrap>
        </TextWrap>
        <WeatherCard />
      </DailyCard>
    );
  };
});

// ------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------

const DailyCard = styled.div`
  max-width: 1600px;
  min-height: 400px;
  margin-top: 50px;
  margin-left: auto;
  margin-right: auto;
  padding: 1.5em;
  background: rgba(0, 0, 0, 0);
`

const TextWrap = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;`

const CoordWrap = styled.div`
flex: 1
`

const Text = styled.h1`
  color: #54b7e0;
  align-content: flex-start;
  
  ${props => props.send && css`
  color: #ba7284;
  align-content: flex-end;
`}`

const ButtonRight = styled.div`
float: right;
`

const DarkSkyButton = styled.button`
font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
font-weight: bold;
border-radius: 3px;
color: white;
width: 250px;
height: 60px;
background: #ba7284;
font-size: 1.25em;
border: 2px solid #ba7284;
`



export default withRouter(inject('snowStore')(Main));
