import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Container, SSRProvider } from 'react-bootstrap';

import '../styles/app.css';

import * as ga from '../lib/ga';

import buildClient from '../api/build-client';
import Footer from '../components/footer/Footer';
import Header from '../components/header/Header';
import { UserContext } from '../contexts/UserContext';

const MyApp = ({ Component, pageProps }) => {
	const { currentUser } = pageProps;
	const [user, setUser] = useState({});
  const router = useRouter();

	useEffect(() => {
    if (currentUser) {
			setUser(currentUser);
		}
  }, [currentUser]);

  useEffect(() => {
    const handleRouteChange = (url) => {
      ga.pageview(url);
    };
    // When the component is mounted, subscribe to router changes
    // and log those page views
    router.events.on('routeChangeComplete', handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
		<SSRProvider>
			<Head>
				<title>Aurapan | Women&apos;s Clothing Online Shop</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<UserContext.Provider value={user}>
				<Header {...pageProps} />
			</UserContext.Provider>
			<main className="pb-5" style={{ marginTop: '74px' }}>
				<Container fluid className="px-0">
					<Component {...pageProps} />
				</Container>
			</main>
			<Footer />
		</SSRProvider>
  );
};

MyApp.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
	let pageProps = {};
	try {
		const { data: {currentUser} } = await client.get('/api/users/currentuser');
		const [
			{data: products},
			{data: orderProducts},
			{data: paymentProducts},
			{data: users},
			{data: bestseller}
		] = await Promise.all([
			client.get('/api/products'),
			client.get('/api/orders/products'),
			client.get('/api/payments/products'),
			client.get('/api/users'),
			client.get('/api/products/bestseller')
		]);
		console.log('RES >>>>>>>>>>>>>>>>>>>', {products});

		pageProps = {
			currentUser,
			products,
			orderProducts,
			paymentProducts,
			users,
			bestseller
		};

		if (currentUser) {
			const [
				{data: myOrders},
				{data: myReviews},
				{data: orders},
			] = await Promise.all([
				client.get('/api/orders/myorders'),
				client.get('/api/products/myreviews'),
				client.get('/api/orders'),
			]);

			pageProps = {
				myOrders,
				myReviews,
				orders,
				...pageProps
			};
		}
	} catch (e) {
		console.log('>>>>>>>>>>>>>>>>ERROR<<<<<<<<<<<<<<<<<');
	}

  return {
    pageProps
  };
};

export default MyApp;
