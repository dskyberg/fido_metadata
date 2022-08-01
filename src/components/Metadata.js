import { invoke } from '@tauri-apps/api/tauri'
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil'
import { resultsState, filterState, optionState } from '../state'
import { Button, Input, VStack, HStack, Box } from '@chakra-ui/react'

function SearchBox() {
    const [filter, setFilter] = useRecoilState(filterState)
    const [options, setOptions] = useRecoilState(optionState)
    const setResults = useSetRecoilState(resultsState)

    const handleFilterChange = (event) => {
        setFilter(event.target.value)
    }

    const handleOptionsChange = (event) => {
        setOptions(event.target.value)
    }
    const handleClick = () => {
        let args = {
        }
        if (filter !== '') {
            args.filter = filter
        }
        if (options !== '') {
            args.options = options
        }

        invoke('search', { filter: { "statement.aaguid": { "$exists": true } } })
            .then((results) => {
                setResults(results)
                console.log(results)
            })
            .catch(err => {
                console.log("Search returned an error:", err)
            })
    }

    return (
        <Box w={[200, 300, 800]} p={5} shadow='md' borderWidth='1px' >
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
                <Button variant='outline' mr={3} onClick={handleClick}>
                    Search
                </Button>

            </HStack>
        </Box>

    )
}

function ResultsBox() {
    const results = useRecoilValue(resultsState);

    return (
        <>
            {
                results.map((result) => (
                    <Box w={[200, 300, 800]} p={5} shadow='md' borderWidth='1px' >
                    </Box>
                ))
            }
        </>
    )

}


export default function Metadata() {

    return (
        <VStack spacing={4}>
            <SearchBox />
            <ResultsBox />
        </VStack>
    )
}