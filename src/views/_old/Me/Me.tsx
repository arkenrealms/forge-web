import React, { useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { Heading, Button, Flex, Toggle, Card, CardBody, Text, BaseLayout } from '~/ui';
import Input from '~/components/Input/Input';
import useMatchBreakpoints from '~/hooks/useMatchBreakpoints';
import { Link as RouterLink } from 'react-router-dom';
import useI18n from '~/hooks/useI18n';
import { useTranslation } from 'react-i18next';
import Page from '~/components/layout/Page';
import PageWindow from '~/components/PageWindow';
import Inventory from '~/components/Inventory';
import Equipment from '~/components/Equipment';
import Select, { OptionProps } from '~/components/Select/Select';
import { useProfile } from '~/state/hooks';

const StyledInput = styled(Input)`
  border-radius: 16px;
  margin-left: auto;
`;

const InputWrapper = styled.div`
  position: relative;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 234px;
    display: block;
  }
`;

const SearchContainer = styled.div<{ toggled: boolean }>``;

interface SearchProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput: React.FC<SearchProps> = ({ value, onChange }) => {
  const [toggled, setToggled] = useState(false);
  const inputEl = useRef(null);

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
  );
};

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
`;

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
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 0px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
    padding: 0;
  }
`;

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
`;

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
`;

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;

  ${Text} {
    margin-left: 8px;
  }
`;

const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
`;

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
`;

const Me: React.FC = () => {
  const { t } = useTranslation();
  const { isMd, isLg, isXl, isXxl, isXxxl } = useMatchBreakpoints();
  const [perfectOnly, setPerfectOnly] = useState(false);
  const [sortOption, setSortOption] = useState('hot');
  const [query, setQuery] = useState('');

  let columns = 4;
  let rows = 10;

  if (isMd) {
    columns = 5;
    rows = 5;
  }
  if (isLg) {
    columns = 5;
    rows = 5;
  }
  if (isXl) {
    columns = 5;
    rows = 5;
  }
  if (isXxl) {
    columns = 6;
    rows = 6;
  }
  if (isXxxl) {
    columns = 8;
    rows = 8;
  }

  const { profile } = useProfile();

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value.toLowerCase());
  };

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value);
  };

  return (
    <Page>
      <Card style={{ width: '100%' }}>
        <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
          {t('My Character')}
        </Heading>
        <hr />
        <CardBody>
          <div
            css={css`
              ${({ theme }) => theme.mediaQueries.lg} {
                float: left;
              }
              margin-bottom: 20px;
              background: url('/images/team/liviu-anime.png') 0px 100% no-repeat;
              width: 200px;
              height: 200px;
              background-size: contain;
              margin-right: 20px;
            `}></div>
          <p>Hey there, Raider!</p>
          <br />
          <p>
            Once you have your glorious Arken items crafted, you can equip them, trade them and more from here. If you
            have any trouble loading, give it a minute or try refreshing the page. If you have no items yet, get going
            and{' '}
            <RouterLink to="/craft" style={{ borderBottom: '1px solid #fff' }}>
              find a Runeform to craft
            </RouterLink>
            !
          </p>
          <br />
          <br />
        </CardBody>
      </Card>
      <br />
      <Cards>
        <VerticalCards>
          <Card style={{ overflow: 'visible', backgroundImage: 'none' }}>
            <CardBody style={{ width: '100%', height: '100%', padding: 0 }}>
              <Flex flexDirection="column" alignItems="center" justifyContent="center">
                <EquipmentContainer>
                  <Equipment>
                    {/* <Heading as="h2" size="xl" m="24px">
                      Equipment
                    </Heading> */}
                    {/* <p>Coming soon</p> */}
                    {/* <p>Drag n drop items from your inventory. Or double click them to bring up the menu.</p> */}
                  </Equipment>
                </EquipmentContainer>
              </Flex>
            </CardBody>
          </Card>
        </VerticalCards>
        <VerticalCards>
          <Card style={{ overflow: 'visible', backgroundImage: 'none' }}>
            <CardBody>
              <ControlContainer style={{ filter: 'saturate(0) contrast(1.9)' }}>
                <LabelWrapper style={{ marginLeft: 16 }}>
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
                      options={[
                        {
                          label: 'Hot',
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
                  <div style={{ marginLeft: 8 }}>
                    <ViewControls>
                      <ToggleWrapper>
                        <Toggle checked={perfectOnly} onChange={() => setPerfectOnly(!perfectOnly)} scale="sm" />
                        <Text> {t('Perfect Only')}</Text>
                      </ToggleWrapper>
                    </ViewControls>
                  </div>
                </FilterContainer>
              </ControlContainer>

              <Inventory
                columns={columns}
                rows={rows}
                showFull
                filterPerfectOnly={perfectOnly}
                filterSort={sortOption}
                filterQuery={query}
              />
            </CardBody>
          </Card>
        </VerticalCards>
      </Cards>
      {/* <Card style={{overflow: 'visible', background: 'url(/images/background.jpeg)'}}>
        <CardBody style={{width: '100%', height: '100%'}}>
          Actions
          <br />
          <br />
          <br />
          <br />
          <Button>Save</Button>
        </CardBody>
      </Card> */}
    </Page>
  );
};

export default Me;
