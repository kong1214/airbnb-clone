import React, { useState } from "react";
import * as spotsActions from "../../store/spots";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom"
import "./SpotsModal.css";

function CreateSpotModal() {
  const dispatch = useDispatch();
  const history = useHistory()
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState([]);
  const [openEditPhotosModal, setOpenEditPhotosModal] = useState(false);
  const [previewImage, setPreviewImage] = useState("")
  const [image1, setImage1] = useState("")
  const [image2, setImage2] = useState("")
  const [image3, setImage3] = useState("")
  const [image4, setImage4] = useState("")
  const { closeModal } = useModal();

  const openPhotosModalClick = () => {
    setOpenEditPhotosModal(!openEditPhotosModal)
  }


  const handleSubmit = (e) => {
    e.preventDefault();
    // make the return
    setErrors([])
    let imagesArr = [image1, image2, image3, image4]
    return dispatch(spotsActions.createOneSpot({
      address, city, state, country, lat: 100, lng: 100, name, description, price, previewImage, imagesArr
    }))
      .then(async (res) => {
        if (res.id) {
          closeModal()
          history.push(`/spots/${res.id}`)
        } else {
          // const data = await res.json()
          const data = await res.json()
          throw new Error(data.errors, res)
        }
      })
      .catch(async (err) => {
        let errorsArr = []
        if (err.message.indexOf(',')) {
          err.message.split(',').forEach(element => {
            errorsArr.push(element)
          })
        } else errorsArr.push(err.message)
        if (errorsArr.find(error => "Invalid value")) {
          errorsArr = errorsArr.filter(error => error !== "Invalid value")
        }
        setErrors(errorsArr);
      })
  };

  let submitIsDisabled = (address === "" || city === "" || state === "" || country === "" || name === "" || description === "" || price === "" || previewImage === "" || image1 === "" || image2 === "" || image3 === "" || image4 === "")
  return (
    <>
      <div className="all-forms-container">
        <div className="create-spot-form-container">
          <h1 className="create-spot-header">Create a Spot</h1>
          <form onSubmit={handleSubmit} className="create-spot-form">
            <ul className="create-a-spot-errors-container">{errors.map((error, idx) => <li key={idx}>{error}</li>)}</ul>
            <label className="create-spot-form-input-with-label">
              Address
              <input
                className="create-spot-form-input"
                placeholder="Address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </label>
            <label className="create-spot-form-input-with-label">
              City
              <input
                className="create-spot-form-input"
                placeholder="City"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </label>
            <label className="create-spot-form-input-with-label">
              State
              <input
                className="create-spot-form-input"
                placeholder="State"
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
            </label>
            <label className="create-spot-form-input-with-label">
              Country
              <input
                className="create-spot-form-input"
                placeholder="Country"
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </label>
            <label className="create-spot-form-input-with-label">
              Name
              <input
                className="create-spot-form-input"
                placeholder="Name of the Spot"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label className="create-spot-form-input-with-label">
              Description
              <input
                className="create-spot-form-input"
                placeholder="Description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </label>
            <label className="create-spot-form-input-with-label">
              Price
              <input
                className="create-spot-form-input"
                placeholder="Price per night"
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </label>
            <div className="edit-photos-split-modal">
              <button className="open-edit-photos-modal-button" type="button" onClick={openPhotosModalClick}>Add Photos</button>
            </div>
            <div className="create-button-container">
              <button className="create-a-spot-form-button" type="submit" disabled={submitIsDisabled}>Create</button>
            </div>
          </form>
        </div>
        {openEditPhotosModal && (
          <div className="edit-photos-modal">
            <h1 className="edit-photos-header">Add Photos</h1>
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

export default CreateSpotModal;
