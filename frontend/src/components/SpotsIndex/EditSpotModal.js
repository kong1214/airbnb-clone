import React, { useState, useEffect } from "react";
import * as spotsActions from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import "./EditSpotsModal.css";

function EditSpotModal({ spotId }) {
  const dispatch = useDispatch();
  const history = useHistory()
  const spot = useSelector(state => state.spots.singleSpot)

  useEffect(() => {
    dispatch(spotsActions.getOneSpot(Number(spotId))).then(setSpotIsLoaded(true))
  }, [spot.address, spot.city, spot.state, spot.country, spot.name, spot.description, spot.price])

  // console.log(spot)

    const previewImageObj = spot.SpotImages.find(image => image.preview === true)
    const restImages = spot.SpotImages.filter(image => image.preview === false)

  const [address, setAddress] = useState(spot.address);
  const [city, setCity] = useState(spot.city);
  const [state, setState] = useState(spot.state);
  const [country, setCountry] = useState(spot.country);
  const [name, setName] = useState(spot.name);
  const [description, setDescription] = useState(spot.description);
  const [price, setPrice] = useState(spot.price);
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();
  const [spotIsLoaded, setSpotIsLoaded] = useState(false)
  const [openEditPhotosModal, setOpenEditPhotosModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(previewImageObj ? previewImageObj.url : null)
  const [image1, setImage1] = useState(restImages[0] ? restImages[0].url : null)
  const [image2, setImage2] = useState(restImages[1] ? restImages[1].url : null)
  const [image3, setImage3] = useState(restImages[2] ? restImages[2].url : null)
  const [image4, setImage4] = useState(restImages[3] ? restImages[3].url : null)

  const handleSubmit = (e) => {
    e.preventDefault()
    // make the return
    setErrors([])
    return dispatch(spotsActions.editOneSpot({
      address, city, state, country, lat: 100, lng: 100, name, description, price
    }, spotId))
      .then(closeModal)
      // .then(() => history.push(`/`))
      .catch(async (res) => {
        const data = await res.json();
        // console.log(data)
        if (data && data.errors) {
          data.errors.splice(data.errors.find(error => "Invalid value"), 1)
          setErrors(data.errors);
        }
      });
  };

  const editPhotosModalClick = () => {
    setOpenEditPhotosModal(!openEditPhotosModal)
  }

  return (
    <>
      <div className="all-forms-container">
        <div className="edit-spot-form-container">
          <h1 className="edit-spot-header">Edit this Spot</h1>
          <form onSubmit={handleSubmit} className="edit-spot-form">
            <ul className="edit-a-spot-errors-container">{errors.map((error, idx) => <li key={idx}>{error}</li>)}</ul>
            <label className="edit-a-spot-form-input-with-label">
              Address
              <input
                className="edit-a-spot-form-input"
                placeholder="Address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </label>
            <label className="edit-a-spot-form-input-with-label">
              City
              <input
                className="edit-a-spot-form-input"
                placeholder="City"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </label>
            <label className="edit-a-spot-form-input-with-label">
              State
              <input
                className="edit-a-spot-form-input"
                placeholder="State"
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
            </label>
            <label className="edit-a-spot-form-input-with-label">
              Country
              <input
                className="edit-a-spot-form-input"
                placeholder="Country"
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </label>
            <label className="edit-a-spot-form-input-with-label">
              Name
              <input
                className="edit-a-spot-form-input"
                placeholder="Name of the Spot"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label className="edit-a-spot-form-input-with-label">
              Description
              <input
                className="edit-a-spot-form-input"
                placeholder="Description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </label>
            <label className="edit-a-spot-form-input-with-label">
              Price
              <input
                className="edit-a-spot-form-input"
                placeholder="Price per night"
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </label>
            <div className="edit-photos-split-modal">
              <button className="open-edit-photos-modal-button" type="button" onClick={editPhotosModalClick}>Edit Photos</button>
            </div>
            <div className="edit-a-spot-button-container">
              <button className="edit-a-spot-form-button" type="submit">Edit</button>
            </div>
          </form>
        </div>
        {openEditPhotosModal && (
          <div className="edit-photos-modal">
            <h1 className="edit-photos-header">Edit Photos</h1>
            <div className="edit-photos-modal-photos-container">
              <div className="edit-photos-modal-individual-photo-container">
              <label className="edit-a-spot-form-input-with-label">
                Preview Image
                <input
                  className="edit-a-spot-form-input"
                  placeholder=""
                  type="text"
                  value={previewImage}
                  onChange={(e) => setPreviewImage(e.target.value)}
                  required
                />
              </label>
              <label className="edit-a-spot-form-input-with-label">
                Image 1
                <input
                  className="edit-a-spot-form-input"
                  placeholder=""
                  type="text"
                  value={image1}
                  onChange={(e) => setImage1(e.target.value)}
                  required
                />
              </label>
              <label className="edit-a-spot-form-input-with-label">
                Image 2
                <input
                  className="edit-a-spot-form-input"
                  placeholder=""
                  type="text"
                  value={image2}
                  onChange={(e) => setImage2(e.target.value)}
                  required
                />
              </label>
              <label className="edit-a-spot-form-input-with-label">
                Image 3
                <input
                  className="edit-a-spot-form-input"
                  placeholder=""
                  type="text"
                  value={image3}
                  onChange={(e) => setImage3(e.target.value)}
                  required
                />
              </label>
              <label className="edit-a-spot-form-input-with-label">
                Image 4
                <input
                  className="edit-a-spot-form-input"
                  placeholder=""
                  type="text"
                  value={image4}
                  onChange={(e) => setImage4(e.target.value)}
                  required
                />
              </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default EditSpotModal;
