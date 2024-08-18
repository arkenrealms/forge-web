import React, { useState, useCallback } from 'react'
import { FallingCharacters, FallingCharactersProps } from '~/ui'
import useKonamiCheatCode from '~/hooks/useKonamiCheatCode'

const EasterEgg: React.FC<FallingCharactersProps> = (props) => {
  const [show, setShow] = useState(false)
  const startFalling = useCallback(() => setShow(true), [setShow])
  useKonamiCheatCode(startFalling)

  if (show) {
    return <div onAnimationEnd={() => setShow(false)}>{/* <FallingCharacters {...props} /> */}</div>
  }
  return null
}

export default EasterEgg
