import "../styles/globals.css";
import { MantineProvider, NormalizeCSS, GlobalStyles } from "@mantine/core";

function MyApp({ Component, pageProps }) {
  return (
    <MantineProvider theme={{ colorScheme: "dark" }}>
      <NormalizeCSS />
      <GlobalStyles />
      <Component {...pageProps} />
    </MantineProvider>
  );
}

export default MyApp;
