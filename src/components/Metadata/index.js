import { VStack } from '@chakra-ui/react'

import SearchBox from './SearchBox'
import ResultsBox from './ResultsBox'


export default function Metadata() {

    console.log('Metadata')
    return (
        <VStack spacing={4}>
            <SearchBox />
            <ResultsBox />
        </VStack>
    )
}