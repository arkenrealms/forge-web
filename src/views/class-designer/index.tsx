import queryString from 'query-string';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ConnectNetwork } from '~/components/ConnectNetwork';
import Page from '~/components/layout/Page';
import useWeb3 from '~/hooks/useWeb3';
import { Button } from '~/ui';

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

const ClassDesigner: React.FC = () => {
  const location = useLocation();
  const history = useNavigate();
  const match = parseMatch(location);
  const { web3 } = useWeb3();

  const tagOptions = [
    'Athletics',
    'Subtlety',
    'Illusion',
    'Conjuration',
    'Destruction',
    'Restoration',
    'Tinkering',
    'Protection',
    'Assassination',
    'Enhancement',
    'LightArmor',
    'Unarmed',
    'Melee',
    'Ranged',
    'Defense',
    'Offense',
    'Utility',
    'Movement',
    'Attack',
    'Self',
    'Ultimate',
    'Mod',
    'Summon', // Conjuration
    'Spell',
    'AoE',
    'Aura',
    'Passive',
    'Debuff',
    'Nova',
    'Healing',
    'Wall',
    'Trap',
    'Beam',
    'Buff',
    'Totem',
    'Control',
    'Fire',
    'Arcane',
    'Ice',
    'Lightning',
    'Physical',
    'Water',
    'Dark',
    'Light',
    'Poison',
    'Wind',
    'Earth',
    'Astra', // Light
    'Mana',
    'Kona', // Fire
    'Gaia',
    'Ichor', // Poison
    'Chaos', // Dark
    'Temporal',
    'Source',
  ];

  const classOptions = [
    {
      name: 'Rogue',
      tags: {
        Subtlety: 60,
        Melee: 20,
        LightArmor: 20,
      },
    },
    {
      name: 'Thief',
      tags: {
        Subtlety: 60,
        Melee: 20,
        LightArmor: 20,
      },
    },
    {
      name: 'Assassin',
      tags: {
        Subtlety: 60,
        Melee: 20,
        LightArmor: 20,
      },
    },
    {
      name: 'Ranger',
      tags: {
        Subtlety: 60,
        Melee: 20,
        LightArmor: 20,
      },
    },
    {
      name: 'Sniper',
      tags: {
        Subtlety: 60,
        Melee: 20,
        LightArmor: 20,
      },
    },
    {
      name: 'Ranger',
      tags: {
        Subtlety: 60,
        Melee: 20,
        LightArmor: 20,
      },
    },
    {
      name: 'Warrior',
      tags: {
        Subtlety: 60,
        Melee: 20,
        LightArmor: 20,
      },
    },
    {
      name: 'Warrior',
      tags: {
        Subtlety: 60,
        Melee: 20,
        LightArmor: 20,
      },
    },
    {
      name: 'Brute',
      tags: {
        Subtlety: 60,
        Melee: 20,
        LightArmor: 20,
      },
    },
    {
      name: 'Knight',
      tags: {
        Subtlety: 60,
        Melee: 20,
        LightArmor: 20,
      },
    },
    {
      name: 'Paladin',
      tags: {
        Subtlety: 60,
        Melee: 20,
        LightArmor: 20,
      },
    },
    {
      name: 'Priest',
      tags: {
        Subtlety: 60,
        Melee: 20,
        LightArmor: 20,
      },
    },
    {
      name: 'Monk',
      tags: {
        Subtlety: 60,
        Melee: 20,
        LightArmor: 20,
      },
    },
    {
      name: 'Mage',
      tags: {
        Subtlety: 60,
        Melee: 20,
        LightArmor: 20,
      },
    },
    {
      name: 'Battle Mage',
      tags: {
        Subtlety: 60,
        Melee: 20,
        LightArmor: 20,
      },
    },
    {
      name: 'Warlock',
      tags: {
        Subtlety: 60,
        Melee: 20,
        LightArmor: 20,
      },
    },
    {
      name: 'Necromancer',
      tags: {
        Subtlety: 60,
        Melee: 20,
        LightArmor: 20,
      },
    },
    {
      name: 'Druid',
      tags: {
        Subtlety: 60,
        Melee: 20,
        LightArmor: 20,
      },
    },
    {
      name: 'Bard',
      tags: {
        Subtlety: 60,
        Melee: 20,
        LightArmor: 20,
      },
    },
    {
      name: 'Artificer',
      tags: {
        Subtlety: 60,
        Melee: 20,
        LightArmor: 20,
      },
    },
  ];

  const defaultSpecialty = {};

  for (const tag of tagOptions) {
    defaultSpecialty[tag] = 0;
  }

  const [currentClassOption, setCurrentClassOption] = useState({
    name: 'None',
    tags: {},
  });
  const [speciality, setSpeciality] = useState({ ...defaultSpecialty });

  const setClass = (val) => {
    setCurrentClassOption(val);
  };

  return (
    <Page>
      <ConnectNetwork />
      <br />
      <br />
      Current Class: {currentClassOption.name}
      <br />
      Current Speciality:{' '}
      {Object.keys(speciality)
        .filter((s) => speciality[s] > 0)
        .map((specialityKey) => (
          <>
            {specialityKey}: {speciality[specialityKey]}
          </>
        ))}
      <br />
      <br />
      <input value={currentClassOption.name} />
      <br />
      <br />
      {classOptions.map((val) => {
        return <Button onClick={() => setClass(val)}>{val.name}</Button>;
      })}
    </Page>
  );
};

export default ClassDesigner;

// {/* <p>Loading {progression * 100} percent...</p> */}
