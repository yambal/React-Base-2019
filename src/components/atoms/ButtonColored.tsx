import styled from "@emotion/styled";
import Button from './Button'
var Color = require('color');

interface iButtonColoredProps {
  color: string,
  disabledColor: string
}

const ButtonColored = styled(Button)<iButtonColoredProps>`
  color: #fff;
  background-color: ${props => Color(props.color).hex()};
  border-color: ${props => Color(props.color).darken(0.1).hex()};

  &:not(:disabled) {
    cursor: pointer;
    text-decoration: none;
    &:hover {
      background-color: ${props => Color(props.color).lighten(0.1).hex()};
      border-color: ${props => Color(props.color).hex()};
      text-decoration: none;
    }
  }

  &:disabled {
    color: #fff;
    background-color: ${props => props.disabledColor};
    border-color: ${props => props.disabledColor};
    opacity: .65;
  }
`

export default ButtonColored