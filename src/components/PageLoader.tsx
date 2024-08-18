import React, { useState } from 'react'
import styled from 'styled-components'
import { Button, Heading, Text, LogoIcon } from '~/ui'
import Page from '~/components/layout/Page'
import useI18n from '~/hooks/useI18n'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'

const StyledNotFound = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 85px);
  justify-content: center;
`

const NotFound = () => {
  const { t } = useTranslation()
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setNotFound(true)
    }, 5 * 1000)

    return () => {
      clearTimeout(timeout)
    }
  }, [setNotFound])

  return (
    <Page>
      <StyledNotFound>
        {notFound ? (
          <>
            <Heading size="xxl">Loading...</Heading>
            <Text mb="16px">{t('Still looking...')}</Text>
            <br />
            <br />
            <Button as="a" href="/" scale="sm">
              {t('Back Home')}
            </Button>
          </>
        ) : (
          <>
            <Heading size="xxl">Loading...</Heading>
          </>
        )}
      </StyledNotFound>
    </Page>
  )
}

export default NotFound
