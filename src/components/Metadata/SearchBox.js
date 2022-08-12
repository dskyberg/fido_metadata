import { useState } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { resultsState, filterState, optionState } from '../../state'
import { CircularProgress, VStack, RadioGroup, Radio, IconButton, HStack, Box, useColorModeValue, useToast } from '@chakra-ui/react'
import { FaTrash } from 'react-icons/fa';

import IDSearchBox from './IDSearchBox'
import AdvancedSearchBox from './AdvancedSearchBox'


export default function SearchBox() {
    const [mode, setMode] = useState('aaguid')
    const [fetching, setFetching] = useState(false)
    const [filter, setFilter] = useRecoilState(filterState)
    const [options, setOptions] = useRecoilState(optionState)
    const setResults = useSetRecoilState(resultsState)
    const toast = useToast()

    // Set the light and dark mode colors for the navbar
    const bg = useColorModeValue('teal.50', 'teal.500')

    const handleReset = () => {
        setFilter(() => '')
        setOptions(() => '')
        setResults(() => [])
    }

    const mode_filter = () => {
        switch (mode) {
            case 'aaguid':
            case 'aaid': {
                const inner = filter === '' ? '{"$exists":true}' : `{"$regex":"${filter}"}`
                return `{"${mode}": ${inner}}`
            }
            case 'advanced': {
                return filter
            }
            default: {
                console.log('Unrecognized mode:', mode)
            }
        }
    }

    const handleClick = () => {
        let args = {
            filterStr: mode_filter(),
            optionsStr: options
        }
        setResults([])
        setFetching(true)
        invoke('search', args)
            .then((results) => {
                setFetching(false)
                setResults(() => results)
                toast({
                    title: `Found ${results.length} matches`,
                    status: 'success',
                    isClosable: true,
                })
            })
            .catch(err => {
                setFetching(false)
                console.log("Search returned an error:", err)
                toast({
                    title: `Search failed`,
                    status: 'error',
                    description: err,
                    isClosable: true,
                })
            })
    }

    if (fetching) {
        return (
            <Box align="center">
                <CircularProgress isIndeterminate color='green.300' size="md" />
            </Box>
        )
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
                {mode === 'advanced' && <AdvancedSearchBox onClick={handleClick} />}
                {mode !== 'advanced' && <IDSearchBox onClick={handleClick} />}

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