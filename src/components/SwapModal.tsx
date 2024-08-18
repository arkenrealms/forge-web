import React from 'react'
import { Modal, InjectedModalProps } from '~/components/Modal'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import Swap from '~/components/Swap'
import { Router } from 'react-router-dom'
import history from '~/routerHistory'

interface SwapModalProps extends InjectedModalProps {
  defaultAmount?: string
  onSuccess: () => void
}

const ModalContent = styled.div`
  //   margin-bottom: 16px;
  position: relative;
  width: 100%;
  max-width: 420px;
  max-height: 500px;
  //   padding: 10px;
  overflow-y: auto;
`

export const SwapModal: React.FC<SwapModalProps> = ({ defaultAmount, onSuccess, onDismiss }) => {
  const { t } = useTranslation()

  return (
    <Modal
      title={t('Swap Runes')}
      onDismiss={onDismiss}
      css={css`
        overflow: hidden;
      `}
      bodyPadding="8px">
      <ModalContent>
        <Router history={history}>
          <Swap />
        </Router>
      </ModalContent>
    </Modal>
  )
}

export default SwapModal
