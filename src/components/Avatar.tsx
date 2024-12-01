import React, { FC } from 'react';
import { Avatar, Dropdown, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import cerebroConfig from '~/config';
import { useTour } from '~/hooks/useTour';
import { useSettings } from '~/hooks/useSettings';

interface IAvatarUser {
  name: string | null;
  picture: string | null;
}

interface IAvatar {
  user: IAvatarUser;
  login?: () => void;
  logout?: () => void;
}

const { Item } = Menu;

export default ({ user = { name: null, picture: null }, login = () => {}, logout = () => {}, ...props }: IAvatar) => {
  const { name, picture } = user;
  const navigate = useNavigate();
  const tour = useTour();
  const { settings, show: showSettings } = useSettings();

  const items = [
    {
      label: 'Tour',
      key: 'tour',
      children: [
        {
          label: 'Overview',
          key: 'tour-overview',
          onClick: async () => {
            tour.overview();
          },
        },
        {
          label: 'Login As',
          key: 'tour-login-as',
          onClick: async () => {
            tour.loginAs();
          },
        },
      ],
    },
    {
      label: 'Settings',
      key: 'settings',
      onClick: async () => {
        showSettings();
      },
    },
    {
      label: 'View permissions',
      key: 'permissions',
      onClick: async () => {
        navigate('/roles');
      },
    },
    settings.LoginAsUser
      ? {
          label: 'Stop using as ' + settings.LoginAsUser,
          key: 'changeUser',
          onClick: async () => {
            window.localStorage.removeItem('LoginAs');
            const settings = JSON.parse(window.localStorage.getItem('Settings') || '{}');
            window.localStorage.setItem('Settings', JSON.stringify({ ...settings, LoginAsUser: undefined }));

            window.location.reload();

            // login()
          },
        }
      : undefined,
    {
      label: 'Change user',
      key: 'login',
      onClick: async () => {
        if (settings.LoginAsUser) {
          const settings = JSON.parse(window.localStorage.getItem('Settings') || '{}');
          window.localStorage.setItem('Settings', JSON.stringify({ ...settings, LoginAsUser: undefined }));
        }

        login();
      },
    },
    {
      label: 'Sign out',
      key: 'logout',
      onClick: async () => {
        if (settings.LoginAsUser) {
          const settings = JSON.parse(window.localStorage.getItem('Settings') || '{}');
          window.localStorage.setItem('Settings', JSON.stringify({ ...settings, LoginAsUser: undefined }));
        }

        logout();
      },
    },
  ];

  return (
    <Dropdown
      menu={{ items }}
      trigger={['click']}
      placement="bottomRight"
      // align={{ offset: [-70, 120] }}
      {...props}>
      <Avatar
        size={{ xs: 24, sm: 32, md: 40, lg: 40, xl: 40, xxl: 40 }}
        src={picture}
        style={{
          cursor: 'pointer',
          color: '#fff',
          fontSize: '14px',
          background: '#09af42',
        }}
        data-testid="app-header-avatar">
        {name}
      </Avatar>
    </Dropdown>
  );
};
