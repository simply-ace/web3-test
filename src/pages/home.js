import { Box, Button, Container, Heading, useToast } from '@chakra-ui/react';
import { useEthers } from '@usedapp/core';
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';

function HomeScreen() {
  const navigate = useNavigate();
  const { account } = useEthers();
  const toast = useToast();
  const toastIdRef = useRef();

  useEffect(() => {}, []);
  return (
    <>
      <Navbar />
      <Container maxW={{ md: '80%', lg: '80%' }} centerContent mt={'24'}>
        <Heading>Em's NFT</Heading>

        <Box mt={8}>Mint My Nft</Box>

        <Button
          onClick={() => {
            if (!account) {
              return (toastIdRef.current = toast({
                status: 'error',
                position: 'top-right',
                isClosable: true,
                description: 'Please connect your wallet',
              }));
            }
            navigate('/mint');
          }}
        >
          Mint
        </Button>
      </Container>
    </>
  );
}

export default HomeScreen;
