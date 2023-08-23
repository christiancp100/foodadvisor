import App from 'next/app';
import ErrorPage from 'next/error';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import 'tailwindcss/tailwind.css';
import { getStrapiURL } from '../utils';

import { getLocalizedParams } from '../utils/localize';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  const { global } = pageProps;
  if (global === null) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-right" />
        <Component {...pageProps} />
      </QueryClientProvider>
    </>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const { locale } = getLocalizedParams(appContext.ctx.query);

  const appProps = await App.getInitialProps(appContext);

  if (appContext.res) {
    appContext.res.setHeader('Cache-Control', 'no-store');
  }

  try {
    const res = await fetch(
      getStrapiURL(
        `/global?populate[navigation][populate]=*&populate[footer][populate][footerColumns][populate]=*&locale=${locale}`
      )
    );
    const globalData = await res.json();
    const globalDataAttributes = globalData.data.attributes;

    return { ...appProps, pageProps: { global: globalDataAttributes } };
  } catch (error) {
    return { ...appProps };
  }
};

export default MyApp;
