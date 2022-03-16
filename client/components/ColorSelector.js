import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const ColorSelector = ({ product, callback, margin, size, flex }) => {
  const [index, setIndex] = useState(null);
  const [text, setText] = useState("");
  const [colorsArray, setColorsArray] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (product?.colors) {
      product.colors.toLowerCase();
      const colors = product?.colors.split(",");

      setColorsArray(colors);
      setLoading(false);
    }

    if (colorsArray !== null && callback) {
      callback(colorsArray[index]);
    }
  }, [product, index]);

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {text.toLowerCase()}
    </Tooltip>
  );

  return loading ? null : (
    <div className={`px-0 d-flex flex-row justify-content-${flex}`}>
      {colorsArray.map((color, i) => (
        <OverlayTrigger
          key={i}
          placement="top"
          delay={{ show: 50, hide: 0 }}
          overlay={renderTooltip}
          onEnter={() => setText(color)}
        >
          {i === index ? (
            <div
              className="color-selector-outer px-0 color-selected"
              style={{
                margin: `${margin}`,
                width: `${size}`,
              }}
            >
              {color === "white" || color === "White" ? (
                <span
                  className="color-selector-inner"
                  style={{
                    backgroundColor: `${color}`,
                    color: `${color}`,
                    border: "0px solid #000",
                  }}
                  onClick={() => setIndex(i)}
                ></span>
              ) : (
                <span
                  className="color-selector-inner"
                  style={{
                    backgroundColor: `${color}`,
                    color: `${color}`,
                  }}
                  onClick={() => setIndex(i)}
                ></span>
              )}
            </div>
          ) : (
            <div
              className="color-selector-outer px-0"
              style={{
                margin: `${margin}`,
                width: `${size}`,
              }}
            >
              {color === "white" || color === "White" ? (
                <span
                  className="color-selector-inner"
                  style={{
                    backgroundColor: `${color}`,
                    color: `${color}`,
                    border: "1px solid #000",
                  }}
                  onClick={() => setIndex(i)}
                ></span>
              ) : (
                <span
                  className="color-selector-inner"
                  style={{
                    backgroundColor: `${color}`,
                    color: `${color}`,
                  }}
                  onClick={() => setIndex(i)}
                ></span>
              )}
            </div>
          )}
        </OverlayTrigger>
      ))}
    </div>
  );
};

export default ColorSelector;
