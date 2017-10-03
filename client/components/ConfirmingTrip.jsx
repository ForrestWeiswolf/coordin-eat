import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import React, {Component} from 'react'
import {Col, Row, Button, Table} from 'react-bootstrap'
import axios from 'axios'




let attendeeArray = [{name: 'Jackson', location: [40.7061336, -74.0119549]}, {name: 'David'}, {name: 'Sam', location: [40.7061336, -74.0119549]}]
let isTripOwner = true

class ConfirmTrip extends Component {
	constructor(props) {
		super(props)
		this.state = {
			confirmed: false,
			location: [4]
		}
		this.getLocation = this.getLocation.bind(this)
		this.removeFromTrip = this.removeFromTrip.bind(this)
	}



	getLocation() {
		const location = []

		navigator.geolocation.getCurrentPosition(function(position) {
			location[0] = position.coords.latitude
			location[1] = position.coords.longitude
		})

		location && this.setState({location})

		console.log(this.state.location)
	}


	manualEnter () {

	}


	removeFromTrip () {
		axios.delete(`/api/attendee/${this.props.currentTrip.id}/${this.props.user.id}`)
			.then(() => console.log(`${this.props.currentTrip.id} ${this.props.user.id}`))
	}



	render () {

		console.log('props from confirming', this.props)
		return (
			<div>
				<h1>Da trip</h1>
				<button onClick={this.getLocation}>Get my location</button>
				<form>
					This is what my geographical coordinates are  going to be:
					<input type='text' name='address'/>
				</form>

				<button onClick={this.removeFromTrip}>Can't make it</button>




			</div>

		)
	}
}


/**
 * CONTAINER
 */
const mapState = (state) => {
	return {
		TripBuild: state.TripBuild,
		yelpList: state.yelp,
		Results: state.Results,
		user: state.user,
		currentTrip: state.currentTrip
	}
}

const mapDispatch = (dispatch) => {
	return {
	}
}

export default connect(mapState, mapDispatch)(ConfirmTrip)

/**
 * PROP TYPES
 */
ConfirmTrip.propTypes = {
	//TripBuild: PropTypes.array,
}

/**
 * 	<Row>
				<Col xs={1}></Col>
				<Col xs={10}>
					<h3>Here's Who's Coming!</h3>
					<Table responsive>
						<thead>
							<tr>
								<th>#</th>
								<th>Name</th>
								<th>location</th>
							</tr>
						</thead>
						<tbody>
							{
								attendeeArray.map((attendee, idx) =>{
									return (
										<tr key={idx}>
											<td>{idx + 1}</td>
											<td>{attendee.name}</td>
											{attendee.location ? (<td>{attendee.location[0]+ ', '+attendee.location[1]}</td>) : (<td>Awaiting Reply</td>)}
										</tr>
									)
								})
							}
						</tbody>
					</Table>
					{
						isTripOwner ? (<Button className='tripButton'>Procced to Voting</Button>) : ''
					}
				</Col>
				<Col xs={1}></Col>
			</Row>
 */
