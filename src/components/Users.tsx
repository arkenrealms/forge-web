import qs from 'qs';
import styled, { css } from 'styled-components';
import { Button, List } from 'antd';
import { IoHomeOutline as HomeOutlined } from 'react-icons/io5';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import React, { useEffect, useState, JSX } from 'react';
import { BiCommentDetail } from 'react-icons/bi';
import _ from 'lodash';
import App from '@arken/forge-ui/components/App';
import FormFieldText from '@arken/forge-ui/components/FormFieldText';
import FormFieldSelect from '@arken/forge-ui/components/FormFieldSelect';
import useSettings from '@arken/forge-ui/hooks/useSettings';
import * as log from '@arken/node/util/log';
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
import useDocumentTitle from '@arken/forge-ui/hooks/useDocumentTitle';
import { generateLongId } from '@arken/node/util/db';

const zzz = styled.div``;

// type commentsOnUsersWithRelations = commentsOnUsers & {
//   User: User
//   Comment: Comment
// }

type NexusModel<T> = Omit<T, 'meta'> & {
  __original?: T;
  meta: any;
};

type UserWithRelations = NexusModel<any>;

function getDocumentTitle(params: any, contentItem: UserWithRelations = undefined) {
  if (contentItem?.name) {
    return `ASI Cerebro - User - ${contentItem.name}`;
  }

  return 'ASI Cerebro - Users';
}

const statusList = [
  {
    text: 'Unclaimed',
    value: 'Unclaimed',
  },
  {
    text: 'Active',
    value: 'Active',
  },
  {
    text: 'Archived',
    value: 'Archived',
  },
];

const contentItemDefault: any = {
  id: '',
  status: 'Unclaimed',
  createdDate: new Date(),
  updatedDate: undefined,
  deletedDate: undefined,
  name: '',
  email: '',
  companyName: '',
  phoneNumber: '',
  poNumber: '',
  billAccount: '',
  photoUrl: '',
  // commentsOnUsers: [],
  // revisionsOnUsers: [],
  rolesOnUsers: [],
  // revisions: [],
  // comments: [],
  // forms: [],
  meta: {},
};

const contentItemTemp: UserWithRelations = { ...contentItemDefault };

const buildRolePath = (role: any): string => `/roles?contentMode=view&contentId=${role.id}`;

const RoleRenderer = (role: any, onClick: React.MouseEventHandler): JSX.Element => {
  return (
    <List.Item.Meta
      css={{ alignItems: 'flex-end !important' }}
      title={
        <a href={buildRolePath(role)} onClick={onClick}>
          {role.role.name ? role.role.name : 'Unknown'}
        </a>
      }
    />
  );
};

const query = `
  id
  name
  email
  companyName
  phoneNumber
  poNumber
  billAccount
  meta
  status
  createdDate
  updatedDate
  deletedDate
  rolesOnUsers {
    id
    status
    role {
      id
      name
      description
    }
  }
`;

// interface RolesWrapperProps {
//   setRoles: (roles: Role[]) => void
// }
// const RolesWrapper = ({ setRoles }: RolesWrapperProps): JSX.Element => {
//   const { useSearchModels } = useDataModel<Role, any>()
//   const { isLoading, data }: any = useSearchModels({
//     key: 'Role',
//     action: 'roles',
//     query: `
//       id
//       name
//     `,
//     variables: {
//       where: {},
//       orderBy: {
//         name: 'asc',
//       },
//     },
//   })

//   useEffect(() => {
//     if (isLoading === false) {
//       setRoles(data)
//     }
//   }, [isLoading, data])

//   return <></>
// }

const AdminUsers = ({ themeConfig }: any) => {
  const [cacheKey, setCacheKey] = useState('0');
  const { settings } = useSettings();
  const history = useNavigate();
  const location = useLocation();

  const { data: roles }: any = useSearchModels({
    key: 'Role',
    action: 'roles',
    query: `
      id
      name
      description
    `,
    variables: {
      where: {},
      orderBy: {
        name: 'asc',
      },
    },
  });

  const localParams: any = {
    status: ['Unclaimed', 'Active'],
    ...qs.parse(window.location.search.replace('?', '')),
  };

  const { isLoading: contentItemLoading, data: contentItemSearch }: any = useGetModel({
    key: 'User',
    action: 'findFirstUser',
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
    key: 'User',
    action: 'users',
    query,
    variables: {
      where: {
        // @ts-ignore
        status: { in: localParams.status },
      },
    },
  });

  const { isPending: createLoading, mutateAsync: createUser } = useCreateModel({
    key: 'User',
    action: 'createOneUser',
    query: `
      id
    `,
  });

  const { isPending: updateLoading, mutateAsync: updateUser } = useUpdateModel({
    key: 'User',
    action: 'updateOneUser',
    query: `
      id
    `,
  });

  const rerender = function () {
    log.dev('Rerender');
    setCacheKey('cache' + Math.random());
  };

  const onSaveContentItem = async (values: Partial<UserWithRelations>) => {
    log.dev('Saving content item...', values);

    try {
      const contentItem = getContentItem({ params: localParams });

      console.log('Copying user values to content item', contentItem, values);
      for (const index in values) {
        // @ts-ignore
        contentItem[index] = values[index];
      }

      if (contentItem.__original) {
        log.dev('Updating user', contentItem, contentItemSearch);
        const res = await updateUser({
          before: contentItem.__original,
          after: contentItem,
          where: {
            id: contentItem.id,
          },
        });

        return {
          message: `Success`,
          description: <>Saved User: {values?.name}</>,
          placement: 'topRight' as any,
          duration: 3,
          contentId: res.id,
        };
      } else {
        log.dev('Creating user', contentItem, contentItemSearch);
        const res = await createUser({
          data: {
            ...contentItem,
            // commentsOnUsers: undefined,
            // revisionsOnUsers: undefined,
            // rolesOnUsers: undefined,
            // revisions: undefined,
            // comments: undefined,
            // forms: undefined,
          },
        });

        return {
          message: `Success`,
          description: <>Created User: {values?.name}</>,
          placement: 'topRight' as any,
          duration: 3,
          contentId: res.id,
        };
      }
    } catch (e) {
      console.log('Error saving user', e);
      throw e;
    }
  };

  async function getColumns({ params }: any) {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        // align: 'center',
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
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        // align: 'center',
        render: (text: any, record: any, index: number, props: any = {}) => {
          return (
            <FormFieldText
              name={text}
              defaultValue={text}
              isRequired
              isEditing={localParams.tableMode === 'edit'}
              onChange={(text: any) =>
                onSaveContentItem({
                  email: text,
                })
              }
              css={css`
                min-width: 100px;
              `}
              {...props}
            />
          );
        },

        sorter: (a: any, b: any) => a.email.localeCompare(b.email),
      },
      {
        title: 'Status',
        key: 'status',
        align: 'center',
        width: 150,
        filters: statusList,
        filteredValue: params.status || [],
        render: (text: any, record: any, index: number, props: any = {}) => {
          return (
            <FormFieldSelect
              name={`status-${record.id}`}
              defaultValue={record.status}
              options={() => statusList as any}
              isRequired
              isEditing={params.tableMode === 'edit'}
              onChange={(text: any) =>
                onSaveContentItem({
                  id: record.id,
                  status: text,
                  __original: record,
                })
              }
              css={css`
                min-width: 100px;
              `}
              {...props}
            />
          );
        },
      },
      {
        title: 'Company',
        dataIndex: 'companyName',
        key: 'companyName',
        ellipsize: false,
        align: 'center',
        // width: 150,
        render: (text: any, record: any, index: number, props: any = {}) => {
          return (
            <FormFieldText
              name={text}
              defaultValue={text}
              isRequired
              isEditing={localParams.tableMode === 'edit'}
              onChange={(text: any) =>
                onSaveContentItem({
                  companyName: text,
                })
              }
              css={css`
                min-width: 100px;
              `}
              {...props}
            />
          );
        },
        sorter: (a: any, b: any) => a.companyName.localeCompare(b.companyName),
      },
      {
        title: 'Account #',
        dataIndex: 'billAccount',
        key: 'billAccount',
        align: 'center',
        render: (text: any, record: any, index: number, props: any = {}) => {
          return (
            <FormFieldText
              name={text}
              defaultValue={text}
              isRequired
              isEditing={localParams.tableMode === 'edit'}
              onChange={(text: any) =>
                onSaveContentItem({
                  billAccount: text,
                })
              }
              css={css`
                min-width: 100px;
              `}
              {...props}
            />
          );
        },
      },
      // {
      //   title: '',
      //   key: 'action',
      //   render: ({ Id, commentsOnUsers }: any) => {
      //     return commentsOnUsers?.length ? (
      //       <Link
      //         to={`/users?${qs.stringify({
      //           ...params,
      //           contentId: Id,
      //           contentMode: 'view',
      //           tab: 'comments',
      //         })}`}
      //       >
      //         {commentsOnUsers.length} <BiCommentDetail />
      //       </Link>
      //     ) : null
      //   },
      // },
    ];

    return columns;
  }

  function getContentList({ params }: any) {
    // if (settings.LocalMode) {
    //   for (const user of mockUsers) {
    //     for (const order of user.Orders) {
    //       const orderDetails = mockOrders.find((item: any) => item.id === order.id)
    //       for (const key of Object.keys(orderDetails)) {
    //         // @ts-ignore
    //         order[key] = orderDetails[key]
    //       }
    //     }
    //   }
    //   return mockUsers.filter((item: any) => item.status !== 'Archived')
    // }

    if (!contentListSearch) return [];

    const result = contentListSearch;

    return result;
  }

  function getContentItem({ params }: any) {
    // if (settings.LocalMode) {
    //   const contentList = getContentList({ params })
    //   return contentList.find((item: any) => item.id === params?.contentId)
    // }

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

    if (params?.contentMode === 'edit') {
      if (!contentItemTemp.name) {
        contentItemTemp.name = 'name';
      }
      // if (params?.tab === 'roles') {
      //   // fix Roles if required
      //   const newrolesOnUsers = contentItemTemp.rolesOnUsers
      //     .map((rolesOnUsers: any) => {
      //       //
      //       //
      //       if (rolesOnUsers && rolesOnUsers.role && rolesOnUsers.role.id) {
      //         const newRole = roles.find((role) => role.id === rolesOnUsers.role.id)
      //         if (newRole) {
      //           // check if newly added Role previously existed but Archived
      //           const archivedRole = contentItemTemp.rolesOnUsers.find(
      //             (crolesOnUsers: any) => newRole.id === crolesOnUsers.role.id
      //           )
      //           if (archivedRole) {
      //             archivedRole.status = 'Active'
      //             return {}
      //           } else {
      //             if (!newRole.description) {
      //               newRole.description = ''
      //             }
      //             return {
      //               id: rolesOnUsers.role.id,
      //               role: newRole,
      //               status: 'Active',
      //             }
      //           }
      //         }
      //       }
      //       return rolesOnUsers
      //     }) //
      //     .filter((rolesOnUsers: any) => rolesOnUsers.id && rolesOnUsers.status) //
      //   contentItemTemp.rolesOnUsers = newrolesOnUsers
      //   if (contentItemSearch) contentItemSearch.rolesOnUsers = newrolesOnUsers
      // }
    }

    // console.log('Set temp content item', contentItemTemp)

    return contentItemTemp;
  }

  function getBreadcrumb({ contentItem, params }: any) {
    const breadcrumb: any = [
      {
        href: ``,
        title: <HomeOutlined />,
      },
      {
        href: `/users`,
        title: 'Users',
      },
    ];

    if (contentItem?.__original) {
      breadcrumb.push({
        href: `/users?contentMode=view&contentId=${contentItem.id}`,
        title: contentItem[config.secondaryKey],
      });
    } else {
      breadcrumb.push({
        href: `/users?contentMode=view`,
        title: 'New User',
      });
    }

    return breadcrumb;
  }

  function onRemove({ params }: any) {
    onSaveContentItem({
      id: params.contentId,
      status: 'Archived',
    });
  }

  function getTabs({ params }: any) {
    const tabs = [
      {
        label: 'Information',
        key: 'user',
        type: 'form',
        fieldsets: [
          {
            key: 'main',
            type: 'form',
            fields: [
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
              {
                label: 'Name',
                name: 'name',
                type: 'text',
                isRequired: true,
              },
              {
                label: 'Email',
                name: 'email',
                type: 'text',
                isRequired: true,
              },
              {
                label: 'Company name',
                name: 'companyName',
                type: 'text',
                isRequired: false,
              },
              {
                label: 'Phone Number',
                name: 'phoneNumber',
                type: 'text',
                validation: 'phone-number',
              },
              {
                label: 'PO Number',
                name: 'poNumber',
                type: 'text',
                validation: 'po-number',
              },
              {
                label: 'Bill Account',
                name: 'billAccount',
                type: 'text',
              },
              {
                label: 'Status',
                name: 'status',
                type: 'select',
                options: () => statusList as any,
                isRequired: true,
              },
            ],
          },
          {
            key: 'data',
            label: 'Data',
            type: 'full',
            environment: 'local',
            fields: [
              {
                name: '@',
                type: 'jsonviewer',
              },
            ],
          },
        ],
      },
    ];

    // tabs.push({
    //   label: (
    //     <>
    //       Notes{' '}
    //       {contentItem?.commentsOnUsers.length > 0 ? (
    //         <span
    //           css={css`
    //             position: absolute;
    //             top: 5px;
    //             right: -27px; // 11 for closer
    //             border-radius: 4px;
    //             /* background: #f6f6f6; */
    //             padding: 3px 10px;
    //             zoom: 0.7;
    //           `}
    //         >
    //           {contentItem.commentsOnUsers.length} <BiCommentDetail />
    //         </span>
    //       ) : null}
    //     </>
    //   ),
    //   key: 'comments',
    //   type: 'form',
    //   fieldsets: [
    //     {
    //       key: 'main',
    //       fields: [
    //         {
    //           label: '',
    //           name: 'commentsOnUsers[].comment',
    //           type: 'comments',
    //           defaultValue: {
    //             Text: '',
    //             meta: {},
    //           },
    //           fieldsets: [
    //             {
    //               key: 'main',
    //               fields: [
    //                 {
    //                   label: 'Content',
    //                   name: 'text',
    //                   type: 'textarea',
    //                 },
    //               ],
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //   ],
    // } as any)

    // tabs.push({
    //   label: 'History',
    //   key: 'history',
    //   type: 'form',
    //   fieldsets: [
    //     {
    //       key: 'main',
    //       type: 'full',
    //       fields: [
    //         {
    //           label: '',
    //           name: 'revisionsOnUsers[].revision',
    //           type: 'history',
    //         },
    //       ],
    //     },
    //   ],
    // } as any)

    // Users belonging to this Role
    tabs.push({
      label: 'Roles',
      // name: 'roles',
      key: 'roles',
      type: 'form',
      fieldsets: [
        {
          key: 'main-roles',
          type: 'full',
          fields: [
            {
              label: 'Role',
              name: 'rolesOnUsers',
              type: 'related-list',
              filter: (item: any, items: any) => {
                return item.status !== 'Archived';
              },
              onAdd: (item: any, items: any) => {
                let listedItem: any = contentItem.rolesOnUsers.find(
                  (rolesOnUsers: any) => rolesOnUsers.role.id === item.role.id
                );
                if (!listedItem) {
                  listedItem = {
                    id: generateLongId(),
                    status: 'Active',
                    // roleId: roles.find((role: any) => role.id === item.role.id).id,
                    role: roles.find((role: any) => role.id === item.role.id),
                  };
                }
                listedItem.status = 'Active';

                return listedItem;
              },
              onRemove: (item: any) => {
                const listedItem: any = contentItem.rolesOnUsers.find(
                  (rolesOnUsers: any) => rolesOnUsers.role.id === item.role.id
                );
                listedItem.status = 'Archived';
              },
              showAdd: true,
              showEdit: false,
              displayKey: 'role.name',
              defaultValue: {
                id: '',
                status: '',
                role: {
                  name: '',
                  id: '',
                },
              },
              content: (role: any) =>
                RoleRenderer(role, (e: React.MouseEvent) => {
                  e.preventDefault();
                  history(buildRolePath(role));
                }),
              fieldsets: [
                {
                  key: 'main',
                  type: 'full',
                  fields: [
                    {
                      label: 'Name',
                      name: 'role.name',
                      type: 'hidden',
                      // isRequired: true,
                      // isDisabled: true,
                    },
                    {
                      label: 'Role',
                      name: 'role.id',
                      type: 'select',
                      isRequired: true,
                      options: () =>
                        roles
                          .filter(
                            (role: any) =>
                              !contentItem.rolesOnUsers.find(
                                (rolesOnUsers: any) =>
                                  rolesOnUsers.status !== 'Archived' && rolesOnUsers.role.id === role.id
                              )
                          )
                          .map((role: any) => {
                            return { text: role.name, value: role.id };
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
    } as any);

    return tabs;
  }

  const config: any = {
    history,
    cacheKey,
    isListLoading: contentListLoading,
    isItemLoading: contentItemLoading || createLoading || updateLoading,
    primaryKey: 'id',
    secondaryKey: 'name',
    baseUrl: '/users',
    extraParams: {
      tab: 'user',
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
      {/* {isRolesTab && <RolesWrapper setRoles={setRoles} />} */}
    </div>
  );
};

export default AdminUsers;
