import React from 'react'
import styled, { css } from 'styled-components'
import { Heading, Card, CardBody } from '~/ui'
import useI18n from '~/hooks/useI18n'
import { useTranslation } from 'react-i18next'
import Characters from '~/components/Characters'

const Collectibles = () => {
  const { t } = useTranslation()

  return <Characters />
}

export default Collectibles
