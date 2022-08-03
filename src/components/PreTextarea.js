// Handle stupid prett quotes (8220, 8221)
import { Textarea } from '@chakra-ui/react'

const replaceQuotes = (value) => {
    let bytes = [];
    for (let i = 0; i < value.length; ++i) {
        let code = value.charCodeAt(i)
        if (code === 8220 || code === 8221) bytes.push(34)
        else bytes.push(code);
    }
    return String.fromCharCode(...bytes);
};

export default function PreTextarea(props) {
    const { onChange, ...rest } = props
    const handleOnChange = (event) => {
        onChange(replaceQuotes(event.target.value))
    }
    return (
        <Textarea
            onChange={handleOnChange}
            {...rest}
        />
    )
}