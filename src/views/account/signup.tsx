import React, { ChangeEvent, useEffect, useContext, useState } from 'react'
import styled from 'styled-components'
import Cookies from 'js-cookie'
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
// import { useFeathers } from '~/hooks/useFeathers'

const EMAIL_MIN_LENGTH = 5
const EMAIL_MAX_LENGTH = 100

const PASSWORD_MIN_LENGTH = 5
const PASSWORD_MAX_LENGTH = 100

const InputWrap = styled.div`
  position: relative;
  max-width: 240px;
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

const AccountCreation: React.FC<any> = () => {
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const [passwordRepeat, setPasswordRepeat] = useState(null)
  const { t } = useTranslation()
  const { toastError } = useToast()
  const { web3 } = useWeb3()
  const [error, setError] = useState(null)
  const [isEmailValid, setIsEmailValid] = useState(false)
  const [isPasswordValid, setIsPasswordValid] = useState(false)
  const [isPasswordRepeatValid, setIsPasswordRepeatValid] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  // const { client, user, login, signup } = useFeathers()
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

  return (
    <Page>
      <Text fontSize="20px" color="textSubtle" bold>
        {t(`Step ${3}`)}
      </Text>
      <Heading as="h3" size="xl" mb="24px">
        {t('Register')}
      </Heading>
      {/* User: {JSON.stringify(user)} */}
      {error ? <p>{error.message}</p> : null}
      <InputWrap>
        <Input
          onChange={(event) => {
            setEmail(event.target.value)
            setIsEmailValid(true)
          }}
          isWarning={email && !isEmailValid}
          isSuccess={email && isEmailValid}
          minLength={EMAIL_MIN_LENGTH}
          maxLength={EMAIL_MAX_LENGTH}
          placeholder={t('Enter your email...')}
          value={email}
        />
        <Indicator>
          {isLoading && <AutoRenewIcon spin />}
          {!isLoading && isEmailValid && email && <CheckmarkIcon color="success" />}
          {!isLoading && !isEmailValid && email && <WarningIcon color="failure" />}
        </Indicator>
      </InputWrap>
      <InputWrap>
        <Input
          onChange={(event) => setPassword(event.target.value)}
          isWarning={password && !isPasswordValid}
          isSuccess={password && isPasswordValid}
          minLength={PASSWORD_MIN_LENGTH}
          maxLength={PASSWORD_MAX_LENGTH}
          placeholder={t('Password')}
          value={password}
          disabled={!isEmailValid}
          type="password"
        />
        <Indicator>
          {isLoading && <AutoRenewIcon spin />}
          {!isLoading && isEmailValid && email && <CheckmarkIcon color="success" />}
          {!isLoading && !isEmailValid && email && <WarningIcon color="failure" />}
        </Indicator>
      </InputWrap>
      <Text color="textSubtle" fontSize="14px" py="4px" mb="16px" style={{ minHeight: '30px' }}>
        {message}
      </Text>
      <button
        type="button"
        className="button button-primary block signup"
        // onClick={() => signup(email, password, setError)}
      >
        Create
      </button>
    </Page>
  )
}

export default AccountCreation
