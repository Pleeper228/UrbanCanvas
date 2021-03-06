import React from 'react'
import { compose, withProps, lifecycle } from "recompose"
import { withScriptjs } from "react-google-maps"
import { StandaloneSearchBox } from "react-google-maps/lib/components/places/StandaloneSearchBox"
import runtimeEnv from '@mars/heroku-js-runtime-env';

// require("dotenv").config()

const env = runtimeEnv();


const SearchBox = compose(
  withProps({
    googleMapURL: env.REACT_APP_ADDRESS_SEARCH,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
  }),
  lifecycle({
    componentDidMount() {
      const refs = {}

      this.setState({
        places: [],
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();
          let theLocation = places[0].formatted_address
          let theLat = places[0].geometry.location.lat()
          let theLng = places[0].geometry.location.lng()
          this.props.addressUpdate({
            location: theLocation,
            lat: theLat,
            lng: theLng
          })
          places
        },
      })
    },
  }),
  withScriptjs
)(props =>
  <div data-standalone-searchbox="">
    <StandaloneSearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      onPlacesChanged={props.onPlacesChanged}
    >
      <input
        type="text"
        placeholder="Enter address"
        style={{
          boxSizing: `border-box`,
          border: `1px solid transparent`,
          width: `50%`,
          height: `32px`,
          padding: `0 12px`,
          borderRadius: `3px`,
          boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
          fontSize: `14px`,
          outline: `none`,
          textOverflow: `ellipses`,
        }}
      />


    </StandaloneSearchBox>

  </div>
);

export default SearchBox
