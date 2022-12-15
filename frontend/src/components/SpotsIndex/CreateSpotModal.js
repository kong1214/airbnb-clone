import React, { useState } from "react";
import * as spotsActions from "../../store/spots";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./SpotsModal.css";

function CreateSpotModal() {
  const dispatch = useDispatch();
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [previewImage, setPreviewImage] = useState("")
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    // make the return
    setErrors([])
    return dispatch(spotsActions.createOneSpot({
        address, city, state, country, lat, lng, name, description, price, previewImage
    }))
    .then(closeModal)
    .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });
  };


  return (
    <>
      <h1 className="create-spot-header">Create a Spot</h1>
      <form onSubmit={handleSubmit} className="create-spot-form">
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
            placeholder="Latitude"
            type="text"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            className="form-input"
            placeholder="Longitude"
            type="text"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
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
        <label>
          <input
            className="form-input"
            placeholder="Preview Image"
            type="text"
            value={previewImage}
            onChange={(e) => setPreviewImage(e.target.value)}
            required
          />
        </label>
        <button className="form-input button" type="submit">Create</button>
      </form>
    </>
  );
}

export default CreateSpotModal;
