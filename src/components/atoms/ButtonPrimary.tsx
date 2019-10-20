import React, { RefObject } from "react"
import COLORS from './Colors'
import ButtonColored from './ButtonColored'

interface iButtonPrimaryProps extends React.HTMLProps<HTMLButtonElement> {
  type?: "button" | "submit" | "reset" | undefined
  ref?: ((instance: HTMLButtonElement | null) => void) | RefObject<HTMLButtonElement> | null | undefined;
}

const ButtonPrimary:React.FC<iButtonPrimaryProps> = props => {
  return(
    <ButtonColored
      color={COLORS.PREMARY}
      disabledColor={COLORS.DISABLED}
      {...props}
    >
      {props.children}
    </ButtonColored>
  )
}

export default ButtonPrimary