import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import React from 'react'
import {Col, Row, Button, Table} from 'react-bootstrap'
import {setCurrentCoords, moveToVotingThunk} from './../store'
import {ConfirmingTripMap} from './index.js'

const ConfirmTrip = (props) => {
	let isTripOwner = false
	if(props.currentTrip.ownerId === props.user.id){
		isTripOwner = true
	}

	let attendeeArray = props.currentTrip.attendees
	let myAttendance = attendeeArray.filter(attendee => {
		return attendee.user.id === props.user.id
	})[0]

	if(myAttendance && myAttendance.origin){
		return(
			<Row>
				<Col xs={12} className='noPaddingLeft noPaddingRight'>
					<h3 className='marginLeft15'>Here's Who's Coming!</h3>
					<Table responsive>
						<thead>
							<tr>
								<th>#</th>
								<th>Name</th>
								<th>Location</th>
							</tr>
						</thead>
						<tbody>
							{
								attendeeArray.map((attendee, idx) =>{
									return (
										<tr key={idx}>
											<td>{idx + 1}</td>
											<td>{attendee.user.name}</td>{
											}
											{attendee.origin ? (<td>{attendee.origin[0]}, {attendee.origin[1]}</td>) : (<td>Awaiting Reply</td>)}
										</tr>
									)
								})
							}
						</tbody>
					</Table>
					{
						isTripOwner ? (
							<Button 
								className='marginLeft15 tripButton' 
								onClick={() => {
									props.moveToVoting(props.currentTrip)
								}}
								disabled={props.loading}
							>
								{props.loading ? 'Calculating results...' : 'Proceed to Voting'}
							</Button>) : ''
					}
				</Col>
			</Row>
		)
	} else {
		if(props.currentLocation[0] === null){
			navigator.geolocation.getCurrentPosition(function(position) {
				let currentCoords = [Number(position.coords.latitude.toFixed(6)), Number(position.coords.longitude.toFixed(6))]
				props.setLocation(currentCoords)
			},
			function(error) {
				console.error(error)
				props.setLocation([40.750589, -73.993512])
			})
		}
		if (props.currentLocation[0] !== null) {
			return (
				<Row>
					<Col xs={12}>
						<h5>Center the map on your starting point.</h5>
						<ConfirmingTripMap coordinates={props.currentLocation}/>
					</Col>
				</Row>
			)
		} else {
			return(
				<h3 id='putMapHere' className='marginLeft15'>Loading . . .</h3>
			)
		}
	}
}


/**
 * CONTAINER
 */

const mapState = (state) => {
	return {
		user: state.user,
		currentTrip: state.currentTrip,
		currentLocation: state.currentLocation,
		loading: !!state.currentTrip.loading
	}
}

const mapDispatch = (dispatch) => {
	return {
		setLocation(coordArray){
			dispatch(setCurrentCoords(coordArray))
		},
		moveToVoting(trip){
			dispatch(moveToVotingThunk(trip.id))
			// let originArray = []
			// trip.attendees.forEach(attendee => {
			// 	if(attendee.origin){
			// 		originArray.push(attendee.origin)
			// 	} else {
			// 		dispatch(declineInvitation(trip.id, attendee.userId))
			// 	}
			// })
		}
	}
}

export default connect(mapState, mapDispatch)(ConfirmTrip)
