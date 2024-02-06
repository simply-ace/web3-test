import { CloseIcon, HamburgerIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Collapse,
  Flex,
  IconButton,
  Link,
  Stack,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { useEthers } from '@usedapp/core';

export default function Navbar() {
  const { activateBrowserWallet, account, deactivate } = useEthers();
  const { isOpen, onToggle } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();

  /* Truncating the address to make it more readable. */
  const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;

  /**
   * It takes an Ethereum address as a string and returns a truncated version of it
   * @returns The first and last 4 characters of the address.
   */
  const truncateEthAddress = address => {
    const match = address.match(truncateRegex);
    if (!match) return address;
    return `${match[1]}…${match[2]}`;
  };

  return (
    <Box bg={useColorModeValue('white', 'black')}>
      <Flex
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        w={{ md: '90%' }}
        py={{ base: 2, md: '6' }}
        px={{ base: 4 }}
        mx={{ base: 0, md: 'auto' }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}
      >
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Link href="/">Em's NFT</Link>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <Stack direction={'row'} spacing={4}>
              <Link href="/profile">My Nfts</Link>
              <Link href="/mint">Mint Nft</Link>
            </Stack>
          </Flex>
        </Flex>

        <Stack justify={'flex-end'} direction={'row'} spacing={6}>
          <Stack justify={'flex-end'} direction={'row'}>
            <Button
              // outline={'none'}
              border={1}
              _active={{
                border: 0,
                bg: 'none',
              }}
              _focus={{
                border: 0,
                bg: 'none',
              }}
              _hover={{
                bg: 'none',
                border: 0,
              }}
              borderColor="goldenrod"
              onClick={toggleColorMode}
            >
              {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            </Button>
          </Stack>
          <Box ml={4}>
            {account ? (
              <>
                <Button
                  bgColor="red.500"
                  _hover={{ bgColor: 'red.300' }}
                  onClick={() => deactivate()}
                >
                  Disconnect
                </Button>
                {account && <p>Account: {truncateEthAddress(account)}</p>}
              </>
            ) : (
              <Button
                bgColor="green.500"
                _hover={{ bgColor: 'green.300' }}
                onClick={() => activateBrowserWallet()}
              >
                Connect Wallet
              </Button>
            )}
          </Box>
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue('white', 'black')}
      p={4}
      display={{ md: 'none' }}
    >
      <MobileNavItem />
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Link href="/profile">My Nfts</Link>
      <Link href="/mint">Mint Nft</Link>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}
        >
          {children &&
            children.map(child => (
              <Link key={child.label} py={2} href={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};
