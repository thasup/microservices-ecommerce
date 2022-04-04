import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { faStar as farfaStar } from "@fortawesome/free-regular-svg-icons";

const Rating = ({ value, text, color, mobile = false }) => {
  return mobile ? (
    <div className="rating">
      <span style={{ color }}>
        {value >= 5 ? (
          <FontAwesomeIcon icon={faStar} />
        ) : value >= 0.5 ? (
          <FontAwesomeIcon icon={faStarHalfAlt} />
        ) : (
          <FontAwesomeIcon icon={farfaStar} />
        )}
      </span>
      <span> {value}</span>
    </div>
  ) : (
    <div className="rating">
      <span>
        {[1, 2, 3, 4, 5].map((index) => (
          <span key={index} style={{ color }}>
            {value >= index ? (
              <FontAwesomeIcon icon={faStar} />
            ) : value >= index - 0.5 ? (
              <FontAwesomeIcon icon={faStarHalfAlt} />
            ) : (
              <FontAwesomeIcon icon={farfaStar} />
            )}
          </span>
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
