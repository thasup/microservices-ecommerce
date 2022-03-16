import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const SizeSelector = ({ product, width, callback }) => {
  const [index, setIndex] = useState(null);
  const [text, setText] = useState("");
  const [sizeArray, setSizeArray] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (product?.sizes) {
      product.sizes.toUpperCase();
      const sizes = product?.sizes.split(",");

      setSizeArray(sizes);
      setLoading(false);
    }

    if (sizeArray !== null) {
      callback(sizeArray[index]);
    }
  }, [product, index]);

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {text.toUpperCase()}
    </Tooltip>
  );

  return loading ? null : (
    <div className="px-0 d-flex flex-row">
      {sizeArray.map((size, i) => (
        <OverlayTrigger
          key={i}
          placement="top"
          delay={{ show: 50, hide: 0 }}
          overlay={renderTooltip}
          onEnter={() => setText(size)}
        >
          {i === index ? (
            <i
              className="size-selector"
              style={{
                backgroundColor: "#000",
                color: "#fff",
                width: `${width}`,
                height: `${width}`,
              }}
              onClick={() => setIndex(i)}
            >
              {size}
            </i>
          ) : (
            <i
              className="size-selector"
              style={{
                width: `${width}`,
                height: `${width}`,
              }}
              onClick={() => setIndex(i)}
            >
              {size}
            </i>
          )}
        </OverlayTrigger>
      ))}
    </div>
  );
};

export default SizeSelector;
