import { useRecoilState } from 'recoil'
import { filterState, optionState } from '../../state'
import { IconButton } from '@chakra-ui/react'
import { FaSearch } from 'react-icons/fa';

import PreInput from '../PreInput'
import PreTextarea from '../PreTextarea'

export default function AdvancedSearchBox(props) {
    const { onClick } = props
    const [filter, setFilter] = useRecoilState(filterState)
    const [options, setOptions] = useRecoilState(optionState)

    const handleFilterChange = (value) => {
        setFilter(() => value)
    }

    const handleOptionsChange = (value) => {
        setOptions(() => value)
    }

    const handleClick = () => {
        onClick()
    }


    return (
        <>
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
        </>
    )
}
