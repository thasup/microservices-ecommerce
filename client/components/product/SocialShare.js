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

const SocialShare = ({ product }) => {
  const [shareMsg, setShareMsg] = useState('');

  useEffect(() => {
    const message = `I Love this "${
			product.title
		}" product on Aurapan Shop! \n visit this lovely shop here! ${
			window.location.protocol !== 'https' ? 'http' : 'https'
		}://www.aurapan.com/products/${product.id}`;

    setShareMsg(message);
  }, []);

  return (
		<Row className="mx-0">
			<Col
				md={3}
				className="ps-0 d-flex flex-row align-items-center justify-content-flex-start"
			>
				<FacebookShareButton
					url={`https://www.aurapan.com/products/${product.id}`}
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
					url={`https://www.aurapan.com/products/${product.id}`}
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
