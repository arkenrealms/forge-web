import React, { useEffect, useRef, useState, useContext } from 'react'
import styled from 'styled-components'
import { Link as RouterLink, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, Tag, Flex, Card, Heading, CardBody, Link, BaseLayout, OpenNewIcon } from '~/ui'
import { Modal, useModal, InjectedModalProps } from '~/components/Modal'
import Page from '~/components/layout/Page'
import { PurchaseModal } from '~/components/PurchaseModal'
import PageWindow from '~/components/PageWindow'
import i18n from '~/config/i18n'

const Text = styled.div``

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;
  grid-gap: 75px;

  & > div {
    grid-column: span 4;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 12;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 4;
    }
  }
`

const Header = styled.div`
  min-height: 28px;
  width: 100%;
  font-weight: bold;
  font-size: 18px;
  text-align: center;
  padding: 10px;
`

const InfoBlock = styled.div`
  // padding: 24px;
  margin-top: 20px;
  text-align: left;
  font-size: 0.8rem;
`

const HeaderTag = styled.div`
  margin-top: 10px;
  width: 100%;
`

const Tag2 = styled(Tag)`
  zoom: 0.7;
`

const MainCard = styled(Card)`
  position: relative;
  font-weight: bold;
  border-width: 40px 40px;
  border-style: solid;
  border-color: transparent;
  border-image: url('/images/frame.png') 140 repeat;
  background: none;
  // transform: scale(0.8);
  text-shadow: 1px 1px 1px black;
  // box-shadow: 0 2px 0 0 rgb(0 0 0 / 80%), inset 0 -1px 0 0 rgb(0 0 0 / 10%), 0 0 66px 66px rgb(0 0 0 / 10%);
  text-align: center;
  background: #000;
  color: #bb955e;
  text-shadow: 1px 1px 1px black;
  font-weight: bold;
`

const Image = styled.img`
  border-radius: 7px;
`

const ImageBlock = ({ url }) => <Image src={url} />

const BottomMenu = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  text-align: center;
`

const Rules = () => {
  const { t } = useTranslation()
  const [showVision, setShowVision] = useState(false)
  const [onPresentPurchaseModal] = useModal(<PurchaseModal onSuccess={() => {}} />)

  return <iframe title="World" src="https://nexus.arken.gg/" style={{ width: '100%', height: '100%' }} />
}

export default Rules
