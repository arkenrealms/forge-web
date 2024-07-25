import Layout from '~/components/Layout'
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

type NexusModel<T> = T & {
  __original?: T
  meta: any
}

type ModelWithRelations = NexusModel<any>

function getDocumentTitle(params: any, contentItem: ModelWithRelations = undefined) {
  if (contentItem?.name) {
    return `ASI Cerebro - Model - ${contentItem.name}`
  }

  return 'ASI Cerebro - Models'
}

const contentItemDefault: ModelWithRelations = {
  id: '',
  name: '',
  description: '',
  createdDate: new Date(),
  updatedDate: undefined,
  deletedDate: undefined,
  meta: {},
}

const contentItemTemp: ModelWithRelations = { ...contentItemDefault }

const query = `
  id
  name
  createdDate
  updatedDate
  deletedDate
`

const permissions = [
  { name: 'Process Forms', id: 'Process Forms' },
  { name: 'Manage Forms', id: 'Manage Forms' },
  { name: 'View Interfaces', id: 'View Interfaces' },
  { name: 'Design Forms', id: 'Design Forms' },
  { name: 'Manage Users', id: 'Manage Users' },
  { name: 'View Users', id: 'View Users' },
  { name: 'Manage Submissions', id: 'Manage Submissions' },
  { name: 'View Submissions', id: 'View Submissions' },
  { name: 'Process Submissions', id: 'Process Submissions' },
  { name: 'View Workflows', id: 'View Workflows' },
  { name: 'Manage Settings', id: 'Manage Settings' },
  { name: 'Deletion', id: 'Deletion' },
]

export default ({ themeConfig }: any) => {
  const [cacheKey, setCacheKey] = useState('0')
  const history = useNavigate()

  const localParams: any = {
    ...qs.parse(window.location.search.replace('?', '')),
  }

  const { isLoading: contentItemLoading, data: contentItemSearch }: any = useGetModel({
    key: 'Model',
    action: 'findFirstModel',
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
    key: 'Model',
    action: 'findModels',
    query,
    variables: {
      where: {
        __model: 'CryptoToken',
      },
      orderBy: {
        name: 'asc',
      },
    },
  })

  const { isPending: createLoading, mutateAsync: createModel } = useCreateModel({
    key: 'Model',
    action: 'createOneModel',
    query: `
      id
    `,
  })

  const { isPending: updateLoading, mutateAsync: updateModel } = useUpdateModel({
    key: 'Model',
    action: 'updateOneModel',
    query: `
      id
    `,
  })

  const rerender = function () {
    setCacheKey('cache' + Math.random())
  }

  const onSaveContentItem = async (values: Partial<ModelWithRelations>) => {
    try {
      const contentItem = getContentItem({ params: localParams })
      for (const index in values) {
        // @ts-ignore
        contentItem[index] = values[index]
      }

      if (contentItem.__original) {
        log.dev('Updating Model', contentItem, contentItemSearch)
        const res = await updateModel({
          before: contentItem.__original,
          after: contentItem,
          where: {
            id: contentItem.id,
          },
        })

        return {
          message: `Success`,
          description: <>Saved Model: {values?.name}</>,
          placement: 'topRight' as any,
          duration: 3,
          contentId: res.id,
        }
      } else {
        log.dev('Creating Model', contentItem, contentItemSearch)
        const res = await createModel({ data: contentItem })

        return {
          message: `Success`,
          description: <>Created Model: {values?.name}</>,
          placement: 'topRight' as any,
          duration: 3,
          contentId: res.id,
        }
      }
    } catch (e) {
      console.log('Error saving role', e)
      throw e
    }
  }

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
          )
        },
        sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      },
      // {
      //   title: 'Description',
      //   dataIndex: 'description',
      //   key: 'description',
      //   render: (text: any, record: any, index: number, props: any = {}) => {
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
      //         {...props}
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

    return contentItemTemp
  }

  function getBreadcrumb({ contentItem, params }: any) {
    return [] as any
  }

  function onRemove({ params }: any) {
    // TODO: Model does NOT have "Status" so hard delete?
    onSaveContentItem({
      id: params.contentId,
      // Status: 'Archived',
    })
  }

  function getTabs({ params }: any) {
    const tabs: any[] = []

    tabs.push({
      label: 'Information',
      key: 'model',
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

    return tabs
  }

  const config: any = {
    history,
    cacheKey,
    isListLoading: contentListLoading,
    isItemLoading: contentItemLoading || createLoading || updateLoading,
    primaryKey: 'id',
    secondaryKey: 'Name',
    baseUrl: '/models',
    extraParams: {
      tab: 'model',
    },
    commentsFieldName: 'commentsOnModels',
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
    <Layout>
      <App {...config} />
    </Layout>
  )
}
