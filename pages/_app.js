import "../styles/globals.css";
import { MantineProvider, NormalizeCSS, GlobalStyles } from "@mantine/core";
import { NotionCredProvider } from "../context/NotionCred";
import { NotificationsProvider } from "@mantine/notifications";
function MyApp({ Component, pageProps }) {
  return (
    <MantineProvider theme={{ colorScheme: "dark" }}>
      <NormalizeCSS />
      <GlobalStyles />
      <NotificationsProvider>
        <NotionCredProvider>
          <Component {...pageProps} />
        </NotionCredProvider>
      </NotificationsProvider>
    </MantineProvider>
  );
}

export default MyApp;
