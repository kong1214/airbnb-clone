import React, { useState } from "react";
import * as spotsActions from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import "./SpotsModal.css";

function EditSpotModal({ spotId }) {
  const dispatch = useDispatch();
  const history = useHistory()

  const spot = useSelector(state => state.spots.singleSpot)

  const [address, setAddress] = useState(spot.address);
  const [city, setCity] = useState(spot.city);
  const [state, setState] = useState(spot.state);
  const [country, setCountry] = useState(spot.country);
  const [name, setName] = useState(spot.name);
  const [description, setDescription] = useState(spot.description);
  const [price, setPrice] = useState(spot.price);
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault()
    // make the return
    setErrors([])
    return dispatch(spotsActions.editOneSpot({
      address, city, state, country, lat: 100, lng: 100, name, description, price
    }, spotId))
      .then(closeModal)
      .then(() => history.push(`/`))
      .catch(async (res) => {
        const data = await res.json();
        console.log(data)
        if (data && data.errors) setErrors(data.errors);
      });
  };


  return (
    <>
      <h1 className="edit-spot-header">Edit this Spot</h1>
      <form onSubmit={handleSubmit} className="edit-spot-form">
        <ul>{errors.map((error, idx) => <li key={idx}>{error}</li>)}</ul>
        <label>
          <input
            className="form-input"
            placeholder="Address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            className="form-input"
            placeholder="City"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            className="form-input"
            placeholder="State"
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            className="form-input"
            placeholder="Country"
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            className="form-input"
            placeholder="Name of the Spot"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            className="form-input"
            placeholder="Description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            className="form-input"
            placeholder="Price per night"
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>
        <button className="form-input button" type="submit">Edit</button>
      </form>
    </>
  );
}

export default EditSpotModal;
