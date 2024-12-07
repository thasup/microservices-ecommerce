import React from 'react';

function Custom404({ statusCode }) {
	return (
		<p
			className="d-flex justify-content-center align-items-center"
			style={{ height: '90vh' }}
		>
			{
				statusCode === 404
					? '404 Page not found X('
					: 'Something went wrong. Please try again. :('
			}
		</p>
	);
}

Custom404.getInitialProps = ({ res, err }) => {
	const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
	return { statusCode };
};

export default Custom404
