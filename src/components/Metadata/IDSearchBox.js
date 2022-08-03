import { invoke } from '@tauri-apps/api/tauri'
import { useRecoilState, useSetRecoilState, } from 'recoil'
import { resultsState, filterState } from '../../state'
import { IconButton, useToast } from '@chakra-ui/react'
import { FaSearch } from 'react-icons/fa';

import PreInput from '../PreInput'

export default function IDSearchBox(props) {
    const [filter, setFilter] = useRecoilState(filterState)
    const setResults = useSetRecoilState(resultsState)
    const toast = useToast()
    const { mode } = props

    const handleFilterChange = (value) => {
        setFilter(() => value)
    }

    const handleClick = () => {
        let args = {
            filterStr: `{"${mode}": {"$regex":"${filter}"}}`,
            optionsStr: ''
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
        <>
            <PreInput
                value={filter}
                onChange={handleFilterChange}
                placeholder='Options'
            />
            <IconButton
                colorScheme='blue'
                variant="ghost"
                aria-label='Search database'
                icon={<FaSearch />}
                onClick={handleClick}
            />

        </>
    )
}
