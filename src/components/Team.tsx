import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import useMatchBreakpoints from '~/hooks/useMatchBreakpoints';
import { BaseLayout, Button, Flex, Heading, Text } from '~/ui';

const Cards = styled(BaseLayout)`
  margin-bottom: 32px;

  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 0;
  zoom: 0.25;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: repeat(3, 1fr);
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    zoom: 0.5;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: min-content;
    & > div {
      width: 364px;
      height: 296px;
    }
  }
`;

const TeamCard = ({ member, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      css={css`
        position: relative;
      `}>
      {member.handle ? (
        <>
          <div
            css={
              isSelected
                ? css`
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 1;
                    background: url(/images/team-bg-active.png) no-repeat 0 100%;
                  `
                : css`
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 1;
                    background: url(/images/team-bg-inactive.png) no-repeat 0 100%;

                    &:hover {
                      background: url(/images/team-bg-active.png) no-repeat 0 100%;
                      cursor: url('/images/cursor3.png'), pointer;
                    }
                  `
            }></div>
          <div
            css={css`
              position: absolute;
              width: 100%;
              height: calc(100% + 100px);
              top: -112px;
              left: 12px;
              z-index: 2;
              background: url(${member.image}) no-repeat 0 100%;
              pointer-events: none;
            `}></div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

const SelectedTeamMember = ({ member }) => {
  if (!member.name) return <></>;
  return (
    <>
      <div
        css={css`
          text-align: center;
          overflow: hidden;
          height: 1100px;
          width: 100%;
          margin: 0 auto;
          ul {
            padding-left: 5px;
          }
          ${({ theme }) => theme.mediaQueries.lg} {
            width: 470px;
            height: 1100px;
            ul {
              padding-left: 40px;
            }
          }
        `}>
        {member ? (
          <>
            <div
              css={css`
                height: 500px;
                position: relative;
                overflow: hidden;
                margin-bottom: 20px;
                ${({ theme }) => theme.mediaQueries.lg} {
                  margin: 0 auto 20px auto;
                  width: 400px;
                  height: 500px;
                }
              `}>
              <div
                css={css`
                  position: absolute;
                  bottom: 0px;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  z-index: 1;
                  background: url(/images/team-bg-big.png) no-repeat 50% 0;
                  background-size: 500px;
                `}></div>
              <div
                css={css`
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  z-index: 3;
                  background: url(/images/team-shadow.png) no-repeat 0 0;
                `}></div>
              <div
                css={css`
                  width: 100%;
                  height: 100%;
                  background: url(${member.imageBig}) no-repeat 50% 0%;
                  background-size: 600px;
                  z-index: 2;
                  position: absolute;
                  bottom: 0px;
                  left: 0;
                `}></div>
            </div>
            <Button
              css={css`
                zoom: 1.3;
                font-size: 1.4rem;
              `}>
              {member.handle}
            </Button>
            {member.name && member.name !== member.handle ? (
              <>
                <h2
                  css={css`
                    margin-top: 20px;
                    font-size: 1.3rem;
                    color: #fff;
                  `}>
                  {member.name}
                </h2>
                <h2
                  css={css`
                    font-size: 1.3rem;
                  `}>
                  {member.title}
                </h2>
              </>
            ) : (
              <>
                <h2
                  css={css`
                    margin-top: 20px;
                    font-size: 1.3rem;
                  `}>
                  {member.title}
                </h2>
              </>
            )}

            {member.socials?.linkedin || member.socials?.twitter ? (
              <h2
                css={css`
                  margin: 5px 0;
                `}>
                {member.socials.linkedin ? (
                  <a
                    href={member.socials.linkedin}
                    target="_blank"
                    rel="noreferrer noopener"
                    css={css`
                      padding: 2px;
                      border-bottom: 1px solid #fff;
                      margin: 0 5px;
                    `}>
                    LinkedIn
                  </a>
                ) : null}
                {member.socials.twitter ? (
                  <a
                    href={member.socials.twitter}
                    target="_blank"
                    rel="noreferrer noopener"
                    css={css`
                      padding: 2px;
                      border-bottom: 1px solid #fff;
                      margin: 0 5px;
                    `}>
                    Twitter
                  </a>
                ) : null}
              </h2>
            ) : null}
            <ul
              css={css`
                text-align: left;
                margin-top: 40px;
              `}>
              {member.bio?.map((bioItem, index) => <li key={index}>{bioItem}</li>)}
            </ul>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

const Team = ({ showAll = true, match }) => {
  const { id: idStr }: { id: string } = match.params;
  const id = Number(idStr);
  const team = [
    {
      name: '',
    },
    {
      name: 'Eric M.',
      handle: 'Memefella',
      title: 'Meme Czar',
      image: '/images/team/jake-anime.png',
      imageBig: '/images/team/jake-anime-big.png',
      isDoxxed: false,
      socials: { linkedin: 'https://www.linkedin.com/in/ericmuyser' },
      bio: [
        `20 years’ experience programming (C++/C#/Python/Go/Node/etc).`,
        `9 years’ experience of research, development and investment within the crypto space.`,
        `4 years’ experience advising crypto startups and mentoring best software industry practices.`,
        `10 years’ experience developing games.`,
        `3 years’ experience with Solidity.`,
        `6 years’ experience with Unity.`,
        `2 years’ experience in graphic design, UI and UX.`,
        `Contract work for various SF startups and Fortune 500 corporations.`,
      ],
    },
    {
      name: '',
    },
    // {
    //   name: 'Kevin L.',
    //   handle: 'Zaranero',
    //   title: 'Director of Business',
    //   image: '/images/team/kevin-anime.png',
    //   imageBig: '/images/team/kevin-anime-big.png',
    //   isDoxxed: true,
    //   socials: {
    //     linkedin: `https://www.linkedin.com/in/kevin-lamela-aa51665b/`,
    //   },
    //   bio: [
    //     `10 years’ experience specializing in Sales, Turnkey Services, and Leadership roles.`,
    //     `2 years’ experience in the legal publishing industry, 8 years’ experience in the energy sector.`,
    //     `Current GM/COO of a publicly traded energy company in the Philippines.`,
    //     `Current Director for an Energy Solutions provider that caters to commercial and industrial customers in Southeast Asia, powering data centers, cryptocurrency mining facility, manufacturing and optoelectronic industry.`,
    //   ],
    // },
    // {
    //   name: 'Matt D.',
    //   handle: 'Duffles',
    //   title: 'Director of Engineering',
    //   image: '/images/team/matt-anime.png',
    //   imageBig: '/images/team/matt-anime-big.png',
    //   isDoxxed: false,
    //   socials: {},
    //   bio: [
    //     `12 years’ experience in several engineering, architecture, innovation and management roles at a big 4 UK bank.`,
    //     `12 months’ experience as a cloud cybersecurity specialist for the same institution.`,
    //     `18 months’ experience in developer and platform engineering at Microsoft UK.`,
    //     `BSc in Applied Computer Science.`,
    //   ],
    // },
    {
      name: 'Ramir G.',
      handle: 'Maiev',
      title: 'Director of Meat',
      image: '/images/team/ramir-anime.png',
      imageBig: '/images/team/ramir-anime-big.png',
      isDoxxed: false,
      socials: {
        linkedin: 'https://www.linkedin.com/in/ramir-gener-54b83bb4/',
      },
      bio: [
        `3 years’ experience in Project management and Continuous Improvement.`,
        `6.5 years’ experience in Customer Service.`,
        `Worked for: Hewlett Packard, United Health Group, Shell Shared Services Asia.`,
        `BSc in Business Administration, Major in Business Management.`,
      ],
    },
    // {
    //   name: 'Josh B.',
    //   handle: 'Ekkeharta',
    //   title: 'Director of Game Design',
    //   image: '/images/team/josh-anime.png',
    //   imageBig: '/images/team/josh-anime-big.png',
    //   isDoxxed: false,
    //   socials: {
    //     linkedin: 'https://www.linkedin.com/in/joshdb/',
    //   },
    //   bio: [
    //     `9 years' experience designing, executing, and reporting psychology research.`,
    //     `9 years' experience in data analysis.`,
    //     `7 years' programming experience.`,
    //     `5 years' experience leading a cognitive psychology research lab.`,
    //     `5 years' experience teaching research methods & cognitive psychology.`,
    //     `Ph.D. in Engineering Psychology (ABD, est. June 2022).`,
    //   ],
    // },
    // {
    //   name: 'Andree B.',
    //   handle: 'Andree',
    //   title: 'Director of Game Development',
    //   image: '/images/team/andree-anime.png',
    //   imageBig: '/images/team/andree-anime-big.png',
    //   isDoxxed: false,
    //   socials: {
    //     linkedin: 'https://www.linkedin.com/in/andr%C3%A9e-burlamaqui-70b086217/',
    //   },
    //   bio: [
    //     `Finalist at “Best Student Game” on SBGames 2020, game made solo.`,
    //     `Article about "Good practices for indie-solo developers" published worldwide by the magazine Acta Ludologica, on Vol. 4.`,
    //     `Programmer and Illustrator on "Caruani". Nominated on students categories “Winner at Best Art”,  “Finalist at Best Sound Design” and “Finalist at Best Game” with honourable mention.`,
    //   ],
    // },
    // {
    //   name: 'Liviu G.',
    //   handle: 'Liviu',
    //   title: 'Director of Game Development',
    //   image: '/images/team/liviu-anime.png',
    //   imageBig: '/images/team/liviu-anime-big.png',
    //   isDoxxed: false,
    //   socials: {
    //     linkedin: 'https://www.linkedin.com/in/globaliviu/',
    //   },
    //   bio: [
    //     `11 years experience in game development.`,
    //     `3 years experience in robotics engineering, doing VR/AR simulations for robots and industrial use.`,
    //     `Lead game developer for 2 VR games on Steam: Thirst VR, Block Wave VR.`,
    //     `BSc in Informatics and Mathematics.`,
    //   ],
    // },
    // {
    //   name: 'Andrew V.',
    //   handle: 'Advarsky',
    //   title: 'Director of Art',
    //   image: '/images/team/andrew-anime.png',
    //   imageBig: '/images/team/andrew-anime-big.png',
    //   isDoxxed: false,
    //   socials: {
    //     linkedin: 'https://www.linkedin.com/in/andrey-vyalkov-853509225/',
    //   },
    //   bio: [
    //     `10 years' experience with 2d art (illustration, storytelling, concept art, pixel art).`,
    //     `6 years' in game development (game design, coding, Unity3d).`,
    //     `BSc in Electronic Systems, MSc in Fluid Dynamics.`,
    //   ],
    // },
    // {
    //   name: 'Jackson D.',
    //   handle: 'Vaedra',
    //   title: 'Director of Publishing',
    //   image: '/images/team/jackson-anime.png',
    //   imageBig: '/images/team/jackson-anime-big.png',
    //   isDoxxed: false,
    //   socials: {
    //     linkedin: 'https://www.linkedin.com/in/jacksonduckworth/',
    //   },
    //   bio: [
    //     `2 years' experience in freelance content writing and editing.`,
    //     `3 years' experience as Editor-in-Chief for an academic philosophy journal.`,
    //     `4 years' experience coaching academic and professional writing / editing.`,
    //     `10+ years' experience in mapmaking, storywriting, and as Dungeon Master (D&D/ RPGs).`,
    //     `BSc in Honours Philosophy.`,
    //   ],
    // },
    // {
    //   name: 'Jake G.',
    //   handle: 'Blackbeard',
    //   title: 'Director of Social Media',
    //   image: '/images/team/jake-anime.png',
    //   imageBig: '/images/team/jake-anime-big.png',
    //   isDoxxed: false,
    //   socials: {
    //     linkedin: 'https://www.linkedin.com/in/jakegriffus/',
    //     twitter: 'https://twitter.com/BlackBeardxRUNE/',
    //   },
    //   bio: [
    //     `10 years' experience in marketing & advertising.`,
    //     `7 years' experience in social media marketing.`,
    //     `5 years' experience in business management.`,
    //     `2 years' experience as a business owner.`,
    //     `Associates Degree in Marketing.`,
    //   ],
    // },
    ...(showAll
      ? [
          // {
          //   name: 'Alex D.',
          //   handle: 'AlexD',
          //   title: 'Lead Game Developer',
          //   image: '/images/team/alex-anime.png',
          //   imageBig: '/images/team/alex-anime-big.png',
          //   isDoxxed: false,
          //   socials: {},
          //   bio: [
          //     `5 years’ 3D experience.`,
          //     `3 years’ Unity experience.`,
          //     `Worked on AR projects for: Nickelodeon, Adidas, Red Bull, LG U+, Softbank, eyecandylab.`,
          //     `BSc in Biotechnology Engineering, MSc in Molecular Genetics.`,
          //   ],
          // },
          // {
          //   name: 'Julian F.',
          //   handle: 'julian',
          //   title: 'Lead Music Composer',
          //   image: '/images/team/julian-anime.png',
          //   imageBig: '/images/team/julian-anime-big.png',
          //   isDoxxed: false,
          //   socials: {
          //     linkedin: 'https://www.linkedin.com/in/julianrfogel/',
          //   },
          //   bio: [
          //     `10 years’ experience in music production`,
          //     `Clients include Element Animation/Mojang, Utah University, Valnet Inc.`,
          //     `MA in Composition for Scenic & Audiovisual Media`,
          //     `Licenciate in Music (Orchestral Conducting orientation)`,
          //   ],
          // },
          // {
          //   name: 'Maxwell V.',
          //   handle: 'Max',
          //   title: 'Lead Marketing Developer',
          //   image: '/images/team/max-anime.png',
          //   imageBig: '/images/team/max-anime-big.png',
          //   isDoxxed: false,
          //   socials: {},
          //   bio: [],
          // },
          // {
          //   name: 'Omar Panduro',
          //   handle: 'PanzJr',
          //   title: 'Lead Graphic Designer',
          //   image: '/images/team/omar-anime.png',
          //   imageBig: '/images/team/omar-anime-big.png',
          //   isDoxxed: false,
          //   socials: {},
          //   bio: [],
          // },
          // {
          //   name: 'Angel',
          //   handle: 'Angel',
          //   title: 'Game Developer',
          //   image: '/images/team/angel-anime.png',
          //   imageBig: '/images/team/angel-anime-big.png',
          //   isDoxxed: false,
          //   socials: {},
          //   bio: [],
          // },
          // {
          //   name: 'Oh Wei',
          //   handle: 'ohwei',
          //   title: 'Graphic Designer',
          //   image: '/images/team/oh-wei-anime.png',
          //   imageBig: '/images/team/oh-wei-anime-big.png',
          //   isDoxxed: false,
          //   socials: {},
          //   bio: [],
          // },
          // {
          //   name: 'Antoine R.',
          //   handle: 'antoine',
          //   title: 'Concept Designer',
          //   image: '/images/team/antoine-anime.png',
          //   imageBig: '/images/team/antoine-anime-big.png',
          //   isDoxxed: false,
          //   socials: {},
          //   bio: [],
          // },
          // {
          //   name: 'Ricardo',
          //   handle: 'Lionheart',
          //   title: 'Community Manager',
          //   image: '/images/team/ricardo-anime.png',
          //   imageBig: '/images/team/ricardo-anime-big.png',
          //   isDoxxed: false,
          //   socials: {},
          //   bio: [],
          // },
          // {
          //   name: 'Panda',
          //   handle: 'Panda',
          //   title: 'Stream Wizard',
          //   image: '/images/team/panda-anime.png',
          //   imageBig: '/images/team/panda-anime-big.png',
          //   isDoxxed: false,
          //   socials: {},
          //   bio: [`Played a lot of games`],
          // },
          {
            name: 'Discomonk',
            handle: 'Discomonk',
            title: 'Community Manager',
            image: '/images/team/discomonk-anime.png',
            imageBig: '/images/team/discomonk-anime-big.png',
            isDoxxed: false,
            socials: {},
            bio: [],
          },
          {
            name: 'Riccardo',
            handle: 'Riccardo',
            title: 'Community Manager',
            image: '/images/team/riccardo-anime.png',
            imageBig: '/images/team/riccardo-anime-big.png',
            isDoxxed: false,
            socials: {
              linkedin: 'https://www.linkedin.com/in/riccardo-rune-215438225/',
            },
            bio: [],
          },
          // {
          //   name: 'Lazy',
          //   handle: 'Lazy',
          //   title: 'Guild General',
          //   image: '/images/team/lazy-anime.png',
          //   imageBig: '/images/team/lazy-anime-big.png',
          //   isDoxxed: false,
          //   socials: {},
          //   bio: [],
          // },
          // {
          //   name: 'Wingedspawn',
          //   handle: 'Wingedspawn',
          //   title: 'Mod',
          //   image: '/images/team/wingedspawn-anime.png',
          //   imageBig: '/images/team/wingedspawn-anime-big.png',
          //   isDoxxed: false,
          //   socials: {},
          //   bio: [],
          // },
          // {
          //   name: 'Monk',
          //   handle: 'Monk',
          //   title: 'Mod',
          //   image: '/images/team/monk-anime.png',
          //   imageBig: '/images/team/monk-anime-big.png',
          //   isDoxxed: false,
          //   socials: {},
          //   bio: [],
          // },
          // {
          //   name: 'Matheus',
          //   handle: 'Matheus',
          //   title: 'Mod',
          //   image: '/images/team/matheus-anime.png',
          //   imageBig: '/images/team/matheus-anime-big.png',
          //   isDoxxed: false,
          //   socials: {},
          //   bio: [],
          // },
          // {
          //   name: 'Firelord',
          //   handle: 'Firelord',
          //   title: 'Mod',
          //   image: '/images/team/firelord-anime.png',
          //   imageBig: '/images/team/firelord-anime-big.png',
          //   isDoxxed: false,
          //   socials: {},
          //   bio: [],
          // },
          // {
          //   name: 'Scrooge McDucky',
          //   handle: 'Scrooge McDucky',
          //   title: 'Mod',
          //   image: '/images/team/scrooge-anime.png',
          //   imageBig: '/images/team/scrooge-anime-big.png',
          //   isDoxxed: false,
          //   socials: {},
          //   bio: [],
          // },
          // {
          //   name: 'Ivan',
          //   title: 'Game Developer',
          //   image: '/images/team/ivan-anime.png',
          //   imageBig: '/images/team/ivan-anime-big.png',
          //   isDoxxed: false,
          //   socials: {
          //   },
          //   bio: [
          //   ]
          // },
        ]
      : []),
  ];
  const [selectedTeamMember, setSelectedTeamMember] = useState(team.find((t) => t.name === 'Eric M.'));

  const { isMd, isLg, isXl, isXxl, isXxxl } = useMatchBreakpoints();
  const isSmall = !isXxxl;

  return isSmall ? (
    <Flex
      flexDirection="column"
      alignItems="flex-start"
      justifyContent="center"
      style={{ width: '100%', marginBottom: '30px' }}>
      <div
        css={css`
          text-align: center;
          margin: 0 auto 50px;
        `}>
        <Heading size="lg" mb="30px" mt="0">
          Choose Your Hero
        </Heading>

        <Cards style={{ height: showAll ? '3000px' : '1190px' }}>
          {team.map((teamMember, index) => {
            return (
              <TeamCard
                key={teamMember.name + index}
                member={teamMember}
                onClick={() => setSelectedTeamMember(teamMember)}
                isSelected={selectedTeamMember?.name === teamMember.name}
              />
            );
          })}
        </Cards>
      </div>
      <SelectedTeamMember member={selectedTeamMember} />
    </Flex>
  ) : (
    <Flex flexDirection="row" alignItems="flex-start" justifyContent="center" style={{ width: '100%' }}>
      <SelectedTeamMember member={selectedTeamMember} />
      <div
        css={css`
          text-align: center;
        `}>
        <Heading size="lg" mb="60px">
          Choose Your Hero
        </Heading>

        <Cards style={{ height: showAll ? '3000px' : '1190px' }}>
          {team.map((teamMember, index) => {
            return (
              <TeamCard
                key={teamMember.name + index}
                member={teamMember}
                onClick={() => setSelectedTeamMember(teamMember)}
                isSelected={selectedTeamMember?.name === teamMember.name}
              />
            );
          })}
        </Cards>
      </div>
    </Flex>
  );
};

export default Team;
