import React from 'react'
import styled from 'styled-components'
import { Button } from '~/ui'

const StyledButton = styled(Button)`
  border-image-source: url(https://d3a5h34gwy5glx.cloudfront.net/assets/images/fenris-buttons-base@2x.67c4ba30c291fd9743964a790894e15b.png);
  border-image-slice: 110 330 fill;
  border-width: 44px 132px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0);
  font-size: 1.4444rem;
  line-height: 2.3889rem;

  &:hover {
    border-image-source: url(https://d3a5h34gwy5glx.cloudfront.net/assets/images/fenris-buttons-hover@2x.a68416bca15cd727ef738347d1eb9f7a.png);
    border-image-slice: 110 330 fill;
  }
`

export default StyledButton
