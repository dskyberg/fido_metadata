import { useRecoilValue } from 'recoil'
import { resultsState } from '../../state'
import { VStack, Image, Text, Box, Flex, Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel } from '@chakra-ui/react'

// data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAASVUlEQVR42u2bB1hU59LHMWoSr7l+Vvacs41mTdSrRoNYACkLiooFSxQ7gYiiiKJGDdgVLHREll2aqIBijeKNXfFaYmKNHSm7Cxpj9PtijIW5855zFpZlF1dFY/x4n2eepSy75/x2/jPzzryYmdWu2lW7alftql21q3a9w2uDWlpfft27UeyF+KarTh5utvTI1cahBwr/Z17uzUZzc082WrB/Y8OlebPM1t+wM1Pmf/z/AwpAHTNlUfsGyTfTWsSf+1W06hhYLNoH1nO3g8WMLBBOTgdqQhIwo+JBPDQSxIPWAu0V86SJX+alBktPzDZLvWH+/sLJhLr101RTmqXdfCBKOg+S6JMgDTsMlotyjQKS9g8HietSENuHgNB+ITQZm1pQN+rnkWah8MF75zn10ovnCrKLnoszroH4FQCJbeeCqNNMaOG47NlHoccjzTIvffj+AFIWdm22reShZHsRvC4gpt00MP/i2+cfrji78L3xpI82amIkuXdBH5B49THoFHUc+sYfhwGxh6FPWC60DsoCxjuhWkCM1WRo0i/6DzP5rW7vBaB/ZGmOWv77l3JArdKvQPDB23DsuhoKVCVQrC4BlZp7vF2sgUOXCmDehjzo4qsEiWyZQUC0ZDLUX3Ja8V4AaphV8r0WUPutBfDvaxrQaEpeaD/dKIaJsftB7LSoCiCG9oEG03afZzPj332552p2ivfehRZbVKA8ZxocrRHPGhV7CEQ95lcB9PG07y787QGVlJSMPHWr5HmrnRr4ZLMKzheUvBQgYoevqcFyRFxliVlOgforzyb+reEUFRU1wBs8SW4y7kcN/HNjMWy6WO5BZWiP0X5H+z+0P9CeGwJ0EaG2nJalA8gfGg9O+N0ssaDLu3O3XRLqM64KMeWm7NpCpnQTyJRfmrsofAWypOnmsqQggasikHJJ8sevxwhckgaYuyT3mBp2wP7mbRW5eVCjRf+gBoddhXDylmaHWl06RKVStS4uLm6GIJuWlpZaq9V33DSa0jB8/nVdQKnn1UCPSKhI826roaXyyoK/TF4C19SGlCz5U8pVMVbgIo+mnNYdpRxjNFSvNQ+p7iv+pLsuLqM7hwDd6Vs08hj6jOqy+CHVdfldyjZcQ9mtVVO9olVMn/jStoNSynpNzILxIXthhSLvT+fVx6ME0T/lmq+/YGeWmVnX0PvfvXv3n2p1SaBKU/rr7isasF5ykI1BjO08aOW/CWJO3IYijWbW2yx16zD9E/7BeoZzUgLlnHCJtl/7mLFbCsKu80HYKRiEHWaAsP0MYDp985Tutlgt6B62le4ZMZ92jB5CuyR93twppRXxsBZ9lZS5U6KgWZ8UofOUbe1zj12+kbnnHCyXH/9d6paUYe6UcIXqq3zA+O94JF64f4dkyX7vJiuOSSxCD37MVsfElPmNzZILXTttvH5COHsXMIMioeX0bAjIuQinb3ESxdi25M1zCQ39gJEpOpvLlDGU8zo147AaP6mFIP5iLoi7zgZxl2AQdZkFwm4hZXSPsIuUU/wiAsPMIbSeqW+Bkgnhb+iY9sNoIZPbCBwTAsxd5UfooelPRN4bgfbbernJ/H0xDcJPp9Zdd21f3XVX9zRcfCTZK/Ny7pZLGshXVYpLZSjR0W+My6demR+auyS5ClzlubRz7COhw3IQ9/oWxOjGYrt5bM1BIAl7LH6CHnKIcl3vTmT3Ku91586dTxDOj3hTlwGgvv51NMcPSNBnfYbAPu6BeR/0LjflZKZ/RnNtfEEQg/SDNr5eMYlbbwQO7ZrcBQPqbsY19qnIaQWIHRdylWpvBNRrAQtJ1DMU6D4x+ZSL3IvcBN5YHbQP0OrixTXEwCpSq9VtMLB2RACd8Gfti4ru2OD3guvXr39Engc6ARSfY4Oe9APe7ChjEhc4J9oKekQcoz5fWUb1SbiKXu1NPBVj0Xw9QI/x/UbUOBiRTN4UwayhZQlPxDJujyNxXgwSUqX2QUgOoSwkoWPY89aDUnJ3Hbgo02g049FW40XtRruE9hufnqurW56hlaCdRtuEfx+KYDwRnh1+nYo2Vt+TdDMlZR+3kG634DHVeTlYeiSf3J939Red1773RuAInJW2KKcfhe7RIOm7EqTuy9k9DgvJZQlCWoyQFoHQeQ0Ehu8vyy9Q3cOL+dMIgIf4qV7DC81Br1iJNzwFzYtL0RpH/LkTmgf+bgx+Pxu/XoePR8nf8On7Idp+Ih3icfqwcnPPNfQIyFkk7YhebDkTbNwSIDrj1POCQtVm4rU1np0oF6UXJZP/JvbgdsdSjzCQspBWgNStApLIZTV4z/8OCovUBqEQbyCBEeXS8swZIx5QzcrPv98YgXRHUPPwtU7xnngHLQ9/FoFAY/BxG4lX+HhnXtSh23TL2c8ZgR9Qtquf4X3EWzgoP65ROKSIo9zkT8SekSDxXAPSgatAOoCH1E8LCQO0bCV0HpUBl68VVsoUXHDVTL53716jmu2fQR0St/C14xHMr/heBfj93KKiX4T4u3rk9w6hB+sJHOJ3Mow/MM0nAfWvpYAhYmdT9/RGNQIHK1o/yl3+WDQkmu2tSAavBckghOS5moNU7k0rgJHFwuqU/+jCKcQLnkAKtjfbaIQ6pILmYhO71VARWWozlMBdaUt1WvYn03RCOSRzV0VWC4fYT14v5sgUzgK3pEdCL9zgDUdAXpFcE3xIRAUk4k2kIdUvHKwHpsAPF/J5OKVZxcX3RG+3Iwsf4AfSnwPEfkA/k++7e2U2wOx2hsBhITVDSF3Dy9CTIl/5zRjnVAkCyqe9EoD5Mg6EI2IRUgyIh0VVQEJv0kISe0QA2QrcLlA9Re0vJS7+F+78LRHOOW02xOuRdxiRsZ2WTOcAETP3BdzGPEVIw18t7rgoFJSnHGjvBKBHxXOQRnKQRMN4b+IhEW8SeUSB89dbywqLS9b8lXB0ayY+47EeHbjqwBPaJrgCEBptMQNwQ3wLi9eXGwORbYPAXfGY8kZAYxM5SKPXsU1wZiTxJi0k3psGR4BoQDRYDUwt8F/2fbN3pXGAccge4TwhgCaG5gJtjbv4ZhWAmGYTUWphQLkmhb7UvgoDWDI1VMFOBqjxPKQx6ysglUtOF1IUyQ6/M25Jrd+dKRF8QAL3rdsqsBufCYwIM5k5xqHmE8tBEdkJnOWFjENCc9O8p39Cc7zRO/S4ZKAnKcshUVpIBiUXxUqOdk/E7KAMecc6kU5b9l14wvSOAob5ChjKh4PUgoeEXiToGVVG6jyTXpC0KigPJTBfpQL9FQ9pooKDNA4hjV1fSXIEEis59CahZxzxojvm7snW7wqg2MxTlN24zffpdnOAEX7FQaIRkoCH1HwCUO0XkutOMukFcXe+gB6SDMKv04HxS0VQKUD7JCMk3pvG6XgTQqL1JEd7rMfApzhYQ4XY6y2vzLpk30jZhpUxFl8DI/FDmfnqQZoEtM0sBJR0zqTXpJAkMzIVRP4Z7ISS8UsDxpeDxElOUTku6UlOOCwGqL6JGPiU2Y0dlI3/ytYu+bCpXpHPmFYB3ARDC0nsy3kTgYSSo6UBxIMemNQc7+2TfU44Og3EUzeCaAqBtAG9iUAyIrkxOpLTQhoeC1S/RHxT5UnKXdHubbMhARffO53qtfY50xZrn1ZTgLHx5yBZIiQpD0nrTdKpxIPKTAlofcaH7H0qHJ0O0mmbQRywiYPkv8GA5BQGJaeb5eiBCYD7uHuUiyKYtEneNBiyCaVkScMwK12jbZeC8LNAYNpOA6bNVISEZoOgrBGUpY43EUiW04gH/WFK3RA+J/Iw3lwaWARmgXT6ZpAQSMSbCCSDkqsmyyEk4dA4oPslkrL+GlqA0CmlGSlEa7RH1T2zAe4Zh2DRd5y2j3gm7DKP630jIOGn03lIARykljwkreTQm+g2wQTQTRMAleQpc84C45kClkHZYDmDQMoECetNFZJjeMkxPi+QnDbLYSkgHIoe5ZEAlFvSA3TnjaTEp9yUFq8KC6XbwtxZIcOEEC1wXl9MO6wF0RcL2N43GeuI/hXEDwg4SEIyB2uLkFrzkFjJ+bOQ6E5sFttqCqC7Z3GzKe2fAlaBW8Bq5haElI3epIXESU6kLzktJFZyiUYkx5UCoqGkHEBY/RLKKDf5bwjrPCaGFLzAuQRacxeFPXpDRzLdICZwlX+Ghasd1leebNvFRRlPucrzKOd1v9B9Ip8Jey8DUfcF3ICg22wQf84NCESdeUgdgzhInxFI0zlI5ZLzZ72J6hkBZBZnCqBnRcUaGBi4A6QTN4FNcA4HCb3JYoYxyaVWSG6ioqrkdCGN5Kvv8g0vmmckblOiQOiBXtY3Fhh3fK4blg+ydWW0LL6Mdo0DxjUGGJcotlMpcloJIsclIO4dUnlA0P0bHtKciklKZ96bOgYZlhzxprZBWEkn3icTElMAPSX7lg27zuGnnArWs3JYSNaztoKVvuSqy3ITXpDlRlRU31V7TFz7RNpP27E03NZle9/2PKSe3JCAhcROUnhIWm+qRnKU7XJo67Vhp4mbO66PQrzI1T8HJJMywWbO9gpIrOSyWMlJdeOSVnK+2ixXWXJVN7wV1bd2Lycx0GPSbetKdNq6ZEjAQjIwSeHGTd8YlZyo44xyyTEdgsESdw0bd5+LNBXQfm17YM/hn8FycBpYztwG1gTS7G1go4UUlF0OyWCW05YCk5QvLAXYuGSkx1S1rYuQZBWQ2EmKY8UkpRKkKpKbVS45Ni51CAK6dwTMjzkCxcVqP1Onl9/qNtlXKPKAGZoOVnN2gPXcHRwkQ5JDSBWSSy/PcvrVN4FEvWDDq9tjqtTW7ce1dQ1LbqERyfHDy246kuMh0XYroG/ANigoVD/D+u8zU/snXfmeLguITCZ8Fu0D0aiNYDV3J1h/s6Oy5II4yUkD9UoBfz4u+ZG4VDXLGZWcTo9JMrg6yS2vIjkJK7nQCsn11JfcnHLJCe0Wg+3YTXDm/C28T81ZsoMwtX9SD8Ec0vUi0kvxnr8HhKMywGoegbSTg4TeVBGXsnXiEpFcRqUsR+tX36b2mNi4tLYqJGOS08YlB21cqprlhD2XQqeRG+D4Dzf42XzJ9JcqwNTqUpk2m2ktv0AFASv3Y8G3ASxno9wIKAOSsyjPcrzkjG54k6pmOd0Nr67khupIThuXWMmt1JHcUh3JLUJQhiXH2IeDg08WnPzppvbe8l96FEUmlBiLMvWHfsWY2VYqToDNiAyEkMN501wjkquu+jbYY0o02mPSbetWKQU8jJQCepIT9V6INVQ0q4SLVwq09/QUncH7lfY25FABmWkZGhnnHr0Cjn5bQDRuMwZvnbikK7kgI5L7WjfLKSv1mGpCchIDWU7oFA5tBiXD2rSToFJpdE92pBud7ZsYsB35aWUVSERyy+R50N57E0h8s6tmuZlbdapvA1nOz3CWo01o65aXApUkF1YhOTfOm8Su4WDRLwEmhO7lg3GlezhVUFDQ5LWnleQwAb7YI2MnMH68mA/BEYegDWY5iU8mWAUTT6pGclP1spyvXpZ7YfUdrVN9V5WcBEsBsTv+DMEMm70Lvjt8GVTqKseFL5WWllrVWCuBnJ5Ad7xf3VEVouuVWDP18MkGMWY7C/9sLCpzjGc5QxtevR5TlVJAZ8OrLznxgAjcx8VAO68UmLLiezhw4hp72NPAtZ4iQ8Uab0SR0xRkjPuic8i3UXrfYQUeuOoAdEdYVt4bQeqzGSynZoFlYHUbXsNZjjbS+xZ6oQ1CG7AOOoxMg1HzdkPS1rNw9UYRYNo2ctZIs+W1ZfWCSSXFZ7enphzaJvXTwf9cgzWpJ2FsyF7oNjETLEakg2T0BgzwaJPQi3wRkJ92H5fGTVImka4AQhqP3uSNkvsSbZgcmCFyzGRJ0HZ4GngGbYeQuKOw7fuL+idJDNkDctI1P/8t/LchP4gbiqCuvOwpd2LkZkgWVOScxSB/HGasPohBNBeGz9kNg2buhIFBO/Dmd4BX8C4Ys2APK5eQ+KMQt+k05CAMcjCiWGXyvyCQE2q73sBhKdMOMZHjJXgBt18FlCEjMYPIw4hEXsaIh+fh9fV9rTReQ7PvFhj0Avj49LymYL0GmN3k2B45APouTXeJ9OqSgwLkmAnvVWVvCcoTlPsZtAXkSJ/Zu75I7XT//v3GqPve5AQ7XvgR/qTqkxoCQv5f4zZ38JM99NnurQTfNy1DtG5k30MOVqFlcOA0V/nDl4905Elk8r98Z/M8Pncf8UoEMoccASZAyPlqs9pVu2pX7apdtat21a7a9UbXfwFvUEEH4YaqlAAAAABJRU5ErkJggg=="


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
