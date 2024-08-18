import React, { useEffect, useMemo, useState } from 'react'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'
import { Button, Skeleton, Text, Flex, AutoRenewIcon } from '~/ui'
import { Modal, InjectedModalProps } from '~/components/Modal'
import history from '~/routerHistory'
import { useToast } from '~/state/hooks'
import useAccount from '~/hooks/useAccount'
import { useTranslation } from 'react-i18next'
import useApproveConfirmTransaction from '~/hooks/useApproveConfirmTransaction'
import { useArcaneItems, useMasterchef, useRouterV2, useRune } from '~/hooks/useContract'
import { getAddress, getMasterChefAddress, getRuneAddress } from '~/utils/addressHelpers'
import styled from 'styled-components'
import { toFixed } from 'rune-backend-sdk/build/util/math'
import contracts from 'rune-backend-sdk/build/contractInfo'
import { getBalanceNumber } from '~/utils/formatBalance'
import useWeb3 from '~/hooks/useWeb3'
import { getContract } from '~/utils/contractHelpers'
import NumericalInput from './NumericalInput'

interface StakeProps extends InjectedModalProps {
  defaultAmount?: string
  onSuccess: () => void
}

const ModalContent = styled.div`
  margin-bottom: 16px;
`

const InputPanel = styled.div`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.background};
  z-index: 1;
  width: 100%;
`
const InputContainer = styled.div`
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.input};
  box-shadow: ${({ theme }) => theme.shadows.inset};
`

const Actions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 8px;
`

const InputRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 0.75rem 0.75rem 0.75rem 1rem;
`

const BuyLink = styled.a`
  color: #fff;
  padding: 3px 15px;
  margin-top: 20px;
  text-align: center;
  font-family: unset;

  &:hover {
    color: #bb955e;
  }
`
function round(num, precision) {
  const _precision = 10 ** precision
  return Math.ceil(num * _precision) / _precision
}

export const StakeModal: React.FC<StakeProps> = ({ defaultAmount, onSuccess, onDismiss }) => {
  const { walletTokens, stakedTokens } = useAccount()
  const { t } = useTranslation()
  const { toastError, toastSuccess } = useToast()
  const { contract: masterChefContract } = useMasterchef()
  const [amount, setAmount] = useState('')
  const [bnbBalance, setBnbBalance] = useState('')
  const [tabIndex, setTabIndex] = useState(0)
  // const [runeAllowance, setRuneAllowance] = useState<BigNumber>(new BigNumber(0))
  const runeContract = useRune('RXS')
  const routerContract = useRouterV2()

  const { web3, address: account } = useWeb3()

  const { isApproving, isApproved, isConfirmed, isConfirming, handleApprove, handleConfirm } =
    useApproveConfirmTransaction({
      onRequiresApproval: async () => {
        try {
          const response = await runeContract.methods.allowance(account, getAddress(contracts.raid)).call()
          const currentAllowance = getBalanceNumber(new BigNumber(response))
          return currentAllowance >= parseFloat(amount)
        } catch (error) {
          return false
        }
      },
      onApprove: () => {
        return runeContract.methods
          .approve(getAddress(contracts.raid), ethers.constants.MaxUint256)
          .send({ from: account })
      },
      onConfirm: () => {
        const _amount = ethers.utils.parseEther(amount)

        const address = getRuneAddress('RXS')
        return masterChefContract.methods.deposit(75, _amount).send({ from: account })
      },
      onSuccess: async () => {
        // refresh()

        // toastSuccess(`${arcaneItem.name} equipped!`)

        // onDismiss()

        setTabIndex(2)
      },
    })

  useEffect(() => {
    if (!account || !walletTokens) return
    async function init() {
      setAmount(toFixed(walletTokens, 0).replace('.', ''))
    }

    init()
  }, [walletTokens, account, web3])

  useEffect(() => {
    if (!account) return
    async function init() {
      setBnbBalance(toFixed(walletTokens, 0).replace('.', ''))
    }

    init()
  }, [account, walletTokens, web3])

  // useEffect(() => {
  //   async function init() {
  //     const abi = (await (await fetch('/abi/erc20.json')).json()) as any
  //     const contract = getContract(abi, getAddress(contracts.rxs), web3)

  //     const response = await contract.methods.allowance(account, getAddress(contracts.raid)).call()
  //     const currentAllowance = new BigNumber(response)
  //     setRuneAllowance(currentAllowance)
  //   }

  //   init()
  // }, [account, web3])

  const onMax = async () => {
    setAmount(toFixed(walletTokens, 0).replace('.', ''))

    if (!walletTokens) {
      setAmount('0')
      return
    }

    const _value = toFixed(walletTokens, 0).replace('.', '')

    setAmount(_value)
  }

  return (
    <Modal title={t('Stake $RXS')} onDismiss={onDismiss}>
      <ModalContent>
        {tabIndex === 0 ? (
          <Flex flexDirection="column" alignItems="center" justifyContent="center" mb="10px">
            <InputPanel>
              <InputContainer>
                <InputRow style={{}}>
                  <>
                    <NumericalInput
                      value={amount}
                      onUserInput={(val) => {
                        setAmount(toFixed(parseFloat(val), 0).replace('.', ''))
                      }}
                    />
                    <Button onClick={onMax} scale="sm" variant="text">
                      MAX
                    </Button>
                  </>
                </InputRow>
              </InputContainer>
            </InputPanel>
            {/* <input type="text" value={amount} onChange={(e) => onChange(e.target.value)} /> */}
            <Final>
              <strong>Depositing:</strong> {amount} RXS
            </Final>
            <br />
            {/* <em style={{color: '#ccc', fontSize: '0.8rem'}}>1 XRUNE = 1 RUNE</em> */}
            {parseFloat(amount) > parseFloat(bnbBalance) ? (
              <Announce>Not enough RXS</Announce>
            ) : (
              <Final>
                <em>Staking will cause you to harvest any pending rewards.</em>
              </Final>
            )}
            <br />
            <Actions>
              {/* <Button width="100%" variant="secondary" onClick={onDismiss}>
                {t('Cancel')}
              </Button> */}
              <Button
                isLoading={isApproving}
                disabled={
                  isApproved || isApproving || parseFloat(amount) > parseFloat(bnbBalance) || !parseFloat(amount)
                }
                onClick={handleApprove}
                endIcon={isApproving ? <AutoRenewIcon spin color="currentColor" /> : undefined}>
                {t('Approve')}
              </Button>
              <Button
                width="100%"
                onClick={handleConfirm}
                disabled={
                  !account ||
                  !isApproved ||
                  isConfirming ||
                  parseFloat(amount) > parseFloat(bnbBalance) ||
                  !parseFloat(amount)
                }
                endIcon={isConfirming ? <AutoRenewIcon spin color="currentColor" /> : undefined}>
                {t('Confirm')}
              </Button>
            </Actions>
          </Flex>
        ) : null}
        {tabIndex === 1 ? (
          <>
            <Button variant="text" onClick={() => setTabIndex(0)} style={{ paddingLeft: 0 }}>
              {t('Back')}
            </Button>
            <br />
            <br />
            <iframe
              src="https://player.vimeo.com/video/522762925"
              title="How to buy BNB"
              width="640"
              height="400"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen></iframe>
          </>
        ) : null}
        {tabIndex === 2 ? (
          <>
            <Final>Stake complete.</Final>
            <br />
            <br />
            {/* <Tips>Your $RUNE balance: <br /><br />{getBalanceNumber(runeBalance)}</Tips>
            <br />
            <br /> */}
            <Button variant="text" onClick={() => setTabIndex(0)} style={{ paddingLeft: 0 }}>
              {t('Back')}
            </Button>
          </>
        ) : null}
      </ModalContent>
      {/* <> */}
      {/* {item ? (
          <Button
            onClick={async () => {
              await masterChefContract.methods._unequipItem(item.tokenId).send({ from: account })
              refresh()
            }}
          >
            Unequip Current Item First
          </Button>
        ) : null}
        {!item ? (
          <Actions>
            <ApproveConfirmButtons
              isApproveDisabled={isConfirmed || isConfirming || isApproved}
              isApproving={isApproving}
              isConfirmDisabled={!isApproved || isConfirmed}
              isConfirming={isConfirming}
              onApprove={handleApprove}
              onConfirm={handleConfirm}
            />
            <br />
            <br />
          </Actions>
        ) : null} */}
      {/* </> */}
    </Modal>
  )
}

export default StakeModal

const Tips = styled.div`
  margin-left: 0.4em;
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary};
`

const Final = styled.div`
  margin-top: 1em;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary};
`
const Announce = styled.div`
  margin-top: 1em;
  margin-left: 0.4em;
  color: #ed4b9e;
`
