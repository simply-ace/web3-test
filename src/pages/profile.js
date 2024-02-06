/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Container,
  Divider,
  Grid,
  Heading,
  Spinner,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';
import { useQuery } from 'react-query';

import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';

import { useEtherBalance, useEthers } from '@usedapp/core';
import { ethers } from 'ethers';
import Nft from './components/Nft';

const ProfilePage = () => {
  /* Getting the account and balance of the user. */
  const { account } = useEthers();

  /* Getting the balance of the user and setting it to the state. */
  let etherBalance = useEtherBalance(account);
  const [balance, setBalance] = useState();

  /* Checking if the etherBalance is not undefined and if it is not undefined it is setting the balance
 to the state. */
  useEffect(() => {
    if (etherBalance !== undefined) {
      const b = ethers.utils.formatEther(etherBalance);
      setBalance(b);
    }
  }, [etherBalance]);

  /* A query to the Graph. */
  const endpoint = 'https://api.thegraph.com/subgraphs/name/saksijas/blitztask';
  const FILMS_QUERY = `
  {
  tokens {
    id
    tokenId
    uri
    owner
    creator
  }
}
`;

  const [nfts, setNfts] = useState([]);
  const [isNftLoading, setNftLoading] = useState(true);
  const { data, isLoading } = useQuery('launches', () => {
    return axios({
      url: endpoint,
      method: 'POST',
      data: {
        query: FILMS_QUERY,
      },
    }).then(response => response.data.data);
  });

  useEffect(() => {
    /**
     * It takes the data from the OpenSea API and fetches the data from the IPFS hash
     */
    async function fetchNfts() {
      const promises = [];

      /* Checking if the owner of the token is the same as the account of the user. If it is the same it is
fetching the data from the IPFS hash. */

      for (const element of data?.tokens) {
        if (element?.owner === account?.toLowerCase()) {
          const uri = element?.uri.includes('ipfs://')
            ? element.uri.split('//')[1]
            : element.uri;

          const result = axios.get(
            `https://opensea.mypinata.cloud/ipfs/${uri}`
          );

          promises.push(result);

          const results = await Promise.all(promises);

          const actualDatas = results.map(result => result.data);
          setNfts(actualDatas);
          setNftLoading(false);
        }
      }
    }

    if (account !== undefined) {
      fetchNfts();
    }
    setNftLoading(false);
  }, [account]);

  return (
    <>
      <Navbar />
      <Box maxW="100%" minH={'100vh'}>
        <Container maxW={{ md: '80%', lg: '80%' }} mt={'24'}>
          <Heading as={'h1'} fontSize={32} fontWeight={700}>
            My Profile
          </Heading>
          <Divider mb={6} />
          <Text>Address: {account}</Text>
          <Text>
            Balance: {Number(balance).toFixed(6)}
            Eth
          </Text>

          <Box my={6}>
            <Grid
              templateColumns={{
                md: 'repeat(auto-fit, minmax(260px, 1fr))',
                base: 'repeat(1, 1fr)',
              }}
              gap={2}
              mt={16}
            >
              {nfts?.length > 0 &&
                nfts.map((nft, i) => {
                  const uri = nft?.image.split('//')[1];

                  return (
                    <Nft
                      image={`https://opensea.mypinata.cloud/ipfs/${uri}`}
                      key={i}
                      tokenId={nft?.id}
                      title={nft?.name}
                    />
                  );
                })}
              {(isLoading || isNftLoading) && <Spinner />}
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ProfilePage;
