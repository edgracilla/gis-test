import React from 'react'
import { connect } from 'react-redux'

import Map from 'ol/Map'
import View from 'ol/View'
import OSM from 'ol/source/OSM'
import Overlay from 'ol/Overlay'

import * as CONFIG from '../config'
import { fromLonLat } from 'ol/proj'

import TileLayer from 'ol/layer/Tile'
import BingMaps from 'ol/source/BingMaps'
import GoogleLayer from 'olgm/layer/Google'
import OLGoogleMaps from 'olgm/OLGoogleMaps'

// import OLCesium from 'olcs/OLCesium'
// import Cesium from 'cesium/Source/Cesium'
// window.CESIUM_BASE_URL = ''
// window.Cesium = Cesium

// const ol3d = new OLCesium({ map }); // ol2dMap is the ol.Map instance
// ol3d.setEnabled(true);
// window.ol3d = ol3d

class OpenMap extends React.Component {
  state = {
    map: null,
    olgm: null,
    popup: null,
    marker: null,

    layers: {
      googlemap: new GoogleLayer(),
      openmap: new TileLayer({ source: new OSM() }),
      bingmap: new TileLayer({ source: new BingMaps(CONFIG.BINGMAP) })
    }
  }

  makeView (pos, zoom = 8) {
    return new View({
      center: pos,
      zoom
    })
  }

  makePopup (pos) {
    return new Overlay({
      position: pos,
      autoPan: true,
      autoPanAnimation: { duration: 250 },
      element: document.getElementById('popup'),
    })
  }

  makeMarker (pos) {
    return new Overlay({
      position: pos,
      stopEvent: false,
      positioning: 'center-center',
      element: document.getElementById('marker'),
    })
  }

  makeMap (pos, layers, overlays = []) {
    layers = Array.isArray(layers) ? layers : [layers]
    overlays = Array.isArray(overlays) ? overlays : [overlays]

    return new Map({
      layers: layers,
      overlays: overlays,
      view: this.makeView(pos),
      target: this.refs.mapContainer
    })
  }
  
  componentDidMount() {
    let pos = fromLonLat(CONFIG.DEF_COOR)
    let defaultMap = this.state.layers[CONFIG.BASEMAP]

    let popup = this.makePopup()
    let marker = this.makeMarker()
    let map = this.makeMap(pos, defaultMap, [popup, marker])

    this.setState(prevState => { return { ...prevState, popup, marker, map } })
  }

  componentDidUpdate(prevProps, prevState) {
    let { popup, marker, layers, map, olgm } = prevState
    let { baseMap: prevBm, searchText: prevSt } = prevProps
    let { baseMap: curBm, searchText: curSt, data } = this.props

    // console.log('st:', `'${prevSt}'`, `'${curSt}'`, '| bm:', `'${prevBm}'`, `'${curBm}'`)

    // ------- on basemap change -------
    if (prevBm !== curBm) {
      map.removeLayer(layers[prevBm])
      map.addLayer(layers[curBm])
      
      if (curBm === 'googlemap' && !olgm) {
        olgm = new OLGoogleMaps({ map })
        olgm.activate()
      }

      this.setState(prev => { return { ...prev, map, olgm } })
    }

    // ------- on search text change -------
    if (prevSt !== curSt && data.coord) {
      let { lon, lat } = data.coord
      let pos = fromLonLat([lon, lat])

      popup.setPosition(pos)
      marker.setPosition(pos)
      map.setView(this.makeView(pos))
      this.setState(prev => { return { ...prev, map } })
    }
  }

  render () {
    let { name, sys, weather, wind, main } = this.props.data

    // https://openweathermap.desk.com/customer/portal/questions/16682619-wind-speed
    let windSpeed = parseFloat((wind.speed || 0) * (3600/1609.344)).toFixed(2)
    let temp = parseFloat(main.temp - 273.15).toFixed(2) // Kelvin to Celsius

    return (
      <div>
        <div ref="mapContainer" className="mapContainer"></div>
        <div id="marker"></div>
        
        <div id="popup" className="ol-popup">
          <div id="popup-content">
            <label className="city">{name}, {sys.country}</label>
            <ul className="readings">
              <li>Weather: '{weather[0].description}'</li>
              <li>Wind Speed: {windSpeed} mph</li>
              <li>Temp: {temp} 'C</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
	return {
    data: state.data,
    baseMap: state.baseMap,
    viewType: state.viewType,
    searchText: state.searchText
	}
}

export default connect(mapStateToProps)(OpenMap)
