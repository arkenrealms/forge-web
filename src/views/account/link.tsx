import React, { ChangeEvent, useEffect, useContext, useState } from 'react'
import styled from 'styled-components'
import Cookies from 'js-cookie'
import history from '~/routerHistory'
import BigNumber from 'bignumber.js'
import {
  Card,
  CardBody,
  Heading,
  Text,
  Button,
  AutoRenewIcon,
  CheckmarkIcon,
  Flex,
  WarningIcon,
  Skeleton,
  Checkbox,
} from '~/ui'
import UIKitInput from '~/components/Input/Input'
import { parseISO, formatDistance } from 'date-fns'
import nftList from '~/config/constants/nfts'
import { useToast } from '~/state/hooks'
import useWeb3 from '~/hooks/useWeb3'
import useI18n from '~/hooks/useI18n'
import useAccount from '~/hooks/useAccount'
import { useTranslation } from 'react-i18next'
import { getArcaneProfileAddress } from '~/utils/addressHelpers'
import { useCharacters } from '~/hooks/useContract'
import useGetWalletNfts from '~/hooks/useGetWalletNfts'
import useHasRuneBalance from '~/hooks/useHasRuneBalance'
import debounce from 'lodash/debounce'
import Page from '~/components/layout/Page'
import { ConnectNetwork } from '~/components/ConnectNetwork'
import { RowBetween } from '~/components/Row'
import { AutoColumn } from '~/components/Column'
// import { useFeathers } from '~/hooks/useFeathers'

const EMAIL_MIN_LENGTH = 5
const EMAIL_MAX_LENGTH = 100

const PASSWORD_MIN_LENGTH = 6
const PASSWORD_MAX_LENGTH = 100

const InputWrap = styled.div`
  position: relative;
  max-width: 240px;
  margin-bottom: 15px;
`

const Input = styled(UIKitInput)`
  padding-right: 40px;
`

const Indicator = styled(Flex)`
  align-items: center;
  height: 24px;
  justify-content: center;
  margin-top: -12px;
  position: absolute;
  right: 16px;
  top: 50%;
  width: 24px;
`

const MigrateAccount: React.FC<any> = () => {
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const [passwordRepeat, setPasswordRepeat] = useState(null)
  const { t } = useTranslation()
  const { toastError } = useToast()
  const { web3, address, library } = useWeb3()
  const [error, setError] = useState(null)
  const [isEmailValid, setIsEmailValid] = useState(false)
  const [isPasswordValid, setIsPasswordValid] = useState(false)
  const [isPasswordRepeatValid, setIsPasswordRepeatValid] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  // const { client, user, login, signup, services } = useFeathers()
  // {
  // binzy4@arken.gg
  // test
  //   "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJhY2NvdW50SWQiOjQyMDAxLCJpYXQiOjE2NTk0MjA5MjQsImV4cCI6MTY1OTUwNzMyNCwiYXVkIjoiaHR0cHM6Ly95b3VyZG9tYWluLmNvbSIsImlzcyI6ImZlYXRoZXJzIiwic3ViIjoiYW5vbnltb3VzIiwianRpIjoiODE4N2ZlMmEtYjIxMS00YjBkLTliZmYtOGQ2MGVlMTlmNTM1In0.tfaiEVkWnI__7dRb8-tpyyNDkjsXPfYhWr4JnxeL32E",
  //   "accountId": 42001,
  //   "profiles": [
  //     {
  //       "id": 42001,
  //       "name": "Default",
  //       "key": null,
  //       "value": null,
  //       "meta": {},
  //       "status": "active",
  //       "applicationId": null,
  //       "createdBy": null,
  //       "editedBy": null,
  //       "deletedBy": null,
  //       "createdAt": "2022-08-02T06:15:21.795Z",
  //       "updatedAt": null,
  //       "deletedAt": null,
  //       "address": null,
  //       "avatar": null,
  //       "role": "user",
  //       "accountId": 42001
  //     }
  //   ]
  // }

  async function getSignature(_address, value) {
    const hash = library?.bnbSign
      ? (await library.bnbSign(_address, value))?.signature
      : await web3.eth.personal.sign(value, _address, null)

    return hash
  }

  async function link(_email, _password, _address, _setError) {
    console.log(_email, _password, _address, _setError)
    // await signup(_email, _password, _setError)
    const _signature = await getSignature(_address, `Rune.Connect("${_address}")`)

    // const res = await services.accounts.link({
    //   email: _email,
    //   password: _password,
    //   address: _address,
    //   signature: _signature,
    // })

    // if (res) {
    //   const res2 = await login(_email, _password, _setError)

    //   console.log(res2)
    //   history.push('/account')
    // } else {
    //   _setError({
    //     message: 'Could not link, please contact support.',
    //   })
    // }
  }

  return (
    <Page>
      <ConnectNetwork />
      {/* <Text fontSize="20px" color="textSubtle" bold>
        {t(`Step ${3}`)}
      </Text> */}
      {address ? (
        <Card style={{ maxWidth: 500, margin: '0 auto' }}>
          <CardBody>
            <Heading as="h3" size="xl" mb="24px">
              {t('Link Account')}
            </Heading>
            <p>
              We've recently added support for non-crypto accounts. In order to migrate your account to the new system,
              please enter an email and password.
            </p>
            <br />
            <p>Don't worry, you'll continue to connect using your crypto wallet.</p>
            <br />
            <br />
            <Flex flexDirection="column" justifyContent="space-between" alignItems="center">
              <AutoColumn gap="md">
                <RowBetween>
                  <Text color="textSubtle" fontWeight={500} fontSize="14px">
                    Email
                  </Text>
                </RowBetween>
                <InputWrap>
                  <Input
                    onChange={(event) => {
                      setError(null)
                      setEmail(event.target.value)
                      setIsEmailValid(false)

                      if (
                        event.target.value.length < EMAIL_MIN_LENGTH ||
                        event.target.value.length > EMAIL_MAX_LENGTH
                      ) {
                        //  || event.target.value.indexOf('@') < 2 || event.target.value.indexOf('.') < 2
                        return
                      }

                      const regex = new RegExp('(.+)@(.+){2,}.(.+){2,}')

                      if (!regex.test(event.target.value)) {
                        setError({
                          message: 'Invalid email',
                        })
                        return
                      }

                      setIsEmailValid(true)
                    }}
                    isWarning={email && !isEmailValid}
                    isSuccess={email && isEmailValid}
                    minLength={EMAIL_MIN_LENGTH}
                    maxLength={EMAIL_MAX_LENGTH}
                    placeholder={''}
                    value={email}
                  />
                  <Indicator>
                    {isLoading && <AutoRenewIcon spin />}
                    {!isLoading && isEmailValid && email && <CheckmarkIcon color="success" />}
                    {!isLoading && !isEmailValid && email && <WarningIcon color="failure" />}
                  </Indicator>
                </InputWrap>
              </AutoColumn>
              <AutoColumn gap="md">
                <RowBetween>
                  <Text color="textSubtle" fontWeight={500} fontSize="14px">
                    Password
                  </Text>
                </RowBetween>
                <InputWrap>
                  <Input
                    onChange={(event) => {
                      setError(null)
                      setPassword(event.target.value)
                      setIsPasswordValid(false)

                      if (
                        event.target.value.length < PASSWORD_MIN_LENGTH ||
                        event.target.value.length > PASSWORD_MAX_LENGTH
                      ) {
                        return
                      }

                      const regex = new RegExp('^(?=.*[a-z])(?=.*[0-9!@#$%^&*]).{8,}$')

                      if (!regex.test(event.target.value)) {
                        setError({
                          message: 'Password too simple',
                        })
                        return
                      }

                      setIsPasswordValid(true)
                    }}
                    isWarning={password && !isPasswordValid}
                    isSuccess={password && isPasswordValid}
                    minLength={PASSWORD_MIN_LENGTH}
                    maxLength={PASSWORD_MAX_LENGTH}
                    placeholder={''}
                    value={password}
                    disabled={!isEmailValid}
                    type="password"
                  />
                  <Indicator>
                    {isLoading && <AutoRenewIcon spin />}
                    {!isLoading && isPasswordValid && password && <CheckmarkIcon color="success" />}
                    {!isLoading && !isPasswordValid && password && <WarningIcon color="failure" />}
                  </Indicator>
                </InputWrap>
              </AutoColumn>
              <AutoColumn gap="md">
                <RowBetween>
                  <Text color="textSubtle" fontWeight={500} fontSize="14px">
                    Repeat Password
                  </Text>
                </RowBetween>
                <InputWrap>
                  <Input
                    onChange={(event) => {
                      setError(null)
                      setPasswordRepeat(event.target.value)
                      setIsPasswordRepeatValid(false)

                      if (
                        event.target.value.length < PASSWORD_MIN_LENGTH ||
                        event.target.value.length > PASSWORD_MAX_LENGTH
                      ) {
                        return
                      }

                      if (event.target.value !== password) {
                        setError({
                          message: 'Password does not match',
                        })
                        return
                      }

                      setIsPasswordRepeatValid(true)
                    }}
                    isWarning={passwordRepeat && !isPasswordRepeatValid}
                    isSuccess={passwordRepeat && isPasswordRepeatValid}
                    minLength={PASSWORD_MIN_LENGTH}
                    maxLength={PASSWORD_MAX_LENGTH}
                    placeholder={''}
                    value={passwordRepeat}
                    disabled={!isPasswordValid}
                    type="password"
                  />
                  <Indicator>
                    {isLoading && <AutoRenewIcon spin />}
                    {!isLoading && isPasswordRepeatValid && passwordRepeat && <CheckmarkIcon color="success" />}
                    {!isLoading && !isPasswordRepeatValid && passwordRepeat && <WarningIcon color="failure" />}
                  </Indicator>
                </InputWrap>
              </AutoColumn>
              {error ? (
                <Text color="failure" py="4px" mb="16px" style={{ minHeight: '30px' }}>
                  {error.message}
                </Text>
              ) : null}
              <br />
              <Button
                style={{ zoom: 1.3, padding: '6px 20px', textAlign: 'center' }}
                disabled={!isPasswordRepeatValid}
                onClick={() => link(email, password, address, setError)}>
                {t('Connect')}
              </Button>
            </Flex>
          </CardBody>
        </Card>
      ) : null}
    </Page>
  )
}

export default MigrateAccount
