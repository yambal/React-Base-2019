import styled from "@emotion/styled";
import COLORS from './Colors'

const Button = styled.button`
  display: inline-block;
  text-align: center;
  vertical-align: middle;
  user-select: none;
  background-color: transparent;
  border: 1px solid transparent;
  padding: .375rem .75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: .25rem;
  transition: color .15s ease-in-out,background-color .25s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
  font-weight: 400;
  color: ${COLORS.LINK};
  text-decoration: none;

  &:not(:disabled) {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }

  &:disabled {
    color: ${COLORS.DISABLED};
    pointer-events: none;
  }

`

export default Button