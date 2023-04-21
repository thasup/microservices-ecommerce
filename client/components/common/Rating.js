import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as farfaStar } from '@fortawesome/free-regular-svg-icons';

const Rating = ({ value, numReviews, color, mobile = false }) => {
  const renderTooltip = (props) => (
		<Tooltip id="button-tooltip" {...props}>
			{numReviews} {numReviews < 2 ? 'review' : 'reviews'}
		</Tooltip>
  );
  return mobile
    ? (
		<div className="rating unselectable">
			<span style={{ color }}>
				{value >= 5
				  ? (
					<FontAwesomeIcon icon={faStar} />
				    )
				  : value >= 0.5
				    ? (
					<FontAwesomeIcon icon={faStarHalfAlt} />
				      )
				    : (
					<FontAwesomeIcon icon={farfaStar} />
				      )}
			</span>
			<span> {value}</span>
		</div>
      )
    : (
		<div className="rating unselectable">
			<span>
				{[1, 2, 3, 4, 5].map((index) => (
					<span key={index} style={{ color }}>
						{value >= index
						  ? (
							<FontAwesomeIcon icon={faStar} />
						    )
						  : value >= index - 0.5
						    ? (
							<FontAwesomeIcon icon={faStarHalfAlt} />
						      )
						    : (
							<FontAwesomeIcon icon={farfaStar} />
						      )}
					</span>
				))}
			</span>

			<OverlayTrigger
					placement="top"
					delay={{ show: 50, hide: 0 }}
					overlay={renderTooltip}
				>
				<span> {numReviews && `(${numReviews})`}</span>
			</OverlayTrigger>
		</div>
      );
};

Rating.defaultProps = {
  color: '#000'
};

Rating.propTypes = {
  value: PropTypes.number.isRequired,
  numReviews: PropTypes.number,
  color: PropTypes.string
};

export default Rating;
