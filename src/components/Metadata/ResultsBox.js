import { useRecoilValue } from 'recoil'
import { resultsState } from '../../state'
import { Tag as ChakraTag, VStack, Image, Text, Box, Flex, Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel } from '@chakra-ui/react'


const Tag = (props) => {
    const { label, ...rest } = props
    if (label === undefined || label === null || label === '') return null
    return <ChakraTag size="sm" borderRadius="full" {...rest}>{label}</ChakraTag>
}

function Result(props) {
    let { result } = props

    let title
    if (result.aaguid !== undefined) { title = `AAGUID: ${result.aaguid}` }
    else if (result.aaid !== undefined) { title = `AAID: ${title = result.aaid}` }
    else title = "No AAGUID or AAID"

    const panelText = JSON.stringify(result, null, 4)
    const icon = result.hasOwnProperty('icon') ? result.icon : null
    const desc = result.hasOwnProperty('description') ? result.description : ''

    return (
        <Box w={[200, 300, 800]} p={5} shadow='md' borderWidth='1px' >
            <Accordion allowMultiple>
                <AccordionItem>
                    <h2>
                        <AccordionButton>

                            <Flex direction="row" align='center' grow={1} justify="start" gap={10}>
                                {icon !== null && <Image boxSize='50px' objectFit="contain" src={icon} />}
                                <Box align="left">
                                    <Text>{desc}</Text>
                                    <Text>{title}</Text>
                                    <Box align="right">
                                        {result.attachmentHint !== undefined && result.attachmentHint.map(hint => <Tag key={hint} label={hint} />)}
                                        <Tag label={result.protocolFamily} colorScheme='teal' />
                                    </Box>
                                </Box>
                            </Flex>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                        <pre>
                            {panelText}
                        </pre>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>

        </Box>
    )
}

export default function ResultsBox() {
    const results = useRecoilValue(resultsState);

    return (
        <VStack spacing={4}>
            {
                results.map((result, idx) => (<Result key={`result-${idx}`} result={result} />))
            }
        </VStack>
    )

}
