import '../styles/globals.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SessionProvider } from 'next-auth/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#eeecff',
      100: '#cdcaea',
      200: '#aba6d8',
      300: '#8983c8',
      400: '#685fb7',
      500: '#4f469e',
      600: '#3d367b',
      700: '#2b2759',
      800: '#1a1737',
      900: '#090718',
    },
  },
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
  );
}
