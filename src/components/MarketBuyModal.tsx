import BigNumber from 'bignumber.js'
import React, { useContext, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { decodeItem } from 'rune-backend-sdk/build/util/item-decoder'
import styled, { css } from 'styled-components'
import ApproveConfirmButtons from '~/components/account/ApproveConfirmButtons'
import Input from '~/components/Input/Input'
import Item from '~/components/Item'
import { InjectedModalProps, Modal } from '~/components/Modal'
import ItemsContext from '~/contexts/ItemsContext'
import useApproveConfirmTransaction from '~/hooks/useApproveConfirmTransaction'
import { useArcaneItems, useMarketContract } from '~/hooks/useContract'
import useGetWalletItems from '~/hooks/useGetWalletItems'
import useWeb3 from '~/hooks/useWeb3'
import { useToast } from '~/state/hooks'
import { Flex } from '~/ui'
import { getContractAddress } from '~/utils/addressHelpers'

interface MarketBuyModalProps extends InjectedModalProps {
  tokenIds: Record<string, unknown>
  trades: Array<any>
  onSuccess: () => void
}

const StyledInput = styled(Input)`
  margin-left: auto;
  border: 2px solid #555;
  border-radius: 6px;
`

const InputWrapper = styled.div`
  position: relative;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 234px;
    display: block;
  }
`

const ModalContent = styled.div`
  margin-bottom: 16px;
`

const Actions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 8px;
`

const MarketBuyModal: React.FC<MarketBuyModalProps> = ({ tokenIds, trades, onSuccess, onDismiss }) => {
  const { t } = useTranslation()
  const { address: account } = useWeb3()
  const [isLoading, setIsLoading] = useState(false)
  const { toastError, toastSuccess } = useToast()
  const [error, setError] = useState(null)
  const inputEl = useRef(null)
  const arcaneItemsContract = useArcaneItems()
  const [prices, setPrices] = useState({})
  const marketContract = useMarketContract()
  const { refresh } = useGetWalletItems()
  const { setItemPreviewed } = useContext(ItemsContext)
  const { isApproving, isApproved, isConfirmed, isConfirming, handleApprove, handleConfirm } =
    useApproveConfirmTransaction({
      onRequiresApproval: async () => {
        try {
          const response = await arcaneItemsContract.methods.getApproved(Object.keys(tokenIds)[0]).call()
          if (response === getContractAddress('market')) return true

          const response2 = await arcaneItemsContract.methods
            .isApprovedForAll(account, getContractAddress('market'))
            .call() // setApprovalForAll/isApprovedForAll

          return response2
        } catch (e) {
          return false
        }
      },
      onApprove: () => {
        return arcaneItemsContract.methods.setApprovalForAll(getContractAddress('market'), true).send({ from: account })
      },
      onConfirm: () => {
        return marketContract.methods
          .buyMultiple(
            Object.keys(tokenIds).map((tokenId) => trades.find((t2) => t2.tokenId === tokenId).seller),
            Object.keys(tokenIds),
            Object.keys(tokenIds).map((tokenId) =>
              new BigNumber(trades.find((t2) => t2.tokenId === tokenId).price)
                .times(new BigNumber(10).pow(18))
                .toString()
            )
          )
          .send({ from: account })
      },
      onSuccess: () => {
        refresh()

        toastSuccess(`Items purchased. Check back in a few minutes.`)

        onSuccess()
        onDismiss()
      },
    })

  const items = Object.keys(tokenIds)
    .map((tokenId) => decodeItem(tokenId))
    .sort(function (a, b) {
      return a.perfection > b.perfection ? 1 : -1
    })

  const onChangePrice = (tokenId, value) => {
    prices[tokenId] = value

    setPrices(JSON.parse(JSON.stringify(prices)))
  }

  let totalPrice = 0

  for (const tokenId of Object.keys(tokenIds)) {
    totalPrice += trades.find((t2) => t2.tokenId === tokenId).price
  }

  const onMouseLeave = () => {
    setItemPreviewed(null)
  }

  return (
    <Modal
      title={t('Bulk Purchase Items')}
      onDismiss={onDismiss}
      css={css`
        overflow: visible;
      `}>
      <ModalContent
        css={css`
          overflow-y: scroll;
          max-height: 70vh;
        `}
        onMouseLeave={onMouseLeave}>
        {items.map((item) => (
          <div
            key={item.tokenId}
            css={css`
              min-width: 700px;
              padding: 10px;
            `}>
            <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
              <div
                css={css`
                  display: inline-block;
                  text-decoration: none;
                  border: 0 none;
                  margin-left: 5px;
                  margin-right: 5px;

                  & > div {
                    position: relative;
                    width: auto;
                    height: auto;
                    // border: 1px solid #fff;
                    background: rgb(73 74 128 / 10%);
                    border-radius: 5px;
                    padding: 5px 3px 7px 3px;

                    &:hover {
                      background: rgb(73 74 128 / 20%);
                    }
                  }

                  & > div > div:first-child {
                    display: inline;
                    margin-right: 35px;
                  }

                  & > div > div:first-child > div:first-child {
                    top: 2px;
                    left: 4px;
                    width: 26px;
                    height: 26px;
                  }

                  & > div > div:first-child > div:nth-child(2) {
                    top: 2px;
                    left: 4px;
                    width: 26px;
                    height: 26px;
                  }
                `}>
                <Item
                  item={item}
                  // bonus={rune.bonus}
                  itemIndex={'buy' + item.tokenId}
                  showDropdown
                  hideMetadata
                  showBranches
                  showActions={false}
                  isDisabled={false}
                  background={false}
                  showQuantity={false}
                  hideRoll={false}
                  containerCss={css`
                    // display: inline-block;
                    // margin-bottom: -15px;
                    // width: 2rem;
                    // height: 2rem;
                    border-width: 1px;

                    // position: unset !important;
                  `}
                  innerCss={css`
                    position: relative;
                  `}>
                  <span style={{ borderBottom: '1px solid transparent', marginRight: '4px' }}>
                    {item.name} {(item.perfection * 100).toFixed(0)}%
                  </span>
                </Item>
              </div>

              <a
                href={`/token/${item.tokenId}`}
                target="_blank"
                rel="noreferrer noopener"
                css={css`
                  color: #ddd;
                `}>
                {item.shorthand} ({item.tokenId.slice(0, 7)}...{item.tokenId.slice(-7)})
              </a>

              <InputWrapper>
                <StyledInput
                  ref={inputEl}
                  disabled
                  value={trades.find((t2) => t2.tokenId === item.tokenId).price + ' RXS'}
                />
              </InputWrapper>
            </Flex>
          </div>
        ))}
        <br />
        <Final>
          <strong>Total:</strong> {totalPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })} RXS
        </Final>
        <br />
      </ModalContent>
      <Actions>
        <ApproveConfirmButtons
          isApproveDisabled={error || isConfirmed || isConfirming || isApproved}
          isApproving={isApproving}
          isConfirmDisabled={error || !isApproved || isConfirmed}
          isConfirming={isConfirming}
          onApprove={handleApprove}
          onConfirm={handleConfirm}
        />
      </Actions>
    </Modal>
  )
}

export default MarketBuyModal

const Final = styled.div`
  margin-top: 1em;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary};
`
