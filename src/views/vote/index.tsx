import React, { useEffect, useRef, useState, useContext } from 'react'
import styled from 'styled-components'
import { Link as RouterLink, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, Tag, Flex, Card, Heading, CardBody, Link, BaseLayout } from '~/ui'
import Page from '~/components/layout/Page'
import { PurchaseModal } from '~/components/PurchaseModal'
import PageWindow from '~/components/PageWindow'
import i18n from '~/config/i18n'

const Vote = ({ active }) => {
  useEffect(() => {
    if (!active) return
    if (!document) return

    document.location.href = 'https://vote.arken.gg'
  }, [active])

  return <></>
}

export default Vote
