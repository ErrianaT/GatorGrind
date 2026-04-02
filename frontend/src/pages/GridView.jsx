import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import "./GridView.css";
import placeholderImage from "../assets/placeholderImage.png";
import arrowIcon from "../assets/right-arrow.png";

const businesses = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  name: `Student Business ${i + 1}`,
  category: "Category",
  image: placeholderImage,
}));

const GridView = () => {
  const navigate = useNavigate();

  return (
    <div className="grid-page">
      <Navbar />

      <div className="grid-main">
        <div className="grid-top-section">
          {/* Filters */}
          <div className="grid-filters-row">
            <span className="grid-filter-label">Filter By:</span>

            <select className="grid-filter-select">
              <option>Category</option>
            </select>

            <select className="grid-filter-select">
              <option>Distance</option>
            </select>

            <select className="grid-filter-select">
              <option>Rating</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="business-grid">
          {businesses.map((business) => (
            <div className="business-card" key={business.id}>
              <img
                src={business.image}
                alt={business.name}
                className="business-card-image"
              />

              <div className="business-card-footer">
                <div className="business-card-text">
                  <h3>{business.name}</h3>
                  <p>{business.category}</p>
                </div>

                <button
                  className="business-view-btn"
                  onClick={() => navigate()}
                >
                  View Business
                  <img src={arrowIcon} alt="arrow" className="business-arrow-icon" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} GatorGrind. All rights reserved.</p>
        <div className="footer-links">
          <a href="#">About</a>
          <a href="#">Contact</a>
          <a href="#">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
};

export default GridView;