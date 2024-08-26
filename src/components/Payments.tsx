import { IoHomeOutline as HomeOutlined } from 'react-icons/io5';
import _ from 'lodash';
import qs from 'qs';
import { Modal, Form as AntForm, Button, Tooltip } from 'antd';
import React, { useState, useCallback } from 'react';
import { FaPaintbrush, FaFileLines } from 'react-icons/fa6';
import { FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { css } from 'styled-components';
import App from '@arken/forge-ui/components/App';
import FormFieldText from '@arken/forge-ui/components/FormFieldText';
import FormFieldNumber from '@arken/forge-ui/components/FormFieldNumber';
import FormFieldSelect from '@arken/forge-ui/components/FormFieldSelect';
import FormFieldChoice from '@arken/forge-ui/components/FormFieldChoice';
// @ts-ignore
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
import useSettings from '@arken/forge-ui/hooks/useSettings';
import * as log from '@arken/node/util/log';
import { camelize } from '@arken/node/util/string';
import { usePrompt } from '@arken/forge-ui/hooks/usePrompt';
import { useAuth } from '@arken/forge-ui/hooks/useAuth';
import appConfig from '~/config';

// const Payments = ({ themeConfig }: any) => {
//   const config = {
//     themeConfig,
//     modelName: 'Form',
//     modelAction: 'forms',
//     modelFields: [
//       {
//         name: 'id',
//         include: ['list', 'view', 'edit'],
//       },
//       {
//         name: 'key',
//         include: ['list', 'view', 'edit'],
//       },
//       {
//         name: 'title',
//         include: ['list', 'view', 'edit'],
//       },
//       {
//         name: 'description',
//         include: ['view', 'edit'],
//       },
//       {
//         name: 'meta',
//         include: ['view', 'edit'],
//       },
//       {
//         name: 'status',
//         include: ['list', 'view', 'edit'],
//       },
//       {
//         name: 'version',
//         include: ['list', 'view', 'edit'],
//       },
//       {
//         name: 'groupId',
//         include: ['list', 'view', 'edit'],
//       },
//       {
//         name: 'group',
//         include: ['list', 'view', 'edit'],
//         children: [
//           {
//             name: 'id',
//             include: ['list', 'view', 'edit'],
//           },
//           {
//             name: 'title',
//             include: ['list', 'view', 'edit'],
//           },
//         ],
//       },
//       {
//         name: 'formSubmissions',
//         include: ['view', 'edit'],
//         children: [
//           {
//             name: 'id',
//             include: ['view', 'edit'],
//           },
//           {
//             name: 'createdDate',
//             include: ['view', 'edit'],
//           },
//           {
//             name: 'status',
//             include: ['view', 'edit'],
//           },
//           {
//             name: 'formId',
//             include: ['view', 'edit'],
//           },
//           {
//             name: 'formKey',
//             include: ['view', 'edit'],
//           },
//           {
//             name: 'formVersion',
//             include: ['view', 'edit'],
//           },
//           {
//             name: 'components',
//             include: ['view', 'edit'],
//             children: [
//               {
//                 name: 'key',
//                 include: ['view', 'edit'],
//               },
//               {
//                 name: 'value',
//                 include: ['view', 'edit'],
//               },
//             ],
//           },
//         ],
//       },
//       {
//         name: 'publishedForm',
//         include: ['view', 'edit'],
//       },
//       {
//         name: 'draftForm',
//         include: ['view', 'edit'],
//       },
//     ],
//   }

//   return <Editor {...config} />
// }

const shortId = require('shortid');

const StatusList = [
  {
    text: 'Draft',
    value: 'Draft',
  },
  {
    text: 'Published',
    value: 'Published',
  },
  {
    text: 'Finished',
    value: 'Finished',
  },
  {
    text: 'Paused',
    value: 'Paused',
  },
  {
    text: 'Archived',
    value: 'Archived',
  },
];

type NexusModel<T> = T & {
  __original?: T;
  isLoading?: boolean;
  meta: any;
  draftForm: any;
  publishedForm: any;
};

type FormWithRelations = NexusModel<any>;

const contentItemDefault: any = {
  id: '',
  status: 'Draft',
  title: '',
  description: '',
  key: '',
  groupId: null,
  showInOneStop: false,
  theme: 'Default',
  // commentsOnForms: [] as any,
  // recordUpdatesOnForms: [] as any,
  meta: '',
};
const contentItemTemp: FormWithRelations = { ...contentItemDefault };

const Payments = ({ themeConfig }: any) => {
  const [cacheKey, setCacheKey] = useState('cache');
  const { settings } = useSettings();
  const history = useNavigate();
  const { prompt } = usePrompt();
  const { permissions } = useAuth();
  const [form] = AntForm.useForm();

  const extraParams: any = {
    current: '1',
    pageSize: '10',
    tab: 'form',
    tableMode: 'view',
    status: ['Draft', 'Published'],
  };
  const localParams: any = {
    ...extraParams,
    ...qs.parse(window.location.search.replace('?', '')),
  };

  const rerender = function () {
    log.dev('Rerender');
    setCacheKey('cache' + Math.random());
  };

  const { data: formGroups } = useSearchModels({
    key: 'FormGroup',
    action: 'formGroups',
    query: `
      id
      title
      key
      status
      meta
    `,
    variables: { where: {} } as any,
  });

  const {
    isLoading: contentItemLoading,
    data: contentItemSearch,
    refetch: contentItemRefetch,
  }: any = useGetModel({
    key: 'Form',
    action: 'findFirstForm',
    gql: `
      query findFirstForm($where: FormWhereInput!) {
        findFirstForm(where: $where) {
          id
          key
          title
          description
          meta
          status
          version
          theme
          showInOneStop
          connectors {
            key
            type
            event
            protocol
            endpoint
          }
          components {
            ...componentFields
            components {
              ...componentFields
              components {
                ...componentFields
                components {
                  ...componentFields
                  components {
                    ...componentFields
                  }
                }
              }
            }
          }
          formSubmissions {
            id
            createdDate
            status
            formId
            formKey
            formVersion
            components {
              key
              value
              components {
                key
                value
                components {
                  key
                  value
                  components {
                    key
                    value
                    components {
                      key
                      value
                    }
                  }
                }
              }
            }
          }
          groupId
          group {
            id
            title
          }
          publishedForm
          draftForm
        }
      }

      fragment componentFields on FormComponent {
        id
        key
        type
        subType
        label
        note
        placeholder
        value
        isRequired
        isEditable
        isHidden
        isDisabled
        isCustomAllowed
        hasValidation
        hasAttachment
        gridRows
        gridColumns
        connector
        dataPrimaryKey
        data
        actions
        options
        validation {
          numberFormat
          currencyFormat
          dateFormat
          emailFormat
          phoneFormat
          postalFormat
          range
          endpoint
        }
      }
    `,
    variables: localParams.contentId
      ? {
          where: {
            id: { equals: localParams.contentId },
          },
        }
      : null,
  });

  // const contentItem = getContentItem({ params: localParams }) as FormWithRelations

  const variables = {
    take: parseInt(localParams.pageSize),
    skip: (parseInt(localParams.current) - 1) * parseInt(localParams.pageSize),
    where: {
      OR: [
        {
          title: { contains: localParams.value },
        },
        {
          key: { contains: localParams.value },
        },
        {
          version: { contains: localParams.value },
        },
        localParams.value
          ? {
              title: { contains: localParams.value },
            }
          : {
              title: { contains: '' }, // Get all when not searching by a term
            },
      ],
      AND: [
        {
          title: { contains: localParams.title },
        },
        {
          key: { contains: localParams.key },
        },
        {
          version: { contains: localParams.version },
        },
        { status: { in: localParams.status } },
        { groupId: { in: localParams.groupId } },
      ],
    },
  };

  const {
    isLoading: contentListLoading,
    data: contentListSearch,
    refetch: contentListRefetch,
  }: any = useSearchModels({
    key: 'Form',
    action: 'forms',
    query: `
    id
    key
    title
    status
    version
    showInOneStop
    theme
    groupId
    group {
      id
      title
    }
  `,
    variables,
  });

  const { data: aggregateForm }: any = useGetModel({
    key: 'Form',
    action: 'aggregateForm',
    query: `
    _count {
      _all
    }
  `,
    variables,
  });

  const {
    isLoading: createLoading,
    error: createContentItemError,
    mutateAsync: createForm,
  }: any = useCreateModel({ key: 'Form', action: 'createOneForm', query: `id` });

  const {
    isLoading: updateLoading,
    error: updateContentItemError,
    mutateAsync: updateForm,
  }: any = useUpdateModel({ key: 'Form', action: 'updateOneForm', query: `id` });

  const { mutateAsync: publishForm }: any = useModel({
    key: 'Form',
    action: 'publishForm',
    query: `id`,
  });

  const { mutateAsync: deleteOneForm }: any = useDeleteModel({
    key: 'Form',
    action: 'deleteOneForm',
    query: `id`,
  });

  const { mutateAsync: deactivateForm }: any = useModel({
    key: 'Form',
    action: 'deactivateForm',
    query: `id`,
  });

  const { mutateAsync: createFormDraft }: any = useModel({
    key: 'Form',
    action: 'createFormDraft',
    query: `id`,
  });

  const { mutateAsync: resetFormDraft }: any = useModel({
    key: 'Form',
    action: 'resetFormDraft',
    query: `id`,
  });

  const { mutateAsync: acceptSubmission }: any = useModel({
    key: 'FormSubmission',
    action: 'acceptSubmission',
    query: `id`,
  });

  const onChangeParams = async (params: any) => {
    // log.dev('Refetching', params.contentId)
    // queryClient.invalidateQueries('search-forms')
    // contentItemRefetch({ id: params.contentId })
  };

  const [isDraftWarningAcknowledged, setIsDraftWarningAcknowledged] = useState(false);
  const [isDraftWarningModalVisible, setIsDraftWarningModalVisible] = useState(false);

  const onSaveContentItem = async (values: any) => {
    try {
      const contentItem = JSON.parse(JSON.stringify(getContentItem({ params: localParams })));

      log.dev('Saving content item...', values, contentItem);

      if (contentItem.draftForm && !contentItem.__draftWarningAcknowledged) {
        setIsDraftWarningModalVisible(true);

        return;
      }

      console.log('Copying form values to content item', contentItem, values);
      for (const index in values) {
        // @ts-ignore
        contentItem[index] = values[index];
      }

      delete contentItem.isLoading;
      delete contentItem.formSubmissions;
      delete contentItem.group;
      delete contentItem.draftForm;
      delete contentItem.publishedForm;

      if (contentItem.__original) {
        log.dev('Updating form', contentItem, contentItemSearch);
        const res = await updateForm({
          before: contentItem.__original,
          after: contentItem,
          where: {
            id: contentItem.id,
          },
        });

        return {
          message: `Success`,
          description: <>Saved Form: {values?.[config.secondaryKey]}</>,
          placement: 'topRight' as any,
          duration: 3,
          contentId: res.id,
        };
      } else {
        log.dev('Creating form', contentItem, contentItemSearch);
        const res = await createForm({ data: contentItem });

        return {
          message: `Success`,
          description: <>Created Form: {values?.[config.secondaryKey]}</>,
          placement: 'topRight' as any,
          duration: 3,
          contentId: res.id,
        };
      }
    } catch (e) {
      console.log('Error saving form', e);
      // const description = e?.networkError?.result?.errors?.[0].message || e?.message

      // if (description) {
      //   prompt.error({
      //     message: 'Error',
      //     description,
      //     placement: 'topRight' as any,
      //     duration: 60,
      //   })
      // }

      throw e;
    }
  };

  function goto(params: any) {
    const newParams = { ...qs.parse(window.location.search.replace('?', '')), ...params };
    return history(`/interfaces?${qs.stringify(newParams)}`);
  }

  async function getColumns({ params }: any) {
    const columns = [
      {
        title: 'Form ID',
        dataIndex: 'key',
        key: 'key',
        className: 'forms-column-key',
        // align: 'center',
        render: (text: any, record: any, index: number, props: any = {}) => {
          return (
            <FormFieldText
              name={text}
              defaultValue={text}
              isRequired
              isEditing={params.tableMode === 'edit'}
              onChange={(text: any) =>
                onSaveContentItem({
                  key: text,
                })
              }
              css={css`
                min-width: 100px;
              `}
              {...props}
            />
          );
        },

        sorter: (a: any, b: any) => a.key.localeCompare(b.key),
      },
      {
        title: 'Form Name',
        dataIndex: 'title',
        key: 'title',
        className: 'forms-column-title',
        ellipsize: false,
        // align: 'center',
        // width: 150,
        render: (text: any, record: any, index: number, props: any = {}) => {
          return (
            <FormFieldText
              name={text}
              defaultValue={text}
              isRequired
              isEditing={params.tableMode === 'edit'}
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
          );
        },
        sorter: (a: any, b: any) => a.title.localeCompare(b.title),
      },
      {
        title: 'Version',
        dataIndex: 'version',
        key: 'version',
        className: 'forms-column-version',
        ellipsize: false,
        // align: 'center',
        // width: 150,
        render: (text: any, record: any, index: number, props: any) => {
          // console.log('gggggg', props)
          return (
            <FormFieldNumber
              name={text}
              defaultValue={text}
              isRequired
              validation={{ range: '1-999' }}
              isEditing={params.tableMode === 'edit'}
              onChange={(text: any) =>
                onSaveContentItem({
                  version: text,
                })
              }
              css={
                props
                  ? css``
                  : css`
                      min-width: 75px;
                      text-align: center;
                    `
              }
              {...(props || {})}
            />
          );
        },
        sorter: (a: any, b: any) => a.version.localeCompare(b.version),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        className: 'forms-column-status',
        align: 'center',
        width: 150,
        filters: StatusList,
        filteredValue: params.status || [],
        // onFilter: (value: any, record: OrderWithRelations) =>
        //   ((params.Status as string[]) || StatusList.map((item: any) => item.value)).some(
        //     (item) => item === record.Status
        //   ),
        render: (text: any, record: any, index: number, props: any = {}) => {
          return (
            <FormFieldChoice
              name={`status-${record.id}`}
              defaultValue={record.status}
              options={() => StatusList as any}
              type="Drop Down"
              isRequired
              isEditing={params.tableMode === 'edit'}
              onChange={(value: any) =>
                onSaveContentItem({
                  id: record.id,
                  status: value,
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
        title: 'Group',
        dataIndex: 'groupId',
        key: 'groupId',
        className: 'forms-column-groupId',
        align: 'center',
        width: 150,
        filters:
          formGroups?.map((group: any) => ({
            text: group.title,
            value: group.id,
          })) || [],
        filteredValue: params.groupId || [],
        // onFilter: (value: any, record: OrderWithRelations) =>
        //   ((params.Status as string[]) || StatusList.map((item: any) => item.value)).some(
        //     (item) => item === record.Status
        //   ),
        render: (text: any, record: any, index: number, props: any = {}) => {
          return (
            <FormFieldChoice
              name={`group-${record.id}`}
              defaultValue={record.groupId}
              options={() =>
                formGroups?.map((group: any) => ({
                  text: group.title,
                  value: group.id,
                })) || []
              }
              type="Drop Down"
              isRequired
              isEditing={params.tableMode === 'edit'}
              onChange={(value: any) =>
                onSaveContentItem({
                  id: record.id,
                  groupId: value,
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
        title: '',
        key: 'action',
        fixed: 'right',
        width: 110,
        render: ({ id, key }: any, record: any) => {
          // console.log('vvvvv', record)
          return (
            <div
              css={css`
                text-align: right;
                width: 110px;
              `}
              data-testid="app-table-options">
              {process.env.REACT_APP_PUBLIC_URI ? (
                <Button
                  size="small"
                  href={
                    record?.status === 'Published'
                      ? `${process.env.REACT_APP_PUBLIC_URI}/view/${key}`
                      : `${process.env.REACT_APP_PUBLIC_URI}/preview/${id}`
                  }
                  target="_blank"
                  css={css`
                    display: inline-block;
                    padding: 3px 0px;
                    margin: 0 3px;
                    color: #00598e;
                    border-bottom: 1px solid #00598e;
                    &:hover {
                      color: #000;
                      border-bottom: 1px solid #000;
                    }
                  `}
                  onClick={function (e) {
                    e.stopPropagation();
                  }}>
                  <Tooltip placement="top" title="Preview">
                    <FaEye />
                  </Tooltip>
                </Button>
              ) : null}
              {/* record?.formSubmissions?.length &&  */}
              {process.env.REACT_APP_PUBLIC_URI && permissions['View Submissions'] ? (
                <Button
                  size="small"
                  href={`${process.env.REACT_APP_PUBLIC_URI}/submissions/${key}`}
                  target="_blank"
                  css={css`
                    display: inline-block;
                    padding: 3px 0px;
                    margin: 0 3px;
                    color: #00598e;
                    border-bottom: 1px solid #00598e;
                    &:hover {
                      color: #000;
                      border-bottom: 1px solid #000;
                    }
                  `}
                  onClick={function (e) {
                    e.stopPropagation();
                  }}>
                  <Tooltip placement="top" title="Submissions">
                    <FaFileLines />
                  </Tooltip>
                </Button>
              ) : null}
              {permissions['Design Forms'] ? (
                <Button
                  size="small"
                  href="#"
                  css={css`
                    display: inline-block;
                    padding: 3px 0px;
                    margin: 0 3px;
                    color: #00598e;
                    border-bottom: 1px solid #00598e;
                    &:hover {
                      color: #000;
                      border-bottom: 1px solid #000;
                    }
                  `}
                  onClick={function (e) {
                    goto({ contentId: id, contentMode: 'view', tab: 'designer' });
                    e.stopPropagation();
                    e.preventDefault();
                  }}>
                  <Tooltip placement="top" title="Design">
                    <FaPaintbrush />
                  </Tooltip>
                </Button>
              ) : null}
              {process.env.REACT_APP_PUBLIC_URI ? (
                <a
                  href={`${process.env.REACT_APP_PUBLIC_URI}/view/${key}`}
                  target="_blank"
                  css={css`
                    padding: 0 10px;
                  `}
                  onClick={function (e) {
                    // goto({ contentId: id, contentMode: 'edit', tab: 'preview' })
                    // e.stopPropagation()
                    // e.preventDefault()
                  }}>
                  Preview
                </a>
              ) : null}
            </div>
          );
        },
      },
    ];

    return columns;
  }

  function getContentList({ params }: any) {
    return contentListSearch || [];
  }

  const getContentItem = useCallback(
    ({ params }: any) => {
      console.log('getContentItem', params, contentItemSearch);

      if (contentItemSearch?.id && params?.contentId !== contentItemSearch.id) {
        for (const k of Object.keys(contentItemDefault)) {
          // @ts-ignore
          contentItemTemp[k] = contentItemDefault[k];
        }
        contentItemTemp.isLoading = true;
        return contentItemTemp;
      }

      if (params.contentMode === 'hidden' && !params?.contentId) {
        console.log('Resetting content item object due to params', params, contentItemTemp, ':', contentItemSearch?.id);
        for (const k in contentItemTemp) {
          // @ts-ignore
          delete contentItemTemp[k];
        }
        for (const k in contentItemDefault) {
          // @ts-ignore
          contentItemTemp[k] = contentItemDefault[k];
        }
      } else if (!contentItemSearch?.components) {
        // TODO: kind of a hack to deal with delay of the object keys getting set
        return contentItemTemp;
      }

      contentItemTemp.isLoading = false;

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
        // if (!contentItemTemp.__original) {
        // @ts-ignore
        contentItemTemp.__original = _.cloneDeep(contentItemSearch);
        // }

        rerender();
      } else if (!params?.contentId) {
        console.log(
          'Resetting content item object due to params',
          params,
          ':',
          contentItemTemp,
          ':',
          contentItemSearch?.id,
          ':',
          contentItemDefault
        );
        for (const k in contentItemTemp) {
          // @ts-ignore
          delete contentItemTemp[k];
        }
        for (const k in contentItemDefault) {
          // @ts-ignore
          contentItemTemp[k] = contentItemDefault[k];
        }
      }

      if (params?.contentMode === 'edit') {
        if (!contentItemTemp.key) {
          if (contentItemTemp.title) {
            contentItemTemp.key = camelize(contentItemTemp.title);
          } else {
            contentItemTemp.key = shortId.generate();
          }
        }
      }

      // if (!contentItemTemp.meta) contentItemTemp.meta = {}
      // if (!contentItemTemp.meta.Data) contentItemTemp.meta.Data = {}

      // console.log('Set temp content item', contentItemTemp)

      return contentItemTemp;
    },
    [contentItemSearch]
  );

  function getBreadcrumb({ contentItem, params }: any) {
    const breadcrumb: any = [
      {
        href: ``,
        title: <HomeOutlined />,
      },
      {
        href: `/interfaces`,
        title: 'Forms',
      },
    ];

    if (contentItem?.__original) {
      breadcrumb.push({
        href: `/interfaces?contentMode=view&contentId=${contentItem.id}`,
        title: contentItem[config.secondaryKey],
      });
    } else {
      breadcrumb.push({
        href: `/interfaces?contentMode=view`,
        title: 'New Form',
      });
    }

    return breadcrumb;
  }

  function onRemove({ params }: any) {}

  function getTabs({ params }: any) {
    const tabs = [
      {
        key: 'form',
        type: 'form',
        label: 'Information',
        fieldsets: [
          {
            key: 'main',
            type: 'form',
            align: 'left',
            tiled: true,
            label: 'Information',
            columns: 16,
            fields: [
              {
                label: 'Form Name',
                name: 'title',
                type: 'text',
                isRequired: true,
                onChange: (key: any, value: any) => {
                  // const contentItem = getContentItem({ params: localParams })
                  // contentItem.key = camelize(value)
                },
              },
              {
                label: 'Form Description',
                name: 'description',
                type: 'content',
                isRequired: false,
                onChange: (key: any, value: any) => {
                  // const contentItem = getContentItem({ params: localParams })
                  // contentItem.key = camelize(value)
                },
              },
              {
                label: 'Form ID',
                name: 'key',
                type: 'text',
                isRequired: true,
              },
              {
                label: 'Form Group',
                name: 'groupId',
                type: 'select',
                options: () =>
                  formGroups?.map((group: any) => ({
                    text: group.title,
                    value: group.id,
                  })) || [],
                onChange: (key: any, value: any) => {
                  console.log('3333 changed', key, value);

                  const contentItem = getContentItem({ params: localParams });
                  contentItem.group = formGroups.find((g1: any) => g1.id === value);
                  contentItem.groupId = contentItem.group.id;
                },
                isRequired: true,
              },
              {
                label: 'Theme',
                name: 'theme',
                type: 'select',
                options: () => [
                  {
                    text: 'Default',
                    value: 'default',
                  },
                  {
                    text: 'Nexus',
                    value: 'cerebro',
                  },
                ],
                isRequired: true,
              },
              {
                label: 'Show In OneStop',
                name: 'showInOneStop',
                type: 'toggle',
              },
            ],
          },
          {
            key: 'form-info',
            type: 'form',
            align: 'right',
            tiled: true,
            label: 'Status',
            columns: 8,
            fields: [
              {
                label: '',
                name: 'form-info',
                type: 'form-info',
                onDelete: async () => {
                  const contentItem = getContentItem({ params: localParams });

                  const res = await deleteOneForm({
                    where: {
                      id: contentItem.id,
                    },
                  });

                  if (res?.id) {
                    prompt.success({
                      message: 'Form deleted',
                      description: '',
                      placement: 'topRight' as any,
                      duration: 5,
                    });
                  }

                  history('/interfaces');
                },
                onPublish: async () => {
                  const contentItem = getContentItem({ params: localParams });

                  const res = await publishForm({
                    data: {},
                    where: {
                      id: contentItem.id,
                    },
                  });

                  // await contentListRefetch()
                  await contentItemRefetch();

                  history('/interfaces?tab=form&contentMode=view&contentId=' + res.id);
                  rerender();
                  window.location.reload();
                },
                onDeactivate: async () => {
                  const contentItem = getContentItem({ params: localParams });

                  const res = await deactivateForm({
                    data: {},
                    where: {
                      id: contentItem.id,
                    },
                  });

                  await contentItemRefetch();
                  rerender();

                  history('/interfaces?tab=form&contentMode=view&contentId=' + res.id);
                  window.location.reload();
                },
                onEditDraft: async (id: string) => {
                  history('/interfaces?tab=form&contentMode=view&contentId=' + id);
                  window.location.reload();
                },
                onCreateDraft: async () => {
                  const contentItem = getContentItem({ params: localParams });

                  const res = await createFormDraft({
                    data: {},
                    where: {
                      id: contentItem.id,
                    },
                  });

                  // Change contentId
                  await contentItemRefetch();
                  // rerender?
                  history('/interfaces?tab=form&contentMode=view&contentId=' + res.id);
                  window.location.reload();
                  // console.log(contentItemLoading, contentListLoading, createLoading, updateLoading)
                  // setTimeout(() => {
                  //   contentItemTemp.isLoading = false
                  // }, 300)
                },
                onResetDraft: async () => {
                  const contentItem = getContentItem({ params: localParams });

                  const res = await resetFormDraft({
                    data: {},
                    where: {
                      id: contentItem.id,
                    },
                  });

                  window.location.reload();
                },
              },
            ],
          },
          {
            key: 'form-connectors',
            type: 'form',
            tiled: true,
            label: 'Connectors',
            nav: 'form-connectors',
            offset: 16,
            columns: 8,
            fields: [
              {
                label: '',
                name: 'connectors',
                type: 'form-connectors',
                onChange: (value: any) => {
                  console.log('asdadasds', value);
                  setCacheKey('cache' + Math.random());
                },
              },
            ],
          },
        ],
      },
    ];

    const onRefreshSubmissions = useCallback(() => {
      console.log('rerender', contentItemSearch);
      // await contentItemRefetch()
      console.log('rerender', contentItemSearch);
      if (contentItemSearch) {
        for (const k of Object.keys(contentItemSearch)) {
          // @ts-ignore
          contentItemTemp[k] = contentItemSearch[k];
        }

        setCacheKey('cache' + Math.random());
      }
    }, [cacheKey, contentItemSearch]);

    if (permissions['Design Forms']) {
      tabs.push({
        label: 'Designer',
        key: 'designer',
        type: 'form',
        fieldsets: [
          {
            key: 'main',
            type: 'full',
            padding: 0,
            columns: 24,
            rows: 1,
            fields: [
              {
                label: '',
                name: '',
                type: 'designer',
              },
            ],
          },
        ],
      } as any);
    }

    if (permissions['View Submissions']) {
      tabs.push({
        label: 'Submissions',
        key: 'submissions',
        type: 'form',
        fieldsets: [
          {
            key: 'main',
            type: 'full',
            padding: 0,
            tiled: true,
            defaultValue: {
              formSubmissions: [],
            },
            fields: [
              {
                label: '',
                name: 'formSubmissions',
                type: 'submissions',
                onRefresh: onRefreshSubmissions,
                onAccept: async function (submissionId: string) {
                  // await acceptSubmission(submissionId)
                },
              },
            ],
          },
        ],
      } as any);
    }

    if (permissions['Manage Settings']) {
      tabs.push({
        label: 'Settings',
        key: 'settings',
        type: 'form',
        fieldsets: [
          {
            key: 'main',
            type: 'full',
            padding: 0,
            defaultValue: {
              settings: [],
            },
            fields: [
              {
                label: '',
                name: 'settings',
                type: 'form-settings',
                onImport: function (value: any) {
                  console.log('adasdsadas', value);
                  for (const k of Object.keys(value)) {
                    // @ts-ignore
                    contentItemTemp[k] = value[k];
                  }
                },
              },
            ],
          },
        ],
      } as any);
    }

    return tabs;
  }

  const config = {
    form,
    cacheKey,
    tableText: 'Forms',
    createText: 'Create New Form',
    isListLoading: contentListLoading,
    isLoading: contentItemLoading || createLoading || updateLoading,
    primaryKey: 'id',
    secondaryKey: 'title',
    baseUrl: '/interfaces',
    extraParams: {
      ...extraParams,
      total: aggregateForm?._count?._all || 0,
    },
    commentsFieldName: 'commentsOnForms',
    isResizable: false,
    // showContentModal: true,
    canCreate: permissions['Manage Forms'],
    canEdit: permissions['Manage Forms'],
    rerender,
    getBreadcrumb,
    getColumns,
    getContentList,
    getContentItem,
    onChangeParams,
    onChange: (selected: any) => {
      console.log('3333 changed', selected);
    },

    onSubmit: async (values: any) => {
      return onSaveContentItem(values);
    },

    // onValidate: (values: any) => {
    //   const contentItem = getContentItem({ params: localParams })

    //   if (contentItem.draftForm && !isDraftWarningAcknowledged) {
    //     return {

    //       title: 'Warning',
    //       message: 'There is an existing draft. Saving a published form will replace that draft.'
    //     }
    //   }

    //   return true
    // },
    onRemove,
    getTabs,
    themeConfig,
    history,
    permissions,
  };

  return (
    <div
      css={css`
        width: 90%;
        margin: 0 auto;
      `}>
      <Modal
        centered
        title="Warning"
        cancelText=""
        closable={false}
        okText="Confirm Publish"
        onOk={() => {
          const contentItem = getContentItem({ params: localParams });
          contentItem.__draftWarningAcknowledged = true;

          setIsDraftWarningAcknowledged(true);
          setIsDraftWarningModalVisible(false);

          setTimeout(() => {
            // Doesnt work for some reason
            // form.submit()
            // @ts-ignore
            document.querySelectorAll('[data-testid="app-content-edit-button"]')[0].click();
          }, 500);
        }}
        onCancel={() => {
          setIsDraftWarningModalVisible(false);
        }}
        closeIcon={<></>}
        open={isDraftWarningModalVisible}
        css={css`
          max-width: 100vw !important;
        `}>
        This form is already published, so it cannot be updated. Instead a draft will be created. However, there already
        an existing draft. That draft will be replaced with the current changes.
      </Modal>
      {/* <div
        css={css`
          padding: 20px 0 20px;
          text-align: right;
          font-family: 'Open Sans', sans-serif;
        `}
      >
        <h1
          css={css`
            color: #6fa6d4;
            font-size: 28px;
            font-weight: normal;
            font-style: normal;
          `}
        >
          Manage Forms
        </h1>
        <p
          css={css`
            color: rgb(51, 51, 51);
            font-weight: normal;
            font-style: normal;
            margin-top: 5px;
          `}
        >
          Search by Form ID
        </p>
      </div> */}
      <div
        css={css`
          position: relative;
          margin-top: 30px;
        `}>
        <App {...config} />
        {/* <div style={{ height: 0, overflow: 'hidden' }}>cache-key-{cacheKey}</div> */}
      </div>
    </div>
  );
};

export default Payments;
