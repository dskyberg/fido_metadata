import { invoke } from '@tauri-apps/api/tauri'
import { useRecoilState, useSetRecoilState, } from 'recoil'
import { resultsState, filterState, optionState } from '../../state'
import { IconButton, HStack, Box, useColorModeValue, useToast } from '@chakra-ui/react'
import { FaSearch } from 'react-icons/fa';

import PreInput from '../PreInput'
import PreTextarea from '../PreTextarea'

export default function SearchBox() {
    const [filter, setFilter] = useRecoilState(filterState)
    const [options, setOptions] = useRecoilState(optionState)
    const setResults = useSetRecoilState(resultsState)
    const toast = useToast()

    // Set the light and dark mode colors for the navbar
    const bg = useColorModeValue('teal.50', 'teal.500')

    const handleFilterChange = (value) => {
        setFilter(() => value)
    }

    const handleOptionsChange = (value) => {
        setOptions(() => value)
    }
    const handleClick = () => {
        let args = {
            filterStr: filter,
            optionsStr: options
        }
        invoke('search', args)
            .then((results) => {
                setResults(() => results)
                toast({
                    title: `Found ${results.length} matches`,
                    status: 'success',
                    isClosable: true,
                })
            })
            .catch(err => {
                console.log("Search returned an error:", err)
                toast({
                    title: `Search failed`,
                    status: 'error',
                    description: err,
                    isClosable: true,
                })
            })
    }

    return (
        <Box w={[200, 300, 800]} p={5} shadow='md' borderWidth='1px' backgroundColor={bg}>
            <HStack >
                <PreTextarea
                    value={filter}
                    onChange={handleFilterChange}
                    placeholder='Filter'
                    size="lg"
                    resize="vertical"
                />
                <PreInput
                    value={options}
                    onChange={handleOptionsChange}
                    placeholder='Options'
                />
                <IconButton
                    colorScheme='blue'
                    variant="ghost"
                    aria-label='Search database'
                    icon={<FaSearch />}
                    onClick={handleClick}
                />

            </HStack>
        </Box>

    )
}
