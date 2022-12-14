import { VStack } from '@chakra-ui/react'

import SearchBox from './SearchBox'
import ResultsBox from './ResultsBox'


export default function Metadata() {

    return (
        <VStack spacing={4} mb={20}>
            <SearchBox />
            <ResultsBox />
        </VStack>
    )
}