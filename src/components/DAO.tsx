import React, { useEffect, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { Button } from '~/components/Button';
import { Link as RouterLink, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toFixed } from 'rune-backend-sdk/build/util/math';
import useFetch from '~/hooks/useFetch';
import { Card, Heading, CardBody, ArrowForwardIcon, Flex, Skeleton } from '~/ui';
import Page from '~/components/layout/Page';
import Paragraph from '~/components/Paragraph';
import { getUsername } from '~/state/profiles/getProfile';

const zzz = styled.div``;

const cache = {
  getUsername: {},
};

const HeadingFire = styled.div<{
  fireStrength: number;
  color1: string;
  color2: string;
  color3: string;
  color4: string;
}>`
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
  pointer-events: none;

  @keyframes fire {
    0% {
      text-shadow: 0 0 2px ${(props) => props.color1},
        0 ${(props) => props.fireStrength * -5}px ${(props) => props.fireStrength * 4}px ${(props) => props.color2},
        ${(props) => props.fireStrength * 2}px ${(props) => props.fireStrength * -10}px
          ${(props) => props.fireStrength * 6}px ${(props) => props.color1},
        ${(props) => props.fireStrength * -2}px ${(props) => props.fireStrength * -15}px
          ${(props) => props.fireStrength * 11}px ${(props) => props.color3},
        ${(props) => props.fireStrength * -2}px ${(props) => props.fireStrength * -25}px
          ${(props) => props.fireStrength * 18}px ${(props) => props.color4};
    }
    25% {
      text-shadow: 0 0 3px ${(props) => props.color1},
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
      text-shadow: 0 0 3px ${(props) => props.color1},
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
      text-shadow: 0 0 2px ${(props) => props.color1},
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
      text-shadow: 0 0 2px ${(props) => props.color1},
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

const DAO = () => {
  const { t } = useTranslation();
  const url = `https://envoy.arken.gg/dao/proposals.json`;
  const { data } = useFetch(url);

  const proposals = useMemo(
    function () {
      return data?.[url] || [];
    },
    [data, url]
  );

  // useEffect(function() {
  //   if (Object.keys(cache.getUsername).length) return

  //   for (const proposal of proposals) {
  //     if (!proposal.voteList) return

  //     for (const vote of proposal.voteList) {
  //       getUsername(vote.voter).then(function(username) {
  //         cache.getUsername[vote.voter] = username
  //       })
  //     }
  //   }
  // }, [proposals])

  return (
    <Page>
      <Card style={{ width: '100%' }}>
        <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
          {t('Rune DAO')}
        </Heading>
        <hr />
        <CardBody>
          <p>
            Arken Realms will transition from advisory governance to a complete decentralized autonomous organization
            when{' '}
            <a
              href="https://arkenrealms.medium.com/rune-metaverse-dao-1a90f6e1cd18"
              rel="noreferrer noopener"
              target="_blank">
              our 4 phase plan is complete and voted upon
            </a>
            . There will be a proposal with more details and a vote before we move to each phase. $RXS token holders can
            vote if the details / timing are satisfactory on{' '}
            <a href="https://vote.arken.gg" rel="noreferrer noopener" target="_blank">
              vote.arken.gg
            </a>
          </p>
          <br />
          <p>
            Voting is easy: connect your wallet and sign a message. By voting you're helping the project grow, and we've
            allocated a portion of rune rewards for those who do vote. The pool will grow 1 rune reward per 1M RXS that
            participates. The rune is chosen randomly from 10 options: ZOD GUL IST UM FAL ORT SOL NEF TIR EL. Finally,
            that rune reward pool is split between the voters evenly. Each user will also get 10 points towards the
            player + guild leaderboard. Your rewards and points can be found in the{' '}
            <RouterLink to="/account/rewards">Reward Centre</RouterLink>.
          </p>
          <br />
          <p>
            As we work towards the DAO switch, we'll codify configurations &amp; permissions so they can be changed
            using DAO proposals. For details of what could be controlled so far,{' '}
            <a href="https://github.arken.gg/dao" rel="noreferrer noopener" target="_blank">
              check ArkenRealms/dao on Github
            </a>
            .
          </p>
          <br />
          <p>
            <strong>Note:</strong> Voting requires the <RouterLink to="/swap">$RXS token</RouterLink>. When a proposal
            is created, it uses a snapshot of holdings at the time. The reason is so nobody can acquire more to swing
            the vote in the middle of the voting period. Rewards require a Rune user voting with a minimum of 1000 RXS.
          </p>
          <br />
          <br />
          <Flex flexDirection="column" alignItems="center" justifyContent="center">
            <Button
              variant="primary"
              as="a"
              href="https://vote.arken.gg"
              rel="noreferrer noopener"
              target="_blank"
              css={css`
                zoom: 1.3;
                border-radius: 8px;
                height: 50px;
                box-shadow: 0px -1px 0px 0pxrgb (14 14 44 / 40%) inset;
                padding: 16px 25px;
                background-color: #6e0000;
                filter: drop-shadow(rgba(0, 0, 0, 0.6) 1px 1px 1px) drop-shadow(rgba(0, 0, 0, 0.6) 0px 0px 4px);
                &:hover {
                  cursor: url('/images/cursor3.png'), pointer;
                }
              `}>
              <HeadingFire
                fireStrength={1}
                color1="#fd3"
                color2="#ff3"
                color3="#f80"
                color4="#f20"
                css={css`
                  font-size: 1.2rem;
                  color: #000;
                  text-transform: uppercase;
                  font-family: 'webfontexl';
                `}>
                Voting Portal
              </HeadingFire>
            </Button>
          </Flex>
          <br />
          <br />
          <br />
          <Heading as="h2" size="lg" style={{ textAlign: 'center' }}>
            Proposals
          </Heading>
          <br />
          {!proposals.length ? <Skeleton height="80px" mb="16px" mt="16px" ml="16px" mr="16px" /> : null}
          {proposals.map((proposal) => {
            const sortedScores = proposal.scores.sort((a, b) => (a > b ? 1 : -1));
            const scoreIndex = proposal.scores.indexOf(sortedScores[0]);
            const result = proposal.choices[scoreIndex];
            return (
              <div
                css={css`
                  border: 1px solid #bb955e;
                  padding: 10px;
                  margin-bottom: 20px;
                  font-size: 0.9rem;
                `}>
                <h3 style={{ fontSize: '1.2rem' }}>{proposal.title}</h3>
                <br />
                <Paragraph>
                  {proposal.body.slice(0, 300)}...
                  <br />
                  <br />
                  <Flex flexDirection="column" alignItems="center" justifyContent="center">
                    <Button
                      as="a"
                      scale="sm"
                      rel="noreferrer noopener"
                      target="_blank"
                      href={`https://vote.arken.gg/#/proposal/${proposal.id}`}
                      variant="text"
                      style={{ border: '1px solid #ddd' }}>
                      View Proposal
                    </Button>
                  </Flex>
                  <br />
                  <strong>Status:</strong> {proposal.state}
                  <br />
                  <strong>Result:</strong> {proposal.state === 'closed' ? result : 'Pending'}
                  <br />
                  <strong>Reward Pool:</strong>{' '}
                  {proposal.rewardToken
                    ? `${proposal.rewardPool} ${proposal.rewardToken.toUpperCase()}`
                    : `??? Runes (Random)`}{' '}
                  <br />
                  {proposal.state === 'closed' ? (
                    <>
                      <strong>Voters ({proposal.voteList.length}):</strong>
                      <br />
                      <div
                        css={css`
                          display: grid;
                          grid-template-columns: repeat(5, 1fr);
                          grid-template-rows: 1fr;
                          grid-column-gap: 0px;
                          grid-row-gap: 0px;

                          a {
                            display: inline-block;
                          }
                        `}>
                        {proposal.voteList?.map((vote) => (
                          <span>
                            <RouterLink
                              to={`/user/${vote.username || vote.voter}`}
                              css={css`
                                margin-right: 5px;
                                border-bottom: 1px solid #fff;
                              `}>
                              {vote.username || `${vote.voter.slice(0, 5)}...${vote.voter.slice(-3)}`}
                            </RouterLink>{' '}
                            ({vote.rewarded || 0} {proposal.rewardToken.toUpperCase()})
                          </span>
                        ))}
                      </div>
                    </>
                  ) : null}
                </Paragraph>
              </div>
            );
          })}
        </CardBody>
      </Card>
    </Page>
  );
};

export default DAO;
