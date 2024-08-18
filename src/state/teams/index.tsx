/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import teamsList from '~/config/constants/teams';
import { Team } from '~/config/constants/types';
import { TeamsById, TeamsState } from '../types';
import { getTeam, getTeams } from './helpers';

const teamsById: TeamsById = teamsList.reduce((accum, team) => {
  return {
    ...accum,
    [team.id]: team,
  };
}, {});

const initialState: TeamsState = {
  isInitialized: false,
  isLoading: true,
  data: {},
};

export const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.isLoading = true;
    },
    fetchFailed: (state) => {
      state.isLoading = false;
      state.isInitialized = true;
    },
    teamFetchSucceeded: (state, action: PayloadAction<Team>) => {
      state.isInitialized = true;
      state.isLoading = false;
      state.data[action.payload.id] = action.payload;
    },
    teamsFetchSucceeded: (state, action: PayloadAction<TeamsById>) => {
      state.isInitialized = true;
      state.isLoading = false;
      state.data = action.payload;
    },
  },
});

// Actions
export const { fetchStart, teamFetchSucceeded, fetchFailed, teamsFetchSucceeded } = teamsSlice.actions;

// Thunks
export const fetchTeam = (teamId: number) => async (dispatch) => {
  try {
    dispatch(fetchStart());
    let team = await getTeam(teamId);
    if (team.name === 'Westmarch Knights') {
      team.name = 'Knights of Westmarch';
    }

    try {
      const coeff = 1000 * 60 * 5;
      const date = new Date(); //or use any other date
      const rand = new Date(Math.round(date.getTime() / coeff) * coeff).getTime();
      // const rand = Math.floor(Math.random() * Math.floor(999999))
      const response = await fetch(`https://envoy.arken.gg/guilds/${teamId}/overview.json?${rand}`).catch(() => {});

      if (response) {
        const responseData = await response.json();

        team = {
          ...responseData,
          ...team,
        };
      }
    } catch (e) {
      console.log(e);
    }

    dispatch(teamFetchSucceeded(team));
  } catch (error) {
    dispatch(fetchFailed());
  }
};

export const fetchTeams = () => async (dispatch) => {
  try {
    dispatch(fetchStart());
    const teams = await getTeams();
    for (const teamId in teams) {
      const team = teams[teamId];
      if (team.name === 'Westmarch Knights') {
        team.name = 'Knights of Westmarch';
        // team.isJoinable = false
      }

      try {
        const rand = Math.floor(Math.random() * Math.floor(999999));
        const response = await fetch(`https://envoy.arken.gg/guilds/${teamId}/overview.json?${rand}`).catch(() => {});

        if (response) {
          const responseData = await response.json();

          teams[teamId] = {
            ...responseData,
            ...teams[teamId],
          };
        }
      } catch (e) {
        console.log(e);
      }
    }
    dispatch(teamsFetchSucceeded(teams));
  } catch (error) {
    dispatch(fetchFailed());
  }
};

export default teamsSlice.reducer;
