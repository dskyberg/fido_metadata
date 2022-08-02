import { Flex, Spacer, useColorModeValue } from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { useSetRecoilState } from 'recoil'
import { drawerState } from '../../state'

import DrawerButton from './DrawerButton'
import NavbarHeader from './NavbarHeader'

function NavBar() {
    // The Navbar just needs to set the drawerState.  Not consume the state.
    const setIsOpen = useSetRecoilState(drawerState)

    const handleDrawerClick = () => { setIsOpen(true) }

    // Set the light and dark mode colors for the navbar
    const bg = useColorModeValue('teal.100', 'teal.700')

    return (
        <Flex
            as="header"
            position="fixed"
            w="100%"
            h="50px"
            alignItems="center"
            backgroundColor={bg}
        >
            <DrawerButton onClick={handleDrawerClick} />
            <Spacer />
            <NavbarHeader>FIDO Metadata</NavbarHeader>
            <Spacer />
            <ColorModeSwitcher />
        </Flex>
    )
}
export default NavBar;