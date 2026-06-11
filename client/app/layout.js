import { Suspense } from 'react';
import Script from 'next/script';
import { Container } from 'react-bootstrap';

import '../styles/app.css';

import { GA_ID } from '../lib/ga';
import { getCurrentUser } from '../lib/api-server';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import Analytics from '../components/common/Analytics';

// Every page depends on the per-request session cookie
export const dynamic = 'force-dynamic';

export const metadata = {
  title: {
    default: "Aurapan | Women's Clothing Online Shop",
    template: '%s | Aurapan'
  },
  description: 'Be your beautiful best.',
  icons: {
    icon: '/asset/favicon.ico'
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1
};

export default async function RootLayout ({ children }) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <body>
        {/* Global site tag (gtag.js) - Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>

        <Header currentUser={currentUser} />
        <main className="pb-5" style={{ marginTop: '74px' }}>
          <Container fluid className="px-0">
            {children}
          </Container>
        </main>
        <Footer />
      </body>
    </html>
  );
}
