import React, { createContext, useEffect, useMemo, useReducer } from 'react';
import BigNumber from 'bignumber.js';
import useWeb3 from '~/hooks/useWeb3';
import { getCharacterFactoryContract } from '~/utils/contractHelpers';
import { useConfig } from '~/hooks/useConfig';
import { ALLOWANCE_MULTIPLIER } from '../config';
import { Actions, State, ContextType } from './types';

const initialState: State = {
  isInitialized: false,
  currentStep: 0,
  teamId: null,
  tokenId: null,
  userName: '',
  minimumRuneRequired: null,
  allowance: null,
};

const reducer = (state: State, action: Actions): State => {
  switch (action.type) {
    case 'initialize':
      return {
        ...state,
        isInitialized: true,
        currentStep: action.step,
      };
    case 'next_step':
      return {
        ...state,
        currentStep: state.currentStep + 1,
      };
    case 'set_team':
      return {
        ...state,
        teamId: action.teamId,
      };
    case 'set_tokenid':
      return {
        ...state,
        tokenId: action.tokenId,
      };
    case 'set_username':
      return {
        ...state,
        userName: action.userName,
      };
    default:
      return state;
  }
};

export const ProfileCreationContext = createContext<ContextType>(null);

const ProfileCreationProvider: React.FC<any> = ({ children }: any) => {
  const { mintCost, registerCost } = useConfig();
  const totalCost = mintCost + registerCost;
  const allowance = totalCost * ALLOWANCE_MULTIPLIER;

  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    minimumRuneRequired: new BigNumber(totalCost).multipliedBy(new BigNumber(10).pow(18)),
    allowance: new BigNumber(allowance).multipliedBy(new BigNumber(10).pow(18)),
  });
  const { address: account } = useWeb3();

  // Initial checks
  useEffect(() => {
    let isSubscribed = true;

    const fetchData = async () => {
      // const characterFactoryContract = getCharacterFactoryContract()
      const canMint = true;
      dispatch({ type: 'initialize', step: canMint ? 0 : 1 });

      // When changing wallets quickly unmounting before the hasClaim finished causes a React error
      if (isSubscribed) {
        dispatch({ type: 'initialize', step: canMint ? 0 : 1 });
      }
    };

    if (account) {
      fetchData();
    }

    return () => {
      isSubscribed = false;
    };
  }, [account, dispatch]);

  const actions: ContextType['actions'] = useMemo(
    () => ({
      nextStep: () => dispatch({ type: 'next_step' }),
      setTeamId: (teamId: number) => dispatch({ type: 'set_team', teamId }),
      setTokenId: (tokenId: number) => dispatch({ type: 'set_tokenid', tokenId }),
      setUserName: (userName: string) => dispatch({ type: 'set_username', userName }),
    }),
    [dispatch]
  );

  return <ProfileCreationContext.Provider value={{ ...state, actions }}>{children}</ProfileCreationContext.Provider>;
};

export default ProfileCreationProvider;
