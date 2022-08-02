import { invoke } from '@tauri-apps/api/tauri'
import { useRecoilState, useSetRecoilState, } from 'recoil'
import { resultsState, filterState, optionState } from '../../state'
import { IconButton, Input, HStack, Box, useColorModeValue, useToast } from '@chakra-ui/react'
import { FaSearch } from 'react-icons/fa';
String.prototype.convert8 = function () {
    var bytes = [];
    for (var i = 0; i < this.length; ++i) {
        let code = this.charCodeAt(i)
        if (code == 8220 || code === 8221) bytes.push(34)
        else bytes.push(code);
    }
    console.log("Filter Bytes:", bytes)
    return String.fromCharCode(...bytes);
};

export default function SearchBox() {
    const [filter, setFilter] = useRecoilState(filterState)
    const [options, setOptions] = useRecoilState(optionState)
    const setResults = useSetRecoilState(resultsState)
    const toast = useToast()

    // Set the light and dark mode colors for the navbar
    const bg = useColorModeValue('teal.50', 'teal.500')

    const handleFilterChange = (event) => {
        setFilter(() => event.target.value)
    }

    const handleOptionsChange = (event) => {
        setOptions(() => event.target.value)
    }
    const handleClick = () => {
        let args = {
            filterStr: filter.convert8(),
            optionsStr: options
        }
        console.log("invoking search with", args)
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
                toast({
                    title: `Search failed`,
                    status: 'error',
                    description: err,
                    isClosable: true,
                })
                console.log("Search returned an error:", err)
            })
    }

    return (
        <Box w={[200, 300, 800]} p={5} shadow='md' borderWidth='1px' backgroundColor={bg}>
            <HStack >
                <Input
                    value={filter}
                    onChange={handleFilterChange}
                    placeholder='Filter'
                />
                <Input
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
