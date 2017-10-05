import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { Col, Row, Button, Table } from 'react-bootstrap'
import { declineInvitation, setCoordinates } from './../store'
import mapboxgl, { Marker } from 'mapbox-gl'
import history from './../history'



class ConfirmTripMap extends React.Component {
	constructor(props) {
		super(props)
		this.removeSelf = props.removeSelf
		this.giveCoords = props.giveCoords
	}

	componentDidMount() {
		mapboxgl.accessToken = 'pk.eyJ1Ijoic2FtZ2xhc3MiLCJhIjoiY2o2ODNod2c3MGJqNDM0bDdpNm9xNWFxaSJ9.zt0UYvQhCl8Lx6zH9pZ7-w'
		this.map = new mapboxgl.Map({
			container: 'putMapHere',
			style: 'mapbox://styles/mapbox/streets-v9',
			center: [this.props.coordinates[1], this.props.coordinates[0]],
			zoom: 14
		})
	}

	componentWillUnmount() {
		this.map.remove()
	}

	render() {
		let isTripOwner = false
		if(this.props.user.id === this.props.currentTrip.ownerId){
			isTripOwner = true
		}
		return (
			<Row>
				<Col xs={1}></Col>
				<Col xs={10}>
					<div id='putMapHere' className='theMapBox'>
					</div>
					<Button className='tripButton displayBlock' onClick={() => this.giveCoords(this.map, this.props.currentTrip.id, this.props.user.id)}>RVSP with this starting location</Button>
					{
						isTripOwner ? <div /> : <Button className='tripButton displayBlock' onClick={() => this.removeSelf(this.props.currentTrip.id, this.props.user.id)}>I cannot attend</Button>	
					}
				</Col>
				<Col xs={1}></Col>
			</Row>
		)
	}
}


/**
 * CONTAINER
 */

const mapState = (state) => {
	return {
		user: state.user,
		currentTrip: state.currentTrip
	}
}

const mapDispatch = (dispatch) => {
	return {
		removeSelf(tripId, userId) {
			dispatch(declineInvitation(tripId, userId))
			history.push('/home')
		},
		giveCoords(map, tripId, userId) {
			let temp = map.getCenter()
			let coords = [+temp.lat.toFixed(6), +temp.lng.toFixed(6)]
			dispatch(setCoordinates(coords, tripId, userId))
		}
	}
}

export default connect(mapState, mapDispatch)(ConfirmTripMap)