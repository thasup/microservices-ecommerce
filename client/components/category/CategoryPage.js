'use client';

import { useEffect, useState } from 'react';
import { Breadcrumb, Col, Row } from 'react-bootstrap';
import Link from 'next/link';

import Product from '../home/Product';
import Loader from '../common/Loader';
import useWindowSize from '../../hooks/useWindowSize';

/**
 * Shared category listing used by /products/{category}[/new|/bestseller]
 * and the global /products/bestseller page.
 *
 * Props:
 * - products: already-fetched list (all products, or the bestseller list)
 * - category: 'Top' | 'Bottom' | 'Dress' | 'Set' | 'Coat' | null (all)
 * - categoryParams: url segment for the category ('tops', 'bottoms', ...)
 * - mode: 'all' | 'new' | 'bestseller'
 */
const CategoryPage = ({
  products,
  category,
  categoryParams,
  mode = 'all',
  currentUser = null
}) => {
  const [loading, setLoading] = useState(true);
  const [onMobile, setOnMobile] = useState(false);

  const { width } = useWindowSize();

  useEffect(() => {
    if (width <= 576) {
      setOnMobile(true);
    } else {
      setOnMobile(false);
    }

    if (products) {
      setLoading(false);
    }
  }, [width, products]);

  let items = category
    ? (products ?? []).filter((product) => product.category === category)
    : products ?? [];

  if (mode === 'new') {
    items = [...items].reverse();
  }

  const categoryLabel = category
    ? `${category}${category === 'Dress' ? 'es' : 's'}`
    : 'BestSeller';

  const header =
    mode === 'new'
      ? `New Arrivals ${categoryLabel}`
      : mode === 'bestseller' && category
        ? `Bestseller ${categoryLabel}`
        : categoryLabel;

  return (
    <>
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
            <h1 className="category-header">{header}</h1>
            <Breadcrumb className="breadcrumb-label">
              <Breadcrumb.Item linkAs={Link} href="/">
                Home
              </Breadcrumb.Item>

              {category
                ? (
                  <Breadcrumb.Item
                    linkAs={Link}
                    href={`/products/${categoryParams}`}
                  >
                    {categoryLabel}
                  </Breadcrumb.Item>
                  )
                : (
                  <Breadcrumb.Item linkAs={Link} href="/products/bestseller">
                    BestSeller
                  </Breadcrumb.Item>
                  )}

              {category && mode === 'new' && (
                <Breadcrumb.Item
                  linkAs={Link}
                  href={`/products/${categoryParams}/new`}
                >
                  New Arrivals
                </Breadcrumb.Item>
              )}

              {category && mode === 'bestseller' && (
                <Breadcrumb.Item
                  linkAs={Link}
                  href={`/products/${categoryParams}/bestseller`}
                >
                  Bestseller
                </Breadcrumb.Item>
              )}
            </Breadcrumb>

            <Row className="mx-0">
              {items.map((item) => (
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

export default CategoryPage;
