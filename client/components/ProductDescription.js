import React from "react";
import dynamic from "next/dynamic";
import { Col, Row } from "react-bootstrap";

const DynamicTab = dynamic(() => import("react-bootstrap/Tab"), {
  ssr: false,
});

const DynamicTabs = dynamic(() => import("react-bootstrap/Tabs"), {
  ssr: false,
});

const ProductDescription = ({ product }) => {
  return (
    <Row>
      <Col>
        <DynamicTabs
          defaultActiveKey="description"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <DynamicTab eventKey="description" title="Description">
            <p>{product.description}</p>
          </DynamicTab>

          <DynamicTab eventKey="material" title="Material">
            <p>{product.material}</p>
          </DynamicTab>

          <DynamicTab eventKey="size-chart" title="Size Chart">
            <p>Working in progress...</p>
          </DynamicTab>

          <DynamicTab eventKey="wash-care" title="Wash and Care">
            <p>
              Dignissim enim sit amet venenatis urna. Sollicitudin aliquam
              ultrices sagittis orci a scelerisque purus. Augue neque gravida in
              fermentum et. Vel pretium lectus quam id leo.{" "}
            </p>
            <p>
              Quis commodo odio aenean sed. Turpis massa sed elementum tempus
              egestas. Semper eget duis at tellus. Suscipit tellus mauris a diam
              maecenas sed enim. Nec nam aliquam sem et tortor consequat id. In
              ornare quam viverra orci sagittis.
            </p>
            <p>Fames ac turpis egestas integer eget aliquet.</p>
          </DynamicTab>
        </DynamicTabs>
      </Col>
    </Row>
  );
};

export default ProductDescription;
