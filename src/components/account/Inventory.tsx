import React, { useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { Heading, Button, Flex, Toggle, Card, CardBody, Text, BaseLayout, CardHeader } from '~/ui'
import { Modal, useModal, InjectedModalProps } from '~/components/Modal'
import Input from '~/components/Input/Input'
import useMatchBreakpoints from '~/hooks/useMatchBreakpoints'
import { Link as RouterLink } from 'react-router-dom'
import useI18n from '~/hooks/useI18n'
import { useTranslation } from 'react-i18next'
import Page from '~/components/layout/Page'
import PageWindow from '~/components/PageWindow'
import Inventory from '~/components/Inventory'
import Transmute from '~/components/Transmute'
import Equipment from '~/components/Equipment'
import ListModal from '~/components/MarketListModal'
import Skins from '~/components/Skins'
import Select, { OptionProps } from '~/components/Select/Select'
import { useProfile } from '~/state/hooks'

const StyledInput = styled(Input)`
  // border: 1px solid rgba(255, 255, 255, 0.2);
  // border-radius: 6px;
  margin-left: auto;
`

const InputWrapper = styled.div`
  position: relative;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 234px;
    display: block;
  }
`

const SearchContainer = styled.div<{ toggled: boolean }>``

interface SearchProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const SearchInput: React.FC<SearchProps> = ({ value, onChange }) => {
  const [toggled, setToggled] = useState(false)
  const inputEl = useRef(null)

  return (
    <SearchContainer toggled={toggled}>
      <InputWrapper>
        <StyledInput
          ref={inputEl}
          value={value}
          onChange={onChange}
          placeholder="SEARCH"
          onBlur={() => setToggled(false)}
        />
      </InputWrapper>
    </SearchContainer>
  )
}

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;

  & > div {
    grid-column: span 6;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 12;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
`

const VerticalCards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;

  & > div {
    grid-column: span 12;
    width: 100%;
    background-image: url(/images/background.jpeg);
    background-size: 400px;
  }
`

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 0px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
    padding: 0;
  }
`

const ViewControls = styled.div`
  flex-wrap: wrap;
  justify-content: space-between;
  display: flex;
  align-items: center;
  width: 100%;

  > div {
    padding: 8px 0px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
    width: auto;

    > div {
      padding: 0;
    }
  }
`

const ControlContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;
  margin-bottom: 20px;

  justify-content: space-between;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
  }
`

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;

  ${Text} {
    margin-left: 8px;
  }
`

const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
`

const EquipmentContainer = styled.div`
  width: 100%;
  text-align: left;
  max-width: 558px;

  & > br + br + div {
    zoom: 0.7;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    & > br + br + div {
      zoom: 1;
    }
  }
`

const Me: React.FC<any> = ({ address }) => {
  const { t } = useTranslation()
  const { isMd, isLg, isXl, isXxl, isXxxl } = useMatchBreakpoints()
  const [selectedItems, setSelectedItems] = useState({})
  const [onPresentListModal] = useModal(
    <ListModal
      tokenIds={selectedItems}
      onSuccess={() => {
        setSelectedItems({})
      }}
    />
  )
  const [perfectOnly, setPerfectOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [selectMode, setSelectMode] = useState(false)
  const [sortOption, setSortOption] = useState('perfection')
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState(0)

  let columns = 4
  let rows = 10

  if (isMd) {
    columns = 5
    rows = 5
  }
  if (isLg) {
    columns = 5
    rows = 5
  }
  if (isXl) {
    columns = 5
    rows = 5
  }
  if (isXxl) {
    columns = 6
    rows = 6
  }
  if (isXxxl) {
    columns = 8
    rows = 8
  }

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value.toLowerCase())
  }

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value)
  }

  const onItemMultiSelected = (value, items) => {
    setSelectedItems(items)
  }

  return (
    <>
      <Cards>
        <VerticalCards>
          <Card style={{ overflow: 'visible', backgroundImage: 'none' }}>
            <CardHeader style={{ padding: 0 }}>
              <div
                css={css`
                  background: rgba(0, 0, 0, 0.2);
                  width: 100%;
                  padding: 0;
                `}
              >
                <Heading
                  size="md"
                  mb="8px"
                  css={css`
                    display: inline-block;
                    padding: 15px;
                    margin: 0;

                    &:hover {
                      background: rgba(0, 0, 0, 0.2);
                      cursor: url('/images/cursor3.png'), pointer;
                    }
                  `}
                  style={{ background: tab === 0 ? 'rgba(0, 0, 0, 0.2)' : 'none' }}
                  onClick={() => setTab(0)}
                >
                  {t('Equipment')}
                </Heading>
                <Heading
                  size="md"
                  mb="8px"
                  css={css`
                    display: inline-block;
                    padding: 15px;
                    margin: 0;

                    &:hover {
                      background: rgba(0, 0, 0, 0.2);
                      cursor: url('/images/cursor3.png'), pointer;
                    }
                  `}
                  style={{ background: tab === 1 ? 'rgba(0, 0, 0, 0.2)' : 'none' }}
                  onClick={() => setTab(1)}
                >
                  {t('Skins')}
                </Heading>
                <Heading
                  size="md"
                  mb="8px"
                  css={css`
                    padding: 15px;
                    display: inline-block;
                    margin: 0;

                    &:hover {
                      background: rgba(0, 0, 0, 0.2);
                      cursor: url('/images/cursor3.png'), pointer;
                    }
                  `}
                  style={{ background: tab === 2 ? 'rgba(0, 0, 0, 0.2)' : 'none' }}
                  onClick={() => setTab(2)}
                >
                  {t('Transmute')}
                </Heading>
              </div>
              <Text as="p" style={{ padding: 24 }}>
                {t('Equip your items for in-game bonuses!')}
              </Text>
            </CardHeader>
            <CardBody style={{ width: '100%', height: '100%', padding: 0 }}>
              <Flex flexDirection="column" alignItems="center" justifyContent="center">
                {tab === 0 ? (
                  <EquipmentContainer>
                    <Equipment address={address}>
                      {/* <Heading as="h2" size="xl" m="24px">
                      Equipment
                    </Heading> */}
                      {/* <p>Coming soon</p> */}
                      {/* <p>Drag n drop items from your inventory. Or double click them to bring up the menu.</p> */}
                    </Equipment>
                  </EquipmentContainer>
                ) : null}
                {tab === 1 ? <Skins /> : null}
                {tab === 2 ? <Transmute /> : null}
              </Flex>
            </CardBody>
          </Card>
        </VerticalCards>
        <VerticalCards>
          <Card style={{ overflow: 'visible', backgroundImage: 'none' }}>
            <CardHeader>
              <Flex alignItems="center" justifyContent="space-between">
                <div>
                  <Heading size="lg" mb="8px">
                    {t('Inventory')}
                  </Heading>
                  <Text as="p">{t('Manage your items or trade them.')}</Text>
                </div>
              </Flex>
            </CardHeader>
            <CardBody>
              <ControlContainer style={{ filter: 'saturate(0) contrast(1.9)', zIndex: 99 }}>
                <LabelWrapper>
                  <Text>&nbsp;</Text>
                  <SearchInput onChange={handleChangeQuery} value={query} />
                </LabelWrapper>
                <FilterContainer>
                  {/* <LabelWrapper style={{ marginRight: 15 }}>
                  <Text>Status</Text>
                  <Select
                    options={[
                      {
                        label: 'Available',
                        value: 'available',
                      },
                      {
                        label: 'Sold',
                        value: 'sold',
                      },
                      // {
                      //   label: 'Delisted',
                      //   value: 'delisted',
                      // },
                      // {
                      //   label: 'Earned',
                      //   value: 'earned',
                      // },
                      // {
                      //   label: 'Liquidity',
                      //   value: 'liquidity',
                      // },
                    ]}
                    onChange={(option) => setStatusFilter(option.value)}
                  />
                </LabelWrapper> */}
                  <LabelWrapper>
                    <Text>SORT BY</Text>
                    <Select
                      value={sortOption}
                      options={[
                        {
                          label: 'Recent',
                          value: 'recent',
                        },
                        {
                          label: 'Popular',
                          value: 'hot',
                        },
                        // {
                        //   label: 'New',
                        //   value: 'new',
                        // },
                        // {
                        //   label: 'Updated',
                        //   value: 'updated',
                        // },
                        {
                          label: 'Perfection',
                          value: 'perfection',
                        },
                        // {
                        //   label: 'Earned',
                        //   value: 'earned',
                        // },
                        // {
                        //   label: 'Liquidity',
                        //   value: 'liquidity',
                        // },
                      ]}
                      onChange={handleSortOptionChange}
                    />
                  </LabelWrapper>
                </FilterContainer>
              </ControlContainer>
              <ControlContainer style={{ filter: 'saturate(0) contrast(1.4)' }}>
                <FilterContainer>
                  <div>
                    <ViewControls>
                      <ToggleWrapper>
                        <Toggle checked={showFilters} onChange={() => setShowFilters(!showFilters)} scale="sm" />
                        <Text> {t('Filters')}</Text>
                      </ToggleWrapper>
                      <ToggleWrapper
                        css={css`
                          margin-left: 8px;
                        `}
                      >
                        <Toggle checked={selectMode} onChange={() => setSelectMode(!selectMode)} scale="sm" />
                        <Text> {t('Bulk Mode')}</Text>
                      </ToggleWrapper>
                    </ViewControls>
                  </div>
                </FilterContainer>
              </ControlContainer>
              {showFilters ? (
                <ControlContainer style={{ filter: 'saturate(0) contrast(1.4)' }}>
                  <FilterContainer>
                    <div>
                      <ViewControls>
                        <ToggleWrapper>
                          <Toggle checked={perfectOnly} onChange={() => setPerfectOnly(!perfectOnly)} scale="sm" />
                          <Text> {t('Perfect Only')}</Text>
                        </ToggleWrapper>
                      </ViewControls>
                    </div>
                  </FilterContainer>
                </ControlContainer>
              ) : null}
              {selectMode ? (
                <ControlContainer style={{ filter: 'saturate(0) contrast(1.4)' }}>
                  <FilterContainer>
                    <div
                      css={css`
                        button {
                          border: 2px solid rgba(255, 255, 255, 0.2);
                          border-radius: 7px;
                          zoom: 0.8;

                          &.active,
                          &:hover {
                          }
                        }
                      `}
                    >
                      <ViewControls>
                        <Button size="sm" onClick={onPresentListModal} disabled={!Object.keys(selectedItems).length}>
                          List Items
                        </Button>
                      </ViewControls>
                    </div>
                  </FilterContainer>
                </ControlContainer>
              ) : null}

              <Inventory
                address={address}
                columns={columns}
                rows={rows}
                showFull
                filterPerfectOnly={perfectOnly}
                filterSort={sortOption}
                filterQuery={query}
                onItemMultiSelected={onItemMultiSelected}
                selectMode={selectMode}
              />
            </CardBody>
          </Card>
        </VerticalCards>
      </Cards>
    </>
  )
}

export default Me
