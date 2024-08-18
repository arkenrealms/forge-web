import React, { useState, useLayoutEffect } from 'react'
import styled, { css } from 'styled-components'
import { Link as RouterLink, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, Heading, CardBody, Skeleton, Flex } from '~/ui'
import { isWindows, isMacOs, isAndroid } from 'react-device-detect'
import Page from '~/components/layout/Page'
import { Alert, alertVariants } from '~/components/Alert'

const zzz = styled.div``

const downloads = {
  evolution: {
    windows: 'https://storage.googleapis.com/runepublic/Clients/Evolution/Launcher/Windows.zip',
    mac: 'https://storage.googleapis.com/runepublic/Clients/Evolution/Launcher/Mac.zip',
    android: 'https://play.google.com/store/apps/details?id=com.DefaultCompany.Evolution_2___Client',
  },
  infinite: {
    windows: 'https://storage.googleapis.com/runepublic/Clients/Infinite/Launcher/Windows.zip',
    mac: 'https://storage.googleapis.com/runepublic/Clients/Infinite/Launcher/Mac.zip',
  },
}

const DownloadView = ({ active, match }) => {
  const { id, platform }: { id: string; platform: string } = match.params
  const [found, setFound] = useState(null)
  const [manual, setManual] = useState(false)

  let platformOverride = platform

  if (!platform) {
    if (isWindows) platformOverride = 'windows'
    if (isMacOs) platformOverride = 'mac'
    if (isAndroid) platformOverride = 'android'
  }

  useLayoutEffect(
    function () {
      if (!active) return
      if (!document) return

      if (downloads?.[id]?.[platformOverride]) {
        document.location.href = downloads[id][platformOverride]
        setFound(true)
      } else {
        setFound(false)
      }
    },
    [active, id, platformOverride]
  )

  return (
    <Page>
      <Card style={{ width: '100%' }}>
        <CardBody>
          {found === null ? <Skeleton height="80px" mb="16px" /> : null}
          {found === true ? (
            <>
              <Alert title={''} variant={alertVariants.INFO}>
                Your download should begin automatically. Didn’t work?{' '}
                <a
                  href={downloads[id][platformOverride]}
                  css={css`
                    margin-left: 10px;
                    font-weight: bold;
                    border-bottom: 1px solid #ddd;
                  `}
                >
                  Try downloading again.
                </a>
              </Alert>
              <br />
              <br />
              <Flex flexDirection="column" alignItems="center" justifyContent="center">
                <Heading as="h3" size="lg" style={{ textAlign: 'center', marginTop: 15 }}>
                  Open and install the file that just downloaded
                </Heading>
                <Heading
                  as="h4"
                  size="md"
                  style={{ textAlign: 'center', marginTop: 15 }}
                  css={css`
                    margin: 0 auto;
                    display: inline-block;
                    border-bottom: 1px solid #bb955e;
                    cursor: url('/images/cursor3.png'), pointer;
                  `}
                  onClick={() => setManual(!manual)}
                >
                  Show all downloads
                </Heading>
              </Flex>
              {manual ? (
                <>
                  <br />
                  <br />
                  <p>
                    {downloads[id].windows ? (
                      <>
                        <strong>Windows:</strong> <a href={downloads[id].windows}>{downloads[id].windows}</a>
                        <br />
                      </>
                    ) : null}
                    {downloads[id].mac ? (
                      <>
                        <strong>Mac:</strong> <a href={downloads[id].mac}>{downloads[id].mac}</a>
                        <br />
                      </>
                    ) : null}
                    {downloads[id].android ? (
                      <>
                        <strong>Android:</strong> <a href={downloads[id].android}>{downloads[id].android}</a>
                        <br />
                      </>
                    ) : null}
                  </p>
                </>
              ) : null}
              <br />
              <br />
              <p>
                Having trouble? <a href="/support">Get help with your installation.</a>
              </p>
            </>
          ) : null}
          {found === false ? (
            <>
              <Heading as="h3" size="lg" style={{ textAlign: 'center', marginTop: 15 }}>
                Could not detect device system, please choose manually
              </Heading>
              {/* <p>Could not detect device system, please choose manually.</p> */}
              <br />
              <br />
              <p>
                {downloads[id].windows ? (
                  <>
                    <strong>Windows:</strong> <a href={downloads[id].windows}>{downloads[id].windows}</a>
                    <br />
                  </>
                ) : null}
                {downloads[id].mac ? (
                  <>
                    <strong>Mac:</strong> <a href={downloads[id].mac}>{downloads[id].mac}</a>
                    <br />
                  </>
                ) : null}
                {downloads[id].android ? (
                  <>
                    <strong>Android:</strong> <a href={downloads[id].android}>{downloads[id].android}</a>
                    <br />
                  </>
                ) : null}
              </p>
              <br />
              <br />
              <p>
                Having trouble? <a href="/support">Get help with your installation.</a>
              </p>
            </>
          ) : null}
        </CardBody>
      </Card>
    </Page>
  )
}

export default DownloadView
