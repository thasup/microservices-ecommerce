import React from "react";
import PropTypes from "prop-types";

const Rating = ({ value, text, color }) => {
  return (
    <div className="rating">
      <span>
        {[1, 2, 3, 4, 5].map((index) => (
          <i
            key={index}
            style={{ color }}
            className={
              value >= index
                ? "fa-solid fa-star"
                : value >= index - 0.5
                ? "fa-solid fa-star-half-alt"
                : "fa-regular fa-star"
            }
          ></i>
        ))}
      </span>

      <span> {text && text}</span>
    </div>
  );
};

Rating.defaultProps = {
  color: "#000",
};

Rating.propTypes = {
  value: PropTypes.number.isRequired,
  text: PropTypes.string,
  color: PropTypes.string,
};

export default Rating;
