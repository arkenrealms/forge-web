import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import styled, { css } from 'styled-components';
import PageLoader from '~/components/PageLoader';
import { Flex } from '~/ui';

const isLocal = process.env.REACT_APP_RUNE_ENV === 'local';

const endpoints = {
  // cache: 'https://envoy.arken.gg',
  // coordinator: 'https://coordinator.arken.gg',
  cache: isLocal ? 'http://localhost:6001' : 'https://envoy.arken.gg',
  coordinator: isLocal ? 'http://localhost:5001' : 'https://coordinator.arken.gg',
};

const Nothing = styled.div``;

const Skills = () => {
  const { t } = useTranslation();

  const [items, setItems] = useState([]);
  const [skills, setSkills] = useState([]);
  const [currentSkill, setCurrentSkill] = useState(null);

  useEffect(() => {
    if (skills.length) return;

    const init = async function () {
      const res = ((await (await fetch(`${endpoints.cache}/skills.json`)).json()) as any) || [];

      setSkills(res.sort((a, b) => a.name.localeCompare(b.name)));
    };

    init();
  }, [skills, setSkills]);

  useEffect(() => {
    if (items.length) return;

    const init = async function () {
      const res = ((await (await fetch(`${endpoints.cache}/items.json`)).json()) as any) || [];

      setItems(res);
    };

    init();
  }, [items, setItems]);

  if (items.length === 0 && skills.length === 0) return <PageLoader />;

  return (
    <>
      <Flex flexDirection="row" alignItems="flex-start" justifyContent="center" style={{ width: '100%' }}>
        <div
          css={css`
            width: 50%;
          `}>
          {currentSkill ? (
            <>
              <strong>Name:</strong> {currentSkill.name}
              <br />
              <br />
              {/* <strong>ID:</strong> {currentSkill.id}
              <br />
              <br /> */}
              <strong>Type:</strong> {currentSkill.type || 'Attack'}
              <br />
              <br />
              <strong>Description:</strong> {currentSkill.description}
              <br />
              <br />
              <strong>Items:</strong>
              {currentSkill.items.filter((itemId) => !!items.find((item) => item.id === itemId)).length ? (
                <ul
                  css={css`
                    margin-top: 20px;
                  `}>
                  {currentSkill.items
                    .filter((itemId) => !!items.find((item) => item.id === itemId))
                    .map((itemId) => (
                      <li
                        key={itemId}
                        css={css`
                          padding-right: 10px;
                        `}>
                        <RouterLink
                          to={`/item/${items
                            .find((item) => item.id === itemId)
                            .slug.toLowerCase()
                            .replace(/ /g, '-')
                            .replace(/'/g, '')}`}>
                          {items.find((item) => item.id === itemId).name}
                        </RouterLink>
                      </li>
                    ))}
                </ul>
              ) : (
                <p>None assigned yet.</p>
              )}
              <br />
              <em>Disclaimer: The above item assignments are tentative and not guaranteed.</em>
            </>
          ) : (
            <p>No skill selected.</p>
          )}
        </div>
        <div
          css={css`
            width: 50%;
          `}>
          {skills
            .filter((s) => !!s.icon)
            .map((skill) => (
              <div
                key={'skill' + skill.id}
                onClick={() => setCurrentSkill(skill)}
                css={css`
                  display: inline-block;
                  text-align: center;
                  width: 100px;
                  height: 100px;
                  vertical-align: top;
                  line-height: 1em;
                  font-size: 0.9rem;
                  cursor: url('/images/cursor3.png'), pointer;
                `}>
                <div
                  css={css`
                    background: url(${skill.icon}) no-repeat 0 0;
                    background-size: contain;
                    width: 60px;
                    height: 60px;
                    margin: 0 auto 10px;
                  `}
                />
                {skill.name}
              </div>
            ))}
        </div>
      </Flex>
    </>
  );
};

export default Skills;
