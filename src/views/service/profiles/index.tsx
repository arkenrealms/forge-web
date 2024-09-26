import React from 'react';
import { Tag } from 'antd';
import { formatDistance, parseISO } from 'date-fns';
import qs from 'qs';
import { BsArrowRightSquareFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import DataTable from '~/components/DataTable';

export default function () {
  const primaryKey = 'address';

  const contentModel = {
    fieldsets: [
      {
        type: 'form',
        align: 'left',
        fields: [
          {
            label: 'Username',
            key: 'username',
            type: 'text',
          },
          {
            label: 'Address',
            key: 'address',
            type: 'text',
          },
        ],
      },
      {
        type: 'full',
        fields: [
          {
            key: '@',
            type: 'jsonviewer',
          },
        ],
      },
    ],
  };

  async function getColumns({ params }) {
    const columns = [
      {
        title: 'Address',
        dataIndex: 'address',
        fixed: 'left',
      },
      {
        title: 'Username',
        key: 'username',
        render: ({ username, address }) => {
          return <Link to={`/service/profiles?${qs.stringify({ contentId: address })}`}>{username}</Link>;
        },
      },
      {
        title: '',
        key: 'action',
        render: ({ address }) => {
          return (
            <Link to={`/service/profiles?${qs.stringify({ ...params, contentId: address })}`}>
              <BsArrowRightSquareFill />
            </Link>
          );
        },
      },
    ];

    return columns.slice(1);
  }

  async function getContentList({ params }) {
    const address = params.contentId || '0xa987f487639920A3c2eFe58C8FBDedB96253ed9B';
    const response = await fetch(`https://s1.envoy.arken.asi.sh/users/${address}/overview.json`);
    const responseData = await response.json();

    return [responseData];
  }

  async function getContentItem({ params, contentList }) {
    return contentList?.find((item) => item[primaryKey] === params.contentId);
  }

  function getBreadcrumb({ params }) {
    return [
      { path: '/services', label: 'Services' },
      { path: '/service/profiles', label: 'Profiles' },
    ];
  }

  return (
    <>
      <DataTable
        primaryKey={primaryKey}
        getBreadcrumb={getBreadcrumb}
        getColumns={getColumns}
        getContentList={getContentList}
        getContentItem={getContentItem}
        contentModel={contentModel}
      />
    </>
  );
}
