import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import positive_icon from "../assets/positive.png";
import neutral_icon from "../assets/neutral.png";
import negative_icon from "../assets/negative.png";
import review_icon from "../assets/reviewbutton.png";
import Header from '../Header/Header';

const Dealer = () => {
  const [dealer, setDealer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [unreviewed, setUnreviewed] = useState(false);
  const [postReview, setPostReview] = useState(<></>);

  const params = useParams();
  // Fallback to extraction from window path if useParams().id is undefined
  const pathId = window.location.pathname.split('/').filter(Boolean).pop();
  const id = params.id || pathId;

  const base_url = window.location.origin;

  const get_dealer = async (currentId) => {
    if (!currentId || currentId === "undefined") return;
    try {
      const res = await fetch(`${base_url}/djangoapp/dealer/${currentId}`, { method: "GET" });
      const retobj = await res.json();
      
      if (retobj.status === 200 && retobj.dealer) {
        let dealerData = retobj.dealer;
        if (Array.isArray(dealerData)) {
          dealerData = dealerData[0];
        }
        setDealer(dealerData || {});
      }
    } catch (error) {
      console.error("Error fetching dealer details:", error);
    }
  };

  const get_reviews = async (currentId) => {
    if (!currentId || currentId === "undefined") return;
    try {
      const res = await fetch(`${base_url}/djangoapp/reviews/dealer/${currentId}`, { method: "GET" });
      const retobj = await res.json();
      
      if (retobj.status === 200) {
        if (retobj.reviews && retobj.reviews.length > 0) {
          setReviews(retobj.reviews);
        } else {
          setUnreviewed(true);
        }
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const senti_icon = (sentiment) => {
    if (sentiment === "positive") return positive_icon;
    if (sentiment === "negative") return negative_icon;
    return neutral_icon;
  };

  useEffect(() => {
    if (id && id !== "undefined") {
      get_dealer(id);
      get_reviews(id);
      if (sessionStorage.getItem("username")) {
        setPostReview(
          <a href={`/postreview/${id}`}>
            <img src={review_icon} style={{ width: '10%', marginLeft: '10px', marginTop: '10px' }} alt='Post Review' />
          </a>
        );
      }
    }
  }, [id]);

  if (!dealer) {
    return (
      <div style={{ margin: "20px" }}>
        <Header />
        <div style={{ marginTop: "20px" }}>Loading Dealer Details...</div>
      </div>
    );
  }

  return (
    <div style={{ margin: "20px" }}>
      <Header />
      <div style={{ marginTop: "10px" }}>
        <h1 style={{ color: "grey" }}>
          {dealer.full_name || dealer.name || `Dealer #${id}`} {postReview}
        </h1>
        <h4 style={{ color: "grey" }}>
          {dealer.city}, {dealer.address}, Zip - {dealer.zip}, {dealer.state}
        </h4>
      </div>
      <div className="reviews_panel">
        {reviews.length === 0 && unreviewed === false ? (
          <div>Loading Reviews....</div>
        ) : unreviewed === true ? (
          <div>No reviews yet!</div>
        ) : (
          reviews.map((review, index) => (
            <div className='review_panel' key={index}>
              <img src={senti_icon(review.sentiment)} className="emotion_icon" alt='Sentiment' />
              <div className='review'>{review.review}</div>
              <div className="reviewer">
                {review.name} {review.car_make} {review.car_model} {review.car_year}
              </div>
            </div>
          ))
        )}
      </div>  
    </div>
  );
};

export default Dealer;