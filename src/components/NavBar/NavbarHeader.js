import { Heading } from '@chakra-ui/react'

export default function NavbarHeader(props) {
    const { children, ...rest } = props

    return (
        <Heading {...rest}>{children}</Heading>
    )
}