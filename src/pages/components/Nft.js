import { Box, Image, Text, GridItem, HStack, VStack } from '@chakra-ui/react';
import React from 'react';

/**
 * It returns a GridItem component that contains a Box component that contains an Image component and a
 * HStack component that contains a VStack component that contains two HStack components that contain
 * two Text components and a Text component
 * @returns A component that displays a card with an image, title, description, and tokenId.
 */
function Nft({ tokenId, title, description, image }) {
  return (
    <GridItem w="100%" mt={6} alignItems={'center'} align={'center'}>
      <Box position={'relative'} w="240px">
        <Image alt={title} src={image} rounded={'lg'} h="240px" w="240px" />
      </Box>
      <HStack spacing={4} mt={2} align="center" w={'240px'}>
        <VStack spacing={1} alignItems="flex-start" py={3} pb={2}>
          <HStack spacing={1} px={0}>
            <Text fontSize={14}>{title}</Text>
            <Text fontSize={14}>#{tokenId}</Text>
          </HStack>
          <Text fontSize={14} fontWeight="bold">
            {description}
          </Text>
        </VStack>
      </HStack>
    </GridItem>
  );
}

export default Nft;
