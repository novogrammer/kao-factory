import '../client/styles/globals.scss'
import Head from "next/head";
import DefaultLayout from "../client/layouts/DefaultLayout";
import MainLayout from "../client/layouts/MainLayout";


export default function App({ Component, pageProps }) {
  const Layout = Component.Layout || DefaultLayout;
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainLayout>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </MainLayout>
    </>
  );
}