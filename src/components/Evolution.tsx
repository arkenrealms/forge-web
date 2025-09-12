import React, { useCallback, useEffect, useRef, useState } from 'react';
import utf8 from 'utf8';
import type { ProFormInstance } from '@ant-design/pro-components';
import queryString from 'query-string';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { Unity, useUnityContext } from 'react-unity-webgl';
import { rewardTokenIdMap } from '@arken/node/legacy/data/items';
import { generateShortId } from '@arken/node/util/db';
import { decodeItem } from '@arken/node/util/decoder';
import { sleep } from '@arken/node/util/time';
import { presets } from '@arken/evolution-protocol/presets';
import { Slider } from 'antd';
import styled, { createGlobalStyle, css } from 'styled-components';
import ItemInformation from '~/components/ItemInformation';
import history from '~/routerHistory';
import Page from '~/components/layout/Page';
import { useAuth } from '~/hooks/useAuth';
import Linker from '~/components/Linker';
import { GiCrossedSwords } from 'react-icons/gi';
import Market from '~/components/Market';
import { GiDiceEightFacesEight } from 'react-icons/gi';
import { Navigation, Pagination, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { MdLocationPin } from 'react-icons/md';
import { Modal, useModal } from '~/components/Modal';
import ActionBar from '~/components/ActionBar';
import ActionGrid from '~/components/ActionGrid';
import UpgradeGrid from '~/components/UpgradeGrid';
import Inventory from '~/components/Inventory';
import Rewards from '~/components/Rewards';
import {
  ProForm,
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormMoney,
  ProFormText,
  ProFormSwitch,
} from '@ant-design/pro-components';
import { message } from 'antd';
import useMatchBreakpoints from '~/hooks/useMatchBreakpoints';
import useSettings from '~/hooks/useSettings2';
import { serialize, deserialize } from '@arken/node/util/rpc';
import useWeb3 from '~/hooks/useWeb3';
import { useProfile, useToast } from '~/state/hooks';
import { ConnectNetwork } from '~/components/ConnectNetwork';
import { Var } from '~/components/Var';
import config from '../config';
import {
  BaseLayout,
  Button,
  Card2,
  Card3,
  Card4,
  Card,
  CardBody,
  Flex,
  Heading,
  Link,
  OpenNewIcon,
  Text,
  Toggle,
} from '~/ui';
import { trpc, clients } from '~/utils/trpc';
import type * as Arken from '@arken/node/types';

import addresses from '@arken/node/legacy/contractInfo';
import Item from 'antd/es/list/Item';
import { Col, Row } from 'antd';
import { Avatar, Divider, List, Skeleton } from 'antd';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';

const perks = [
  {
    id: '10001',
    weight: 0.1,
    games: {
      3: {
        name: 'Fire Shield',
        description: 'Acquire: Fire Shield. Chaotic fire surrounds you for 10 seconds.',
      },
      6: {
        name: 'BLM Shield',
        description:
          'Acquire: BLM Shield. Chaotic fire surrounds you for 10 seconds. You feel compelled to burn it all down.',
      },
    },
  },
  {
    id: '10002',
    weight: 0.2,
    games: {
      3: {
        name: 'Burst of Speed',
        description: 'Acquire: Burst of Speed. You feel a sudden urge of energy, gaining +30% speed for 5 seconds.',
      },
      6: {
        name: 'Montana Dash',
        description: 'Acquire: Montana Dash. You feel a sudden urge of energy, gaining +30% speed for 5 seconds.',
      },
    },
  },
  {
    id: '10003',
    weight: 0.1,
    games: {
      3: {
        name: 'Fleet Footed',
        description: 'Acquire: Fleet Footed. You feel more energetic, gaining +10% speed for 30 seconds.',
      },
      6: {
        name: "Forrest Bump's Blessing",
        description: "Acquire: Forrest Bump's Blessing. You feel more energetic, gaining +10% speed for 30 seconds.",
      },
    },
  },
  {
    id: '10004',
    weight: 0.5,
    games: {
      3: {
        name: 'Stone Form',
        description: 'Acquire: Stone Form. You are unable to move, but you take no damage.',
      },
      6: {
        name: 'Hide The Pain',
        description: 'Acquire: Hide The Pain. You are unable to move, but you feel no pain.',
      },
    },
  },
  {
    id: '10005',
    weight: 0.1,
    games: {
      3: {
        name: 'Final Encore',
        description:
          "Acquire: Final Encore. You become charged with the energy of ancestral Bard's, releasing a powerful wave of spirit damage.",
      },
      6: {
        name: "Trump's Last Move",
        description:
          "Acquire: Trump's Last Move. You feel the spirit of Trump enter your body, and bust out a powerful wave of dance moves.",
      },
    },
  },
  {
    id: '10006',
    weight: 0.1,
    games: {
      3: {
        name: 'Bone Wall',
        description: 'Acquire: Bone Wall. You summon a wall of bones for protection.',
      },
      6: {
        name: 'Ego Wall',
        description: 'Acquire: Ego Wall. Blessed by Elon Tusk, you summon a wall to protect your ego.',
      },
    },
  },
  {
    id: '10006',
    weight: 0.1,
    games: {
      3: {
        name: "Zeno's Blessing",
        description: "Acquire: Zeno's Blessing.",
      },
      6: {
        name: "Bald Man's Blessing",
        description: "Acquire: Bald Man's Blessing. You cannot be stopped by Ego Walls.",
      },
    },
  },
];

const drops = [
  {
    name: 'Cosmic Key',
  },
  {
    name: '',
  },
];

const houses = [
  {
    name: 'House of the Dragon',
  },
];

// @ts-ignore
window.unityBridge = {
  name: 'Loading',
};

let focusInterval;
let originalAlert;

const testMode = true;
const logCommonEvents = false;
let gameInitialized = false;
// let accountInitialized = false
let currentPlayerId;
const debug = process.env.NODE_ENV !== 'production';

const contractAddressToKey = {};

for (const contractKey of Object.keys(addresses)) {
  contractAddressToKey[addresses[contractKey][56]] = contractKey;
}

const ModalContent = styled.div`
  margin-bottom: 16px;
  color: #bb955e;
  text-shadow: 1px 1px 1px black;
  font-weight: bold;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end; /* Align children to the right */
  gap: 8px;

  > * {
    max-width: 200px; /* Limit each child's width to 100px */
    flex: 0 0 auto; /* Prevent children from growing */
  }
`;

const BreakModal = ({ onResume, onDismiss }) => {
  const { t } = useTranslation();

  return (
    <Modal
      title="Break Time"
      onDismiss={() => {
        onResume();
        onDismiss();
      }}>
      <ModalContent>
        <Flex flexDirection="column" alignItems="left" mb="8px" justifyContent="start">
          {/* <Heading as="h2" size="xl" color="#fff" mb="24px">
              How To Play
            </Heading> */}
          <Heading color="contrast" size="lg" style={{ marginTop: 20 }}>
            Stay Hydrated!
          </Heading>
          <br />
          <HelpText>You died. This popup didn't kill you. Time to take a break!</HelpText>
          <br />
          <HelpText>Make sure you take a break to stretch your legs and drink water.</HelpText>
          <br />
          <br />
        </Flex>
      </ModalContent>
      <Actions>
        <Button
          width="100%"
          variant="secondary"
          onClick={() => {
            onResume();
            onDismiss();
          }}>
          Back
        </Button>
      </Actions>
    </Modal>
  );
};

const RulesModal = ({ onResume, onDismiss }) => {
  const { t } = useTranslation();

  return (
    <Modal
      title="Rules"
      onDismiss={() => {
        onResume();
        onDismiss();
      }}>
      <ModalContent>
        <Flex flexDirection="column" alignItems="left" mb="8px" justifyContent="start">
          {/* <Heading as="h2" size="xl" color="#fff" mb="24px">
              How To Play
            </Heading> */}
          <HelpText>
            Please play clean. Play one game client, play normally, play to win. We will sometimes temporarily restrict
            accounts that are reported for breaking the rules. Permanent bans are rare, but you should read the rules
            carefully:
            <br />
            <ul>
              <li>No teaming up. There are no team game modes yet.</li>
              <li>No purposefully using walls to teleport multiple times to avoid death.</li>
              <li>No playing 2 servers at same time.</li>
              <li>No sharing accounts. 1 account = 1 player = 1 server.</li>
              <li>No using third-party tools to get an advantage.</li>
              <li>No running the game client twice to increase rewards or get an advantage against other players.</li>
              <li>
                No spectating on a different PC to see the map. It will be obvious if you know where everyone and every
                item is, and other players will report you.
              </li>
              <li>No "wintrading" ie. trading kills to a different player so alternate wins.</li>
              <li>
                No "feeding" ie. purposefully dying to help somebody else win. Even if you know you're going to lose,
                it's not fair to give kills to a specific player. If you have a bad connection are constantly being
                killed by the same player, other players will think you are feeding them and your account may be
                restricted.
              </li>
              <li>
                If you find an exploit and use it <strong>purposefully</strong> instead of reporting it, that is
                considered cheating.
              </li>
            </ul>
            <br />
            <br />
            If we believe you are intentionally not playing the game normally or circumventing normal gameplay, you may
            be temporarily restricted from playing for 24 hours or 48 hours, 1 week, or 1 month.
            <br />
            <br />
            If you aren't sure something is againt the rules, just ask.
          </HelpText>
          <br />
          <HelpText>
            If you are permanently banned, you will lose access to Arken games and will not receive rewards. It's
            against the rules to circumvent the ban by creating a new account. If it is proven you've done this, you
            will be banned again.
          </HelpText>
          <br />
          <br />
        </Flex>
      </ModalContent>
      <Actions>
        <Button
          width="100%"
          variant="secondary"
          onClick={() => {
            onResume();
            onDismiss();
          }}>
          Back
        </Button>
      </Actions>
    </Modal>
  );
};

const PartyMember = ({ data }) => {
  return (
    <div>
      {data.level}
      <br />
      {data.name}
      <br />
      {data.power}
      <br />
      {data.area?.name}
      <br />
      {data.area?.channel}
    </div>
  );
};

const PartyModal = () => {
  const { t } = useTranslation();

  const party = {
    name: 'Party Name',
    targetArea: {
      name: 'Mage Isles',
    },
    itemDistribution: 'Random',
  };
  const members = [
    {
      name: 'AAA',
      power: 12000000,
      level: 97,
      isLeader: true,
      team: {
        icon: 'aaaa.png',
      },
      area: {
        name: 'Mage Isles',
        channel: 'CH 1',
      },
    },
    {
      name: 'AAA',
      power: 12000000,
      level: 97,
      isLeader: true,
      team: {
        icon: 'aaaa.png',
      },
      area: {
        name: 'Mage Isles',
        channel: 'CH 1',
      },
    },
    {
      name: 'AAA',
      power: 12000000,
      level: 97,
      isLeader: true,
      team: {
        icon: 'aaaa.png',
      },
      area: {
        name: 'Mage Isles',
        channel: 'CH 1',
      },
    },
    {
      name: 'AAA',
      power: 12000000,
      level: 97,
      isLeader: true,
      team: {
        icon: 'aaaa.png',
      },
      area: {
        name: 'Mage Isles',
        channel: 'CH 1',
      },
    },
    {
      name: 'AAA',
      power: 12000000,
      level: 97,
      isLeader: true,
      team: {
        icon: 'aaaa.png',
      },
      area: {
        name: 'Mage Isles',
        channel: 'CH 1',
      },
    },
  ];
  const [isEditingSettings, setIsEditingSettings] = useState(false);

  const isLeader = true;

  return (
    <Modal title="Manage Party" onDismiss={() => {}} style={{ minWidth: 900 }}>
      <ModalContent>
        {isEditingSettings ? (
          <>Editing</>
        ) : (
          <>
            <Row
              gutter={[16, 16]}
              css={css`
                margin-bottom: 20px;
                span {
                  font-size: 1.1rem;
                }
              `}>
              <Col span={8}>
                <Var icon={<GiCrossedSwords />} title="Party Name">
                  {party.name}
                </Var>
              </Col>
              <Col span={8}>
                <Var icon={<MdLocationPin />} title="Target Area">
                  {party.targetArea.name}
                </Var>
              </Col>
              <Col span={8}>
                <Var icon={<GiDiceEightFacesEight />} title="Item Distribution">
                  {party.itemDistribution}
                </Var>
              </Col>
            </Row>
            <Swiper
              modules={[Navigation, Pagination, Scrollbar]}
              spaceBetween={30}
              slidesPerView={5}
              navigation
              style={{ maxWidth: 1200, margin: '0 auto 30px auto', padding: '0 20px' }}>
              {members.map((item) => (
                <SwiperSlide style={{ maxWidth: 1200, margin: '0 auto', height: 'auto' }}>
                  <PartyMember data={item} />
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        )}
      </ModalContent>
      <Actions>
        <Button width="100%" variant="secondary" onClick={() => setIsEditingSettings(!isEditingSettings)}>
          {isEditingSettings ? 'Save Settings' : 'Edit Settings'}
        </Button>
        {!isEditingSettings && isLeader ? (
          <Button width="100%" variant="secondary" onClick={() => {}}>
            Disband Party
          </Button>
        ) : null}
        {!isEditingSettings ? (
          <Button width="100%" variant="secondary" onClick={() => {}}>
            Leave Party
          </Button>
        ) : null}
      </Actions>
    </Modal>
  );
};

const GuildModal = () => {
  const { t } = useTranslation();

  const guild = null;
  // {
  //   name: 'Guild Name',
  // };
  const members = [
    {
      name: 'AAA',
      power: 12000000,
      level: 97,
      isLeader: true,
      team: {
        icon: 'aaaa.png',
      },
      area: {
        name: 'Mage Isles',
        channel: 'CH 1',
      },
    },
    {
      name: 'AAA',
      power: 12000000,
      level: 97,
      isLeader: true,
      team: {
        icon: 'aaaa.png',
      },
      area: {
        name: 'Mage Isles',
        channel: 'CH 1',
      },
    },
    {
      name: 'AAA',
      power: 12000000,
      level: 97,
      isLeader: true,
      team: {
        icon: 'aaaa.png',
      },
      area: {
        name: 'Mage Isles',
        channel: 'CH 1',
      },
    },
    {
      name: 'AAA',
      power: 12000000,
      level: 97,
      isLeader: true,
      team: {
        icon: 'aaaa.png',
      },
      area: {
        name: 'Mage Isles',
        channel: 'CH 1',
      },
    },
    {
      name: 'AAA',
      power: 12000000,
      level: 97,
      isLeader: true,
      team: {
        icon: 'aaaa.png',
      },
      area: {
        name: 'Mage Isles',
        channel: 'CH 1',
      },
    },
  ];
  const [isEditingSettings, setIsEditingSettings] = useState(false);

  const isLeader = true;

  const formRef = useRef();

  return (
    <Modal title="Guild Information" onDismiss={() => {}} style={{ minWidth: 900 }}>
      <ModalContent>
        {guild ? (
          <>
            {isEditingSettings ? (
              <>Editing</>
            ) : (
              <>
                <Row
                  gutter={[16, 16]}
                  css={css`
                    margin-bottom: 20px;
                    span {
                      font-size: 1.1rem;
                    }
                  `}>
                  <Col span={8}>
                    <Var icon={<GiCrossedSwords />} title="Guild Name">
                      {guild.name}
                    </Var>
                  </Col>
                </Row>
                <Swiper
                  modules={[Navigation, Pagination, Scrollbar]}
                  spaceBetween={30}
                  slidesPerView={5}
                  navigation
                  style={{ maxWidth: 1200, margin: '0 auto 30px auto', padding: '0 20px' }}>
                  {members.map((item) => (
                    <SwiperSlide style={{ maxWidth: 1200, margin: '0 auto', height: 'auto' }}>
                      <PartyMember data={item} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </>
            )}
          </>
        ) : (
          <>
            Create guild
            <ProForm
              onFinish={async (values) => {
                console.log('Submitted Values:', values);
                // await waitTime(2000);
                // console.log(values);
                // const val1 = await formRef.current?.validateFields();
                // console.log('validateFields:', val1);
                // const val2 =
                //   await formRef.current?.validateFieldsReturnFormatValue?.();
                // console.log('validateFieldsReturnFormatValue:', val2);
                message.success('提交成功');
              }}
              formRef={formRef}
              params={{ id: '100' }}
              formKey="base-form-use-demo"
              initialValues={{
                amount6: 2222222222.222222,
              }}
              // readonly={readonly}
              request={async () => {
                // await waitTime(100);
                return {
                  name: '蚂蚁设计有限公司',
                  useMode: 'chapter',
                };
              }}
              autoFocusFirstInput>
              <ProFormText
                name="name"
                label="实验名称"
                width="md"
                tooltip="最长为 24 位，用于标定的唯一 id"
                placeholder="请输入名称"
                rules={[{ required: true }]}
              />
              <ProFormMoney label="小数点精度-0" name="amount6" customSymbol="💰" />
            </ProForm>
          </>
        )}
      </ModalContent>
      <Actions>
        <Button width="100%" variant="secondary" onClick={() => setIsEditingSettings(!isEditingSettings)}>
          {isEditingSettings ? 'Save Settings' : 'Edit Settings'}
        </Button>
        {!isEditingSettings && isLeader ? (
          <Button width="100%" variant="secondary" onClick={() => {}}>
            Disband Guild
          </Button>
        ) : null}
        {!isEditingSettings ? (
          <Button width="100%" variant="secondary" onClick={() => {}}>
            Leave Guild
          </Button>
        ) : null}
      </Actions>
    </Modal>
  );
};

const MarketModal = () => {
  return (
    <Modal title="Market" onDismiss={() => {}} style={{ minWidth: 900 }}>
      <ModalContent>
        <Market />
      </ModalContent>
      <Actions></Actions>
    </Modal>
  );
};

const InventoryModal = ({ account }) => {
  const { data: profile } = trpc.seer.profile.getProfile.useQuery<Arken.Profile.Types.Profile>({
    where: { address: { equals: account || '0x1a367CA7bD311F279F1dfAfF1e60c4d797Faa6eb' } },
  });

  const items = profile?.character?.items || [];

  return (
    <Modal title="Inventory" onDismiss={() => {}} style={{ minWidth: 900 }}>
      <ModalContent>
        {/* <Card style={{ textAlign: 'center', zoom: '0.6' }}>
          <CardBody>
            <h2>Inventory</h2>
          </CardBody>
          <CardBody>
            <img
              src={'/images/rewards/Santa Christmas 2024 Ticket.png'}
              css={css`
                width: 40px;
                height: 40px;
                margin-bottom: 10px;
              `}
            />
            <div
              css={css`
                font-weight: bold;
                font-size: 1.1rem;
              `}>
              {auth?.profile?.meta?.rewards?.tokens?.['christmas2024'] || 0} Hats
            </div>
          </CardBody>
          <CardBody>
            <img
              src={'/images/rewards/doge.png'}
              css={css`
                width: 40px;
                height: 40px;
                margin-bottom: 10px;
              `}
            />
            <div
              css={css`
                font-weight: bold;
                font-size: 1.1rem;
              `}>
              {auth?.profile?.meta?.rewards?.tokens?.['doge'] || 0} DOGE
            </div>
          </CardBody>
          <CardBody>
            <img
              src={'/images/rewards/pepe.png'}
              css={css`
                width: 40px;
                height: 40px;
                margin-bottom: 10px;
              `}
            />
            <div
              css={css`
                font-weight: bold;
                font-size: 1.1rem;
              `}>
              {auth?.profile?.meta?.rewards?.tokens?.['pepe'] || 0} PEPE
            </div>
          </CardBody>
          <CardBody>
            <img
              src={'/images/rewards/harold.png'}
              css={css`
                width: 40px;
                height: 40px;
                margin-bottom: 10px;
              `}
            />
            <div
              css={css`
                font-weight: bold;
                font-size: 1.1rem;
              `}>
              {auth?.profile?.meta?.rewards?.tokens?.['harold'] || 0} HAROLD
            </div>
          </CardBody>
          <CardBody>
            <Button size="sm" onClick={() => history.push('/account/rewards')}>
              Claim
            </Button>
          </CardBody>
        </Card> */}
        <Inventory columns={6} rows={7} showFull hideExtras items={items} />
      </ModalContent>
      <Actions></Actions>
    </Modal>
  );
};

const SettingsModal = ({ auth }) => {
  // @ts-ignore
  const { mutateAsync: updateSettings } = trpc.seer.evolution.updateSettings.useMutation();
  const [values, setValues] = useState({});

  return (
    <Modal title="Settings" onDismiss={() => {}} style={{ minWidth: 900 }}>
      <ModalContent>
        <Heading>UI</Heading>
        <ProForm
          onFinish={async () => {
            console.log('onFinish', values);
            updateSettings(values);

            message.success('Settings saved');
          }}
          submitter={{
            searchConfig: {
              submitText: 'Save',
            },
          }}
          initialValues={{
            zoom: 0.7,
            opacity: 1,
            ...(auth?.profile?.meta?.evolution?.settings || {}),
          }}
          autoFocusFirstInput>
          <h4>Zoom</h4>
          <Slider
            step={0.05}
            defaultValue={auth?.profile?.meta?.evolution?.settings?.zoom || 0.7}
            min={0}
            max={1}
            onChange={(zoom: any) => {
              setValues({
                ...values,
                zoom,
              });
            }}
          />
          <h4>Opacity</h4>
          <Slider
            step={0.05}
            defaultValue={auth?.profile?.meta?.evolution?.settings?.opacity || 1}
            min={0}
            max={1}
            onChange={(opacity: any) => {
              setValues({
                ...values,
                opacity,
              });
            }}
          />
          {auth?.profile?.address === '0x954246b18fee13712C48E5a7Da5b78D88e8891d5' ? (
            <>
              <Button
                onClick={async (e) => {
                  e.stopPropagation();
                  e.preventDefault();

                  login(auth);

                  await sleep(1000);

                  // @ts-ignore
                  window.socket.emit('trpc', {
                    id: generateShortId(),
                    method: 'initMaster',
                    type: 'mutate',
                    params: {},
                  });
                }}>
                Claim Master
              </Button>
            </>
          ) : null}
        </ProForm>
      </ModalContent>
      <Actions></Actions>
    </Modal>
  );
};

const CraftModal = () => {
  return (
    <Modal title="Craft" onDismiss={() => {}} style={{ minWidth: 900 }}>
      <ModalContent>Coming soon</ModalContent>
      <Actions></Actions>
    </Modal>
  );
};

const LeaderboardModal = () => {
  return (
    <Modal title="Leaderboard" onDismiss={() => {}} style={{ minWidth: 900 }}>
      <ModalContent>Coming soon</ModalContent>
      <Actions></Actions>
    </Modal>
  );
};

const PVPModal = () => {
  return (
    <Modal title="PVP" onDismiss={() => {}} style={{ minWidth: 900 }}>
      <ModalContent>Coming soon</ModalContent>
      <Actions></Actions>
    </Modal>
  );
};

const ChestModal = () => {
  return (
    <Modal title="Rewards" onDismiss={() => {}} style={{ minWidth: 900 }}>
      <ModalContent>
        <Rewards />
      </ModalContent>
      <Actions></Actions>
    </Modal>
  );
};

const QuestModal = () => {
  return (
    <Modal title="Quests" onDismiss={() => {}} style={{ minWidth: 900 }}>
      <ModalContent>Coming soon</ModalContent>
      <Actions>
        <Button width="100%" variant="secondary">
          Close
        </Button>
      </Actions>
    </Modal>
  );
};

const EventsModal = () => {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <Modal title="Events" onDismiss={() => {}} style={{ minWidth: 900, maxWidth: '90%' }}>
      <ModalContent>
        <div
          id="scrollableDiv"
          style={{
            height: 400,
            overflow: 'auto',
            padding: '0 16px',
            border: '1px solid rgba(140, 140, 140, 0.35)',
          }}>
          <List
            dataSource={[
              {
                name: 'January Calendar',
                description: 'asdas',
                type: 'Calendar',
                id: 'adas',
                startDate: '',
                endDate: '',
                hideDate: '',
                groups: [
                  {
                    name: 'Adventure',
                    items: [
                      {
                        id: 'asdasd',
                        name: '1',
                        image: '',
                        quantity: 1,
                        isClaimed: true,
                        isLocked: false,
                        unlockDate: '',
                      },
                      {
                        id: 'asdasd',
                        name: '2',
                        image: '',
                        quantity: 1,
                        isClaimed: false,
                        isLocked: false,
                        unlockDate: '',
                      },
                      {
                        id: 'asdasd',
                        name: '3',
                        image: '',
                        quantity: 1,
                        isClaimed: false,
                        isLocked: true,
                        unlockDate: '',
                      },
                    ],
                  },
                  {
                    name: 'Collector Points',
                    requiredPoints: 150,
                    items: [
                      {
                        id: 'asdasd',
                        name: '',
                        image: '',
                        quantity: 1,
                        isLocked: true,
                        pointsType: 'CP',
                        pointsRequired: 150,
                      },
                    ],
                  },
                  {
                    name: 'Collector Points',
                    requiredPoints: 300,
                    items: [
                      {
                        id: 'asdasd',
                        name: '',
                        image: '',
                        quantity: 1,
                        isLocked: true,
                        pointsType: 'CP',
                        pointsRequired: 300,
                      },
                    ],
                  },
                ],
              },
              {
                name: 'Daily Collector',
                description: '',
                type: 'Collector',
                id: 'adas2',
                startDate: '',
                endDate: '',
                hideDate: '',
                groups: [
                  {
                    name: 'Collector Points',
                    requiredPoints: 100,
                    items: [
                      {
                        id: 'asdasd',
                        name: '',
                        image: '',
                        quantity: 1,
                        isLocked: true,
                        pointsType: 'CP',
                        pointsRequired: 100,
                      },
                    ],
                  },
                  {
                    name: 'Collector Points',
                    requiredPoints: 150,
                    items: [
                      {
                        id: 'asdasd',
                        name: '',
                        image: '',
                        quantity: 1,
                        isLocked: true,
                        pointsType: 'CP',
                        pointsRequired: 150,
                      },
                    ],
                  },
                  {
                    name: 'Collector Points',
                    requiredPoints: 300,
                    items: [
                      {
                        id: 'asdasd',
                        name: '',
                        image: '',
                        quantity: 1,
                        isLocked: true,
                        pointsType: 'CP',
                        pointsRequired: 300,
                      },
                    ],
                  },
                ],
              },
              {
                name: 'Weekly Collector',
                description: '',
                type: 'Collector',
                id: 'adas23',
                startDate: '',
                endDate: '',
                hideDate: '',
                groups: [
                  {
                    name: 'Collector Points',
                    requiredPoints: 100,
                    items: [
                      {
                        id: 'asdasd',
                        name: '',
                        image: '',
                        quantity: 1,
                        isLocked: true,
                        pointsType: 'CP',
                        pointsRequired: 100,
                      },
                    ],
                  },
                  {
                    name: 'Collector Points',
                    requiredPoints: 150,
                    items: [
                      {
                        id: 'asdasd',
                        name: '',
                        image: '',
                        quantity: 1,
                        isLocked: true,
                        pointsType: 'CP',
                        pointsRequired: 150,
                      },
                    ],
                  },
                  {
                    name: 'Collector Points',
                    requiredPoints: 300,
                    items: [
                      {
                        id: 'asdasd',
                        name: '',
                        image: '',
                        quantity: 1,
                        isLocked: true,
                        pointsType: 'CP',
                        pointsRequired: 300,
                      },
                    ],
                  },
                ],
              },
              {
                name: 'Evolution Pass 1',
                description: 'asdas',
                type: 'Battlepass',
                subtype: 'Season Pass',
                id: 'asdsa',
                startDate: '',
                endDate: '',
                hideDate: '',
                groups: [
                  {
                    name: 'Battle',
                    isLocked: false,
                    items: [
                      {
                        id: 'asdasd',
                        name: '',
                        image: '',
                        quantity: 1,
                        isLocked: true,
                        pointsType: 'BP',
                        pointsRequired: 100,
                      },
                      {
                        id: 'asdasd',
                        name: '',
                        image: '',
                        quantity: 1,
                        isLocked: true,
                        pointsType: 'BP',
                        pointsRequired: 100,
                      },
                      {
                        id: 'asdasd',
                        name: '',
                        image: '',
                        quantity: 1,
                        isLocked: true,
                        pointsType: 'BP',
                        pointsRequired: 100,
                      },
                      {
                        id: 'asdasd',
                        name: '',
                        image: '',
                        quantity: 1,
                        isLocked: true,
                        pointsType: 'BP',
                        pointsRequired: 100,
                      },
                      {
                        id: 'asdasd',
                        name: '',
                        image: '',
                        quantity: 1,
                        isLocked: true,
                        pointsType: 'BP',
                        pointsRequired: 100,
                      },
                      {
                        id: 'asdasd',
                        name: '',
                        image: '',
                        quantity: 1,
                        isLocked: true,
                        pointsType: 'BP',
                        pointsRequired: 100,
                      },
                    ],
                  },
                  {
                    name: 'Exalted',
                    isLocked: true,
                    items: [
                      {
                        id: 'asdasd',
                        name: '',
                        image: '',
                        quantity: 1,
                        isLocked: true,
                        pointsType: 'AP',
                        pointsRequired: 100000,
                      },
                    ],
                  },
                ],
              },
            ]}
            renderItem={(item) => (
              <List.Item key={item.id}>
                <List.Item.Meta
                  title={
                    <div
                      onClick={() => {
                        setSelectedItem(item);
                      }}>
                      {item.name}
                    </div>
                  }
                  description={item.description}
                />
              </List.Item>
            )}
          />
        </div>
        {selectedItem?.type === 'Calendar' ? (
          <div>
            <h2>Wisp Festival</h2>
            <h3>The </h3>
          </div>
        ) : selectedItem?.type === 'Collector' ? (
          <div>
            <h2>Wisp Festival</h2>
            <h3>The </h3>
          </div>
        ) : selectedItem?.type === 'Collector' ? (
          <div>
            <h2>Wisp Festival</h2>
            <h3>The </h3>
          </div>
        ) : selectedItem?.type === 'Battlepass' ? (
          <div>
            <h3>{selectedItem.subtype}</h3>
            <h2>{selectedItem.name}</h2>
            {selectedItem.groups.map((group: any) => (
              <>
                <>{group.name}</>
                <Swiper
                  modules={[Navigation, Pagination]}
                  slidesPerView={5}
                  slidesPerGroup={5}
                  spaceBetween={30}
                  style={{ margin: '0 auto 30px auto', padding: '0 20px' }}>
                  {group.items.map((item: any) => (
                    <SwiperSlide style={{ width: 75, margin: '0 auto', height: 75 }}>
                      {item.name}
                      {item.quantity}
                      {item.image}
                      {item.isLocked}
                      {item.pointsType}
                      {item.pointsRequired}
                    </SwiperSlide>
                  ))}
                </Swiper>
              </>
            ))}
          </div>
        ) : null}
      </ModalContent>
      <Actions></Actions>
    </Modal>
  );
};

const TokenModal = ({ onResume, onDismiss, reward }) => {
  const { t } = useTranslation();

  return (
    <Modal
      title={reward.rewardItemName}
      onDismiss={() => {
        onResume();
        onDismiss();
      }}>
      <ModalContent>
        <Flex flexDirection="column" alignItems="left" mb="8px" justifyContent="start">
          {/* <Heading as="h2" size="xl" color="#fff" mb="24px">
              How To Play
            </Heading> */}
          <HelpText>{reward.shortDescription}</HelpText>
          <br />
          <HelpText>{reward.longDescription}</HelpText>
          <br />
          <br />
        </Flex>
      </ModalContent>
      <Actions>
        <Button
          width="100%"
          variant="secondary"
          onClick={() => {
            onResume();
            onDismiss();
          }}>
          Back
        </Button>
      </Actions>
    </Modal>
  );
};
const RewardModal = ({ onResume, onDismiss }) => {
  const { t } = useTranslation();

  return (
    <Modal
      title="Rewards"
      onDismiss={() => {
        onResume();
        onDismiss();
      }}>
      <ModalContent>
        <Flex flexDirection="column" alignItems="left" mb="8px" justifyContent="start">
          <HelpText>Rewards</HelpText>
          <br />
        </Flex>
      </ModalContent>
      <Actions>
        <Button
          width="100%"
          variant="secondary"
          onClick={() => {
            onResume();
            onDismiss();
          }}>
          Back
        </Button>
      </Actions>
    </Modal>
  );
};
const WarningsModal = ({ onResume, onDismiss }) => {
  const { t } = useTranslation();

  return (
    <Modal
      title="Warnings"
      onDismiss={() => {
        onResume();
        onDismiss();
      }}>
      <ModalContent>
        <Flex flexDirection="column" alignItems="left" mb="8px" justifyContent="start">
          <HelpText>
            <em>This video game may trigger seizures for people with photosensitive epilepsy.</em>
          </HelpText>
          <br />
          <br />
        </Flex>
      </ModalContent>
      <Actions>
        <Button
          width="100%"
          variant="secondary"
          onClick={() => {
            onResume();
            onDismiss();
          }}>
          Back
        </Button>
      </Actions>
    </Modal>
  );
};

const Cards = styled(BaseLayout)`
  align-items: flex-start;
  justify-content: stretch;
  margin-bottom: 32px;

  & > div {
    grid-column: span 12;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    & > div {
      grid-column: span 4;
      min-height: 550px;
    }
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
  width: 100%;
  margin-bottom: 10px;

  ${Text} {
    margin-left: 8px;
  }
`;

const HeadingFire = styled.div<{
  fireStrength: number;
  color1: string;
  color2: string;
  color3: string;
  color4: string;
}>`
  text-align: center;
  background-image: -webkit-linear-gradient(
    top,
    #bcbcbc 0%,
    #bcbcbc 17.5%,
    #cecece 33.75%,
    #f0f0f0 50%,
    #cecece 63.75%,
    #bcbcbc 77.5%,
    #bcbcbc 100%
  );
  -webkit-background-clip: text;
  // -webkit-text-fill-color: transparent;
  // filter: sepia(1) saturate(5) hue-rotate(-25deg);
  // sepia(1) saturate(5) hue-rotate(-25deg) grayscale(1) drop-shadow(0px 0px 10px #000) invert(1)

  -webkit-animation: fire 0.4s infinite;

  @keyframes fire {
    0% {
      text-shadow:
        0 0 2px ${(props) => props.color1},
        0 ${(props) => props.fireStrength * -5}px ${(props) => props.fireStrength * 4}px ${(props) => props.color2},
        ${(props) => props.fireStrength * 2}px ${(props) => props.fireStrength * -10}px
          ${(props) => props.fireStrength * 6}px ${(props) => props.color1},
        ${(props) => props.fireStrength * -2}px ${(props) => props.fireStrength * -15}px
          ${(props) => props.fireStrength * 11}px ${(props) => props.color3},
        ${(props) => props.fireStrength * -2}px ${(props) => props.fireStrength * -25}px
          ${(props) => props.fireStrength * 18}px ${(props) => props.color4};
    }
    25% {
      text-shadow:
        0 0 3px ${(props) => props.color1},
        ${(props) => props.fireStrength * 1}px ${(props) => props.fireStrength * -6}px
          ${(props) => props.fireStrength * 5}px ${(props) => props.color2},
        ${(props) => props.fireStrength * 1}px ${(props) => props.fireStrength * -11}px
          ${(props) => props.fireStrength * 7}px ${(props) => props.color1},
        ${(props) => props.fireStrength * -2}px ${(props) => props.fireStrength * -16}px
          ${(props) => props.fireStrength * 13}px ${(props) => props.color3},
        ${(props) => props.fireStrength * -0}px ${(props) => props.fireStrength * -26}px
          ${(props) => props.fireStrength * 20}px ${(props) => props.color4};
    }
    50% {
      text-shadow:
        0 0 3px ${(props) => props.color1},
        ${(props) => props.fireStrength * -1}px ${(props) => props.fireStrength * -4}px
          ${(props) => props.fireStrength * 6}px ${(props) => props.color2},
        ${(props) => props.fireStrength * 0}px ${(props) => props.fireStrength * -12}px
          ${(props) => props.fireStrength * 6}px ${(props) => props.color1},
        ${(props) => props.fireStrength * -3}px ${(props) => props.fireStrength * -16}px
          ${(props) => props.fireStrength * 15}px ${(props) => props.color3},
        ${(props) => props.fireStrength * -1}px ${(props) => props.fireStrength * -28}px
          ${(props) => props.fireStrength * 22}px ${(props) => props.color4};
    }
    75% {
      text-shadow:
        0 0 2px ${(props) => props.color1},
        ${(props) => props.fireStrength * 1}px ${(props) => props.fireStrength * -7}px
          ${(props) => props.fireStrength * 4}px ${(props) => props.color2},
        ${(props) => props.fireStrength * 1}px ${(props) => props.fireStrength * -11}px
          ${(props) => props.fireStrength * 8}px ${(props) => props.color1},
        ${(props) => props.fireStrength * -1}px ${(props) => props.fireStrength * -14}px
          ${(props) => props.fireStrength * 12}px ${(props) => props.color3},
        ${(props) => props.fireStrength * -2}px ${(props) => props.fireStrength * -25}px
          ${(props) => props.fireStrength * 21}px ${(props) => props.color4};
    }
    100% {
      text-shadow:
        0 0 2px ${(props) => props.color1},
        0 ${(props) => props.fireStrength * -5}px ${(props) => props.fireStrength * 4}px ${(props) => props.color2},
        ${(props) => props.fireStrength * 2}px ${(props) => props.fireStrength * -10}px
          ${(props) => props.fireStrength * 6}px ${(props) => props.color1},
        ${(props) => props.fireStrength * -2}px ${(props) => props.fireStrength * -15}px
          ${(props) => props.fireStrength * 11}px ${(props) => props.color3},
        ${(props) => props.fireStrength * -2}px ${(props) => props.fireStrength * -25}px
          ${(props) => props.fireStrength * 18}px ${(props) => props.color4};
    }
  }
`;

const SpecialButton = styled.div<{ title: string }>`
  position: relative;
  // height: 110px;
  // width: 260px;
  // padding: 44px 132px;
  // border-width: 44px 132px;
  // border-style: solid;
  // border-color: rgba(0, 0, 0, 0);
  // border-image-source: url(/images/special-button.png);
  // border-image-slice: 110 330 fill;
  padding: 0 0 50px 0;
  cursor: url('/images/cursor3.png'), pointer;
  font-family: 'webfontexl', 'Palatino Linotype', 'Times', serif !important;
  text-transform: uppercase;
  background-color: #642c08;
  border-radius: 10px;
  padding: 30px 103px;
  filter: drop-shadow(rgba(0, 0, 0, 0.6) 1px 1px 1px) drop-shadow(rgba(0, 0, 0, 0.6) 0px 0px 4px);
  box-shadow: 0px -1px 0px 0px rgb(14 14 44 / 40%) inset;

  &:before {
    content: '${({ title }) => title}';
    position: absolute;
    top: 0;
    color: #000;
    white-space: nowrap;
    font-size: 24px;
    left: 20px;
    top: 20px;
  }

  filter: contrast(1.2);
  &:hover {
    filter: contrast(1.3) brightness(1.3);
  }
`;

const HelpText = styled.p`
  font-size: 0.9rem;
  line-height: 1.3rem;
  font-family: 'Alegreya Sans', Cambria, Verdana, Arial, Helvetica, sans-serif;
  text-transform: none;

  li {
    font-size: 0.9rem;
  }
`;

const StyledNotFound = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 125px);
  justify-content: center;
`;

const log = (...args) => {
  if (debug) console.info(...args);
};

const RewardCardContainer = styled(Flex)`
  padding: 10px;
  margin-bottom: 10px;
`;

const RewardCardRune = ({ reward }) => {
  return (
    <RewardCardContainer>
      <Text>{reward.quantity} Rune</Text>
    </RewardCardContainer>
  );
};

// const getSocket = (endpoint) => {
//   console.log('Connecting to', endpoint);
//   return io(endpoint, {
//     transports: ['websocket'],
//     upgrade: false,
//     // extraHeaders: {
//     //   "my-custom-header": "1234"
//     // }
//   });
// };

const RewardCardItem = ({ reward }) => {
  reward.tokenId = rewardTokenIdMap[reward.name][reward.rarity];

  const item = decodeItem(reward.tokenId);
  return (
    <RewardCardContainer>
      <ItemInformation item={item} showActions={false} hideMetadata quantity={reward.quantity} showBranches={false} />
    </RewardCardContainer>
  );
};

// const RewardCard = ({ reward }) => {
//   return <RewardCardItem reward={reward} />;
// };

// const sendUserInfo = (username, address, isMobile, signature) => {};

// const goFullscreen = () => {
//   if (!gameCanvas) return;
//   // const ActivateFullscreen = function()
//   // {
//   if (gameCanvas.requestFullscreen) {
//     /* API spec */
//     gameCanvas.requestFullscreen();
//   }
//   // @ts-ignore
//   else if (gameCanvas.mozRequestFullScreen) {
//     /* Firefox */
//     // @ts-ignore
//     gameCanvas.mozRequestFullScreen();
//   }
//   // @ts-ignore
//   else if (gameCanvas.webkitRequestFullscreen) {
//     /* Chrome, Safari and Opera */
//     // @ts-ignore
//     gameCanvas.webkitRequestFullscreen();
//   }
//   // @ts-ignore
//   else if (gameCanvas.msRequestFullscreen) {
//     /* IE/Edge */
//     // @ts-ignore
//     gameCanvas.msRequestFullscreen();
//   }
// };

// let gameCanvas;

const localConfig = {
  username: 'Testman', // || 'Guest' + Math.floor(Math.random() * 999),
  address: '0x1a367CA7bD311F279F1dfAfF1e60c4d797Faa6eb',
  isMobile: false,
};

// const formatCountdown = (secs) => {
//   function pad(n) {
//     return n < 10 ? '0' + n : n;
//   }

//   const h = Math.floor(secs / 3600);
//   const m = Math.floor(secs / 60) - h * 60;
//   const s = Math.floor(secs - h * 3600 - m * 60);

//   return pad(m) + ':' + pad(s); // pad(h) +":"+
// };

const parseMatch = (location) => {
  const match = {
    params: queryString.parse(location?.search || ''),
  };

  for (const key in match.params) {
    if (match.params[key] === 'false') {
      // @ts-ignore
      match.params[key] = false;
    } else if (match.params[key] === 'true') {
      // @ts-ignore
      match.params[key] = true;
    }
  }

  return match;
};

const GlobalStyles = createGlobalStyle`
#server-menu > div {
  display: block;
}
`;

const BoxHeading = styled(Heading)`
  margin-bottom: 16px;
`;

// const LogoImg = styled.img``;
// const BigCard = styled.div<{ align?: string }>`
//   color: ${({ theme }) => theme.colors.text};
//   position: relative;

//   border-width: 10px 10px;
//   border-style: solid;
//   border-color: transparent;

//   border-image-width: 80px;
//   background-color: rgba(0, 0, 0, 0.4);

//   background-size: 400px;
//   // background-color: rgba(0,0,0,0.4);
//   line-height: 1.6rem;
//   font-size: 1rem;
//   text-shadow: 1px 1px 1px #000;
//   p,
//   a,
//   span {
//     font-family: 'Alegreya Sans', sans-serif, monospace !important;
//     text-transform: none;
//     color: #ddd;
//   }
//   & > div > p {
//     line-height: 1.7rem;
//   }
//   ${({ theme }) => theme.mediaQueries.sm} {
//     border-width: 40px 40px;
//   }

//   ${({ align }) =>
//     align === 'right'
//       ? `
//     text-align: right;
//   `
//       : ''}
// `;
const average = (arr) => arr.reduce((p, c) => p + c, 0) / arr.length;

let realm2;
// let unityInstance;
let account2;
// let sig2;

// // @ts-ignore
// window.socket = {
//   on: (...args) => {},
//   emit: (...args) => {},
// };

const userIdToName = {};
let assumedTimeDiff = 0;
const assumedTimeDiffList = [];

const GameWrapper = ({ setIsGameStarted }) => {
  const gameRef = useRef(null);
  const { unityProvider, sendMessage, loadingProgression, initialisationError, unload } = useUnityContext({
    loaderUrl: '/Build/EvolutionIsles/EvolutionIsles.loader.js',
    dataUrl: '/Build/EvolutionIsles/EvolutionIsles.data',
    frameworkUrl: '/Build/EvolutionIsles/EvolutionIsles.framework.js',
    codeUrl: '/Build/EvolutionIsles/EvolutionIsles.wasm',
    webglContextAttributes: {
      alpha: false,
      depth: false,
      stencil: false, // also interesting to test 'false'
      antialias: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      // powerPreference: 'high-performance',
      failIfMajorPerformanceCaveat: false,
      desynchronized: false,
    },
  });
  //@ts-ignore
  window.sendMessageToUnity = sendMessage;
  // console.log('wtf', UNSAFE__unityInstance);
  // const handleUnityUnmounting = async () => {
  //   await unload().catch((err) => console.log('err===>', err));
  // };

  useEffect(
    function () {
      // if (loadingProgression === 1)
      setIsGameStarted(true);

      // return () => {
      //   handleUnityUnmounting();
      // };
    },
    [loadingProgression, setIsGameStarted]
  );

  // const [isGameStarted, setIsGameStarted] = useState(loadingProgression !== 1);

  return (
    <>
      {initialisationError ? (
        initialisationError
      ) : (
        <>
          {loadingProgression !== 1 ? (
            <StyledNotFound>
              <Heading size="xxl" style={{ margin: '0 auto' }}>
                {(loadingProgression * 100).toFixed(0)}%
              </Heading>
            </StyledNotFound>
          ) : null}
          <Unity
            ref={gameRef}
            unityProvider={unityProvider}
            // matchWebGLToCanvasSize={false}
            style={{
              width: loadingProgression === 1 ? '100%' : '0%',
              height: loadingProgression === 1 ? 'calc(100% - 99px)' : '0%',
            }}
          />
        </>
      )}
    </>
  );
};

function login(auth) {
  const network = 'bsc';

  // if (!account) return;

  // @ts-ignore
  clients.evolutionShard.socket.emit('trpc', {
    id: generateShortId(),
    method: 'login',
    type: 'mutate',
    params: {
      name: auth?.profile?.name || 'Unknown',
      network: network,
      address: auth?.address,
      device: localConfig.isMobile ? 'mobile' : 'desktop',
      version: '1.9.0',
      signature: auth?.token,
    },
  });
}

const Isles: any = ({ open }) => {
  const location = useLocation();
  // const settings = useSettings();
  const match = parseMatch(location);
  const { t } = useTranslation();
  // const [didError, setDidError] = useState(false);
  // const [errorMessage, setErrorMessage] = useState('');
  // const [progression, setProgression] = useState(0);
  const { account, library, web3 } = useWeb3();
  account2 = account;
  const auth = useAuth();
  // const { data: profile } = trpc.seer.profile.getProfile.useQuery<Arken.Profile.Types.Profile>({
  //   where: { address: { equals: account || '0x1a367CA7bD311F279F1dfAfF1e60c4d797Faa6eb' } },
  // });
  // @ts-ignore
  const [_realm, setRealm] = useState(null);
  // const [username, setUsername] = useState(localConfig.username);
  // const [address, setAddress] = useState(localConfig.address);
  // const [loaded, setLoaded] = useState(false);
  const state = useRef('loading');
  const [tab, setTab] = useState(match?.params?.realm ? parseInt(match?.params?.realm + '') : 0);
  const [isServerOffline, setIsServerOffline] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const { toastError, toastSuccess, toastInfo } = useToast();
  const [gameInfo, setGameInfo] = useState({} as any);
  const [leaderboard, setLeaderboard] = useState({} as any);
  const [reward, setReward] = useState(null);
  const [isMenuOpened, setIsMenuOpened] = useState(null);
  const [isEmoteOpened, setIsEmoteOpened] = useState(false);
  const [isUpgradeOpened, setIsUpgradeOpened] = useState(false);
  const [upgrades, setUpgrades] = useState([]);
  const [activeMenu, setActiveMenu] = useState('mode');
  const [onPresentRulesModal] = useModal(<RulesModal onResume={() => {}} onDismiss={() => {}} />);
  const [onPresentWarningsModal] = useModal(<WarningsModal onResume={() => {}} onDismiss={() => {}} />);
  const [onPresentRewardModal] = useModal(<RewardModal onResume={() => {}} onDismiss={() => {}} />);
  const [onPresentTokenModal] = useModal(<TokenModal onResume={() => {}} onDismiss={() => {}} reward={reward} />);
  const [onPresentPartyModal] = useModal(<PartyModal />);
  const [onPresentGuildModal] = useModal(<GuildModal />);
  const [onPresentMarketModal] = useModal(<MarketModal />);
  const [onPresentInventoryModal] = useModal(<InventoryModal account={account} />);
  const [onPresentPVPModal] = useModal(<PVPModal />);
  const [onPresentCraftModal] = useModal(<CraftModal />);
  const [onPresentLeaderboardModal] = useModal(<LeaderboardModal />);
  const [onPresentSettingsModal] = useModal(<SettingsModal auth={auth} />);
  const [onPresentEventsModal] = useModal(<EventsModal />);
  const [onPresentChestModal] = useModal(<ChestModal />);
  const [onPresentQuestModal] = useModal(<QuestModal />);
  console.log('gameInfo', gameInfo);
  // useEffect(
  //   function () {
  //     if (!account) return;

  //     // accountInitialized = true

  //     async function init() {
  //       try {
  //         const res = await getUsername(account);
  //         // @ts-ignore
  //         if (res) {
  //           setUsername(res);
  //           localConfig.username = res;
  //           localConfig.address = account;

  //           if (playerWhitelist.includes(res)) {
  //             setIsAdmin(true);
  //           }
  //         } else {
  //           // setUsername(account.slice(0, 5))
  //         }
  //       } catch (e) {
  //         // @ts-ignore
  //         // setUsername(account.slice(0, 5))
  //       }
  //     }

  //     const inter = setInterval(init, 1 * 60 * 1000);
  //     init();

  //     return () => {
  //       clearInterval(inter);
  //     };
  //   },
  //   [account, setUsername, setAddress]
  // );

  const { data: merchant } = trpc.seer.character.getCharacter.useQuery<Arken.Character.Types.Character>({
    where: { key: { equals: 'harold' } },
  });
  const { mutateAsync: exchangeCharacterItem } = trpc.seer.character.exchangeCharacterItem.useMutation();
  const { data: realms } = trpc.seer.core.getRealms.useQuery<Arken.Core.Types.Realm[]>();

  console.info('Realms', realms);
  // @ts-ignore
  const servers = realms?.[0].realmShards?.filter((s) => s.status === 'online' || s.status === 'Offline') || [];

  //   const realms = servers;
  const realm = _realm || servers[tab];
  realm2 = realm;

  const { isMd, isLg, isXl, isXxl, isXxxl } = useMatchBreakpoints();
  const isMobile = !isMd && !isLg && !isXl && !isXxl && !isXxxl;

  localConfig.isMobile = isMobile;

  const startGame = async () => {
    // let sig = signature;
    // if (!sig) {
    //   sig = (await getSignature('evolution')).hash;
    //   setSignature(sig);
    //   sig2 = sig;
    //   window.localStorage.setItem(config.addressKey, account);
    //   window.localStorage.setItem(config.tokenKey, sig);
    // }

    // document.body.classList.add(`override-bad-quality`);

    // setIsSigned(true);

    gameInitialized = true;

    clearInterval(focusInterval);

    document.addEventListener('keyup', (event) => {
      if (event.code === 'Space') {
        event.stopImmediatePropagation();
        event.stopPropagation();
        event.preventDefault();
      }
    });

    // unityProvider.on('canvas', function (canvas) {
    //   if (canvas) {
    //     if (isMobile) {
    //       canvas.width = window.innerWidth;
    //       canvas.height = window.innerHeight;
    //     } else {
    //       canvas.width = window.innerWidth - 40;
    //     }

    //     canvas.height = window.innerHeight - 104;

    //     canvas.tabIndex = 1;
    //     canvas.setAttribute('id', 'unityCanvas');
    //     window.scrollTo(0, 0);

    //     gameCanvas = canvas;

    //     // if (isMobile) {
    //     document.body.appendChild(canvas);
    //     document.getElementById('root').style.display = 'none';
    //     // }

    //     window.addEventListener(
    //       'resize',
    //       function () {
    //         if (isMobile) {
    //           gameCanvas.width = window.innerWidth;
    //           gameCanvas.height = window.innerHeight;
    //         } else {
    //           gameCanvas.width = window.innerWidth - 40;
    //         }
    //         gameCanvas.height = window.innerHeight - 104;
    //         window.scrollTo(0, 0);
    //       },
    //       true
    //     );
    //   }
    // });

    // unityProvider.on('error', function (message) {
    //   setDidError(true);
    //   setErrorMessage(message);
    // });

    // unityProvider.on('progress', function (p) {
    //   setProgression(p);

    //   if (p === 1) {
    //     UNSAFE__sendMessage('NetworkManager', 'Connect');
    //   }
    // });
  };

  originalAlert = window.alert;

  async function getSignature(text = null) {
    const value = text || Math.floor(Math.random() * 999) + '';
    const hash = library?.bnbSign
      ? (await library.bnbSign(account, value))?.signature
      : await web3.eth.personal.sign(value, account, null);

    return {
      value,
      hash,
    };
  }

  const updateRealm = (r) => {
    if (!r) return;
    setRealm(r);
  };

  // useEffect(() => {
  //   // @ts-ignore
  //   window.stateDebug = state;
  // }, [state]);

  // const now = new Date().getTime() / 1000;

  const [cacheKey, setCacheKey] = useState('');

  useEffect(
    function () {
      console.log('state.current', 'zzz', state);
      // @ts-ignore
      if (window.socket || !auth?.address || !auth.token) return;

      const OnLoaded = () => {
        // localConfig.username = 'aaa';
        // localConfig.address = '0xasdsada';
        // log('Loaded');
        // const network = 'bsc';
        // const pack =
        //   localConfig.username + ':' + network + ':' + localConfig.address + ':' + (localConfig.isMobile ? 'mobile' : 'desktop');
        //  +
        // ':' +
        // sig2;
        // console.log(pack);
        // sendMessage('NetworkManager', 'emitSetInfo', pack);
        // sendMessage('NetworkManager', 'onReadyToJoinGame')
        // setLoaded(true);

        login(auth);
      };

      clients.evolutionShard.socket.on('disconnect', function () {
        state.current = 'disconnected';
      });

      clients.evolutionShard.socket.on('trpc', function (msg) {
        // @ts-ignore
        if (!window.sendMessageToUnity) return;

        // @ts-ignore
        // let json = String.fromCharCode.apply(null, new Uint8Array(msg));
        try {
          // explicitly decode the String as UTF-8 for Unicode
          //   https://github.com/mathiasbynens/utf8.js
          // json = utf8.decode(json);
          // console.log('onEvents msg', msg);
          const data = deserialize(msg);
          // console.log('onEvents events', msg, msg.byteLength, data);

          // @ts-ignore
          if (data.params) {
            // @ts-ignore
            for (const event of data.params) {
              const eventName = event[0];

              if (
                logCommonEvents ||
                (eventName !== 'onUpdatePickup' &&
                  eventName !== 'onUpdateMyself' &&
                  eventName !== 'onSpawnPowerUp' &&
                  eventName !== 'onClearLeaderboard' &&
                  eventName !== 'onUpdatePlayer')
              ) {
                log('Shard Event', event);
              }

              if (eventName === 'onLoaded') {
                OnLoaded();
                continue;
              } else if (eventName === 'onLogin') {
                // @ts-ignore
                clients.evolutionShard.socket.emit('trpc', {
                  id: generateShortId(),
                  method: 'join',
                  type: 'mutate',
                });

                setCacheKey('cache' + Math.floor(Math.random() * 10000));

                continue;
              } else if (eventName === 'onJoinGame') {
                currentPlayerId = event[1].split(':')[0];
                console.log('state.current set joined');
                state.current = 'joined';
                console.log('state.current', 'bbb', state);
                // @ts-ignore
                // window.sendMessageToUnity('NetworkManager', 'onChangeGame', 'MemeIsles');
                // @ts-ignore
                window.sendMessageToUnity('NetworkManager', eventName, event[1] ? event[1] : '');

                setCacheKey('cache' + Math.floor(Math.random() * 10000));
              } else if (eventName === 'onChangeGame') {
                const gameKey = event[1].split(':')[0];
                // @ts-ignore
                window.sendMessageToUnity('NetworkManager', 'onChangeGame', gameKey);

                setCacheKey('cache' + Math.floor(Math.random() * 10000));
              } else if (eventName === 'onSpectate') {
                const clientId = event[1].split(':')[0];

                state.current = 'spectating';
              } else if (eventName === 'onSpawnClient') {
                userIdToName[event[1].split(':')[0]] = event[1].split(':')[1];
              } else if (eventName === 'onShowUI') {
                const key = event[1].split(':')[0];

                if (key === 'shop') {
                  setShowShop(true);
                }
              } else if (eventName === 'onHideUI') {
                const key = event[1].split(':')[0];

                if (key === 'shop') {
                  setShowShop(false);
                }
              } else if (eventName === 'onSetInfo') {
                userIdToName[event[1].split(':')[0]] = event[1].split(':')[1];
              } else if (eventName === 'onGameOver') {
                const playerId = event[1].split(':')[0];
                if (playerId === currentPlayerId) {
                  if (userIdToName[event[1].split(':')[1]]) {
                    // toastInfo('You were killed by ' + userIdToName[event[1].split(':')[1]]);
                  } else {
                    // toastInfo('You died');
                  }
                  state.current = 'spectating';
                }
              } else if (eventName === 'onDisconnected') {
                const playerId = event[1].split(':')[0];
                if (playerId === currentPlayerId) {
                  // socket.disconnect();
                  // socket = null;
                  state.current = 'disconnected';
                }
              } else if (eventName === 'onUpgrade') {
                const updatesPending = event[1].split(':')[0];
                const upgradeRorolls = event[1].split(':')[1];
                const upgrades = event[1].split(',')[2];
                const upgradeId1 = upgrades.split(',')[0];
                const upgradeId2 = upgrades.split(',')[1];
                const upgradeId3 = upgrades.split(',')[2];

                console.log('onUpgrade', updatesPending, upgradeRorolls, upgradeId1, upgradeId2, upgradeId3);

                // TODO: fetch server
                setUpgrades([
                  {
                    id: '200',
                    keybind: '1',
                    name: 'BLM Shield',
                    src: '/images/skills/200.png',
                    description: 'Chaotic fire surrounds you for 10 seconds. You feel compelled to burn it all down.',
                  },
                  {
                    id: '201',
                    keybind: '2',
                    name: 'Montana Speed',
                    description: 'You feel a sudden urge of energy, gaining +30% speed for 5 seconds.',
                    src: '/images/skills/201.png',
                  },
                  {
                    id: '202',
                    keybind: '3',
                    name: "Forrest Bump's Blessing",
                    description: 'You feel more energetic, gaining +10% speed for 30 seconds.',
                    src: '/images/skills/202.png',
                  },
                  // {
                  //   id: '202',
                  //   keybind: '3',
                  //   name: 'Hide The Pain',
                  //   description: 'Acquire: Hide The Pain. You are unable to move, but you feel no pain.',
                  //   src: '/images/skills/202.png',
                  // },
                ]);

                setIsUpgradeOpened(true);
              } else if (eventName === 'onUpdateBestClient') {
                const [name, position, points, kills, deaths, powerups, evolves, rewards, ping, rank] =
                  event[1].split(':');

                setLeaderboard({
                  ...leaderboard,
                  [position]: { name, points, kills, deaths, powerups, evolves, rewards, ping, rank },
                });
              } else if (eventName === 'onSetRoundInfo') {
                // toastInfo('Game mode is now ' + event[1].split(':')[22])
                const [
                  timer,
                  antifeed1,
                  avatarDecayPower0,
                  avatarDecayPower1,
                  avatarDecayPower2,
                  avatarTouchDistance0,
                  avatarTouchDistance1,
                  avatarTouchDistance2,
                  avatarSpeedMultiplier0,
                  avatarSpeedMultiplier1,
                  avatarSpeedMultiplier2,
                  baseSpeed,
                  cameraSize,
                  checkConnectionLoopSeconds,
                  checkInterval,
                  checkPositionDistance,
                  claimingRewards,
                  decayPower,
                  disconnectClientSeconds,
                  disconnectPositionJumps,
                  fastestLoopSeconds,
                  fastLoopSeconds,
                  gameMode,
                  immunitySeconds,
                  isMaintenance,
                  leadercap,
                  maxEvolves,
                  noBoot,
                  noDecay,
                  orbCutoffSeconds,
                  orbOnDeathPercent,
                  orbTimeoutSeconds,
                  pickupDistance,
                  pointsPerEvolve,
                  pointsPerKill,
                  pointsPerOrb,
                  pointsPerPowerup,
                  pointsPerReward,
                  powerupXp0,
                  powerupXp1,
                  powerupXp2,
                  powerupXp3,
                  resetInterval,
                  rewardItemAmount,
                  rewardItemName,
                  rewardItemType,
                  rewardSpawnLoopSeconds,
                  rewardWinnerAmount,
                  rewardWinnerName,
                  roundLoopSeconds,
                  sendUpdateLoopSeconds,
                  slowLoopSeconds,
                  spritesPerClientCount,
                  spritesStartCount,
                  spritesTotal,
                ] = event[1].split(':');

                setGameInfo({
                  ...gameInfo,
                  timer,
                  rewardWinnerAmount,
                  rewardWinnerName,
                  rewardItemAmount,
                  rewardItemName,
                  preset: presets.find((preset: any) => preset.gameMode === gameMode),
                });
                auth?.reauth();
              } else if (eventName === 'onSpawnReward') {
                const data = event[1].split(':');
                setReward({
                  id: data[0],
                  rewardItemType: data[1],
                  rewardItemName: data[2],
                  quantity: data[3],
                  position: { x: data[4], y: data[5] },
                  shortDescription:
                    data[2] === 'harold'
                      ? 'HAROLD token is based on the Hide The Pain meme.'
                      : data[2] === 'pepe'
                        ? 'Pepe is a well known meme.'
                        : 'DOGE is a shiba inu.',
                  longDescription:
                    data[2] === 'harold'
                      ? 'It was rugged by the original creator and is has been adopted by the community and a very big whale.'
                      : data[2] === 'pepe'
                        ? 'Pepe stuff'
                        : 'Doge stuff',
                });
              } else if (eventName === 'onUpdateReward') {
                setReward(null);
              } else if (state.current !== 'loading' && eventName === 'onUpdatePlayer') {
                if (!assumedTimeDiff) {
                  assumedTimeDiffList.push(new Date().getTime() - parseInt(event[1].split(':')[8]));
                  if (assumedTimeDiffList.length >= 50) {
                    assumedTimeDiff = average(assumedTimeDiffList);
                  }
                }
              }

              if (state.current === 'joined' || state.current === 'spectating') {
                if (
                  logCommonEvents ||
                  (eventName !== 'onUpdatePickup' &&
                    eventName !== 'onUpdateMyself' &&
                    eventName !== 'onSpawnPowerUp' &&
                    eventName !== 'onClearLeaderboard' &&
                    eventName !== 'onUpdatePlayer')
                ) {
                  console.info('WEB => UNITY', eventName, event[1]);
                }

                // @ts-ignore
                window.sendMessageToUnity('NetworkManager', eventName, event[1] ? event[1] : '');
              } else {
                console.info('WEB -> UNITY IGNORED', state.current, eventName, event[1]);
              }
            }
          }
        } catch (err) {
          // ...
          console.error(err);
        }
      });

      // @ts-ignore
      window.socket = {
        // on: (...args) => {
        //   log('socket.on', !!clients.evolutionShard.socket, args);

        //   if (clients.evolutionShard.socket)
        //     clients.evolutionShard.socket.on(args[0], function (...args2) {
        //       if (
        //         logCommonEvents ||
        //         (args[0] !== 'onUpdatePickup' && args[0] !== 'onUpdateMyself' && args[0] !== 'onUpdatePlayer')
        //       ) {
        //         log('socket.on called', !!clients.evolutionShard.socket, args[0], args2);
        //       }

        //       args[1](...args2);
        //     });
        // },
        emit: (...args) => {
          if (logCommonEvents || (args[0] !== 'UpdateMyself' && args[0] !== 'Pickup')) {
            // log('socket.emit', !!clients.evolutionShard.socket, args);
          }

          if (args?.[1]?.method === 'load' && state.current === 'loading') return;

          if (args?.[1]?.method === 'load') {
            state.current = 'loading';
            console.log('state.current set loading');
            // state.current = 'loading';

            // if (socket) {
            //   socket.disconnect();
            //   socket = null;
            // }

            // socket = getSocket('https://' + realm2.endpoint);

            // sendMessage('NetworkManager', 'onWebInit', account2 + ':' + sig2);
          }

          if (args.length > 1 && typeof args[1] === 'string') {
            // console.log(args[1]);
            // Step 1: Split the binary string into bytes
            const binaryArray = args[1].split(' ');

            // Step 2: Convert each byte to its ASCII character
            const jsonString = binaryArray
              .filter((item) => !!item)
              .map((byte) => String.fromCharCode(parseInt(byte, 2)))
              .join('');

            // Step 3: Parse the resulting string into JSON
            try {
              const jsonObject = JSON.parse(jsonString.trim());
              if (
                logCommonEvents ||
                (jsonObject.method !== 'updatePickup' &&
                  jsonObject.method !== 'updateMyself' &&
                  jsonObject.method !== 'updatePlayer')
              ) {
                log('Unity Event', jsonObject);
              }

              // const encoder = new TextEncoder();

              // clients.evolutionShard.socket.emit(
              //   'trpc',
              //   encoder.encode(
              //     JSON.stringify({
              //       id: jsonObject.id, // generateShortId(),
              //       method: jsonObject.method, //args[0],
              //       type: 'mutate',
              //       params: jsonObject.params,
              //     })
              //   )
              // );
            } catch (error) {
              console.error('Invalid JSON format:', error);
            }
          }

          if (clients.evolutionShard.socket) clients.evolutionShard.socket.emit(args[0], ...args.slice(1));
        },
      };
    },
    [auth]
  );

  // sendMessage(
  //   'NetworkManager',
  //   'onJoinGame',
  //   'qUcc5CvuMEoJmoOiAAD6:Guest420:3:false:600:-12.6602:-10.33721'
  // );
  // sendMessage('NetworkManager', 'onJoinGame', 'VL570mqtH6h33SWWAAAc:Killer:3:6');
  return (
    <div
      css={css`
        &::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url(/images/evolution-bg.jpg);
          background-size: cover;
          background-repeat: repeat-y;
          opacity: 0.3;
          z-index: -1;
        }
      `}>
      <GlobalStyles />
      {!auth?.address || !auth?.token ? (
        <>
          <Page>
            <Card3 style={{ marginTop: 20 }}>
              <CardBody>
                Evolution Isles is a web-based arena style game, comprised of 10+ game modes rotating every 5 minutes.
                You collect sprites to evolve your character to be able to beat other players, while trying to collect
                rewards scattered on the map. Each game mode puts a spin on the game play. Although it's easy to get
                started, the battle for glory is more difficult.
                <br />
                <br />
                <Button as={RouterLink} to="/evolution/tutorial">
                  View Tutorial
                </Button>
                {/* <p>
                  {t(
                    `Arken is the next evolution of DeFi farming. Farming is when you use your tokens to earn bonus tokens by staking them. Every week a new token is created (called a rune). It's farmed until the max supply of 50,000. That rune can then be combined with other runes to create NFTs. Those NFTs can be used to improve your earnings.`,
                  )}
                </p> */}
                <br />
                <br />
                <br />
                Interested in airdropping memecoins? 95% of tokens donated to these contracts will be dropped in-game
                over the next 90 days (with highest balance getting priority)
                <br />
                BSC:{' '}
                <a href="https://bscscan.com/address/0xad5faa6e1a8991C67DB1C3f7212729Cf6ba5118c">
                  0xad5faa6e1a8991C67DB1C3f7212729Cf6ba5118c
                </a>
                <br />
                Polygon: coming soon
                <br />
                Solana: coming soon
                <br />
                <br />
                If your memecoin doesn't appear in-game, report it in telegram.arken.gg
              </CardBody>
            </Card3>
            <br />

            <Card2>
              <Card>
                <BoxHeading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
                  {t('Play Now')}
                </BoxHeading>
                <hr />
                <CardBody>
                  <Cards>
                    <div style={{ position: 'relative' }}></div>
                    <div style={{ position: 'relative', minHeight: 300 }}>
                      <Flex flexDirection="column" alignItems="center" justifyContent="start">
                        {realms ? (
                          <ControlContainer>
                            <ViewControls>
                              {realms?.map((r) => {
                                return (
                                  <ToggleWrapper key={r.key}>
                                    <Toggle
                                      checked={realm?.key === r.key}
                                      disabled={r.status !== 'online'}
                                      onChange={() => updateRealm(r)}
                                      scale="sm"
                                    />
                                    <Text style={{ textAlign: 'left' }}>
                                      {' '}
                                      {t(r.name)} {r.regionCode}
                                      {(!realm || (realm.key === r.key && !isServerOffline) || realm.key !== r.key) &&
                                      r.status === 'online'
                                        ? ` (${r.clientCount} online)`
                                        : t(` (online)`)}
                                    </Text>
                                  </ToggleWrapper>
                                );
                              })}
                            </ViewControls>
                          </ControlContainer>
                        ) : null}
                        {!realms ? <p>Loading realms...</p> : null}
                        {realms?.length === 0 ? <p>No realms online</p> : null}
                      </Flex>
                      {auth?.address && auth?.token ? (
                        <div
                          css={css`
                            position: absolute;
                            left: 0;
                            bottom: 0;
                            text-align: center;
                            width: 100%;
                            padding: 20px;
                          `}>
                          <HeadingFire fireStrength={1} color1="#fd3" color2="#ff3" color3="#f80" color4="#f20">
                            <SpecialButton
                              title="ENTER ISLES"
                              onClick={() => {
                                startGame();
                              }}
                            />
                          </HeadingFire>
                        </div>
                      ) : auth?.address && !auth?.token ? (
                        <>
                          <Button scale="sm" onClick={() => auth?.sign(auth?.address)}>
                            Sign
                          </Button>
                        </>
                      ) : (
                        <div></div>
                        // <ConnectNetwork />
                      )}
                    </div>
                    <div>
                      <p style={{ fontSize: '0.9em' }}>
                        <Button scale="sm" variant="text" onClick={onPresentRulesModal}>
                          View Rules
                        </Button>
                      </p>
                      <p style={{ fontSize: '0.9em' }}>
                        <Button scale="sm" variant="text" onClick={onPresentWarningsModal}>
                          View Warnings
                        </Button>
                      </p>
                    </div>
                  </Cards>
                </CardBody>
              </Card>
            </Card2>
          </Page>
        </>
      ) : null}
      <Page style={{ padding: 0, maxWidth: 'none', position: 'relative' }}>
        {isGameStarted ? (
          <>
            {state.current === 'spectating' && isUpgradeOpened ? (
              <div
                css={css`
                  position: absolute;
                  top: 0;
                  left: 0;
                  z-index: 10;
                  display: flex;
                  align-items: center; /* Vertical centering */
                  justify-content: center; /* Horizontal centering */
                  zoom: ${auth?.profile?.meta?.evolution?.settings?.zoom || 0.7};
                  // opacity: ${auth?.profile?.meta?.evolution?.settings?.opacity || 1};
                  height: 100%;
                  width: 100%;
                  pointer-events: none;
                `}>
                <UpgradeGrid
                  onUse={(upgradeId) => {
                    setIsUpgradeOpened(false);
                    clients.evolutionShard.socket.emit('trpc', {
                      id: generateShortId(),
                      method: 'chooseUpgrade',
                      type: 'mutate',
                      params: upgradeId,
                    });
                  }}
                  upgrades={upgrades}
                />
              </div>
            ) : null}
            {state.current === 'joined' ? (
              <div
                css={css`
                  position: absolute;
                  bottom: 40px;
                  right: 40px;
                  z-index: 10;
                  zoom: ${auth?.profile?.meta?.evolution?.settings?.zoom || 0.7};
                  opacity: ${auth?.profile?.meta?.evolution?.settings?.opacity || 1};
                  background: ${isEmoteOpened ? '#000' : 'transparent'};
                  border-radius: 10px;
                  padding: 15px;
                `}>
                {isEmoteOpened ? (
                  <ActionGrid
                    onUse={(actionId) => {
                      clients.evolutionShard.socket.emit('trpc', {
                        id: generateShortId(),
                        method: 'emote',
                        type: 'mutate',
                        params: actionId,
                      });
                    }}
                    actions={[
                      {
                        id: '10001',
                        name: 'None',
                        src: '/images/skills/10001.png',
                      },
                      {
                        id: '10002',
                        name: 'Sigh',
                        src: '/images/skills/10002.png',
                      },
                      {
                        id: '10003',
                        name: 'Question',
                        src: '/images/skills/10003.png',
                      },
                      {
                        id: '10004',
                        name: 'Sweat',
                        src: '/images/skills/10004.png',
                      },
                      {
                        id: '10005',
                        name: 'Idea',
                        src: '/images/skills/10005.png',
                      },
                      {
                        id: '10006',
                        name: 'Whisper',
                        src: '/images/skills/10006.png',
                      },
                      {
                        id: '10007',
                        name: 'Happy',
                        src: '/images/skills/10007.png',
                      },
                      {
                        id: '10008',
                        name: 'Anger',
                        src: '/images/skills/10008.png',
                      },
                      {
                        id: '10009',
                        name: 'Sad',
                        src: '/images/skills/10009.png',
                      },
                      {
                        id: '10010',
                        name: 'Laugh',
                        src: '/images/skills/10010.png',
                      },
                      {
                        id: '10011',
                        name: 'Shock',
                        src: '/images/skills/10011.png',
                      },
                      {
                        id: '10012',
                        name: 'Excited',
                        src: '/images/skills/10012.png',
                      },
                      {
                        id: '10013',
                        name: 'Finger',
                        src: '/images/skills/10013.png',
                      },
                      {
                        id: '10014',
                        name: 'Nervous',
                        src: '/images/skills/10014.png',
                      },
                      {
                        id: '10015',
                        name: 'Greedy',
                        src: '/images/skills/10015.png',
                      },
                      {
                        id: '10016',
                        name: 'Proud',
                        src: '/images/skills/10016.png',
                      },
                      {
                        id: '10017',
                        name: 'Heart',
                        src: '/images/skills/10017.png',
                      },
                      {
                        id: '10018',
                        name: 'Dispirit',
                        src: '/images/skills/10018.png',
                      },
                      {
                        id: '10019',
                        name: 'Shy',
                        src: '/images/skills/10019.png',
                      },
                    ]}
                  />
                ) : null}
                <div
                  css={css`
                    width: 100%;
                    text-align: right;
                    cursor: pointer;
                  `}>
                  <img
                    src="/images/skills/10001.png"
                    css={css`
                      width: 96px;
                      height: 96px;
                    `}
                    onClick={() => setIsEmoteOpened(!isEmoteOpened)}
                  />
                </div>
              </div>
            ) : null}
            {state.current === 'joined' ? (
              <div
                css={css`
                  position: absolute;
                  bottom: 30px;
                  left: 0;
                  width: 100%;
                  z-index: 1;
                `}>
                <div
                  css={css`
                    margin: 0 auto;
                    width: 450px;
                    zoom: ${auth?.profile?.meta?.evolution?.settings?.zoom || 0.7};
                    opacity: ${auth?.profile?.meta?.evolution?.settings?.opacity || 1};
                    position: relative;
                  `}>
                  <ActionBar
                    onUse={(actionId) => {
                      clients.evolutionShard.socket.emit('trpc', {
                        id: generateShortId(),
                        method: 'action',
                        type: 'mutate',
                        params: actionId,
                      });
                    }}
                    actions={[
                      {
                        id: 'adsada2',
                        keybind: '1',
                        src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/87792/fireball-red-1.png',
                        name: 'Fireball',
                        description: 'A',
                        cooldown: 10,
                        isSelf: true,
                      },
                      {
                        id: 'adsada3',
                        keybind: '2',
                        src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/87792/evil-eye-eerie-3.png',
                        name: 'Fireball',
                        description: 'A',
                        cooldown: 10,
                        isSelf: true,
                      },
                      {
                        id: 'adsada4',
                        keybind: '3',
                        src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/87792/protect-orange-3.png',
                        name: 'Fireball',
                        description: 'A',
                        cooldown: 10,
                        isSelf: true,
                      },
                      {
                        id: 'adsada5',
                        keybind: '4',
                        src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/87792/fireball-acid-3.png',
                        name: 'Fireball',
                        description: 'A',
                        cooldown: 10,
                        isSelf: false,
                      },
                      {
                        id: 'adsada6',
                        keybind: '5',
                        src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/87792/enchant-acid-3.png',
                        name: 'Fireball',
                        description: 'A',
                        cooldown: 0,
                        isSelf: false,
                      },
                      {
                        id: 'adsada7',
                        keybind: '6',
                        src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/87792/enchant-acid-3.png',
                        name: 'Fireball',
                        description: 'A',
                        cooldown: 0,
                        isSelf: false,
                      },
                      {
                        id: 'adsada8',
                        keybind: '7',
                        src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/87792/enchant-acid-3.png',
                        name: 'Fireball',
                        description: 'A',
                        cooldown: 0,
                        isSelf: false,
                      },
                      {
                        id: 'adsada9',
                        keybind: '8',
                        src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/87792/enchant-acid-3.png',
                        name: 'Fireball',
                        description: 'A',
                        cooldown: 0,
                        isSelf: false,
                      },
                      {
                        id: 'adsada11',
                        keybind: '9',
                        src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/87792/enchant-acid-3.png',
                        name: 'Fireball',
                        description: 'A',
                        cooldown: 0,
                        isSelf: false,
                      },
                      {
                        id: 'adsada12',
                        keybind: 'a',
                        src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/87792/enchant-acid-3.png',
                        name: 'Fireball',
                        description: 'A',
                        cooldown: 0,
                        isSelf: false,
                      },
                      {
                        id: 'adsada13',
                        keybind: 'b',
                        src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/87792/enchant-acid-3.png',
                        name: 'Fireball',
                        description: 'A',
                        cooldown: 0,
                        isSelf: false,
                      },
                      {
                        id: 'adsada14',
                        keybind: 'c',
                        src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/87792/enchant-acid-3.png',
                        name: 'Fireball',
                        description: 'A',
                        cooldown: 0,
                        isSelf: false,
                      },
                    ]}
                  />
                </div>
              </div>
            ) : null}
            {state.current === 'joined' ? (
              <div
                css={css`
                  position: absolute;
                  bottom: 30px;
                  right: 10px;
                  width: 450px;
                  zoom: ${auth?.profile?.meta?.evolution?.settings?.zoom || 0.7};
                  opacity: ${auth?.profile?.meta?.evolution?.settings?.opacity || 1};
                `}>
                <ActionBar
                  actions={[
                    {
                      id: 'adsada',
                      keybind: '1',
                      src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/87792/fireball-red-1.png',
                    },
                  ]}
                  onUse={(actionId) => {
                    clients.evolutionShard.socket.emit('trpc', {
                      id: generateShortId(),
                      method: 'action',
                      type: 'mutate',
                      params: actionId,
                    });
                  }}
                />
              </div>
            ) : null}
            {state.current === 'joined' ? (
              <div
                css={css`
                  position: absolute;
                  top: 20px;
                  left: 10px;
                  width: 600px;
                  zoom: ${auth?.profile?.meta?.evolution?.settings?.zoom || 0.7};
                  opacity: ${auth?.profile?.meta?.evolution?.settings?.opacity || 1};

                  div {
                    font-size: 1rem;
                    margin-bottom: 2px;
                    color: #fff;
                    font-family: 'RobotoSlab Bold' !important;
                    font-weight: 700;
                    text-transform: uppercase !important;
                    text-shadow: -1px 1px 0 rgba(0, 0, 0, 0.8);
                  }
                `}>
                <div css={css``}>
                  <div
                    css={css`
                      display: inline-block;
                    `}>
                    {gameInfo.timer}
                  </div>
                  <div
                    css={css`
                      display: inline-block;
                      margin-left: 20px;
                    `}>
                    {gameInfo.rewardWinnerAmount} {gameInfo.rewardWinnerName}
                  </div>
                </div>
                <div
                  css={css`
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    grid-template-rows: repeat(1, 1fr);
                    background: rgba(0, 0, 0, 0.3);
                  `}>
                  <div>Player</div>
                  <div>Rank</div>
                  <div>Points</div>
                  <div>Ping</div>
                </div>
                <div
                  css={css`
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    grid-template-rows: repeat(10, 1fr);
                    grid-gap: 8px;
                  `}>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((index: any) =>
                    leaderboard[index]?.name ? (
                      <>
                        <div>{leaderboard[index]?.name}</div>
                        <div>{leaderboard[index]?.rank}</div>
                        <div>{leaderboard[index]?.points}</div>
                        <div>{leaderboard[index]?.ping}ms</div>
                      </>
                    ) : (
                      <></>
                    )
                  )}
                </div>
              </div>
            ) : null}
            {state.current === 'joined' ? (
              <div
                css={css`
                  position: absolute;
                  top: 120px;
                  right: 10px;
                  display: grid;
                  width: 400px;
                  display: flex;
                  justify-content: flex-end; /* Align children to the right */
                  gap: 8px;
                  zoom: ${auth?.profile?.meta?.evolution?.settings?.zoom || 0.7};
                  opacity: ${auth?.profile?.meta?.evolution?.settings?.opacity || 1};

                  > div {
                    max-width: 300px; /* Limit each child's width to 100px */
                    flex: 0 0 auto; /* Prevent children from growing */
                  }
                `}>
                <div
                  css={css`
                    padding: 30px 15px;
                  `}>
                  {activeMenu === 'mode' ? (
                    <div css={css``}>
                      {/* <div
                        css={css`
                          font-size: 1.2rem;
                          color: #fff;
                          font-family: 'RobotoSlab Bold' !important;
                          font-weight: 700;
                          text-transform: uppercase !important;
                          letter-spacing: -1px;
                          text-shadow: -2px 2px 0 #000;
                        `}>
                        GAME MODE
                      </div>
                      <br /> */}
                      {gameInfo ? (
                        <div
                          css={css`
                            div {
                              font-size: 1rem;
                              margin-bottom: 2px;
                              color: #fff;
                              font-family: 'RobotoSlab Bold' !important;
                              font-weight: 700;
                              text-transform: uppercase !important;
                              text-shadow: -1px 1px 0 rgba(0, 0, 0, 0.8);
                            }
                          `}>
                          {gameInfo?.preset?.guide?.map((item: any) => (
                            <div key={item} css={css``}>
                              {item}
                            </div>
                          ))}
                          {/* <div
                            css={css`
                              font-size: 1rem;
                              margin-bottom: 2px;
                              color: #fff;
                              font-family: 'RobotoSlab Bold' !important;
                              font-weight: 700;
                              text-transform: uppercase !important;
                              text-shadow: -2px 2px 0 #000;
                            `}>
                            Evolve: {gamePreset.pointsPerEvolve}
                          </div>
                          <div
                            css={css`
                              font-size: 1rem;
                              margin-bottom: 2px;
                              color: #fff;
                              font-family: 'RobotoSlab Bold' !important;
                              text-transform: uppercase !important;
                              text-shadow: -2px 2px 0 #000;
                            `}>
                            Powerup: {gamePreset.pointsPerPowerup}
                          </div>
                          <div
                            css={css`
                              font-size: 1rem;
                              margin-bottom: 2px;
                              color: #fff;
                              font-family: 'RobotoSlab Bold' !important;
                              font-weight: 700;
                              text-transform: uppercase !important;
                              text-shadow: -2px 2px 0 #000;
                            `}>
                            Kill: {gamePreset.pointsPerKill}
                          </div>
                          <div
                            css={css`
                              font-size: 1rem;
                              margin-bottom: 2px;
                              color: #fff;
                              font-family: 'RobotoSlab Bold' !important;
                              font-weight: 700;
                              text-transform: uppercase !important;
                              text-shadow: -2px 2px 0 #000;
                            `}>
                            Reward: {gamePreset.pointsPerReward}
                          </div>
                          <div
                            css={css`
                              font-size: 1rem;
                              margin-bottom: 2px;
                              color: #fff;
                              font-family: 'RobotoSlab Bold' !important;
                              font-weight: 700;
                              text-transform: uppercase !important;
                              text-shadow: -2px 2px 0 #000;
                            `}>
                            Orb: {gamePreset.pointsPerOrb}
                          </div> */}
                        </div>
                      ) : (
                        <>None</>
                      )}
                    </div>
                  ) : null}
                  {activeMenu === 'party' ? <>PARTY HERE</> : null}
                  {activeMenu === 'quest' ? <>QUEST HERE</> : null}
                  {activeMenu === 'target' ? <>TARGET HERE</> : null}
                </div>
                <div
                  css={css`
                    filter: drop-shadow(2px 4px 6px black);
                    display: grid;
                    grid-template-columns: repeat(1, 1fr); /* 7 columns */
                    grid-template-rows: repeat(3, 1fr); /* 5 rows */
                    gap: 30px 20px; /* Adjust spacing between grid items */
                    padding: 10px 15px;
                    text-align: center;

                    span {
                      display: block;
                      font-weight: bold;
                      font-size: 1rem;
                      color: #fff;
                      margin-top: 9px;
                      text-shadow: 2px 2px #000;
                    }

                    img {
                      width: 60px;
                      height: 60px;
                      filter: brightness(1.5) grayscale(1) sepia(1.5);
                    }

                    div {
                      opacity: 0.5;

                      &:hover {
                        opacity: 1 !important;
                      }
                    }
                  `}>
                  <div style={{ opacity: activeMenu === 'mode' ? 0.8 : 0.5 }}>
                    <img src="/evolution/images/quest.png" onClick={() => setActiveMenu('mode')} />
                  </div>
                  <div style={{ opacity: activeMenu === 'quest' ? 0.8 : 0.5 }}>
                    <img src="/evolution/images/quest.png" onClick={() => setActiveMenu('quest')} />
                  </div>
                  <div style={{ opacity: activeMenu === 'party' ? 0.8 : 0.5 }}>
                    <img src="/evolution/images/party.png" onClick={() => setActiveMenu('party')} />
                  </div>
                  {/* <div style={{ opacity: activeMenu === 'target' ? 0.8 : 0.5 }}>
                  <img src="/evolution/images/target.png" onClick={() => setActiveMenu('target')} />
                </div> */}
                </div>
              </div>
            ) : null}
            <div
              css={css`
                position: absolute;
                top: 0;
                right: 10px;
                width: 500px;
                z-index: 101;
                background: ${isMenuOpened ? '#1c1c2e' : 'none'};
                border: ${isMenuOpened ? '2px solid #666' : '2px solid transparent'};
                border-top: none;
                filter: drop-shadow(2px 4px 6px black);
                display: grid;
                grid-template-columns: repeat(5, 1fr); /* 7 columns */
                grid-template-rows: repeat(${isMenuOpened ? 3 : 1}, 1fr); /* 5 rows */
                gap: 30px 20px; /* Adjust spacing between grid items */
                padding: 10px 15px 20px;
                text-align: center;
                zoom: ${auth?.profile?.meta?.evolution?.settings?.zoom || 0.7};
                // opacity: ${auth?.profile?.meta?.evolution?.settings?.opacity || 1};

                span {
                  display: block;
                  font-weight: bold;
                  font-size: 1rem;
                  color: #fff;
                  margin-top: 9px;
                  text-shadow: 2px 2px #000;
                }

                img {
                  width: 60px;
                  height: 60px;
                  filter: ${isMenuOpened ? 'none' : 'brightness(1.5) grayscale(1) sepia(1.5)'};
                }

                span {
                  opacity: ${isMenuOpened ? '1' : '0'};
                }

                div {
                  opacity: ${isMenuOpened ? '0.8' : '0.5'};
                  &:hover {
                    opacity: 1;
                  }
                }
              `}>
              <div>
                <img src="/evolution/images/events.png" onClick={onPresentEventsModal} />
                <span>Events</span>
              </div>
              <div>
                <img src="/evolution/images/chest.png" onClick={onPresentChestModal} />
                <span>Chest</span>
              </div>
              <div>
                <img src="/evolution/images/inventory.png" onClick={onPresentInventoryModal} />
                <span>Inventory</span>
              </div>
              <div>
                <img src="/evolution/images/market.png" onClick={onPresentMarketModal} />
                <span>Market</span>
              </div>
              <div onClick={() => setIsMenuOpened(!isMenuOpened)}>
                <img src="/evolution/images/settings.png" />
                <span>Close</span>
              </div>
              {isMenuOpened ? (
                <>
                  <div onClick={onPresentCraftModal}>
                    <img src="/evolution/images/craft.png" />
                    <span>Craft</span>
                  </div>
                  <div onClick={onPresentGuildModal}>
                    <img src="/evolution/images/guild.png" />
                    <span>Guild</span>
                  </div>
                  <div onClick={onPresentPartyModal}>
                    <img src="/evolution/images/party.png" />
                    <span>Party</span>
                  </div>
                  <div onClick={onPresentPVPModal}>
                    <img src="/evolution/images/pvp.png" />
                    <span>PVP</span>
                  </div>
                  {/* <div onClick={onPresentPVPModal}>
                    <img src="/evolution/images/runes.png" />
                    <span>Runes</span>
                  </div> */}
                  <div onClick={onPresentLeaderboardModal}>
                    <img src="/evolution/images/leaderboard.png" />
                    <span>Leaderboard</span>
                  </div>
                  <div onClick={onPresentSettingsModal}>
                    <img src="/evolution/images/settings.png" />
                    <span>Settings ({state.current})</span>
                  </div>
                  {/* <div onClick={onPresentPVPModal}>
                    <img src="/evolution/images/boss.png" />
                    <span>Boss</span>
                  </div> */}
                  {/* <div onClick={onPresentPVPModal}>
                    <img src="/evolution/images/dungeon.png" />
                    <span>Dungeon</span>
                  </div> */}
                  {/* <div onClick={onPresentPVPModal}>
                    <img src="/evolution/images/wings.png" />
                    <span>Wings</span>
                  </div> */}
                  {/* <div onClick={onPresentPVPModal}>
                    <img src="/evolution/images/friends.png" />
                    <span>Friends</span>
                  </div> */}
                  {/* <div onClick={onPresentPVPModal}>
                    <img src="/evolution/images/crystals.png" />
                    <span>Crystals</span>
                  </div> */}
                  {/* <div onClick={onPresentPVPModal}>
                    <img src="/evolution/images/growth.png" />
                    <span>Growth</span>
                  </div> */}
                  {/* <div onClick={onPresentPVPModal}>
                    <img src="/evolution/images/skills.png" />
                    <span>Skills</span>
                  </div> */}
                  {/* <div onClick={onPresentPVPModal}>
                    <img src="/evolution/images/transform.png" />
                    <span>Transform</span>
                  </div> */}
                  {/* <div onClick={onPresentPVPModal}>
                    <img src="/evolution/images/expedition.png" />
                    <span>Expedition</span>
                  </div> */}
                  {/* <div onClick={onPresentPVPModal}>
                    <img src="/evolution/images/settings.png" />
                    <span>Settings</span>
                  </div> */}
                </>
              ) : null}
            </div>
            <div
              css={css`
                position: absolute;
                top: 0;
                left: 0;
                pointer-events: none;
                display: grid;
                place-items: center; /* Centers both vertically and horizontally */
                height: 100%;
                width: 100%;
                z-index: 3;
              `}>
              <div
                css={css`
                  .app__styled-card2 {
                    box-shadow: none !important;
                  }
                `}>
                {state.current === 'spectating' ? (
                  <div
                    css={css`
                      position: absolute;
                      bottom: 50px;
                      left: calc(50% - 60px);
                      pointer-events: all;
                      zoom: ${auth?.profile?.meta?.evolution?.settings?.zoom || 0.7};
                      // opacity: ${auth?.profile?.meta?.evolution?.settings?.opacity || 1};
                    `}>
                    <Card2>
                      <Card>
                        {/* <BoxHeading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
                      UI
                    </BoxHeading>
                    <hr /> */}
                        <CardBody>
                          <Button
                            onClick={() => {
                              // @ts-ignore
                              window.socket.emit('trpc', {
                                id: generateShortId(),
                                method: 'load',
                                type: 'mutate',
                                params: serialize([]),
                              });
                              // sendMessage(
                              //   'NetworkManager',
                              //   'onJoinGame',
                              //   'qUcc5CvuMEoJmoOiAAD6:Guest420:3:false:600:-12.6602:-10.33721'
                              // );
                              // sendMessage('NetworkManager', 'onJoinGame', 'VL570mqtH6h33SWWAAAc:Killer:3:6');
                            }}
                            style={{ width: 150 }}>
                            Revive
                          </Button>
                        </CardBody>
                      </Card>
                    </Card2>
                  </div>
                ) : null}
                {state.current === 'disconnected' ? (
                  <div
                    css={css`
                      position: absolute;
                      bottom: 50px;
                      left: calc(50% - 60px);
                      pointer-events: all;
                      zoom: ${auth?.profile?.meta?.evolution?.settings?.zoom || 0.7};
                      // opacity: ${auth?.profile?.meta?.evolution?.settings?.opacity || 1};
                    `}>
                    <Card2>
                      <Card>
                        <CardBody>
                          <Button
                            onClick={() => {
                              // @ts-ignore
                              clients.evolutionShard.socket.emit('trpc', {
                                id: generateShortId(),
                                method: 'join',
                                type: 'mutate',
                              });
                            }}
                            style={{ width: 150 }}>
                            Reconnect
                          </Button>
                        </CardBody>
                      </Card>
                    </Card2>
                  </div>
                ) : null}
                {/* {state.current === 'disconnected' ? (
                <Card2>
                  <Card>
                    <CardBody>
                      <Button
                        onClick={() => {
                          // @ts-ignore
                          window.socket.emit('trpc', {
                            id: generateShortId(),
                            method: 'load',
                            type: 'mutate',
                            params: serialize([]),
                          });
                        }}>
                        Enter World
                      </Button>
                    </CardBody>
                  </Card>
                </Card2>
              ) : null} */}
                {state.current === 'loading' ? (
                  <Card2>
                    <Card style={{ textAlign: 'center' }}>
                      <BoxHeading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15, padding: '0 20px' }}>
                        Connecting
                      </BoxHeading>
                      {/* <hr />
                      <CardBody>
                        <Button
                          onClick={() => {
                            state.current = 'disconnected';
                          }}>
                          Cancel
                        </Button>
                      </CardBody> */}
                    </Card>
                  </Card2>
                ) : null}
                {reward ? (
                  <Card2
                    onClick={onPresentTokenModal}
                    css={css`
                      position: absolute;
                      top: 20px;
                      left: calc(50% - 20px);
                      zoom: ${auth?.profile?.meta?.evolution?.settings?.zoom || 0.7};
                      // opacity: ${auth?.profile?.meta?.evolution?.settings?.opacity || 1};
                      z-index: 2;
                    `}>
                    <Card style={{ textAlign: 'center' }}>
                      <CardBody>
                        <img
                          src={'/images/rewards/' + reward.rewardItemName + '.png'}
                          css={css`
                            width: 40px;
                            height: 40px;
                            margin-bottom: 10px;
                          `}
                        />
                        <div
                          css={css`
                            font-weight: bold;
                            font-size: 1.1rem;
                          `}>
                          {reward.quantity} {reward.rewardItemName.toUpperCase()}
                        </div>
                      </CardBody>
                    </Card>
                  </Card2>
                ) : null}
                {showShop && merchant?.[merchant?.inventoryIndex]?.items ? (
                  <Card2
                    css={css`
                      position: absolute;
                      bottom: 300px;
                      left: 20px;
                    `}>
                    <Card style={{ textAlign: 'center', zoom: '0.6' }}>
                      <CardBody>
                        <h2>Harold's Shop</h2>
                      </CardBody>
                      <CardBody>
                        {merchant.inventory[merchant.inventoryIndex].items.map((item: any) => (
                          <div
                            key={item.id}
                            css={css`
                              font-weight: bold;
                              font-size: 1.1rem;
                            `}>
                            <img
                              src={'/images/rewards/doge.png'}
                              css={css`
                                width: 40px;
                                height: 40px;
                                margin-bottom: 10px;
                              `}
                            />
                            {item.quantity} {item.name}{' '}
                            <Button
                              size="sm"
                              onClick={() => exchangeCharacterItem({ characterId: merchant.id + '', itemId: item.id })}>
                              {item.exchange.item.quantity} {item.exchange.item.name}
                            </Button>
                          </div>
                        ))}
                      </CardBody>
                      <CardBody>
                        <img
                          src={'/images/rewards/sprite-dust.png'}
                          css={css`
                            width: 40px;
                            height: 40px;
                            margin-bottom: 10px;
                          `}
                        />
                        <div
                          css={css`
                            font-weight: bold;
                            font-size: 1.1rem;
                          `}>
                          Your balance:{' '}
                          {auth?.profile?.character?.items.find((item: any) => item.name === 'Sprite Dust').quantity ||
                            0}{' '}
                          Sprite Dust
                        </div>
                      </CardBody>
                      <CardBody>
                        <Button size="sm">Purchase</Button>
                      </CardBody>
                    </Card>
                  </Card2>
                ) : null}
              </div>
            </div>
          </>
        ) : null}
        <div style={{ width: 0, height: 0, overflow: 'hidden' }}>{cacheKey}</div>
        {auth?.address && auth?.token ? <GameWrapper setIsGameStarted={setIsGameStarted} /> : null}
      </Page>
    </div>
  );
};

// @ts-ignore
// Isles.whyDidYouRender = true;

export default Isles;
