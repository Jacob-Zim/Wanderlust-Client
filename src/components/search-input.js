import React from 'react';
import {connect} from 'react-redux';
import { fetchSearchApi } from '../actions/protected-data';
import '../css/search.css'

export class Search extends React.Component {
  onSubmit(event) {
    event.preventDefault();
    const search = document.getElementById("searchInput").value;
    const location = document.getElementById("locationInput").value;
    if(search && location) {
      this.props.dispatch(fetchSearchApi(search, location));
    } else {
      this.props.dispatch(fetchSearchApi(search, this.props.locationAddress));
    }
  }

  render() {
    return (
      <div className={"search"}>
        <form className={'form-search'}onSubmit={event => this.onSubmit(event)}> 
          <input
            type="text"
            className={'search-input'}
            id="searchInput"
            placeholder="Search"
          /> 
          <input 
            type="text"
            className={'location-input'}
            id="locationInput"
            placeholder="Location"
          />
          <button className={"search-button"} type="submit" aria-label="search"></button>
          <br/>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  protectedData: state.protectedData.data,
  locationAddress: state.protectedData.locationAddress
});

export default connect(mapStateToProps)(Search);