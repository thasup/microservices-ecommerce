'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStarHalfAlt,
  faStar as fasfaStar
} from '@fortawesome/free-solid-svg-icons';
import { faStar as farfaStar } from '@fortawesome/free-regular-svg-icons';

/**
 * Small local replacement for react-rating-stars-component.
 *
 * Props:
 * - value: current rating (supports halves for display)
 * - onChange: callback with the new rating (only when edit is true)
 * - count: number of stars (default 5)
 * - size: font size in px (default 40)
 * - edit: when false, the rating is read-only (default true)
 * - activeColor: color of the filled stars (default '#000')
 */
const StarRating = ({
  value = 0,
  onChange,
  count = 5,
  size = 40,
  edit = true,
  activeColor = '#000'
}) => {
  const [hoverValue, setHoverValue] = useState(null);

  const displayValue = hoverValue ?? value;

  const iconFor = (index) => {
    if (displayValue >= index) {
      return fasfaStar;
    } else if (displayValue >= index - 0.5) {
      return faStarHalfAlt;
    }
    return farfaStar;
  };

  return (
    <div
      className="star-rating unselectable"
      role={edit ? 'radiogroup' : 'img'}
      aria-label={`Rating: ${value} of ${count} stars`}
      style={{ display: 'inline-flex', fontSize: `${size}px` }}
      onMouseLeave={() => setHoverValue(null)}
    >
      {Array.from({ length: count }, (_, i) => i + 1).map((index) => (
        <span
          key={index}
          role={edit ? 'radio' : undefined}
          aria-checked={edit ? value >= index : undefined}
          aria-label={edit ? `${index} star${index > 1 ? 's' : ''}` : undefined}
          style={{
            color: displayValue >= index - 0.5 ? activeColor : '#ccc',
            cursor: edit ? 'pointer' : 'default',
            padding: '0 2px'
          }}
          onMouseEnter={edit ? () => setHoverValue(index) : undefined}
          onClick={edit && onChange ? () => onChange(index) : undefined}
        >
          <FontAwesomeIcon icon={iconFor(index)} />
        </span>
      ))}
    </div>
  );
};

export default StarRating;
