import actionTypes from '../actionTypes';
/**
 * @function selectCity will add a city to selectedCity reducer
 * @param {string} city 
 * @returns {object}
 */
export const selectCity = city => {
    return {
        type: actionTypes.CURRENT_CITY,
        payload: city
    }
}