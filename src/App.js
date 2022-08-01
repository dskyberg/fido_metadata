import React from 'react';

import {
  Container,
  Flex,
  useDisclosure,
} from '@chakra-ui/react';

import NavBar from './components/NavBar'
import LeftDrawer from './components/LeftDrawer'
import Metadata from './components/Metadata'

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Flex>
      <NavBar />
      <Container as="main" mt="20">
        <Metadata />
      </Container>
      <LeftDrawer />
    </Flex>
  );
}

export default App;
