import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectCity, filterCity } from '../actions';
import './City.css';

class City extends Component {
    /**
     * @param isFocus - It shows that select city input is focus or blur to show or hide city-box
     */
    state = {
        isFocus: false,
        citySearch: '',
    }
    timeOut = false;
    /**
     * will update citySearch state and filter cities redux state
     * @param {Object} ev - Javascript Event ( change event )
     */
    updateCitySearch = (ev) => {
        const { filterCity } = this.props;
        let citySearch = ev.target.value;
        this.setState({isFocus: true, citySearch}, () => {
            if(this.timeOut) clearTimeout(this.timeOut);
            this.timeOut = setTimeout(() => {
                filterCity(citySearch);
            }, 200);
        });
    }
    /**
     * @function addCity add City to redux state "selectedCities"
     * @param {Object} currentCity - return current selected city data {id, name}
     */
    updateCityBox = currentCity => {
        const { selectCity } = this.props;
        selectCity(currentCity);
    }

    /**
     * filter list of cities , and prevent duplicate city selection
     */
    filterCities = () => {
        let { cities, selectedCities } = this.props;
        let { citySearch } = this.state;
        return cities.map(city => {
            if(citySearch == '' || city.name.toString().toLowerCase().indexOf(citySearch.toString().toLowerCase()) >=0){
                if(!selectedCities.find(selected => selected.id == city.id)){ // filter selection to prevent duplicate select
                    return (
                        <div onClick={() => this.updateCityBox(city)} key={city.id} className="text-left pl-3">
                            <img src={`https://www.countryflags.io/${city.country}/shiny/32.png`} /> {city.name}
                        </div>
                    )
                }
            }
        })
    }
    componentDidMount(){
        const { filterCity } = this.props;
        filterCity('');
    }
    render() {
        let { isFocus, citySearch } = this.state;
        let { cities } = this.props;
        let filterCities = this.filterCities;
        return (
            <div className="container mt-4" data-test="city-component">
                <div 
                    className="text-center col-xs-12 col-sm-8 col-md-6 col-lg-4 col-xl-4 offset-sm-2 offset-md-3 offset-lg-4 offset-xl-4 row"
                >
                    <input 
                        className="col-12 form-control height-50"
                        id="cityInput"
                        data-test="select-city-input"
                        type="text"
                        placeholder="type City then Select"
                        value={citySearch}
                        onChange={this.updateCitySearch}
                        onFocus={this.updateCitySearch}
                        onBlur={() => setTimeout(() => this.setState({isFocus: false, citySearch: ''}), 200)} // use setTimeout to let user click on a city from city-box to select before hide city-box
                    />
                    {
                        isFocus ? 
                        <div data-test="city-box" className="city-box">
                            { filterCities() }
                        </div>
                        : ''
                    }
                </div>
            </div>
        )
    }
}

City.propTypes = {
    selectCity: PropTypes.func,
    selectedCities: PropTypes.array
};

const mapStateToProps = state => {
    const { cities, selectedCities } = state;
    return { cities, selectedCities };
};

export default connect(mapStateToProps, { selectCity, filterCity })(City);