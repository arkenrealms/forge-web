import styled from 'styled-components'
import { Button, Form, Input, InputNumber } from 'antd'

export default styled(Button)`
  background: #fff;

  &:not(:disabled):hover {
    color: #fff;
  }

  ${({ danger }) =>
    !danger
      ? `
      border: 1px solid #414bb2;
      color: #414bb2;

      &:focus,
      &:hover {
        background: #414bb2;
        border: 1px solid #414bb2;
        color: #fff;
      }
      `
      : ''}

  ${({ size }) =>
    size === 'middle'
      ? `
    padding: 10px 20px;
    height: 48px;
  `
      : ''}

  ${({ size }) =>
    size === 'large'
      ? `
        padding: 15px 30px;
        height: 58px;
        font-size: 1.1rem;
      `
      : ''}
`
