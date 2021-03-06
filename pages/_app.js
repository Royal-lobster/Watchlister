import "../styles/globals.css";
import { MantineProvider, NormalizeCSS, GlobalStyles } from "@mantine/core";
import { NotionCredProvider } from "../context/NotionCred";
import { NotificationsProvider } from "@mantine/notifications";
import Head from "next/head";
import Footer from "../components/Footer";
import { SettingsProvider } from "../context/Settings";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Watchlister</title>
        <meta
          name="description"
          content="Manage your Notion Watchlist with ease ! This app automatically fills Movie/TV/Anime details to you watchlist so you don't have to do it manually."
        />
        <meta name="theme-color" content="#222222" />
        <meta name="color-scheme" content="dark" />
        <link rel="icon" href="/favicon.svg" sizes="any" type="image/svg+xml" />

        {/* <!-- Facebook Meta Tags --> */}
        <meta property="og:url" content="https://www.watchlister.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Watchlister" />
        <meta
          property="og:description"
          content="Manage your Notion Watchlist with ease ! This app automatically fills Movie/TV/Anime details to you watchlist so you don't have to do it manually."
        />
        <meta property="og:image" content="https://i.imgur.com/GTVtpAe.png" />

        {/* <!-- Twitter Meta Tags --> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="" />
        <meta
          property="twitter:url"
          content="https://www.watchlister.vercel.app/"
        />
        <meta name="twitter:title" content="Watchlister" />
        <meta
          name="twitter:description"
          content="Manage your Notion Watchlist with ease ! This app automatically fills Movie/TV/Anime details to you watchlist so you don't have to do it manually."
        />
        <meta name="twitter:image" content="https://i.imgur.com/GTVtpAe.png" />
      </Head>
      <MantineProvider theme={{ colorScheme: "dark" }}>
        <NormalizeCSS />
        <GlobalStyles />
        <NotificationsProvider>
          <SettingsProvider>
            <NotionCredProvider>
              <div id="page-container">
                <div id="content-wrap">
                  <Component {...pageProps} />
                </div>
                <Footer />
              </div>
            </NotionCredProvider>
          </SettingsProvider>
        </NotificationsProvider>
      </MantineProvider>

      <style jsx global>{`
        #page-container {
          position: relative;
          min-height: 100vh;
        }
        #content-wrap {
          padding-bottom: 50px; /* Footer height */
        }
      `}</style>
    </>
  );
}

export default MyApp;
