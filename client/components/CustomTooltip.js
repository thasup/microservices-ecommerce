import React, { useEffect, useState } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";

const CustomTooltip = ({ index, mongoId, variant }) => {
  const [text, setText] = useState("");
  const [onCopy, setOnCopy] = useState(false);

  useEffect(() => {
    if (onCopy) {
      /* Copy the text inside the text field */
      navigator.clipboard.writeText(text);

      setText("copy!");
      setOnCopy(false);
    }
  }, [onCopy]);

  const copyHandler = (e) => {
    e.preventDefault();
    setOnCopy(true);
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {text}
    </Tooltip>
  );

  return (
    <>
      <OverlayTrigger
        placement="right"
        delay={{ show: 250, hide: 200 }}
        overlay={renderTooltip}
        onEnter={() => setText(mongoId)}
      >
        <Button variant={variant || "light"} onClick={copyHandler}>
          {index}
        </Button>
      </OverlayTrigger>
    </>
  );
};

export default CustomTooltip;
