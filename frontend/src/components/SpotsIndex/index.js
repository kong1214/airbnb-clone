import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as spotsActions from "../../store/spots"
import DetailCard from "./DetailCard"
import "./SpotsIndex.css"
const SpotsIndex = () => {

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(spotsActions.getAllSpots());
    }, [dispatch])

    const data = useSelector(state => state.spots.allSpots)
    if (!data) {
        // console.log("data is null")
        return null
    }

    const spots = Object.values(data)
    return (
        <div>
            <h1 className="header-container"></h1>
            <div className="index-container">
                {spots.map(spot => (
                    <DetailCard
                        spot={spot}
                        key={spot.id}
                    />
                ))}
            </div>
        </div>
    )
}

export default SpotsIndex
