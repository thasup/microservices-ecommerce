import React from 'react';
import dynamic from 'next/dynamic';
import { Col, Nav, Row } from 'react-bootstrap';

import SizeChart from './SizeChart';

const DynamicTabContainer = dynamic(
  () => import('react-bootstrap/TabContainer'),
  {
    ssr: false
  }
);
const DynamicTabContent = dynamic(() => import('react-bootstrap/TabContent'), {
  ssr: false
});
const DynamicTabPane = dynamic(() => import('react-bootstrap/TabPane'), {
  ssr: false
});

const ProductDescription = ({ product }) => {
  return (
		<DynamicTabContainer
			id="product-desciption-box"
			defaultActiveKey="description"
			className="mb-3"
		>
			<Row>
				<Col>
					<Nav justify variant="pills" className="description-tabs">
						<Nav.Item>
							<Nav.Link eventKey="description" as="div">
								Description
							</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link eventKey="size-chart" as="div">
								Size Chart
							</Nav.Link>
						</Nav.Item>
					</Nav>
				</Col>
			</Row>

			<Row className="mt-5">
				<Col>
					<DynamicTabContent>
						<DynamicTabPane
							className="description-panel"
							eventKey="description"
							title="Description"
						>
							<div className="description-section">
								<h6>Material:</h6>
								<p>{product.material}</p>
							</div>
							<div className="description-section">
								<h6>Description:</h6>
								<p>{product.description}</p>
							</div>

							<div className="description-section">
								<h6>Wash and Care:</h6>
								<p>
									Dignissim enim sit amet venenatis urna. Sollicitudin aliquam
									ultrices sagittis orci a scelerisque purus. Augue neque
									gravida in fermentum et. Vel pretium lectus quam id leo.{' '}
								</p>
								<p>
									Quis commodo odio aenean sed. Turpis massa sed elementum
									tempus egestas. Semper eget duis at tellus. Suscipit tellus
									mauris a diam maecenas sed enim. Nec nam aliquam sem et tortor
									consequat id. In ornare quam viverra orci sagittis.
								</p>
								<p>Fames ac turpis egestas integer eget aliquet.</p>
							</div>
						</DynamicTabPane>

						<DynamicTabPane
							className="description-panel"
							eventKey="size-chart"
							title="Size Chart"
						>
							<SizeChart />
						</DynamicTabPane>
					</DynamicTabContent>
				</Col>
			</Row>
		</DynamicTabContainer>
  );
};

export default ProductDescription;
