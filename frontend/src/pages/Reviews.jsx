import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/NavBar";
import "./Reviews.css";

const Reviews = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/login");
      return;
    }
    try {
      const response = await axios.get(`http://localhost:5001/api/businesses/user/${userId}`);
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reviews-page">
      <Navbar />
      <div className="reviews-container">
        <button className="back-btn" onClick={() => navigate("/profile")}>
          ← Back to Profile
        </button>
        <h1>My Reviews</h1>

        {loading ? (
          <p>Loading...</p>
        ) : reviews.length === 0 ? (
          <p className="no-reviews-msg">You haven't reviewed any businesses yet.</p>
        ) : (
          <div className="reviews-list">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="review-card"
                onClick={() => navigate(`/business/${review.business?._id}`)}
              >
                <div className="review-card-header">
                  <h3>{review.business?.business_name}</h3>
                  <div className="review-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className={star <= review.rating ? "star-filled" : "star-empty"}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="review-category">{review.business?.category}</p>
                <p className="review-comment">{review.comment || "No comment provided."}</p>
                <span className="review-date">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;