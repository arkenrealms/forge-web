import React from 'react'
import { Link, Redirect, useParams } from 'react-router-dom'
import { Card, CardBody, Heading } from '~/ui'
import Page from '~/components/layout/Page'
import PageWindow from '~/components/PageWindow'

const Guide = ({ match }) => {
  const { id }: { id: string } = match.params
  return (
    <Page>
      <PageWindow>
        <Card>
          <CardBody>
            <Heading size="xl" mb="24px">
              Guide: Founder's Cube on Binance NFT
            </Heading>
            Hi Raider!
            <br />
            <br />
            Time to move your Earliest Access Founder's Cube from BINANCE NFT to your wallet!
            <br />
            <br />
            The Binance NFT cube will be exchanged for a Rune NFT cube and provide benefits such as earliest access to
            our upcoming games such as RUNE Infinite, Private Discord Channel, etc.
            <br />
            <br />
            <h3>Video Guide:</h3>
            <br />
            <iframe
              src="https://www.youtube.com/embed/THZLZVWlk_0"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: '100%', height: '500px' }}
            ></iframe>
            <br />
            <br />
            <h3>Instructions:</h3>
            <br />
            1. Withdraw your Earliest Access Founder's Cube from BINANCE NFT to your wallet
            <br />
            <br />
            2. Send your Cube to the burn address: 0x000000000000000000000000000000000000dead
            <br />
            <br />
            3. Send a DM to Maiev (@Ethermonarch on Telegram or Maiev#7524 on Discord)
            <br />
            <br />
            What Maiev Needs:
            <br />
            1. Transaction ID
            <br />
            2. BSC Address
            <br />
            3. Discord / Telegram Handle
            <br />
            <br />
            Soon your cube will be in your Rune inventory, back better than ever!
            <br />
          </CardBody>
        </Card>
      </PageWindow>
    </Page>
  )
}

export default Guide
