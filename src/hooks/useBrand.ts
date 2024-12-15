import { useState, useEffect } from 'react';
import routerHistory from '~/routerHistory';

const BrandMap = {
  localhost: 'arken',
  'arken.localhost': 'arken',
  'raids.localhost': 'raids',
  'evolution.localhost': 'evolution',
  'guardians.localhost': 'guardians',
  'infinite.localhost': 'infinite',
  'oasis.localhost': 'oasis',
  'isles.localhost': 'isles',
  'binzy.localhost': 'binzy',
  'foundation.localhost': 'foundation',

  'arken-prod.asi.sh': 'arken',
  'arken-beta.asi.sh': 'arken',
  'arken.gg': 'arken',
  'swap.arken.gg': 'rune',
  'dev.arken.gg': 'arken',
  'beta.arken.gg': 'arken',
  'evolution.arken.gg': 'evolution',
  'infinite.arken.gg': 'infinite',
  'oasis.arken.gg': 'oasis',
  'raids.arken.gg': 'raids',
  'strike.arken.gg': 'strike',
  'isles.arken.gg': 'isles',

  'playarken.com': 'arken',
  'arken.games': 'arken',
  'arkenrealm.com': 'arken',
  'arkenrealms.com': 'arken',
  'arkenmetaverse.com': 'arken',
  'arkenverse.com': 'arken',
  'arkenisles.com': 'evolution',
  'arkenarena.com': 'infinite',
  'arkenoasis.com': 'oasis',
  'arkenraids.com': 'raids',
  'arkenstrike.com': 'strike',
  'arkenguardians.com': 'guardians',

  'runicraids.com': 'raids',
  'evolutionisles.com': 'evolution',
  'infinitearena.com': 'infinite',
  'heartoftheoasis.com': 'oasis',
  'guardiansunleashed.com': 'guardians',

  'return.gg': 'return',
  'portal.return.gg': 'return',
  'returntotheoasis.com': 'return',

  'meme.now': 'return',
  'isles.meme.now': 'return',

  'binzy.ai': 'binzy',

  'game.foundation': 'foundation',
};

export const useBrand = () => {
  const [host, setHost] = useState(window?.location?.hostname);
  const [brand, setBrand] = useState(BrandMap[host]);

  useEffect(
    function () {
      const listener = routerHistory.listen(function () {
        if (brand !== 'arken' && ['/evolution', '/raids', '/infinite', '/oasis'].includes(window?.location?.pathname)) {
          setBrand('arken');
          console.log(5555, 'Set brand: arken');
        }
        if (brand !== 'return' && ['/isles'].includes(window?.location?.pathname)) {
          setBrand('return');
          console.log(5555, 'Set brand: return');
        }
        if (brand !== 'return' && window?.location?.pathname.startsWith('/service')) {
          setBrand('return');
          console.log(5555, 'Set brand: return');
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
