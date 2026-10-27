import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';

const Dealer = () => {
  const [dealer, setDealer] = useState({ full_name: "Loading...", city: "", address: "", zip: "", state: "" });
  const [reviews, setReviews] = useState([]);
  
  const { id } = useParams();
  const base_url = window.location.origin;

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch dealer details
        const dealerRes = await fetch(`${base_url}/djangoapp/dealer/${id}`);
        const dealerObj = await dealerRes.json();
        if (dealerObj.status === 200 && dealerObj.dealer) {
          const dData = Array.isArray(dealerObj.dealer) ? dealerObj.dealer[0] : dealerObj.dealer;
          setDealer(dData);
        }

        // Fetch reviews
        const reviewRes = await fetch(`${base_url}/djangoapp/reviews/dealer/${id}`);
        const reviewObj = await reviewRes.json();
        if (reviewObj.status === 200 && reviewObj.reviews) {
          setReviews(reviewObj.reviews);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }
    fetchData();
  }, [id, base_url]);

  return (
    <div style={{ margin: "20px" }}>
      <Header />
      <div style={{ marginTop: "20px" }}>
        <h1 style={{ color: "#333" }}>{dealer.full_name || `Dealer #${id}`}</h1>
        <h4 style={{ color: "#666" }}>
          {dealer.city}, {dealer.address} - {dealer.zip}, {dealer.state}
        </h4>
      </div>
      <div className="reviews_panel" style={{ marginTop: "20px" }}>
        <h3>Reviews</h3>
        {reviews.length === 0 ? (
          <div>No reviews yet for this dealer!</div>
        ) : (
          reviews.map((review, index) => (
            <div className='review_panel' key={index} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
              <div className='review'><strong>Review:</strong> {review.review}</div>
              <div className="reviewer"><strong>User:</strong> {review.name} | <strong>Car:</strong> {review.car_make} {review.car_model} ({review.car_year})</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dealer;