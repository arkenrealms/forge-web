import FormFieldText from '@arken/forge-ui/components/FormFieldText';
import useDocumentTitle from '@arken/forge-ui/hooks/useDocumentTitle';

import * as log from '@arken/node/util/log';
import { Avatar, List } from 'antd';
import _ from 'lodash';
import qs from 'qs';
import React, { JSX, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { css } from 'styled-components';
import App from '@arken/forge-ui/components/App';
import {
  useModel,
  useGetModelCall,
  useGetModel,
  useSearchModels,
  useSearchModelsCall,
  useCreateModel,
  useUpdateModel,
  useUpsertModel,
  useDeleteModel,
} from '@arken/forge-ui/hooks';
import { generateLongId } from '@arken/node/util/db';

type NexusModel<T> = T & {
  __original?: T;
  meta: any;
};

type RoleWithRelations = NexusModel<any>;

function getDocumentTitle(params: any, contentItem: RoleWithRelations = undefined) {
  if (contentItem?.name) {
    return `ASI Cerebro - Role - ${contentItem.name}`;
  }

  return 'ASI Cerebro - Roles';
}

const contentItemDefault: RoleWithRelations = {
  id: '',
  name: '',
  description: '',
  createdDate: new Date(),
  updatedDate: undefined,
  deletedDate: undefined,
  permissionsOnRoles: [],
  rolesOnUsers: [],
  meta: {},
};

const contentItemTemp: RoleWithRelations = { ...contentItemDefault };

const buildUserPath = (user: any): string => `/users?contentMode=view&contentId=${user.id}`;

const UserRenderer = (user: any, onClick: React.MouseEventHandler): JSX.Element => {
  return (
    <List.Item.Meta
      css={{ alignItems: 'flex-end !important' }}
      avatar={<Avatar src={user.photoUrl ? user.photoUrl : '/images/anon-avatar.png'} />}
      title={
        <a href={buildUserPath(user)} onClick={onClick}>
          {user.name ? user.name : user.email ? user.email : 'Unknown'}
        </a>
      }
    />
  );
};

const buildPermissionPath = (permission: any): string => `/permissions?contentMode=view&contentId=${permission.id}`;

const PermissionRenderer = (permission: any, onClick: React.MouseEventHandler): JSX.Element => {
  return (
    <List.Item.Meta
      css={{ alignItems: 'flex-end !important' }}
      title={
        <a href={buildPermissionPath(permission.permission)} onClick={onClick}>
          {permission.permission.name ? permission.permission.name : 'Unknown'}
        </a>
      }
    />
  );
};

const query = `
  id
  name
  description
  createdDate
  updatedDate
  deletedDate
  rolesOnUsers {
    id
    status
    user {
      id
      name
      email
      photoUrl
    }
  }
  permissionsOnRoles {
    id
    status
    permission {
      id
      name
    }
  }
`;

const permissions = [
  { name: 'Process Interfaces', id: 'Process Interfaces' },
  { name: 'Manage Interfaces', id: 'Manage Interfaces' },
  { name: 'View Interfaces', id: 'View Interfaces' },
  { name: 'Design Interfaces', id: 'Design Interfaces' },
  { name: 'Manage Users', id: 'Manage Users' },
  { name: 'View Users', id: 'View Users' },
  { name: 'Manage Submissions', id: 'Manage Submissions' },
  { name: 'View Submissions', id: 'View Submissions' },
  { name: 'Process Submissions', id: 'Process Submissions' },
  { name: 'View Workflows', id: 'View Workflows' },
  { name: 'Manage Settings', id: 'Manage Settings' },
  { name: 'Deletion', id: 'Deletion' },
];

const AdminRoles = ({ themeConfig }: any) => {
  const [cacheKey, setCacheKey] = useState('0');
  const history = useNavigate();

  const localParams: any = {
    ...qs.parse(window.location.search.replace('?', '')),
  };

  const { isLoading: contentItemLoading, data: contentItemSearch }: any = useGetModel({
    key: 'Role',
    action: 'findFirstRole',
    query,
    variables: localParams.contentId
      ? {
          where: {
            id: { equals: localParams.contentId },
          },
        }
      : null,
  });

  const contentItem = getContentItem({ params: localParams });

  const { isLoading: contentListLoading, data: contentListSearch }: any = useSearchModels({
    key: 'Role',
    action: 'roles',
    query,
    variables: {
      where: {},
      orderBy: {
        name: 'asc',
      },
    },
  });

  const { isPending: createLoading, mutateAsync: createRole } = useCreateModel({
    key: 'Role',
    action: 'createOneRole',
    query: `
      id
    `,
  });

  const { isPending: updateLoading, mutateAsync: updateRole } = useUpdateModel({
    key: 'Role',
    action: 'updateOneRole',
    query: `
      id
    `,
  });

  const rerender = function () {
    setCacheKey('cache' + Math.random());
  };

  const onSaveContentItem = async (values: Partial<RoleWithRelations>) => {
    try {
      const contentItem = getContentItem({ params: localParams });
      for (const index in values) {
        // @ts-ignore
        contentItem[index] = values[index];
      }

      if (contentItem.__original) {
        log.dev('Updating Role', contentItem, contentItemSearch);
        const res = await updateRole({
          before: contentItem.__original,
          after: contentItem,
          where: {
            id: contentItem.id,
          },
        });

        return {
          message: `Success`,
          description: <>Saved Role: {values?.name}</>,
          placement: 'topRight' as any,
          duration: 3,
          contentId: res.id,
        };
      } else {
        log.dev('Creating Role', contentItem, contentItemSearch);
        const res = await createRole({ data: contentItem });

        return {
          message: `Success`,
          description: <>Created Role: {values?.name}</>,
          placement: 'topRight' as any,
          duration: 3,
          contentId: res.id,
        };
      }
    } catch (e) {
      console.log('Error saving role', e);
      throw e;
    }
  };

  async function getColumns({ params }: any) {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text: any, record: any, index: number, props: any = {}) => {
          return (
            <FormFieldText
              name={text}
              defaultValue={text}
              isRequired
              isEditing={localParams.tableMode === 'edit'}
              onChange={(text: any) =>
                onSaveContentItem({
                  name: text,
                })
              }
              css={css`
                min-width: 100px;
              `}
              {...props}
            />
          );
        },
        sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        render: (text: any, record: any, index: number, props: any = {}) => {
          return (
            <FormFieldText
              name={text}
              defaultValue={text}
              isRequired
              isEditing={localParams.tableMode === 'edit'}
              onChange={(text: any) =>
                onSaveContentItem({
                  description: text,
                })
              }
              css={css`
                min-width: 100px;
              `}
              {...props}
            />
          );
        },
        sorter: (a: any, b: any) => a.description.localeCompare(b.description),
      },
    ];

    return columns;
  }

  function getContentList({ params }: any) {
    if (!contentListSearch) return [];

    const result = contentListSearch;

    return result;
  }

  function getContentItem({ params }: any) {
    if (params?.contentId && contentItemSearch?.id && contentItemTemp.id !== contentItemSearch.id) {
      console.log('Resetting content item object due to search', contentItemTemp, ':', contentItemSearch?.id);
      for (const k of Object.keys(contentItemDefault)) {
        // @ts-ignore
        contentItemTemp[k] = contentItemDefault[k];
      }
      for (const k of Object.keys(contentItemSearch)) {
        // @ts-ignore
        contentItemTemp[k] = contentItemSearch[k];
      }

      // @ts-ignore
      if (!contentItemTemp.__original) {
        // @ts-ignore
        contentItemTemp.__original = _.cloneDeep(contentItemSearch);
      }

      setCacheKey('cache' + Math.random());
    }
    //  else if (!params?.contentMode && !params?.contentId) {
    //   console.log(
    //     'Resetting content item object due to params',
    //     params,
    //     contentItemTemp,
    //     ':',
    //     contentItemSearch?.id
    //   )
    //   for (const k in contentItemTemp) {
    //     // @ts-ignore
    //     delete contentItemTemp[k]
    //   }
    //   for (const k in contentItemDefault) {
    //     // @ts-ignore
    //     contentItemTemp[k] = contentItemDefault[k]
    //   }
    // }

    // if (params?.contentMode === 'edit') {
    //   if (!contentItemTemp.name) {
    //     contentItemTemp.name = 'Name'
    //   }
    // }

    // console.log('Set temp content item', contentItemTemp)

    return contentItemTemp;
  }

  function getBreadcrumb({ contentItem, params }: any) {
    return [] as any;
  }

  function onRemove({ params }: any) {
    // TODO: Role does NOT have "Status" so hard delete?
    onSaveContentItem({
      id: params.contentId,
      // Status: 'Archived',
    });
  }

  function getTabs({ params }: any) {
    const tabs: any[] = [];

    tabs.push({
      label: 'Information',
      key: 'role',
      type: 'form',
      fieldsets: [
        {
          key: 'main',
          type: 'form',
          fields: [
            {
              label: 'Name',
              name: 'name',
              type: 'text',
              isRequired: true,
            },
            {
              label: 'Description',
              name: 'description',
              type: 'textarea',
              isRequired: true,
            },
            // {
            //   label: 'Created Date',
            //   name: 'createdDate',
            //   type: 'date',
            //   isRequired: true,
            // },
            // {
            //   label: 'Updated Date',
            //   name: 'updatedDate',
            //   type: 'date',
            // },
            // {
            //   label: 'Deleted Date',
            //   name: 'deletedDate',
            //   type: 'date',
            // },
          ],
        },
      ],
    });

    // Users belonging to this Role
    tabs.push({
      label: 'Users',
      name: 'users',
      key: 'users',
      type: 'form',
      fieldsets: [
        {
          key: 'main-users',
          type: 'full',
          fields: [
            {
              label: 'Users',
              name: 'rolesOnUsers[].user',
              type: 'related-list',
              showAdd: false,
              showEdit: false,
              displayKey: 'name',
              content: (user: any) =>
                UserRenderer(user, (e: React.MouseEvent) => {
                  e.preventDefault();
                  history(buildUserPath(user));
                }),
            },
          ],
        },
      ],
    });

    // Permissions belonging to this Role
    tabs.push({
      label: 'Permissions',
      name: 'permissions',
      key: 'permissions',
      type: 'form',
      fieldsets: [
        {
          key: 'main-permissions',
          type: 'full',
          fields: [
            {
              label: 'Permission',
              name: 'permissionsOnRoles',
              type: 'related-list',
              filter: (item: any, items: any) => {
                return item.status !== 'Archived';
              },
              onAdd: (item: any, items: any) => {
                let listedItem: any = contentItem.permissionsOnRoles.find(
                  (permissionsOnRoles: any) => permissionsOnRoles.permission.id === item.permission.id
                );
                if (!listedItem) {
                  listedItem = {
                    id: generateLongId(),
                    status: 'Active',
                    // permissionId: permissions.find((permission: any) => permission.id === item.permission.id).id,
                    permission: permissions.find((permission: any) => permission.id === item.permission.id),
                  };
                }
                listedItem.status = 'Active';

                return listedItem;
              },
              onRemove: (item: any) => {
                const listedItem: any = contentItem.permissionsOnRoles.find(
                  (permissionsOnRoles: any) => permissionsOnRoles.permission.id === item.permission.id
                );
                listedItem.status = 'Archived';
              },
              showAdd: true,
              showEdit: false,
              displayKey: 'permission.name',
              defaultValue: {
                id: '',
                status: '',
                permission: {
                  name: '',
                  id: '',
                },
              },
              content: (permission: any) =>
                PermissionRenderer(permission, (e: React.MouseEvent) => {
                  e.preventDefault();
                  history(buildPermissionPath(permission));
                }),
              fieldsets: [
                {
                  key: 'main',
                  type: 'full',
                  fields: [
                    {
                      label: 'Name',
                      name: 'permission.name',
                      type: 'hidden',
                      // isRequired: true,
                      // isDisabled: true,
                    },
                    {
                      label: 'Permission',
                      name: 'permission.id',
                      type: 'select',
                      isRequired: true,
                      options: () =>
                        permissions
                          ?.filter(
                            (permission: any) =>
                              !contentItem.permissionsOnRoles.find(
                                (permissionsOnRoles: any) =>
                                  permissionsOnRoles.status !== 'Archived' &&
                                  permissionsOnRoles.permission.id === permission.id
                              )
                          )
                          .map((permission: any) => {
                            return { text: permission.name, value: permission.id };
                          }) || [],
                      value: '',
                    },
                  ],
                },
              ],
            } as any,
          ],
        },
      ],
    });

    return tabs;
  }

  const config: any = {
    history,
    cacheKey,
    isListLoading: contentListLoading,
    isItemLoading: contentItemLoading || createLoading || updateLoading,
    primaryKey: 'id',
    secondaryKey: 'Name',
    baseUrl: '/roles',
    extraParams: {
      tab: 'role',
    },
    commentsFieldName: 'commentsOnUsers',
    isResizable: false,
    // showContentModal: true,
    canEdit: false,
    rerender,
    getBreadcrumb,
    getColumns,
    getContentList,
    getContentItem,
    onSubmit: onSaveContentItem,
    onRemove,
    getTabs,
    themeConfig,
  };

  useDocumentTitle(getDocumentTitle(localParams, contentItem));

  return (
    <div
      css={css`
        width: 90%;
        margin: 20px auto;
      `}>
      <App {...config} />
    </div>
  );
};

export default AdminRoles;
