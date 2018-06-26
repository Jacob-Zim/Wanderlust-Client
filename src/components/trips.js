import React, {Component} from 'react';
import {connect} from 'react-redux';
import { setMarkerLocation } from '../actions/protected-data';
import {fetchTrips, fetchTripDetails, removeTrip} from '../actions/protected-data';

class Trip extends Component {
    componentDidMount() {
        this.props.dispatch(fetchTrips())
    }

    openTrip(inc) {
        this.props.dispatch(fetchTripDetails(this.props.trips[inc].id));
        this.props.dispatch(setMarkerLocation(this.props.trips[inc].location))
    }

    render() {
        let trips;
        if (this.props.trips.length >= 1) {
            trips = this.props.trips.map((trip, inc) =>
                {  
                    return (
                        <div className={"trips-data"}>
                        <div  className={"showing-trips"} key={inc} onClick={() => this.openTrip(inc)}>
                            {trip.name}
                            <div className="delete-data" >
                            <button className={"delete-button"} onClick={(e) => { 
                                e.stopPropagation();
                                if (window.confirm(`Are you sure you want to delete ${this.props.trips[inc].name}?`)) this.props.dispatch(removeTrip(this.props.trips[inc].id))
                            }}>DELETE</button>
                            </div>
                        </div>
                        </div>
                    );
                }
            );
        }
        return (
            <div className={"trips-list"}>
                {trips}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        trips: state.protectedData.trips
    }
}

export default connect(mapStateToProps)(Trip);