import { useRecoilValue } from 'recoil'
import { resultsState } from '../../state'
import { Box, Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel } from '@chakra-ui/react'

function Result(props) {
    let { result } = props

    let title
    if (result.aaguid !== undefined) { title = `AAGUID: ${result.aaguid}` }
    else if (result.aaid !== undefined) { title = `AAID: ${title = result.aaid}` }
    else title = "No AAGUID or AAID"

    const panelText = JSON.stringify(result, null, 4)

    return (
        <Box w={[200, 300, 800]} p={5} shadow='md' borderWidth='1px' >
            <Accordion allowMultiple>
                <AccordionItem>
                    <h2>
                        <AccordionButton>
                            <Box flex='1' textAlign='left'>
                                {title}
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                        {panelText}
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>

        </Box>
    )
}

export default function ResultsBox() {
    const results = useRecoilValue(resultsState);

    return (
        <>
            {
                results.map((result, idx) => (<Result key={`result-${idx}`} result={result} />))
            }
        </>
    )

}
