import React, { useEffect, useRef, useState, useContext } from 'react'
import styled from 'styled-components'
import { Link as RouterLink, NavLink } from 'react-router-dom'
import { getUsername } from '~/state/profiles/getProfile'
import { useTranslation } from 'react-i18next'
import { Button, Tag, Flex, Card, Heading, CardBody, Link, BaseLayout } from '~/ui'
import Page from '~/components/layout/Page'
import { PurchaseModal } from '~/components/PurchaseModal'
import PageWindow from '~/components/PageWindow'
import useWeb3 from '~/hooks/useWeb3'
import { Dots } from '~/components/swap/styleds'
import WalletNotConnected from '~/components/account/WalletNotConnected'

const Rules = ({ active }) => {
  const { address: account, library } = useWeb3()
  const [username, setUsername] = useState(null)
  const { t } = useTranslation()

  useEffect(
    function () {
      if (!account) return

      async function init() {
        const acc = account

        try {
          if (acc.indexOf('0x') === 0) {
            const res = await getUsername(account)
            // @ts-ignore
            if (res) {
              setUsername(res)
            }
          } else {
            setUsername(acc)
          }
        } catch (e) {
          console.log(e)
        }
      }

      init()
    },
    [account, setUsername]
  )

  useEffect(() => {
    if (!document) return
    if (!username) return

    document.location.href = `/user/${username}`
  }, [username])

  if (!account) {
    return (
      <Page>
        <WalletNotConnected />
      </Page>
    )
  }

  return (
    <>
      <Dots>Loading</Dots>
    </>
  )
}

export default Rules
