import React from 'react'
import styled from 'styled-components'
import { Link as RouterLink, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, Heading, CardBody } from '~/ui'
import Page from '~/components/layout/Page'

const Whitepaper = () => {
  const { t } = useTranslation()

  return (
    <iframe
      title="Whitepaper"
      src="https://runefarm.github.io/rune-whitepaper/"
      style={{ width: '100%', height: '100%' }}
    />
  )
}

export default Whitepaper
