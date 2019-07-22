import React from 'react'
import { connect } from 'react-redux'

import * as ACTION from '../store/actions'

class MapControl extends React.Component {
	render () {
    return (
			<div className="container map-control">
				<div className="row">
					<div className="col-sm">
						<select onChange={this.props.onBaseMapChange}>
							<option value="openmap">OpenStreetMap</option>
							<option value="googlemap">GoogleMap</option>
							<option value="bingmap">BingMap</option>
						</select>
					</div>
					<div className="col-lg">
						<input className="form-control form-control-sm" type="text" placeholder="Search" onKeyDown={this.props.onSearch}/>
					</div>
					<div className="col-sm">
						<select onChange={this.props.onViewTypeChange}>
							<option value="2d">OpenLayer(2D)</option>
							<option value="3d">Cesium (3D)</option>
						</select>
					</div>
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		baseMap: state.baseMap,
		viewType: state.viewType,
		searchText: state.searchText
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onBaseMapChange: (event) => dispatch({ type: ACTION.CHANGE_BASEMAP, value: event.target.value }),
		onViewTypeChange: (event) => dispatch({ type: ACTION.CHANGE_VIEWTYPE, value: event.target.value }),

		onSearch: (event) => {
			if (event.key === 'Enter') {
				let val = event.target.value
				let appid = '5dc29ee3d7cdc64965d27d5e448c4619'				
				let url = `http://api.openweathermap.org/data/2.5/weather?appid=${appid}&q=${val}`

				return fetch(url)
					.then(response => response.json())
					.then(jsondata => dispatch({ type: ACTION.SEARCH, payload: {
						data: jsondata,
						value: val
					}}))
			}
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(MapControl)