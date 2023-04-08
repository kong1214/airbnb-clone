import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SpotsIndex from "./components/SpotsIndex";
import SpotDetails from "./components/SpotsIndex/SpotDetails";
import ReviewsByUser from "./components/Reviews/ReviewsByUser";
import BookingsByUser from "./components/Bookings/BookingsByUser";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <SpotsIndex />
          </Route>
          <Route exact path="/spots/:spotId" >
            <SpotDetails />
          </Route>
          <Route exact path="/reviews/current" >
            <ReviewsByUser />
          </Route>
          <Route exact path="/bookings/current" >
            <BookingsByUser />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
