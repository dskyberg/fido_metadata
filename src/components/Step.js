import { Box, Heading, Text } from '@chakra-ui/react'

export default function Step(props) {
    const { title, desc, ...rest } = props
    return (
        <Box w={[200, 300, 500]} p={5} shadow='md' borderWidth='1px' {...rest}>
            <Heading fontSize='xl'>{title}</Heading>
            <Text mt={4}>{desc}</Text>
        </Box>
    )
}