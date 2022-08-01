import { useRecoilState } from 'recoil'
import { drawerState } from '../state'
import {
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    Input,
    Button
} from '@chakra-ui/react'

function LeftDrawer() {
    const [isOpen, setIsOpen] = useRecoilState(drawerState)

    const handleClose = () => { setIsOpen(false) }
    return (
        <Drawer
            isOpen={isOpen}
            placement='left'
            onClose={handleClose}
        >
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Create your account</DrawerHeader>

                <DrawerBody>
                    <Input placeholder='Type here...' />
                </DrawerBody>

                <DrawerFooter>
                    <Button variant='outline' mr={3} onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button colorScheme='blue'>Save</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
export default LeftDrawer