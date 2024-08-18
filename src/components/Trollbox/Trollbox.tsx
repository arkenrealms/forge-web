import React, { useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useRunePrice, useProfile } from '~/state/hooks'
import { getUserAddressByUsername } from '~/state/profiles/getProfile'
import { Link as RouterLink } from 'react-router-dom'
import useWeb3 from '~/hooks/useWeb3'
import useInterval from '~/hooks/useInterval'
import useI18n from '~/hooks/useI18n'

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

const ChatHeader = styled.div`
  text-align: center;
  cursor: url('/images/cursor3.png'), pointer;
  font-size: 15px;
  padding: 4px;
`

const ChatForm = styled.form`
  width: 100%;
  height: 40px;
  position: relative;
`

const ChatInput = styled.input`
  width: 90%;
  margin-left: 20px;
  height: 40px;
  background: transparent;
  border: 0 none;
  padding: 5px;
  font-family: 'Alegreya Sans', Cambria, Verdana, Arial, Helvetica, sans-serif;
  text-transform: none;

  color: #fff;

  &:focus {
    outline: none !important;
  }
`

const ChatSubmit = styled.input`
  position: absolute;
  bottom: 10px;
  right: 30px;
  width: 60px;
  text-align: center;
  border: 1px solid #bb955e;
  border-radius: 3px;
  padding: 4px;
  background: transparent;
  color: #bb955e;
  cursor: url('/images/cursor3.png'), pointer;
`

const Chat = styled.div<{ isShown: boolean }>`
  ${({ isShown }) => `display: ${isShown ? 'block' : 'none'};`}
`

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

const ChatContainer2 = styled.div`
  // border-width: 3px 3px;
  // border-style: solid;
  // border-color: transparent;
  // border-image: url('/images/window-border-2.png') 3 repeat;
  // border-image-width: 3px;
  // background-color: rgba(0,0,0,0.4);
  color: #bb955e;
`
const ChatMessagesWrapper = styled.div`
  width: 100%;
  height: 250px;
  overflow-x: hidden;
  overflow-y: scroll;
`

const ChatMessages = styled.div`
  padding: 10px;
`

const Image = styled.img`
  position: fixed;
  bottom: 10px;
  right: 10px;
  width: 50px;
  height: 50px;
  cursor: url('/images/cursor3.png'), pointer;
  filter: grayscale(100%) brightness(70%) sepia(100%) hue-rotate(16deg) saturate(100%) contrast(2);
  opacity: 0.5;
`

const ChatMessage = styled.div`
  font-size: 12px;
  font-family: 'Alegreya Sans', Cambria, Verdana, Arial, Helvetica, sans-serif;
  line-height: 16px;

  strong {
    font-size: 12px;
    font-family: 'Alegreya Sans', Cambria, Verdana, Arial, Helvetica, sans-serif;
  }
  span {
    color: #fff;
    font-size: 12px;
    font-family: 'Alegreya Sans', Cambria, Verdana, Arial, Helvetica, sans-serif;
    text-transform: none;
  }
`

let currentWebSocket = null
let lastSeenTimestamp = 0
// let wroteWelcomeMessages = false;
let initialized = false
const globalMessages = []

const Trollbox: React.FC<Props> = () => {
  const [isTrollboxShown, setIsTrollboxShown] = useState(true)
  const [messages, setMessages] = useState([])
  const [roster, setRoster] = useState([])
  const [isAtBottom, setIsAtBottom] = useState(true)
  const [message, setMessage] = useState('')
  const { t } = useTranslation()
  const chatLogRef = useRef(null)
  const chatInputRef = useRef(null)
  const chatRoomRef = useRef(null)
  const { address: account } = useWeb3()
  const { profile } = useProfile()

  const toggleTrollbox = () => {
    setIsTrollboxShown(!isTrollboxShown)
    // setMessages([])

    // if (!isTrollboxShown) {

    // }
  }

  const onChangeMessage = (e) => {
    setMessage(e.target.value.slice(0, 256))
  }

  const onFormSubmit = (e) => {
    if (currentWebSocket && message.length >= 2) {
      console.log('Sending message: ' + message)
      currentWebSocket.send(JSON.stringify({ message }))
      setMessage('')

      // Scroll to bottom whenever sending a message.
      chatLogRef.current.scrollBy(0, 1e8)
    }

    e.preventDefault()
    e.stopPropagation()
  }

  useEffect(() => {
    if (!isTrollboxShown) return
    if (!chatRoomRef.current || !chatLogRef.current || !chatInputRef.current) return
    if (initialized) return
    if (!account) return
    if (!profile?.username) return

    initialized = true

    const username = profile?.username || getRandomName() //window.location.hostname === 'localhost' ? 'Binzy' : (profile?.username || getRandomName())
    const roomname = 'rune3'
    const hostname = 'edge-chat-demo.cloudflareworkers.com'

    async function addChatMessage(timestamp, name, text) {
      if (text.length < 2) return
      if (text === 'test' && window.location.hostname !== 'localhost') return

      console.log('Add message: ' + text)

      try {
        const address = randomName.indexOf(name) !== -1 ? undefined : await getUserAddressByUsername(name)

        globalMessages.push({ timestamp, name: name || 'Binzy', address, text })
      } catch (e) {
        globalMessages.push({ timestamp, name: name || 'Binzy', address: undefined, text })
      }

      // console.log(globalMessages.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1)))

      setMessages(() => [...globalMessages.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1))])

      if (isAtBottom) {
        chatLogRef.current?.scrollBy(0, 1e8)
      }
    }

    function startChat() {
      const chatRoom = chatRoomRef.current
      const chatLog = chatLogRef.current
      const chatInput = chatInputRef.current

      chatInput.addEventListener('keydown', (event) => {
        if (event.keyCode === 38) {
          // up arrow
          chatLog.scrollBy(0, -50)
        } else if (event.keyCode === 40) {
          // down arrow
          chatLog.scrollBy(0, 50)
        } else if (event.keyCode === 33) {
          // page up
          chatLog.scrollBy(0, -chatLog.clientHeight + 50)
        } else if (event.keyCode === 34) {
          // page down
          chatLog.scrollBy(0, chatLog.clientHeight - 50)
        }

        // setMessage(chatInput.value.slice(0, 256))
        // } else if (event.keyCode === 49) {
        //   currentWebSocket.send(JSON.stringify({message: chatInput.value.slice(0, 256)}));
        //   chatInput.value = "";
        //   // Scroll to bottom whenever sending a message.
        //   chatLog.scrollBy(0, 1e8);
        // }
      })

      // chatRoom.addEventListener("submit", event => {
      // });

      // chatInput.addEventListener("input", event => {
      //   if (event.currentTarget.value.length > 256) {
      //     event.currentTarget.value = event.currentTarget.value.slice(0, 256);
      //   }
      // });

      chatLog.addEventListener('scroll', (event) => {
        setIsAtBottom(chatLog.scrollTop + chatLog.clientHeight >= chatLog.scrollHeight)
      })

      chatInput.focus()
      document.body.addEventListener('click', (event) => {
        // If the user clicked somewhere in the window without selecting any text, focus the chat
        // input.
        if (window.getSelection().toString() === '') {
          chatInput.focus()
        }
      })

      // Detect mobile keyboard appearing and disappearing, and adjust the scroll as appropriate.
      if ('visualViewport' in window) {
        window.visualViewport.addEventListener('resize', function (event) {
          if (isAtBottom) {
            chatLog.scrollBy(0, 1e8)
          }
        })
      }

      //startChat();
      join()
    }

    function join() {
      const ws = new WebSocket('wss://' + hostname + '/api/room/' + roomname + '/websocket')
      let rejoined = false
      const startTime = Date.now()

      setMessages([])

      const rejoin = async () => {
        if (!rejoined) {
          rejoined = true
          currentWebSocket = null

          // Don't try to reconnect too rapidly.
          const timeSinceLastJoin = Date.now() - startTime
          if (timeSinceLastJoin < 10000) {
            // Less than 10 seconds elapsed since last join. Pause a bit.
            await new Promise((resolve) => setTimeout(resolve, 10000 - timeSinceLastJoin))
          }

          // OK, reconnect now!
          join()
        }
      }

      ws.addEventListener('open', (event) => {
        currentWebSocket = ws

        // Send user info message.
        ws.send(JSON.stringify({ name: username }))
      })

      ws.addEventListener('message', async (event) => {
        const data = JSON.parse(event.data)
        // console.log(data)
        if (data.error) {
          addChatMessage(null, 'System', data.error)
        } else if (data.joined) {
          const p = document.createElement('p')
          p.innerText = data.joined
          roster.push(p)
          setRoster(roster)
        } else if (data.quit) {
          // roster.remove(data.quit) // may not work
          setRoster(roster)
        } else if (data.ready) {
          // All pre-join messages have been delivered.
          // if (!wroteWelcomeMessages) {
          //   wroteWelcomeMessages = true;
          //   addChatMessage(null,
          //       "Welcome to the Trollbox");
          // }
        } else if (data.timestamp > lastSeenTimestamp) {
          const found = !!messages.find(
            (m) => m.name === data.message.name && m.text === data.message.text && m.timestamp === data.timestamp
          )

          if (found) return

          await addChatMessage(data.timestamp, data.name, data.message)
          lastSeenTimestamp = data.timestamp
        }
      })

      ws.addEventListener('close', (event) => {
        console.log('WebSocket closed, reconnecting:', event.code, event.reason)
        rejoin()
      })
      ws.addEventListener('error', (event) => {
        console.log('WebSocket error, reconnecting:', event)
        rejoin()
      })
    }

    startChat()
  }, [messages, roster, message, account, setMessages, profile?.username, isTrollboxShown, isAtBottom])

  useEffect(() => {
    if (isAtBottom) {
      chatLogRef.current?.scrollBy(0, 1e8)
    }
  }, [isAtBottom])

  // useInterval(() => {
  //   setMessages([...messages])
  // }, 1000)
  return (
    <ChatContainer>
      <ChatContainer2>
        <ChatHeader onClick={toggleTrollbox}>Expert Trollbox</ChatHeader>
        <Chat isShown={isTrollboxShown}>
          <ChatMessagesWrapper ref={chatLogRef}>
            {profile?.username ? (
              <ChatMessages>
                {messages.length === 0 ? <div>Loading...</div> : null}
                {messages.map((m) => (
                  <ChatMessage key={`${m.timestamp}${m.name}${m.text}`}>
                    {m.address ? (
                      <>
                        <RouterLink to={`/users/${m.address}`}>
                          <strong>{m.name}:</strong>
                        </RouterLink>{' '}
                        <span>{m.text}</span>
                      </>
                    ) : (
                      <>
                        <strong>{m.name}:</strong> <span>{m.text}</span>
                      </>
                    )}
                  </ChatMessage>
                ))}
              </ChatMessages>
            ) : null}
          </ChatMessagesWrapper>
          {profile?.username ? (
            <ChatForm ref={chatRoomRef} onSubmit={onFormSubmit}>
              <ChatInput
                ref={chatInputRef}
                placeholder="Enter..."
                value={message}
                onChange={onChangeMessage}
                autoComplete="none"
              />
              <ChatSubmit type="submit" name="submit" value="Send" />
              <input
                type="text"
                autoComplete="on"
                value=""
                style={{ display: 'none', opacity: 0, position: 'absolute', left: '-100000px' }}
                readOnly
              />
            </ChatForm>
          ) : (
            <RouterLink to={`/account`} style={{ padding: '10px' }}>
              Create Profile to Chat
            </RouterLink>
          )}
        </Chat>
        {/* <Image src="/images/trollbox.png" alt="trollbox" onClick={toggleTrollbox} /> */}
      </ChatContainer2>
    </ChatContainer>
  )
}

export default Trollbox
