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
								<p>To keep your clothing looking fresh and vibrant, follow these general care instructions:</p>
								<ol>
									<li><strong>Machine Wash</strong>: Wash in cold water on a gentle cycle with like colors to prevent fading and bleeding.</li>
									<li><strong>Mild Detergent</strong>: Use a mild detergent to maintain the fabric&apos;s quality and colors.</li>
									<li><strong>Do Not Bleach</strong>: Avoid bleach to protect the integrity of the fabric.</li>
									<li><strong>Tumble Dry Low</strong>: If using a dryer, tumble dry on low heat. For optimal results, air drying is recommended.</li>
									<li><strong>Iron with Care</strong>: If needed, iron on low heat while the item is slightly damp to remove wrinkles. For added protection, place a cloth between the iron and fabric.</li>
									<li><strong>Store Properly</strong>: Hang or fold your clothes in a cool, dry place to maintain shape and quality.</li>
								</ol>
								<p>By following these care guidelines, you can ensure that your clothing remains a staple in your wardrobe for years to come!</p>
							</div>
						</DynamicTabPane>

						<DynamicTabPane
							className="description-panel"
							eventKey="size-chart"
							title="Size Chart"
						>
							<p>Refer to our size chart to find your perfect fit. If you&apos;re between sizes, we recommend sizing up for added comfort.</p>
							<div className="size-chart-container">
								<SizeChart />
							</div>
						</DynamicTabPane>
					</DynamicTabContent>
				</Col>
			</Row>
		</DynamicTabContainer>
  );
};

export default ProductDescription;
