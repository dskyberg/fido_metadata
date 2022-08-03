// Handle stupid prett quotes (8220, 8221)
import { Input } from '@chakra-ui/react'

const replaceQuotes = (value) => {
    let bytes = [];
    for (let i = 0; i < value.length; ++i) {
        let code = value.charCodeAt(i)
        if (code === 8220 || code === 8221) bytes.push(34)
        else bytes.push(code);
    }
    return String.fromCharCode(...bytes);
};

export default function PreInput(props) {
    const { onChange, ...rest } = props
    const handleOnChange = (event) => {
        onChange(replaceQuotes(event.target.value))
    }
    return (
        <Input
            onChange={handleOnChange}
            {...rest}
        />
    )
}