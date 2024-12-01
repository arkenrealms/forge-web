import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import {
  Heading,
  Text,
  BaseLayout,
  AutoRenewIcon,
  Button,
  Card3,
  CardBody,
  Skeleton,
  CheckmarkCircleIcon,
  Flex,
  Tag,
  PrizeIcon,
  OpenNewIcon,
  LinkExternal,
  Link,
  BlockIcon,
  ButtonMenu,
  ButtonMenuItem,
} from '~/ui';
import { useTranslation } from 'react-i18next';
import Page from '~/components/layout/Page';
import Skills from '~/components/Skills';
import useCache from '~/hooks/useCache';

const BoxHeading = styled(Heading)`
  text-align: center;
  margin-bottom: 16px;
`;

const Guide: React.FC<any> = () => {
  const { t } = useTranslation();
  const cache = useCache();
  const [tabIndex, setTabIndex] = useState(0);
  // const [onPresentSkillsModal] = useModal(
  //   <Modal title="Skills">
  //     <ModalContent><Skills /></ModalContent>
  //   </Modal>
  // )

  return (
    <Page>
      <Card3>
        <CardBody>
          <BoxHeading as="h2" size="xl">
            {t('Infinite Tutorial')}
          </BoxHeading>
          <Flex flexDirection="column" alignItems="center" justifyContent="center">
            <ButtonMenu activeIndex={tabIndex} scale="md" onItemClick={(index) => setTabIndex(index)}>
              <ButtonMenuItem>General</ButtonMenuItem>
              <ButtonMenuItem>Skills</ButtonMenuItem>
            </ButtonMenu>
            <br />
            <br />
          </Flex>
          {tabIndex === 0 ? (
            <Flex flexDirection="column" alignItems="left" mb="8px" justifyContent="start">
              <Heading color="contrast" size="lg" style={{ textAlign: 'left', marginTop: 20 }}>
                Controls
              </Heading>
              <br />
              <p>
                WASD - Movement
                <br />
                <br />
                LMB on ground - Move in the direction <br />
                <br />
                RMB on ground - Move to position
                <br />
                <br />
                LMB/RMB on enemy - Uses the skill assigned to the mouse key (left or right)
                <br />
                <br />
                Shift + RMB/LMB - Cast without moving
                <br />
                <br />
                1, 2, 3, 4 - Attack skills
                <br />
                <br />
                T - Ultimate skill
                <br />
                <br />
                Q/E - Utility skill
                <br />
                <br />
                Space bar - Special movement skill
                <br />
                <br />
                F/G - Enter arena or quick match (must be near portal)
                <br />
                <br />
                ESC - Menu panel
              </p>
            </Flex>
          ) : null}
          {tabIndex === 1 ? (
            <Flex flexDirection="column" alignItems="left" mb="8px" justifyContent="start">
              <Heading color="contrast" size="lg" style={{ textAlign: 'left', marginTop: 20 }}>
                Skills
              </Heading>
              <br />
              <Skills />
            </Flex>
          ) : null}
        </CardBody>
      </Card3>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </Page>
  );
};

export default Guide;
