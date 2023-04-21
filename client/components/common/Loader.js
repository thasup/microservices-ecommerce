import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loader = () => {
  return (
		<div className="my-5">
			<Spinner
				animation="border"
				role="status"
				variant="dark"
				style={{
				  width: '75px',
				  height: '75px',
				  margin: 'auto',
				  display: 'block'
				}}
			>
				<span className="visually-hidden sr-only">Loading...</span>
			</Spinner>
		</div>
  );
};

export default Loader;
