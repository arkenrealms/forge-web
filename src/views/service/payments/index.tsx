import React from 'react';
import { Tag } from 'antd';
import { formatDistance, parseISO } from 'date-fns';
import qs from 'qs';
import { BsArrowRightSquareFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import DataTable from '~/components/DataTable';

export default function () {
  const primaryKey = 'id';

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
          {
            label: 'To',
            key: 'to',
            type: 'text',
          },
          {
            label: 'Created At',
            key: 'createdAt',
            type: 'date',
          },
          {
            label: 'Updated At',
            key: 'updatedAt',
            type: 'date',
          },
          {
            label: 'laimed At',
            key: 'claimedAt',
            type: 'date',
          },
          {
            label: 'Message',
            key: 'message',
            type: 'text',
            default: 'None',
          },
          {
            key: 'tokenAddresses',
            valueKey: 'tokenAmounts',
            type: 'tokens',
            default: <>None</>,
          },
          {
            key: 'itemIds',
            type: 'items',
            default: <>None</>,
          },
          {
            key: 'status',
            type: 'select',
            placeholder: 'Please select a status',
            default: <>None</>,
            options: ['processing', 'processed', 'completed', 'voided', 'failed'],
          },
        ],
      },
      {
        align: 'right',
        type: 'actions',
        fields: [
          {
            label: '',
            key: 'address',
            type: 'arken-profile-info',
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
        title: 'ID',
        dataIndex: 'id',
        // fixed: 'left',
      },
      {
        title: 'Username',
        key: 'username',
        render: ({ username, address }) => {
          return <Link to={`/service/profiles?${qs.stringify({ contentId: address })}`}>{username}</Link>;
        },
      },
      {
        title: 'Address',
        dataIndex: 'address',
      },
      {
        title: 'Created',
        dataIndex: 'createdAt',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.createdAt - b.createdAt,
        render: (createdAt: string) => (
          <>
            {formatDistance(parseISO(new Date(createdAt).toISOString()), new Date(), {
              addSuffix: true,
            })}
          </>
        ),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        render: (status: string) => (
          <Tag
            color={
              status === 'completed' ? 'green' : status === 'processed' ? 'blue' : status === 'failed' ? 'red' : 'grey'
            }>
            {status}
          </Tag>
        ),
        filters: [
          {
            text: 'Failed',
            value: 'failed',
          },
          {
            text: 'Completed',
            value: 'completed',
          },
          {
            text: 'Processed',
            value: 'processed',
          },
          {
            text: 'Voided',
            value: 'voided',
          },
        ],
        // @ts-ignore
        filteredValue: params.status ? [params.status] : null,
        // specify the condition of filtering result
        // here is that finding the name started with `value`
        onFilter: (value: string | number | boolean, record) => value === record.status,
      },
      {
        title: '',
        key: 'action',
        // fixed: 'right',
        align: 'right',
        width: 30,
        render: ({ id }) => {
          return (
            <Link to={`/service/payments?${qs.stringify({ ...params, contentId: id })}`}>
              <BsArrowRightSquareFill />
            </Link>
          );
        },
      },
    ];

    return params.contentId ? [...columns.slice(1, 2), ...columns.slice(-2)] : columns;
  }

  async function getContentList() {
    const response = await fetch(`https://s1.relay.arken.asi.sh/data/claimRequests.json`);
    const responseData = await response.json();

    return responseData;
  }

  async function getContentItem({ params, contentList }) {
    return contentList?.find((item) => item[primaryKey] === params.contentId);
  }

  function getBreadcrumb({ params }) {
    return [
      { path: '/services', label: 'Services' },
      { path: '/service/payments', label: 'Payments' },
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
