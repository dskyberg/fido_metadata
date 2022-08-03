import { useState } from 'react'
import { useSetRecoilState, } from 'recoil'
import { resultsState, filterState, optionState } from '../../state'
import { VStack, RadioGroup, Radio, IconButton, HStack, Box, useColorModeValue } from '@chakra-ui/react'
import { FaTrash } from 'react-icons/fa';

import IDSearchBox from './IDSearchBox'
import AdvancedSearchBox from './AdvancedSearchBox'

export default function SearchBox() {
    const [mode, setMode] = useState('aaguid')
    const setFilter = useSetRecoilState(filterState)
    const setOptions = useSetRecoilState(optionState)
    const setResults = useSetRecoilState(resultsState)

    // Set the light and dark mode colors for the navbar
    const bg = useColorModeValue('teal.50', 'teal.500')

    const handleReset = () => {
        setFilter(() => '')
        setOptions(() => '')
        setResults(() => [])
    }

    return (
        <Box w={[200, 300, 800]} p={5} shadow='md' borderWidth='1px' backgroundColor={bg}>
            <HStack flex={1}>
                <VStack w={75} mr={4}>
                    <RadioGroup value={mode} onChange={setMode}>
                        <Radio size="sm" value="aaguid">AAGUID</Radio>
                        <Radio size="sm" value="aaid">AAID</Radio>
                        <Radio size="sm" value="advanced">Advanced</Radio>
                    </RadioGroup>
                </VStack>
                {mode === 'advanced' && <AdvancedSearchBox />}
                {mode !== 'advanced' && <IDSearchBox mode={mode} />}

                <IconButton
                    colorScheme='blue'
                    variant="ghost"
                    aria-label='reset search'
                    icon={<FaTrash onClick={handleReset} />}

                />

            </HStack>
        </Box>

    )
}
