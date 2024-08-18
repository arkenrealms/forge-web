import React, { useEffect, useRef, useState, useContext } from 'react'
import useSound from 'use-sound'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { Link, Redirect, useParams } from 'react-router-dom'
import {
  Button,
  Flex,
  BaseLayout,
  Card,
  CardBody,
  Text,
  Toggle,
  CardHeader,
  LinkExternal,
  AutoRenewIcon,
  Heading,
} from '~/ui'
import Input from '~/components/Input/Input'
import Select, { OptionProps } from '~/components/Select/Select'
import ItemCatalog from '~/components/ItemCatalog'
import useGetCatalogItems from '~/hooks/useGetCatalogItems'

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
export default function ({
  rows = 5,
  columns = 7,
  autoColumn = false,
  itemId = null,
  tokens = [],
  rightSidedInfo = false,
  showControls = true,
  sort = 'perfection',
  selectMode = false,
  onItemMultiSelected = null,
  defaultBranch = undefined,
}) {
  const { t } = useTranslation()
  const { nfts, fetchItem } = useGetCatalogItems()
  const [showFilters, setShowFilters] = useState(false)
  const [enableSellMode, setEnableSellMode] = useState(false)

  const refresh = () => {
    if (itemId) {
      fetchItem(itemId)
    }
  }

  const refresh2 = useRef(refresh)

  useEffect(() => {
    console.log('Refreshing from ItemCatalog component')
    refresh2.current()
  }, [refresh2])

  const [perfectOnly, setPerfectOnly] = useState(false)
  const [sortOption, setSortOption] = useState(sort)
  const [query, setQuery] = useState('')

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value.toLowerCase())
  }

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value)
  }

  return (
    <>
      {showControls ? (
        <>
          <ControlContainer style={{ filter: 'saturate(0) contrast(1.9)', zIndex: 999 }}>
            <LabelWrapper>
              <ViewControls>
                <SearchInput onChange={handleChangeQuery} value={query} />
              </ViewControls>
            </LabelWrapper>
            <FilterContainer>
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
                    {
                      label: 'Perfection',
                      value: 'perfection',
                    },
                  ]}
                  onChange={handleSortOptionChange}
                />
              </LabelWrapper>
            </FilterContainer>
          </ControlContainer>
          <ControlContainer style={{ filter: 'saturate(0) contrast(1.4)' }}>
            <FilterContainer>
              <ViewControls>
                <ToggleWrapper>
                  <Toggle checked={showFilters} onChange={() => setShowFilters(!showFilters)} scale="sm" />
                  <Text> {t('Filters')}</Text>
                </ToggleWrapper>
              </ViewControls>
            </FilterContainer>
          </ControlContainer>
          {showFilters ? (
            <ControlContainer style={{ filter: 'saturate(0) contrast(1.4)' }}>
              <FilterContainer>
                <ViewControls>
                  <div>
                    <ViewControls>
                      <ToggleWrapper>
                        <Toggle checked={perfectOnly} onChange={() => setPerfectOnly(!perfectOnly)} scale="sm" />
                        <Text> {t('Perfect Only')}</Text>
                      </ToggleWrapper>
                    </ViewControls>
                  </div>
                </ViewControls>
              </FilterContainer>
            </ControlContainer>
          ) : null}
        </>
      ) : null}

      <ItemCatalog
        nfts={
          itemId && nfts?.[itemId]
            ? nfts[itemId].map((token) => (typeof token === 'string' ? { id: token } : token))
            : tokens.map((token) => ({ id: token }))
        }
        rows={rows}
        columns={columns}
        autoColumn={autoColumn}
        defaultBranch={defaultBranch}
        filterPerfectOnly={perfectOnly}
        filterSort={sortOption}
        filterQuery={query}
        rightSidedInfo={rightSidedInfo}
        onItemMultiSelected={onItemMultiSelected}
        selectMode={selectMode}
      />
    </>
  )
}
