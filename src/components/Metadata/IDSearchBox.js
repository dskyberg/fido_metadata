import { useRecoilState } from 'recoil'
import { filterState } from '../../state'
import { IconButton } from '@chakra-ui/react'
import { FaSearch } from 'react-icons/fa';

import PreInput from '../PreInput'

export default function IDSearchBox(props) {
    const [filter, setFilter] = useRecoilState(filterState)
    const { onClick } = props

    const handleFilterChange = (value) => {
        setFilter(() => value)
    }

    const handleClick = () => {
        onClick()
    }


    return (
        <>
            <PreInput
                value={filter}
                onChange={handleFilterChange}
                placeholder="ID Value"
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
