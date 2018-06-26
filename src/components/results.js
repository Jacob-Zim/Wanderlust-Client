import React from 'react';
import { connect } from 'react-redux';
import {
    openMoreDetails,
    closeMoreDetails,
    openTripDropdown,
    holdDropdownElement,
    closeTripDropdown,
    fetchPlacesDetails,
    savePlaceToTrip,
    saveTrip
} from '../actions/results';

import { setMarkerLocation, openMarker, closeMarker, fetchNextSearchApi } from '../actions/protected-data';

class Results extends React.Component {

    constructor() {
        super();
    // bind for use in named function - required for removing event listener
    this.closeDropdown = this.closeDropdown.bind(this);
    }

    clicked(inc) {
        if (inc === this.props.clicked) {
            this.props.dispatch(closeMoreDetails());
            this.props.dispatch(closeMarker());
        }
        else {
            this.props.dispatch(openMoreDetails(inc));
            this.props.dispatch(openMarker());
            this.props.dispatch(fetchPlacesDetails(this.props.results[inc].place_id));
            this.props.dispatch(setMarkerLocation(this.props.results[inc].geometry.location))
            // console.log(this.props.results)
            // console.log(this.props.results[inc].geometry.location)
            // console.log(this.props.result.details.geometry);
            // console.log(this.props.results[inc].photos[0].photo_reference)
            // console.log(this.props.results[inc].photos[0].html_attributions)
            // this.props.dispatch(fetchPhoto(this.props.results[inc].photos[0].photo_reference))
            // console.log(this.props)
        }
    }

    closeDropdown(e) {
        e.preventDefault();
        // if user clicked out of the menu
        if (!this.props.dropdownElement.contains(e.target)) {
            this.props.dispatch(closeTripDropdown());
            document.removeEventListener('click', this.closeDropdown);
            // close the menu, remove the old listener
        }
    }

    saveNewTrip(inc) {
        this.props.dispatch(saveTrip(this.props.details, this.props.results[inc].place_id));
    }

    render() {
        let dynamicHeight;
        let list;
        let details;
        let page;

        if (this.props.results.length >= 1) {
            //create but if there is a next page token to paginate through results
            if(this.props.next_page_token){
                page = <button
                className="nextPage"
                onClick={ (e) => {
                    //    e.preventDefault();
                    console.log('clicked', this.props);
                    this.props.dispatch(fetchNextSearchApi(this.props.next_page_token))}}
                >Next Page</button>}
            // create button allowing user to save a place to a trip if they have a trip
            let saveTripDropdownBtn;
            let saveTripDropdown;
            if (this.props.trips.length >= 1) {
                saveTripDropdownBtn =
                    <button onClick={(e) => {
                        e.stopPropagation();
                        // show the dropdown of trips
                        this.props.dispatch(openTripDropdown());

                        // add listener for closing dropdown on click anywhere but the dropdown
                        document.addEventListener('click', this.closeDropdown);
                    }}>
                        add to trip
                        </button>

                // if the button was clicked
                if (this.props.tripDropdown) {
                    // uses ref to reference the dropdown element from the dom
                    // which will be used to check if user clicked outside of it
                    saveTripDropdown =
                        <div
                            ref={(element) => {
                                if (!this.props.dropdownElement) {
                                    this.props.dispatch(holdDropdownElement(element));
                                }
                            }}
                        >
                            {this.props.trips.map((trip, counter) => {
                                return <button key={counter} onClick={(e) => {
                                    e.stopPropagation();
                                    this.props.dispatch(savePlaceToTrip(this.props.details, this.props.trips[counter].id))
                                }}>{trip.name}</button>
                            })}
                        </div>
                }
            }
            list = this.props.results.map((result, inc) => {
                // make sure the 0 index isn't expanded
                if (this.props.clicked === false) {
                    dynamicHeight = '100px'
                }
                // expand the clicked box, include details
                if (inc === Number(this.props.clicked) && this.props.clicked !== false && this.props.details !== null
                    // &&this.props.photo !== null
                ) {
                    if (this.props.loading) {
                        details = <p>loading...</p>
                    }
                    dynamicHeight = '300px'
                    details =
                        <div>
                            <div>
                                Rating: {this.props.details.rating}
                            </div>
                            <div>
                                {this.props.details.formatted_address}
                            </div>
                            <div>       {this.props.details.formatted_phone_number}
                            </div>
                            <a href={this.props.details.website} target="_blank">
                                {`${this.props.details.name} official website`}
                            </a>
                            <div>
                                <img src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=2000&photoreference=${this.props.details.photos[0].photo_reference}&key=AIzaSyDcXgfc08bFKvh2HkOilaX112ghHvyRBkU`} alt={`${this.props.details.name}`} className="place-photo" />
                                <span className={`${this.props.details.photos[0].html_attributions[0]}`}></span>
                            </div>
                            <div>
                                {saveTripDropdownBtn}
                                {saveTripDropdown}
                                <button onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('clicked');
                                    this.saveNewTrip(inc);
                                }}>
                                    start new trip
                     </button>
                            </div>
                        </div>
                }
                // keep box regular size
                else {
                    dynamicHeight = '100px'
                    details = null;
                }
                return (
                    <div
                        key={inc}
                        id={inc}
                        style={{ width: '40%', innerWidth: '300px', height: dynamicHeight, border: 'solid 1px black' }}
                        onClick={() => {
                            this.clicked(inc)
                        }}
                    >
                        {result.name}
                        {details}
                    </div>
                )
            });
        }
        return (
            <div className={"result-map-view"}>
                {list}
                {page}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        results: state.protectedData.results,
        loading: state.result.loading,
        trips: state.protectedData.trips,
        clicked: state.result.open,
        details: state.result.details,
        tripDropdown: state.result.tripDropdown,
        dropdownElement: state.result.tripDropdownElement,
        next_page_token: state.protectedData.next_page_token
    }
};

export default connect(mapStateToProps)(Results)