import { useState, useEffect } from 'react';
import routerHistory from '~/routerHistory';

const BrandMap = {
  localhost: 'w4',
  'arken.localhost': 'rune',
  'raid.localhost': 'raid',
  'isles.localhost': 'evolution',
  'guardians.localhost': 'guardians',
  'infinite.localhost': 'infinite',
  'oasis.localhost': 'sanctuary',

  'arken.gg': 'w4',
  'swap.arken.gg': 'rune',
  'dev.arken.gg': 'w4',
  'beta.arken.gg': 'w4',
  'isles.arken.gg': 'evolution',
  'arena.arken.gg': 'infinite',
  'oasis.arken.gg': 'sanctuary',
  'raids.arken.gg': 'raid',
  'strike.arken.gg': 'strike',

  'playarken.com': 'w4',
  'arken.games': 'w4',
  'arkenrealm.com': 'w4',
  'arkenrealms.com': 'w4',
  'arkenmetaverse.com': 'w4',
  'arkenverse.com': 'w4',
  'arkenisles.com': 'evolution',
  'arkenarena.com': 'infinite',
  'arkenoasis.com': 'sanctuary',
  'arkenraids.com': 'raid',
  'arkenstrike.com': 'strike',
  'arkenguardians.com': 'guardians',

  'runicraids.com': 'raid',
  'evolutionisles.com': 'evolution',
  'infinitearena.com': 'infinite',
  'heartoftheoasis.com': 'sanctuary',
  'guardiansunleashed.com': 'guardians',
};

export const useBrand = () => {
  const [host, setHost] = useState(window?.location?.hostname);
  const [brand, setBrand] = useState(BrandMap[host]);

  useEffect(
    function () {
      const listener = routerHistory.listen(function () {
        if (
          brand !== 'arken' &&
          ['/evolution', '/raid', '/infinite', '/sanctuary'].includes(window?.location?.pathname)
        ) {
          setBrand('arken');
          console.log(5555, 'Set brand: arken');
        }
        if (brand !== 'w4' && window?.location?.pathname.startsWith('/service')) {
          setBrand('w4');
          console.log(5555, 'Set brand: w4');
        }
      });

      return function () {
        listener();
      };
    },
    [brand, setBrand]
  );

  return {
    host,
    brand,
  };
};

export default useBrand;
