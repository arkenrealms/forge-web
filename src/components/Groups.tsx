import FormFieldText from '@arken/forge-ui/components/FormFieldText'
import useDocumentTitle from '@arken/forge-ui/hooks/useDocumentTitle'

import * as log from '@arken/node/util/log'
import { Avatar, List } from 'antd'
import _ from 'lodash'
import qs from 'qs'
import React, { JSX, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { css } from 'styled-components'
import App from '@arken/forge-ui/components/App'
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
} from '@arken/forge-ui/hooks'
import { generateLongId } from '@arken/node/util/db'

function getDocumentTitle(params: any, contentItem: any = undefined) {
  if (contentItem?.name) {
    return `ASI Cerebro - Form Group - ${contentItem.name}`
  }

  return 'ASI Cerebro - Form Groups'
}

const contentItemDefault: any = {
  id: '',
  title: '',
  key: '',
  status: 'New',
  meta: {},
  rolesOnFormGroups: [],
}

const contentItemTemp: any = { ...contentItemDefault }

const buildUserPath = (user: any): string => `/users?contentMode=view&contentId=${user.id}`

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
  )
}

const buildRolePath = (permission: any): string =>
  `/roles?contentMode=view&contentId=${permission.id}`

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
  )
}

const query = `
  id
  title
  key
  status
  meta
  createdDate
  updatedDate
  deletedDate
  rolesOnFormGroups {
    id
    status
    role {
      id
      name
      description
    }
  }
  forms {
    id
    key
    title
  }
`

const AdminFormGroups = ({ themeConfig }: any) => {
  const [cacheKey, setCacheKey] = useState('0')
  const history = useNavigate()

  const localParams: any = {
    ...qs.parse(window.location.search.replace('?', '')),
  }

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
  })

  const { isLoading: contentItemLoading, data: contentItemSearch }: any = useGetModel({
    key: 'FormGroup',
    action: 'findFirstFormGroup',
    query,
    variables: localParams.contentId
      ? {
          where: {
            id: { equals: localParams.contentId },
          },
        }
      : null,
  })

  const contentItem = getContentItem({ params: localParams })

  const { isLoading: contentListLoading, data: contentListSearch }: any = useSearchModels({
    key: 'FormGroup',
    action: 'formGroups',
    query,
    variables: {
      where: {},
      orderBy: {
        title: 'asc',
      },
    },
  })

  const { isPending: createLoading, mutateAsync: createFormGroup } = useCreateModel({
    key: 'FormGroup',
    action: 'createOneFormGroup',
    query: `
      id
    `,
  })

  const { isPending: updateLoading, mutateAsync: updateFormGroup } = useUpdateModel({
    key: 'FormGroup',
    action: 'updateOneFormGroup',
    query: `
      id
    `,
  })

  const rerender = function () {
    setCacheKey('cache' + Math.random())
  }

  const onSaveContentItem = async (values: Partial<any>) => {
    try {
      const contentItem = getContentItem({ params: localParams })
      for (const index in values) {
        // @ts-ignore
        contentItem[index] = values[index]
      }

      if (contentItem.__original) {
        log.dev('Updating FormGroup', contentItem, contentItemSearch)
        const res = await updateFormGroup({
          before: contentItem.__original,
          after: contentItem,
          where: {
            id: contentItem.id,
          },
        })

        return {
          message: `Success`,
          description: <>Saved FormGroup: {values?.name}</>,
          placement: 'topRight' as any,
          duration: 3,
          contentId: res.id,
        }
      } else {
        log.dev('Creating FormGroup', contentItem, contentItemSearch)
        const res = await createFormGroup({ data: contentItem })

        return {
          message: `Success`,
          description: <>Created FormGroup: {values?.name}</>,
          placement: 'topRight' as any,
          duration: 3,
          contentId: res.id,
        }
      }
    } catch (e) {
      console.log('Error saving formGroup', e)
      throw e
    }
  }

  async function getColumns({ params }: any) {
    const columns = [
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        render: (text: any, record: any, index: number, props: any = {}) => {
          return (
            <FormFieldText
              name={text}
              defaultValue={text}
              isRequired
              isEditing={localParams.tableMode === 'edit'}
              onChange={(text: any) =>
                onSaveContentItem({
                  title: text,
                })
              }
              css={css`
                min-width: 100px;
              `}
              {...props}
            />
          )
        },
        sorter: (a: any, b: any) => a.title.localeCompare(b.title),
      },
      // {
      //   title: 'Description',
      //   dataIndex: 'description',
      //   key: 'description',
      //   render: (text: any, record: any) => {
      //     return (
      //       <FormFieldText
      //         name={text}
      //         defaultValue={text}
      //         isRequired
      //         isEditing={localParams.tableMode === 'edit'}
      //         onChange={(text: any) =>
      //           onSaveContentItem({
      //             description: text,
      //           })
      //         }
      //         css={css`
      //           min-width: 100px;
      //         `}
      //       />
      //     )
      //   },
      //   sorter: (a: any, b: any) => a.description.localeCompare(b.description),
      // },
    ]

    return columns
  }

  function getContentList({ params }: any) {
    if (!contentListSearch) return []

    const result = contentListSearch

    return result
  }

  function getContentItem({ params }: any) {
    if (params?.contentId && contentItemSearch?.id && contentItemTemp.id !== contentItemSearch.id) {
      console.log(
        'Resetting content item object due to search',
        contentItemTemp,
        ':',
        contentItemSearch?.id
      )
      for (const k of Object.keys(contentItemDefault)) {
        // @ts-ignore
        contentItemTemp[k] = contentItemDefault[k]
      }
      for (const k of Object.keys(contentItemSearch)) {
        // @ts-ignore
        contentItemTemp[k] = contentItemSearch[k]
      }

      // @ts-ignore
      if (!contentItemTemp.__original) {
        // @ts-ignore
        contentItemTemp.__original = _.cloneDeep(contentItemSearch)
      }

      setCacheKey('cache' + Math.random())
    }

    // if (params?.contentMode === 'edit') {
    //   if (!contentItemTemp.title) {
    //     contentItemTemp.title = 'Name'
    //   }
    // }

    // console.log('Set temp content item', contentItemTemp)

    return contentItemTemp
  }

  function getBreadcrumb({ contentItem, params }: any) {
    return [] as any
  }

  function onRemove({ params }: any) {
    // TODO: FormGroup does NOT have "Status" so hard delete?
    onSaveContentItem({
      id: params.contentId,
      // Status: 'Archived',
    })
  }

  function getTabs({ params }: any) {
    const tabs: any[] = []

    tabs.push({
      label: 'Information',
      key: 'formGroup',
      type: 'form',
      fieldsets: [
        {
          key: 'main',
          type: 'form',
          fields: [
            {
              label: 'Title',
              name: 'title',
              type: 'text',
              isRequired: true,
            },
            {
              label: 'Key',
              name: 'key',
              type: 'text',
              isRequired: true,
            },
            // {
            //   label: 'Description',
            //   name: 'description',
            //   type: 'textarea',
            //   isRequired: true,
            // },
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
    })

    // Users belonging to this FormGroup
    tabs.push({
      label: 'Forms',
      name: 'forms',
      key: 'forms',
      type: 'form',
      fieldsets: [
        {
          key: 'main-forms',
          type: 'full',
          fields: [
            {
              label: 'Forms',
              name: 'forms[]',
              type: 'related-list',
              showAdd: false,
              showEdit: false,
              displayKey: 'Number',
              content: (user: any) =>
                UserRenderer(user, (e: React.MouseEvent) => {
                  e.preventDefault()
                  history(buildUserPath(user))
                }),
            },
          ],
        },
      ],
    })

    // Roles belonging to this FormGroup
    tabs.push({
      label: 'Roles',
      name: 'roles',
      key: 'roles',
      type: 'form',
      fieldsets: [
        {
          key: 'main-roles',
          type: 'full',
          fields: [
            {
              label: 'Role',
              name: 'rolesOnFormGroups',
              type: 'related-list',
              filter: (item: any, items: any) => {
                return item.status !== 'Archived'
              },
              onAdd: (item: any, items: any) => {
                let listedItem: any = contentItem.rolesOnFormGroups.find(
                  (rolesOnFormGroups: any) => rolesOnFormGroups.role.id === item.role.id
                )
                if (!listedItem) {
                  listedItem = {
                    id: generateLongId(),
                    status: 'Active',
                    // roleId: roles.find((role: any) => role.id === item.role.id).id,
                    role: roles.find((role: any) => role.id === item.role.id),
                  }
                }
                listedItem.status = 'Active'

                return listedItem
              },
              onRemove: (item: any) => {
                const listedItem: any = contentItem.rolesOnFormGroups.find(
                  (rolesOnFormGroups: any) => rolesOnFormGroups.role.id === item.role.id
                )
                listedItem.status = 'Archived'
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
                  e.preventDefault()
                  history(buildRolePath(role))
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
                          ?.filter(
                            (role: any) =>
                              !contentItem.rolesOnFormGroups.find(
                                (rolesOnFormGroups: any) =>
                                  rolesOnFormGroups.status !== 'Archived' &&
                                  rolesOnFormGroups.role.id === role.id
                              )
                          )
                          .map((role: any) => {
                            return { text: role.name, value: role.id }
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
    })

    return tabs
  }

  const config: any = {
    history,
    cacheKey,
    isListLoading: contentListLoading,
    isItemLoading: contentItemLoading || createLoading || updateLoading,
    primaryKey: 'id',
    secondaryKey: 'name',
    baseUrl: '/groups',
    extraParams: {
      tab: 'formGroup',
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
  }

  useDocumentTitle(getDocumentTitle(localParams, contentItem))

  return (
    <div
      css={css`
        width: 90%;
        margin: 20px auto;
      `}
    >
      <App {...config} />
    </div>
  )
}

export default AdminFormGroups
