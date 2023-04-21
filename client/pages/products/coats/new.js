import React, { useEffect, useState } from 'react';
import { Breadcrumb, Col, Row } from 'react-bootstrap';
import Head from 'next/head';
import Link from 'next/link';

import Product from '../../../components/home/Product';
import Loader from '../../../components/common/Loader';
import useWindowSize from '../../../hooks/useWindowSize';

const CoatsNewArrivals = ({ products, currentUser }) => {
  const [loading, setLoading] = useState(true);
  const [onMobile, setOnMobile] = useState(false);

  const { width } = useWindowSize();

  const coatsNewArrivals = products
    ?.filter((coat) => coat.category === 'Coat')
    .reverse();

  useEffect(() => {
    if (width <= 576) {
      setOnMobile(true);
    } else {
      setOnMobile(false);
    }

    if (products && coatsNewArrivals) {
      setLoading(false);
    }
  }, [width, products]);

  return (
		<>
			<Head>
				<title>New Arrivals Coats | Aurapan</title>
			</Head>
			{loading
			  ? (
				<div
					className="d-flex justify-content-center align-items-center px-0"
					style={{ marginTop: '80px' }}
				>
					<Loader />
				</div>
			    )
			  : (
				<>
					<h1 className="category-header">New Arrivals Coats</h1>
					<Breadcrumb className="breadcrumb-label">
						<Link href="/" passHref>
							<Breadcrumb.Item>Home</Breadcrumb.Item>
						</Link>

						<Link href="/products/coats" passHref>
							<Breadcrumb.Item>Coats</Breadcrumb.Item>
						</Link>

						<Link href="/products/coats/new" passHref>
							<Breadcrumb.Item>New Arrivals</Breadcrumb.Item>
						</Link>
					</Breadcrumb>

					<Row className="mx-0">
						{coatsNewArrivals.map((item) => (
							<Col key={item.id} xs={6} md={4} xl={3} className="p-0">
								<Product
									onMobile={onMobile}
									product={item}
									currentUser={currentUser}
								/>
							</Col>
						))}
					</Row>
				</>
			    )}
		</>
  );
};

export default CoatsNewArrivals;
