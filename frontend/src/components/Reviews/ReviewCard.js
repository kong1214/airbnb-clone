import "./Reviews.css"

const ReviewCard = ({ review }) => {

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    if (!review.User) return null;
    let date = new Date(review.createdAt)
    const year = date.getFullYear()
    const monthIdx = date.getMonth()
    let fullDate = `${monthNames[monthIdx]} ${year}`
    return (
        <div className="review-card-container">
            <div className="picture-name-date-stars-container">
                <div className="icon-container">
                    <img className="profile-picture" src="https://cdn.vectorstock.com/i/preview-1x/90/02/profile-photo-placeholder-icon-design-vector-43189002.jpg"></img>
                </div>
                <div className="name-date-stars-container">
                    <div className="user-name">{`${review.User.firstName} ${review.User.lastName}`}</div>
                    <div className="date-stars-container">
                        <div className="creation-date">{fullDate}</div>
                        <div className="stars-rating">
                            <i className="fa-solid fa-star"></i>
                            {`${review.stars}`}
                        </div>
                    </div>
                </div>
            </div>
            <div className="review-text">{review.review}</div>
        </div>
    )
}



export default ReviewCard
