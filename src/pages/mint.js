import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  GridItem,
  Heading,
  Image,
  Input,
  Spinner,
  Stack,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Navbar from './components/Navbar';

import { Contract } from '@ethersproject/contracts';
import { useContractFunction, useEthers } from '@usedapp/core';
import { utils } from 'ethers';
import { useNavigate } from 'react-router-dom';
import NFTabi from './NFTabi.json';

const BEARER_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlMzdlZmI4Zi03MzZiLTRlMTktODcxOC1jMGY5YzQ3MjY4OWEiLCJlbWFpbCI6ImRhZ3JhbmRtYXN0ZXIwMUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiNjZhZjBlYmUyMjBlZDkyNzczMGQiLCJzY29wZWRLZXlTZWNyZXQiOiJjNTQ1ZTNjM2RmMmY3OWIzNWUzYTM0OTA1YzkyMDFkY2RhOTRjYzJiZDdkNjUzYmY0ZjA1ZmFhOTg0ZjIwMTFiIiwiaWF0IjoxNjYyMzI5ODkxfQ.GX2PMq2qmkacDd2YQ0cmFtRUiEsX6hh3UCh6enc7wTM';

const MintPage = () => {
  const wethInterface = new utils.Interface(NFTabi);
  const wethContractAddress = '0x54141663E2495Cf8dA7ec447B73A28534ad1fad3';
  const contract = new Contract(wethContractAddress, wethInterface);
  const { state, send } = useContractFunction(contract, 'mint', {
    transactionName: 'Mint',
  });

  const { status } = state;

  const { account } = useEthers();
  const navigate = useNavigate();
  const toast = useToast();
  const toastIdRef = useRef();

  const [imagePreview, setImagePreview] = useState(null);
  const [image, setImage] = useState(null);
  const [values, setValues] = useState({
    title: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);

  const inputHandler = e => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    console.log(status);
    if (status === 'Success') {
      setLoading(false);
      toastIdRef.current = toast({
        position: 'top-right',
        isClosable: true,
        description: 'Congrats, Your Nft has been minted!',
      });

      setTimeout(() => {
        navigate('/profile');
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  /* A callback function that is called when a file is dropped on the dropzone. */
  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.forEach(file => {
      setImage(file);
      const reader = new FileReader();

      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = function (e) {
        setImagePreview(() => e.target.result);
      };

      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const UploadToIpFs = async () => {
    /* This is the function that is called when the user clicks the mint button. It uploads the image
    to IPFS and then uploads the metadata to IPFS. It then calls the mint function on the smart
    contract. */
    try {
      setLoading(true);
      const data = new FormData();
      const ImageMetadata = {
        name: values.title,
      };
      data.append('file', image);
      data.append('pinataOptions', '{"cidVersion": 1}');
      data.append('pinataMetadata', JSON.stringify(ImageMetadata));

      const config = {
        method: 'post',
        url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
        headers: {
          'Content-Type': `multipart/form-data`,
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
        data: data,
      };

      const res = await axios(config);

      const ImgHash = `ipfs://${res.data.IpfsHash}`;

      const resJSON = await axios({
        method: 'post',
        url: 'https://api.pinata.cloud/pinning/pinJsonToIPFS',
        data: {
          pinataMetadata: { name: values.title },
          pinataContent: {
            name: values.title,
            description: values.description,
            image: ImgHash,
          },
        },
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      });

      const tokenURI = `ipfs://${resJSON.data.IpfsHash}`;

      send(account, tokenURI);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />
      <Box maxW="100%" minH={'100vh'}>
        <Container maxW={{ md: '80%', lg: '80%' }} mt={'24'}>
          <Grid
            templateColumns={[
              'repeat(auto-fit, minmax(240px, 1fr))',
              'repeat(2,1fr)',
            ]}
            gap={{ md: 2, base: 8 }}
          >
            <GridItem
              w={'full'}
              colSpan={{ md: 2, base: 4 }}
              order={[2, 2, 1, 1]}
            >
              <Heading as={'h1'} fontSize={32} fontWeight={700}>
                Mint Em's NFT
              </Heading>

              <Box my={6}>
                <Divider mb={6} />
                <Box as={'form'} mt={10}>
                  <Stack spacing={4}>
                    <Input
                      placeholder="Title"
                      bg={'gray.100'}
                      border={0}
                      color={'gray.500'}
                      name="title"
                      onChange={inputHandler}
                      _placeholder={{
                        color: 'gray.500',
                      }}
                    />
                    <Textarea
                      placeholder="Description"
                      bg={'gray.100'}
                      name="description"
                      onChange={inputHandler}
                      border={0}
                      color={'gray.500'}
                      _placeholder={{
                        color: 'gray.500',
                      }}
                    />

                    <Box
                      bg={'gray.100'}
                      color={'gray.500'}
                      p={6}
                      rounded="md"
                      {...getRootProps()}
                    >
                      <input {...getInputProps()} />
                      <p>
                        Drag 'n' drop some files here, or click to select files
                      </p>
                    </Box>
                  </Stack>
                  <Button
                    fontFamily={'heading'}
                    mt={8}
                    w={'full'}
                    bgGradient="linear(to-r, red.400,pink.400)"
                    color={'white'}
                    _hover={{
                      bgGradient: 'linear(to-r, red.400,pink.400)',
                      boxShadow: 'xl',
                    }}
                    onClick={() => {
                      if (!account) {
                        toastIdRef.current = toast({
                          status: 'warning',
                          position: 'top-right',
                          isClosable: true,
                          description:
                            'You have to connect your wallet before submitting!',
                        });
                      } else {
                        UploadToIpFs();
                      }
                    }}
                  >
                    {loading ? <Spinner /> : 'Mint'}
                  </Button>
                </Box>

                <Divider mt={6} />
              </Box>
            </GridItem>
            <GridItem
              colEnd={{ md: 8 }}
              colSpan={{ base: 4, md: 1 }}
              order={{ md: 2, base: 1 }}
            >
              {imagePreview && <Image src={imagePreview} h={400} w={400} />}
            </GridItem>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default MintPage;
