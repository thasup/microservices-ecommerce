import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import {
  FacebookShareButton,
  TwitterShareButton,
  LineShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  LineIcon,
  EmailIcon
} from 'react-share';
import { arrayOf, number, shape, string } from 'prop-types';

import { WEBSITE_URL } from '../../constants/site';

const SocialShare = (props) => {
  const { product } = props;
  const [shareMsg, setShareMsg] = useState('');

  useEffect(() => {
    const message = `I Love this "${
			product.title
		}" product on Aurapan Shop! \n visit this lovely shop here! ${
			window.location.protocol !== 'https' ? 'http' : 'https'
		}://${WEBSITE_URL.replace(/^https?:\/\//, '')}products/${product.id}`;

    setShareMsg(message);
  }, [product]);

  return (
		<Row className="mx-0">
			<Col
				md={3}
				className="ps-0 d-flex flex-row align-items-center justify-content-flex-start"
			>
				<FacebookShareButton
					url={`${WEBSITE_URL}/products/${product.id}`}
					quote={'Be your beautiful best.'}
					className="me-2"
				>
					<FacebookIcon size={32} round={true} />
				</FacebookShareButton>

				<TwitterShareButton
					url={`${shareMsg}`}
					hashtags={['lovely', 'dress', 'aurapan', 'shopping']}
					className="me-2"
				>
					<TwitterIcon size={32} round={true} />
				</TwitterShareButton>

				<LineShareButton
					url={`${WEBSITE_URL}/products/${product.id}`}
					title={'Be your beautiful best.'}
					className="me-2"
				>
					<LineIcon size={32} round={true} />
				</LineShareButton>

				<EmailShareButton url={`${shareMsg}`} className="me-2">
					<EmailIcon size={32} round={true} />
				</EmailShareButton>
			</Col>
		</Row>
  );
};

export default SocialShare;

SocialShare.propTypes = {
  product: shape({
    images: {
      image1: string,
      image2: string,
      image3: string,
      image4: string
    },
    title: string,
    price: number,
    userId: string,
    brand: string,
    category: string,
    material: string,
    description: string,
    reviews: arrayOf(shape({
      title: string,
      rating: number,
      comment: string,
      userId: string,
      updatedAt: string,
      createdAt: string,
      id: string
    })),
    numReviews: number,
    rating: number,
    countInStock: number,
    createdAt: string,
    updatedAt: string,
    version: number,
    colors: string,
    isReserved: false,
    sizes: string,
    id: string
  })
};
