import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomeScreen from './pages/home';
import MintPage from './pages/mint';
import ProfilePage from './pages/profile';

import { DAppProvider, Mainnet, Rinkeby } from '@usedapp/core';
import { getDefaultProvider } from 'ethers';
import { QueryClient, QueryClientProvider } from 'react-query';

function App() {
  const config = {
    readOnlyChainId: Mainnet.chainId,
    readOnlyUrls: {
      [Mainnet.chainId]: getDefaultProvider('mainnet'),
      [Rinkeby.chainId]: getDefaultProvider('rinkeby'),
    },
  };

  const theme = extendTheme({
    config: { initialColorMode: 'dark', useSystemColorMode: false },
  });

  const client = new QueryClient();
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />

      <DAppProvider config={config}>
        <QueryClientProvider client={client}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/mint" element={<MintPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </DAppProvider>
    </ChakraProvider>
  );
}

export default App;
