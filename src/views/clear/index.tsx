import React, { useEffect, useRef, useState, useContext } from 'react'
import styled from 'styled-components'
import { Link as RouterLink, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, Tag, Flex, Card, Heading, CardBody, Link, BaseLayout } from '~/ui'
import Page from '~/components/layout/Page'
import { PurchaseModal } from '~/components/PurchaseModal'
import PageWindow from '~/components/PageWindow'
import i18n from '~/config/i18n'
import { clearDatabase } from 'rune-backend-sdk/build/util/item-decoder'

function deleteAllCookies() {
  const cookies = document.cookie.split(';')

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i]
    const eqPos = cookie.indexOf('=')
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
  }
}

const Clear = ({ active }) => {
  useEffect(() => {
    if (!active) return
    if (!document) return

    setTimeout(function () {
      // @ts-ignore
      window.localStorage.clear()
      deleteAllCookies()
      clearDatabase()
    }, 1 * 1000)
  }, [active])

  return <></>
}

export default Clear
