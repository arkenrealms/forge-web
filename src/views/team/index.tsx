import React, { useEffect, useState, useRef } from 'react';
import Page from '~/components/layout/Page';
import styled, { css } from 'styled-components';
import { Link as RouterLink, NavLink } from 'react-router-dom';
import { Button, Flex, Card, Heading, CardBody, BaseLayout, ButtonMenu, ButtonMenuItem } from '~/ui';
import { ImCheckboxChecked } from 'react-icons/im';
import { ImCheckboxUnchecked } from 'react-icons/im';
import { CgTimelapse } from 'react-icons/cg';
import { BsPauseBtnFill } from 'react-icons/bs';
import { MdCancelPresentation } from 'react-icons/md';
import PageWindow from '~/components/PageWindow';
import TeamComponent from '~/components/Team';

function scrollParentToChild(parent, child) {
  // Where is the parent on page
  const parentRect = parent.getBoundingClientRect();
  // What can you see?
  const parentViewableArea = {
    height: parent.clientHeight,
    width: parent.clientWidth,
  };

  // Where is the child
  const childRect = child.getBoundingClientRect();
  // Is the child viewable?
  const isViewable = childRect.top >= parentRect.top && childRect.bottom <= parentRect.top + parentViewableArea.height;

  // if you can't see the child try to scroll parent
  if (!isViewable) {
    // Should we scroll using top or bottom? Find the smaller ABS adjustment
    const scrollTop = childRect.top - parentRect.top;
    const scrollBot = childRect.bottom - parentRect.bottom;
    if (Math.abs(scrollTop) < Math.abs(scrollBot)) {
      // we're near the top of the list
      parent.scrollTop += scrollTop;
    } else {
      // we're near the bottom of the list
      parent.scrollTop += scrollBot;
    }
  }
}

const RiccardoContainer = styled.div``;

const ProgressIcon = ({ status }) => (
  <div
    css={css`
      vertical-align: top;
      padding: 3px;
    `}>
    {status === 'done' ? (
      <ImCheckboxChecked width="18px" style={{ marginRight: 10 }} />
    ) : status === 'pending' ? (
      <ImCheckboxUnchecked width="18px" style={{ marginRight: 10 }} />
    ) : status === 'working' ? (
      <CgTimelapse width="18px" style={{ marginRight: 10 }} />
    ) : status === 'postponed' ? (
      <BsPauseBtnFill width="18px" style={{ marginRight: 10 }} />
    ) : status === 'canceled' ? (
      <MdCancelPresentation width="18px" style={{ marginRight: 10 }} />
    ) : null}
  </div>
);
const CardCustom = styled(Card)`
  border-width: 8px;
  margin-top: 30px;
`;
const Tag = styled.span`
  background: #113657;
  border-radius: 3px;
  padding: 3px 4px 2px;
  color: #fff;
  font-weight: bold;
  font-size: 0.8rem;
  vertical-align: top;
`;
const PerformanceTag = styled(Tag)`
  background: #1c5711;
`;
const Coin = () => <img src="/images/items/01220.png" style={{ width: 17, height: 17, verticalAlign: 'middle' }} />;

const Team = ({ match }) => {
  const joinRef = useRef(null);
  const raffleRef = useRef(null);
  const [collapseTeam, setCollapseTeam] = useState(false);
  const [collapseJoin, setCollapseJoin] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState(2);
  const [selectedGoal, setSelectedGoal] = useState(0);

  useEffect(() => {
    if (!window?.location) return;

    const hasJoinAnchor = window.location.href.includes('#join');
    if (hasJoinAnchor) {
      setCollapseTeam(true);
      // joinRef.current.scrollIntoView({ behavior: 'smooth' })
      // document.querySelector('div.not-draggable').scrollTo(0, 1800)
      // scrollParentToChild(document.querySelector('div.not-draggable'), joinRef.current)
    }

    const hasRaffleAnchor = window.location.href.includes('#raffle');
    if (hasRaffleAnchor) {
      setCollapseTeam(true);
      setCollapseJoin(true);
      // joinRef.current.scrollIntoView({ behavior: 'smooth' })
      // document.querySelector('div.not-draggable').scrollTo(0, 1800)
      // scrollParentToChild(document.querySelector('div.not-draggable'), joinRef.current)
    }
  }, []);

  const roadmap = {
    phases: [
      {
        content: (
          <>
            <strong>#1 (August, 2022)</strong>
          </>
        ),
        status: 'done',
        goals: [
          {
            content: (
              <>
                <strong>#1 - 50 Zavox Tickets</strong>
              </>
            ),
            status: 'done',
            notes: [
              <>That's a lot of Zavox, think of the possibilities...</>,
              <>Entry Requirement: None</>,
              <>Winner: Matheus</>,
              <>
                Matheus: 55 <Coin />
              </>,
              <>
                SamKouCaille: 50 <Coin />
              </>,
              <>
                FireLord: 40 <Coin />
              </>,
              <>
                Discomonk: 20 <Coin />
              </>,
              <>
                Lazy: 10 <Coin />
              </>,
              <>
                Binzy: 5 <Coin />
              </>,
            ],
          },
          {
            content: (
              <>
                <strong>#2 - Giveaway Item</strong>
              </>
            ),
            status: 'done',
            notes: [
              <>
                Item from the <RouterLink to="/user/ArkenGiveaways/inventory">Giveaway Wallet</RouterLink> that wasn't
                given away. Time to search the inventory...
              </>,
              <>Entry Requirement: None</>,
              <>Winner: SamKouCaille</>,
              <>
                Matheus: 2 <Coin />
              </>,
              <>
                Lazy: 2 <Coin />
              </>,
              <>
                SamKouCaille: 2 <Coin />
              </>,
              <>
                Binzy: 1 <Coin />
              </>,
            ],
          },
          {
            content: (
              <>
                <strong>#3 - Diablo 2 Item</strong>
              </>
            ),
            status: 'done',
            notes: [
              <>Fundraiser item that has been purchased by Binzy using the dev cut.</>,
              <>Entry Requirement: None</>,
              <>Winner: Riccardo</>,
              <>
                Riccardo: 160 <Coin />
              </>,
              <>
                Discomonk: 60 <Coin />
              </>,
              <>
                Monk: 50 <Coin />
              </>,
              <>
                FireLord: 40 <Coin />
              </>,
              <>
                Binzy: 20 <Coin />
              </>,
            ],
          },
          {
            content: (
              <>
                <strong>#4 - Zavox Ticket</strong>
              </>
            ),
            status: 'done',
            notes: [
              <>You definitely like RNG.</>,
              <>Entry Requirement: None</>,
              <>Winner: Matheus</>,
              <>
                Lazy: 2 <Coin />
              </>,
              <>
                Matheus: 2 <Coin />
              </>,
              <>
                Binzy: 1 <Coin />
              </>,
            ],
          },
          {
            content: (
              <>
                <strong>#5 - Character Slot Redemption Scroll</strong>
              </>
            ),
            status: 'done',
            notes: [
              <>This is the same scroll that's transmuted using 1 ZOD.</>,
              <>Entry Requirement: None</>,
              <>Winner: Matheus</>,
              <>
                Matheus: 2 <Coin />
              </>,
              <>
                Lazy: 1 <Coin />
              </>,
              <>
                Binzy: 1 <Coin />
              </>,
              <>
                SamKouCaille: 1 <Coin />
              </>,
            ],
          },
          {
            content: (
              <>
                <strong>#6 - Dev Fee Acquisition</strong>
              </>
            ),
            status: 'done',
            notes: [
              <>You'll receive 0.1% of all RXS transactions for the next month. Yum.</>,
              <>Entry Requirement: Have not won this reward already this year.</>,
              <>Winner: Maiev</>,
              <>
                Maiev: 100 <Coin />
              </>,
              <>
                Discomonk: 80 <Coin />
              </>,
              <>
                Monk: 70 <Coin />
              </>,
              <>
                Binzy: 20 <Coin />
              </>,
            ],
          },
        ],
      },
      {
        content: (
          <>
            <strong>#2 (September, 2022)</strong>
          </>
        ),
        status: 'done',
        goals: [
          {
            content: (
              <>
                <strong>#1 - 20 Zavox Tickets</strong>
              </>
            ),
            status: 'done',
            notes: [
              <>That's a lot of Zavox, think of the possibilities...</>,
              <>Entry Requirement: None</>,
              <>Winner: Monk</>,
              <>
                Monk: 53 <Coin />
              </>,
              <>
                Scrooge: 51 <Coin />
              </>,
              <>
                FireLord: 31 <Coin />
              </>,
              <>
                Disco: 30 <Coin />
              </>,
              <>
                Monk: 30 <Coin />
              </>,
              <>
                Jon: 20 <Coin />
              </>,
              <>
                Sam: 10 <Coin />
              </>,
              <>
                Lazy: 10 <Coin />
              </>,
            ],
          },
          {
            content: (
              <>
                <strong>#2 - Giveaway Item</strong>
              </>
            ),
            status: 'done',
            notes: [
              <>
                Item from the <RouterLink to="/user/ArkenGiveaways/inventory">Giveaway Wallet</RouterLink> that wasn't
                given away. Time to search the inventory...
              </>,
              <>Entry Requirement: None</>,
              <>Winner: Lazy</>,
              <>
                Lazy: 5 <Coin />
              </>,
              <>
                Binzy: 5 <Coin />
              </>,
            ],
          },
          {
            content: (
              <>
                <strong>#3 - $100 Cash</strong>
              </>
            ),
            status: 'done',
            notes: [
              <>We're talking cold hard cash here...</>,
              <>Entry Requirement: Have won 1 previous reward.</>,
              <>Winner: Maiev</>,
              <>
                Maiev: 20 <Coin />
              </>,
              <>
                Sam: 10 <Coin />
              </>,
              <>
                Riccardo: 10 <Coin />
              </>,
            ],
          },
          {
            content: (
              <>
                <strong>#4 - Zavox Ticket</strong>
              </>
            ),
            status: 'done',
            notes: [
              <>You definitely like RNG.</>,
              <>Entry Requirement: None</>,
              <>Winner: Matheus</>,
              <>
                Binzy: 2 <Coin />
              </>,
              <>
                Matheus: 2 <Coin />
              </>,
              <>
                Ekke: 1 <Coin />
              </>,
              <>
                Disco: 1 <Coin />
              </>,
              <>
                Lazy: 1 <Coin />
              </>,
            ],
          },
          {
            content: (
              <>
                <strong>#5 - Character Slot Redemption Scroll</strong>
              </>
            ),
            status: 'done',
            notes: [
              <>This is the same scroll that's transmuted using 1 ZOD.</>,
              <>Entry Requirement: None</>,
              <>Winner: Disco</>,
              <>
                Disco: 3 <Coin />
              </>,
              <>
                Binzy: 3 <Coin />
              </>,
              <>
                Maiev: 2 <Coin />
              </>,
              <>
                Ekke: 1 <Coin />
              </>,
              <>
                Lazy: 1 <Coin />
              </>,
            ],
          },
          {
            content: (
              <>
                <strong>#6 - Dev Fee Acquisition</strong>
              </>
            ),
            status: 'done',
            notes: [
              <>You'll receive 0.1% of all RXS transactions for the next month. Yum.</>,
              <>Entry Requirement: Have won 1 previous reward. Have not won this reward already this year.</>,
              <>Winner: Riccardo</>,
              <>
                Riccardo: 10 <Coin />
              </>,
            ],
          },
          {
            content: (
              <>
                <strong>#7 - Binzy's Blessing</strong>
              </>
            ),
            status: 'done',
            notes: [
              <>You'll receive one random item from Binzy.</>,
              <>Entry Requirement: None</>,
              <>Winner: Disco</>,
              <>
                Disco: 60 <Coin />
              </>,
              <>
                Monk: 40 <Coin />
              </>,
              <>
                Jon: 35 <Coin />
              </>,
              <>
                Riccardo: 10 <Coin />
              </>,
              <>
                Lazy: 2 <Coin />
              </>,
            ],
          },
          {
            content: (
              <>
                <strong>#8 - General's Medallion</strong>
              </>
            ),
            status: 'done',
            notes: [
              <>You'll receive one Magical General's Medallion.</>,
              <>Entry Requirement: None</>,
              <>Winner: Disco</>,
              <>
                Disco: 100 <Coin />
              </>,
              <>
                Firelord: 80 <Coin />
              </>,
              <>
                Jon: 20 <Coin />
              </>,
              <>
                Sam: 5 <Coin />
              </>,
              <>
                Lazy: 5 <Coin />
              </>,
            ],
          },
          {
            content: (
              <>
                <strong>#9 - Character</strong>
              </>
            ),
            status: 'done',
            notes: [
              <>You'll receive one Arken character (choose your class).</>,
              <>Entry Requirement: None</>,
              <>Winner: Maiev</>,
              <>
                Matheus: 5 <Coin />
              </>,
              <>
                Binzy: 5 <Coin />
              </>,
              <>
                Maiev: 5 <Coin />
              </>,
              <>
                Ekke: 5 <Coin />
              </>,
              <>
                Lazy: 5 <Coin />
              </>,
            ],
          },
        ],
      },
      {
        content: (
          <>
            <strong>#3 (October, 2022)</strong>
          </>
        ),
        status: 'pending',
        goals: [
          {
            content: (
              <>
                <strong>#1 - 50 Zavox Tickets</strong>
              </>
            ),
            status: 'pending',
            notes: [
              <>That's a lot of Zavox, think of the possibilities...</>,
              <>Entry Requirement: None</>,
              <>Winner: TBD</>,
            ],
          },
          {
            content: (
              <>
                <strong>#2 - Giveaway Item</strong>
              </>
            ),
            status: 'pending',
            notes: [
              <>
                Item from the <RouterLink to="/user/ArkenGiveaways/inventory">Giveaway Wallet</RouterLink> that wasn't
                given away. Time to search the inventory...
              </>,
              <>Entry Requirement: None</>,
              <>Winner: TBD</>,
            ],
          },
          {
            content: (
              <>
                <strong>#3 - $50 Cash</strong>
              </>
            ),
            status: 'pending',
            notes: [
              <>We're talking cold hard cash here...</>,
              <>Entry Requirement: Have won 1 previous reward.</>,
              <>Winner: TBD</>,
            ],
          },
          {
            content: (
              <>
                <strong>#4 - Zavox Ticket</strong>
              </>
            ),
            status: 'pending',
            notes: [<>You definitely like RNG.</>, <>Entry Requirement: None</>, <>Winner: TBD</>],
          },
          {
            content: (
              <>
                <strong>#5 - Character Slot Redemption Scroll</strong>
              </>
            ),
            status: 'pending',
            notes: [
              <>This is the same scroll that's transmuted using 1 ZOD.</>,
              <>Entry Requirement: None</>,
              <>Winner: TBD</>,
            ],
          },
          {
            content: (
              <>
                <strong>#6 - Dev Fee Acquisition</strong>
              </>
            ),
            status: 'pending',
            notes: [
              <>You'll receive 0.1% of all RXS transactions for the next month. Yum.</>,
              <>Entry Requirement: Have won 1 previous reward. Have not won this reward already this year.</>,
              <>Winner: TBD</>,
            ],
          },
          {
            content: (
              <>
                <strong>#7 - Binzy's Blessing</strong>
              </>
            ),
            status: 'pending',
            notes: [<>You'll receive one random item from Binzy.</>, <>Entry Requirement: None</>, <>Winner: TBD</>],
          },
          {
            content: (
              <>
                <strong>#8 - General's Medallion</strong>
              </>
            ),
            status: 'pending',
            notes: [
              <>You'll receive one Magical General's Medallion.</>,
              <>Entry Requirement: None</>,
              <>Winner: TBD</>,
            ],
          },
          {
            content: (
              <>
                <strong>#9 - Character</strong>
              </>
            ),
            status: 'pending',
            notes: [
              <>You'll receive one Arken character (choose your class).</>,
              <>Entry Requirement: None</>,
              <>Winner: TBD</>,
            ],
          },
        ],
      },
    ],
  };

  return (
    <Page>
      <PageWindow>
        {collapseTeam ? (
          <Card>
            <Heading
              as="h2"
              size="xl"
              style={{ textAlign: 'center', marginTop: 15, marginBottom: 15 }}
              onClick={() => setCollapseTeam(false)}
              css={css`
                &:hover {
                  cursor: url('/images/cursor3.png'), pointer;
                }
              `}>
              Show Team
            </Heading>
          </Card>
        ) : (
          <Card>
            <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
              Team
            </Heading>
            <hr />
            <CardBody>
              <TeamComponent match={match} />
            </CardBody>
          </Card>
        )}
        <div id="join" ref={joinRef} />
        <br />
        <br />
        {collapseJoin ? (
          <Card>
            <Heading
              as="h2"
              size="xl"
              style={{ textAlign: 'center', marginTop: 15, marginBottom: 15 }}
              onClick={() => setCollapseJoin(false)}
              css={css`
                &:hover {
                  cursor: url('/images/cursor3.png'), pointer;
                }
              `}>
              Show Join
            </Heading>
          </Card>
        ) : (
          <Card>
            <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
              Join Arken <PerformanceTag>Currently Only Mods</PerformanceTag>
            </Heading>
            <hr />
            <CardBody>
              Arken is a diverse team around the world, but one thing that brings us together is a love for dark fantasy
              RPGs, and... gambling 😂
              <br />
              <br />
              <strong>Perks:</strong>
              <ul>
                <li>Build cool shit</li>
                <li>Like-minded gaming enthusiasts</li>
                <li>Work anywhere in the world from home</li>
                <li>Flat hierarchy with zero time or space for politics</li>
                <li>Internal raffles with interesting rewards</li>
                <li>Item or rune bonuses from time-to-time</li>
              </ul>
              <br />
              <hr />
              <br />
              <Heading as="h4" size="lg">
                Open Positions
              </Heading>
              <br />
              <div>Currently available positions:</div>
              <ul>
                <li>Telegram Mods (volunteer)</li>
                <li>RPG Enthusiasts (volunteer)</li>
              </ul>
              <br />
              <div>Unfortunately, due to market conditions it has forced us to put a pause on salary hires.</div>
              <br />
              <Heading as="h4" size="lg" mb="10px">
                Interested in helping anyway?
              </Heading>
              <div>
                Arken was built from the ground up by the community. We believe in community. If you're somebody who
                understands <RouterLink to="/about">our vision</RouterLink> and wants to be part of building the Rune
                Metaverse, please reach out on{' '}
                <a target="_blank" rel="noreferrer noopener" href="https://discord.gg/rune">
                  Discord
                </a>{' '}
                or{' '}
                <a target="_blank" rel="noreferrer noopener" href={`https://t.me/ArkenRealms`}>
                  Telegram
                </a>
                . When the market gives us the opportunity, we'll look at our volunteers for the first hires. It takes a
                lot to build a game, and it takes a lot more to build a Metaverse. Here are some ideas of things we need
                help with:
              </div>
              <br />
              <ol>
                <li>Working with the Arken Lorekeepers on Sanctuary storyline/act structure</li>
                <li>Working with the Arken Blacksmiths on item descriptions and/or create from scratch</li>
                <li>Come up with enemies/monster data to populate through the world (spreadsheet)</li>
                <li>Come up with good skill combination ideas, or balancing suggestions</li>
                <li>Come up with interesting boss designs (before we hire the professional artists)</li>
                <li>Help assigning sound FX files to our skills, or even future skills</li>
                <li>
                  Design the towns/landscape with Inkarnate (basis has already been created by a professional but each
                  zone needs detailing)
                </li>
                <li>Design levels for Arken: Heart of the Oasis or Arken: Infinite Arena</li>
              </ol>
              <br />
              <hr />
              <br />
              <Heading as="h4" size="lg" mb="10px">
                Riccardo's Raffle{' '}
                <img src="/images/items/01220.png" style={{ width: 30, height: 30, verticalAlign: 'middle' }} />
              </Heading>
              One of the perks of the team is the internal raffle. On top of our desire to greatly reward the early Rune
              supporters, like The First Order, also want to reward our mods, admins, and team members. When that's more
              realistic, it will take a higher priority. In the meantime, we'll have some fun with what we call
              Riccardo's Raffle.
              <br />
              <br />
              Depending on how much work you do each month, you'll receive X coins. Every month, or maybe a specific
              event, you can bid against each other for some kind of benefit, or just hoard them. They can only be used
              by the team (bind on pickup).
              <br />
              <br />
              <ul>
                <li>
                  1 <Coin /> = Still around but not active
                </li>
                <li>
                  3 <Coin /> = Somewhat active / not much contribution
                </li>
                <li>
                  5 <Coin /> = Normal activity / contributions
                </li>
                <li>
                  10 <Coin /> = Very active / great contributions
                </li>
                <li>
                  30 <Coin /> = MVP of the month
                </li>
              </ul>
              <br />
              Some ideas of what you could bid on:
              <br />
              <ul>
                <li>
                  50 <RouterLink to="/item/zavoxs-fortune">Zavox Fortune tickets</RouterLink>
                </li>
                <li>Dev fee recipient - 0.1% of RXS sales would go to your address</li>
                <li>Item from the giveaway wallet that wasn't given away</li>
                <li>
                  Access to <RouterLink to="/guild/1">The First Order</RouterLink> (limited)
                </li>
                <li>???</li>
              </ul>
              <br />
              So basically everyone has a month to figure out which one you want, and how many coins they're going to
              bid to win it. It's informal, negotiation is in team chat, or privately if needed but the final bid needs
              to be visible in team chat.
              <br />
              <br />
              <strong>Example:</strong>
              <br />
              <ul>
                <li>
                  <strong>Riccardo:</strong> bid 3 coins on dev fee
                </li>
                <li>
                  <strong>Binzy:</strong> bid 5 on dev fee
                </li>
                <li>
                  <strong>Maiev:</strong> bid 6 on dev fee
                </li>
                <li>
                  <strong>Binzy:</strong> too rich for my blood
                </li>
                <li>
                  <strong>Riccardo:</strong> what have I done?
                </li>
                <li>
                  <strong>Maiev:</strong> I am the champion, now where's my thermal paste
                </li>
              </ul>
              <br />
              <strong>Notes:</strong>
              <ol>
                <li>
                  We could adjust the timeline as needed (currently 1 month), and the options could change (could be a
                  pro or con)
                </li>
                <li>
                  Only for active team members, and amounts determined will be by council (everybody will have a chance
                  to get something but not every month)
                </li>
              </ol>
            </CardBody>
          </Card>
        )}

        <div id="raffle" ref={raffleRef} />
        <br />
        <RiccardoContainer>
          <CardCustom className="lore-container">
            <div className="sitenav-sub" style={{ width: '100%' }}>
              <div>
                <div className="w-layout-grid grid-3">
                  <div className="subnav-list first">
                    <div className="text-block-3">Round</div>
                    <div className="w-layout-grid grid-subnav-list">
                      {roadmap.phases.map((phase, index) => (
                        <div
                          className={`subnavlink w-inline-block ${index === selectedPhase ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedPhase(index);
                            setSelectedGoal(0);
                          }}>
                          <ProgressIcon status={phase.status} />
                          <div>{phase.content}</div>
                        </div>
                      ))}
                    </div>
                    <div className="subnavcolshadow"></div>
                  </div>
                  <div className="subnav-list">
                    <div className="text-block-3">Rewards</div>
                    <div className="w-layout-grid grid-subnav-list">
                      {roadmap.phases[selectedPhase].goals.map((goal, index) => (
                        <div
                          className={`subnavlink w-inline-block ${index === selectedGoal ? 'selected' : ''}`}
                          onClick={() => setSelectedGoal(index)}>
                          <div>{goal.content}</div>
                        </div>
                      ))}
                    </div>
                    <div className="subnavcolshadow"></div>
                  </div>
                  <div className="subnav-list">
                    <div className="text-block-3">Notes</div>
                    <div className="w-layout-grid grid-subnav-list">
                      {roadmap.phases[selectedPhase].goals[selectedGoal].notes.map((note, index) => (
                        <div className="subnavlink w-inline-block">
                          <div>{note}</div>
                        </div>
                      ))}
                    </div>
                    <div className="subnavcolshadow"></div>
                  </div>
                </div>
              </div>
              <div className="div-block-23"></div>
            </div>
          </CardCustom>
        </RiccardoContainer>
      </PageWindow>
    </Page>
  );
};

export default Team;
