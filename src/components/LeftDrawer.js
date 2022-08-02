import { useState } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { drawerState, filterState, optionState, resultsState } from '../state'
import {
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    Button,
    useToast,
    CircularProgress,
    VStack
} from '@chakra-ui/react'

function LeftDrawer() {
    const [isOpen, setIsOpen] = useRecoilState(drawerState)
    const setFilter = useSetRecoilState(filterState)
    const setOptions = useSetRecoilState(optionState)
    const setResults = useSetRecoilState(resultsState)
    const [isFetching, setIsFetching] = useState(false)
    const toast = useToast()

    const handleReset = () => {
        console.log('Clearing the current state')
        setFilter(() => '')
        setOptions(() => '')
        setResults(() => [])
    }

    const handleFetch = () => {
        setIsFetching(true)
        invoke('fetch_metadata')
            .then(() => {
                console.log("Fetch succeeded")
                setIsFetching(false)
                setIsOpen(false)
                toast({
                    title: 'Fetch Succeeded',
                    status: 'success',
                    isClosable: true,
                })
            })
            .catch(err => {
                console.log("Fetch returned an error:", err)
                setIsFetching(false)
                setIsOpen(false)
                toast({
                    title: 'Fetch Error',
                    description: err,
                    status: 'error',
                    isClosable: true,
                })
            })

    }

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
                <DrawerHeader>FIDO</DrawerHeader>

                <DrawerBody>
                    <VStack>
                        {isFetching == false && <Button colorScheme='blue' onClick={handleFetch}>Fetch Metadata</Button>}
                        {isFetching == true && <CircularProgress isIndeterminate color='green.300' />}
                        <Button colorScheme='teal' variant='ghost' onClick={handleReset}>
                            Reset
                        </Button>
                    </VStack>
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