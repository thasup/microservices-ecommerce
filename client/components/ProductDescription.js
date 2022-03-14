import React from "react";
import dynamic from "next/dynamic";
import { Col, Nav, Row } from "react-bootstrap";

const DynamicTabContainer = dynamic(
  () => import("react-bootstrap/TabContainer"),
  {
    ssr: false,
  }
);

const DynamicTabContent = dynamic(() => import("react-bootstrap/TabContent"), {
  ssr: false,
});

const DynamicTabPane = dynamic(() => import("react-bootstrap/TabPane"), {
  ssr: false,
});

const DynamicTab = dynamic(() => import("react-bootstrap/Tab"), {
  ssr: false,
});

const DynamicTabs = dynamic(() => import("react-bootstrap/Tabs"), {
  ssr: false,
});

const ProductDescription = ({ product }) => {
  return (
    // <DynamicTabContainer
    //   variant="light"
    //   defaultActiveKey="product-list"
    //   className="mb-3"
    //   forceRenderTabPanel={true}
    // >
    //   <Row>
    //     <Col>
    //       <Nav justify variant="tabs" defaultActiveKey="decription">
    //         <Nav.Item>
    //           <Nav.Link eventkey="decription">Decription</Nav.Link>
    //         </Nav.Item>
    //         <Nav.Item>
    //           <Nav.Link eventkey="material">Material</Nav.Link>
    //         </Nav.Item>
    //         <Nav.Item>
    //           <Nav.Link eventkey="size-chart">Size Chart</Nav.Link>
    //         </Nav.Item>
    //         <Nav.Item>
    //           <Nav.Link eventkey="wash-care">Wash and care</Nav.Link>
    //         </Nav.Item>
    //       </Nav>
    //     </Col>
    //   </Row>

    <Row>
      <Col>
        <DynamicTabs
          defaultActiveKey="decription"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <DynamicTab eventKey="decription" title="Decription">
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
    // </DynamicTabContainer>
  );
};

export default ProductDescription;
