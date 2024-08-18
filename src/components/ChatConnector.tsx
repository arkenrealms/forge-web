import React, { useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { useRunePrice, useProfile } from '~/state/hooks'
import { getUserAddressByUsername } from '~/state/profiles/getProfile'
import { Link as RouterLink } from 'react-router-dom'
import useInterval from '~/hooks/useInterval'

interface Props {
  dummy?: string
}

const randomName = [
  'Leah',
  'Cain',
  'Tyrael',
  'Adria',
  'Asheara',
  'Akara',
  'Charsi',
  'Flavie',
  'Gheed',
  'Kashya',
  'Warriv',
  'Atma',
  'Drognan',
  'Elzix',
  'Fara',
  'Geglash',
  'Greiz',
  'Jerhyn',
  'Kaelan',
  'Lysander',
  'Meshif',
  'Warriv',
  'Alkor',
  'Hratli',
  'Natalya',
  'Ormus',
  'Halbu',
  'Jamella',
  'Hadriel',
  'Izual',
  'Anya',
  'Lazruk',
  'Malah',
  'Nihlathak',
  'Qual-Kehk',
]

function getRandomName() {
  return randomName[Math.floor(Math.random() * Math.floor(randomName.length - 1))]
}

const ChatContainer = styled.div`
  // position: fixed;
  // z-index: 100;
  // bottom: 25px;
  // right: 30px;
  // width: 300px;
  // padding: 2px;

  // background: #000;
  // border-width: 10px 10px;
  // border-style: solid;
  // border-color: transparent;
  // border-image: url(/images/frame.png) 140 repeat;
  // border-image-width: 60px;
  // background-color: rgba(0, 0, 0, 0.4);

  background-size: 400px;
  // box-shadow: 0 2px 0 0 rgb(0 0 0 / 80%), inset 0 -1px 0 0 rgb(0 0 0 / 10%), 0 0 66px 66px rgb(0 0 0 / 10%);

  // @media (max-width: 768px) {
  //   display: none;
  // }
  padding: 10px;
`

// let currentWebSocket = null
// let lastSeenTimestamp = 0
// let initialized = false

const ChatConnector: React.FC<Props> = () => {
  //   const [isChatConnectorShown, setIsChatConnectorShown] = useState(true)
  //   const [messages, setMessages] = useState([])
  //   const [isAtBottom, setIsAtBottom] = useState(true)
  //   const [message, setMessage] = useState('')
  //   const chatLogRef = useRef(null)
  //   const chatInputRef = useRef(null)
  //   const chatRoomRef = useRef(null)
  //   const { address: account } = useWeb3()
  //   const { profile } = useProfile()

  //   useEffect(() => {
  //     if (!isChatConnectorShown) return
  //     if (!chatRoomRef.current || !chatLogRef.current || !chatInputRef.current) return
  //     if (initialized) return
  //     if (!account) return
  //     if (!profile?.username) return

  //     initialized = true

  //     const username = profile?.username || getRandomName() //window.location.hostname === 'localhost' ? 'Binzy' : (profile?.username || getRandomName())
  //     const roomname = 'rune3'
  //     const hostname = 'edge-chat-demo.cloudflareworkers.com'

  //     async function addChatMessage(timestamp, name, text) {
  //       if (text.length < 2) return
  //       if (text === 'test' && window.location.hostname !== 'localhost') return

  //       console.log('Add message: ' + text)

  //       // @ts-ignore
  //       if (!window.globalMessages) {
  //         // @ts-ignore
  //         window.globalMessages = []
  //       }

  //       // @ts-ignore
  //       window.globalMessages = window.globalMessages.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1))
  //     }

  //     function startChat() {
  //       join()
  //     }

  //     function join() {
  //       const ws = new WebSocket('wss://' + hostname + '/api/room/' + roomname + '/websocket')
  //       let rejoined = false
  //       const startTime = Date.now()

  //       // @ts-ignore
  //       window.globalMessages = []

  //       const rejoin = async () => {
  //         if (!rejoined) {
  //           rejoined = true
  //           currentWebSocket = null

  //           // Don't try to reconnect too rapidly.
  //           const timeSinceLastJoin = Date.now() - startTime
  //           if (timeSinceLastJoin < 10000) {
  //             // Less than 10 seconds elapsed since last join. Pause a bit.
  //             await new Promise((resolve) => setTimeout(resolve, 10000 - timeSinceLastJoin))
  //           }

  //           // OK, reconnect now!
  //           join()
  //         }
  //       }

  //       ws.addEventListener('open', (event) => {
  //         currentWebSocket = ws

  //         // Send user info message.
  //         ws.send(JSON.stringify({ name: username }))
  //       })

  //       ws.addEventListener('message', async (event) => {
  //         const data = JSON.parse(event.data)

  //         try {
  //             const address = await getUserAddressByUsername(name)

  //             // @ts-ignore
  //             window.globalMessages.push({ timestamp, name: name || 'Binzy', address, text })
  //           } catch (e) {
  //             // @ts-ignore
  //             window.globalMessages.push({ timestamp, name: name || 'Binzy', address: undefined, text })
  //           }

  //         if (data.error) {
  //           addChatMessage(null, 'System', data.error)
  //         } else if (data.joined) {
  //             // @ts-ignore
  //           window.roster.push(data.joined)
  //         } else if (data.quit) {
  //             // @ts-ignore
  //           window.roster.remove(data.quit) // may not work
  //         } else if (data.timestamp > lastSeenTimestamp) {
  //           const found = !!messages.find(
  //             (m) => m.name === data.message.name && m.text === data.message.text && m.timestamp === data.timestamp,
  //           )

  //           if (found) return

  //           await addChatMessage(data.timestamp, data.name, data.message)
  //           lastSeenTimestamp = data.timestamp
  //         }
  //       })

  //       ws.addEventListener('close', (event) => {
  //         console.log('WebSocket closed, reconnecting:', event.code, event.reason)
  //         rejoin()
  //       })
  //       ws.addEventListener('error', (event) => {
  //         console.log('WebSocket error, reconnecting:', event)
  //         rejoin()
  //       })
  //     }

  //     startChat()
  //   }, [messages, message, account, setMessages, profile?.username, isChatConnectorShown, isAtBottom])

  return <ChatContainer></ChatContainer>
}

export default ChatConnector
