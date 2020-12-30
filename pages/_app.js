import '../client/styles/globals.css'
import Head from "next/head";
import DefaultLayout from "../client/layouts/DefaultLayout";


export default function App({ Component, pageProps }) {
  const Layout = Component.Layout || DefaultLayout;
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}