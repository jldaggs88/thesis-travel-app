import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
// import Typography from '@material-ui/core/Typography';

const Hotels = ({ currentUser, currentTrip }) => {
  const [hotelData, setHotelData] = useState([]);
  const [trip, setTrip] = useState({});
  const [city, setCity] = useState('');

  const handleChange = (response, cityName) => {
    setTrip(response);
    setCity(cityName);
    console.info(trip, city);
  };

  const handleChangeHotel = (response) => {
    setHotelData(response);
  };

  useEffect(() => {
    axios
      .post(
        '/getFullTrip',
        { id: currentTrip.id, googleId: currentUser.googleId },
        () => {},
      )
      .then((response) => {
        console.info(
          `Grabbing ${currentUser.first_name}'s trip info for ${currentTrip.city}`,
        );
        handleChange(response.data, response.data.destination);
        axios
          .post('/getHotels', { trip: response.data, city: response.data.destination })
          .then((results) => {
            console.info(results);
            handleChangeHotel(results.data);
          })
          .catch((err) => console.warn(err));
      });
  }, []);

  if (hotelData.length === 0) {
    return (
      <h3>
        Finding the best hotel prices for you...If results do no return in 20 seconds or
        less, please try again later
      </h3>
    );
  }

  return (
    <div>
      <h2>HOTELS</h2>
      <p>{`Hey, ${currentUser.first_name}!`}</p>
      <p>{`Check out the cheapest hotels in ${currentTrip.city}:`}</p>
      <div>
        <p>You should book before hotel prices go up!</p>
        <div>
          {hotelData.map((hotel) => {
            if (hotel.offers[0].price.base && hotel.hotel.name && hotel.hotel.rating) {
              return (
                <div>
                  <div>{`It costs $${hotel.offers[0].price.base} to stay at ${hotel.hotel.name}. It has a ${hotel.hotel.rating} start rating.`}</div>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

Hotels.propTypes = {
  currentUser: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    email: PropTypes.string,
    profile_pic: PropTypes.string,
    host: PropTypes.bool,
    googleId: PropTypes.string,
  }).isRequired,
  currentTrip: PropTypes.shape({
    id: PropTypes.number,
    city: PropTypes.string,
  }).isRequired,
};

export default Hotels;
