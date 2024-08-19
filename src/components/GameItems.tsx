import { HomeOutlined } from '@ant-design/icons';
import _ from 'lodash';
import qs from 'qs';
import { Modal, Form as AntForm } from 'antd';
import React, { useState } from 'react';
import { BiCommentDetail } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { css } from 'styled-components';
import App from '@arken/forge-ui/components/App';
import FormFieldText from '@arken/forge-ui/components/FormFieldText';
import FormFieldSelect from '@arken/forge-ui/components/FormFieldSelect';
// @ts-ignore
import {
  useModel,
  useGetModel,
  useCreateModel,
  useDeleteModel,
  useUpdateModel,
  useSearchModels,
} from '@arken/forge-ui/hooks/db';
import useSettings from '@arken/forge-ui/hooks/useSettings';
import * as log from '@arken/node/util/log';
import { camelize } from '@arken/node/util/string';
import { usePrompt } from '@arken/forge-ui/hooks/usePrompt';
import { useAuth } from '@arken/forge-ui/hooks/useAuth';
import appConfig from '~/config';

// const GameItems = ({ themeConfig }: any) => {
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
  // commentsOnForms: [] as any,
  // recordUpdatesOnForms: [] as any,
  meta: '',
};
const contentItemTemp: FormWithRelations = { ...contentItemDefault };

const GameItems = ({ themeConfig }: any) => {
  const [cacheKey, setCacheKey] = useState('cache');
  const { settings } = useSettings();
  const history = useNavigate();
  const { prompt } = usePrompt();
  const { permissions } = useAuth();
  const [form] = AntForm.useForm();

  const extraParams: any = {
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
    query: `
    id
    key
    title
    description
    meta
    status
    version
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
      }
    }
    groupId
    group {
      id
      title
    }
    publishedForm
    draftForm
  `,
    variables: localParams.contentId
      ? {
          where: {
            id: { equals: localParams.contentId },
          },
        }
      : null,
  });

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
    groupId
    group {
      id
      title
    }
  `,
    variables: {
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
    },
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
        ellipsize: false,
        // align: 'center',
        // width: 150,
        render: (text: any, record: any, index: number, props: any) => {
          // console.log('gggggg', props)
          return (
            <FormFieldText
              name={text}
              defaultValue={text}
              isRequired
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
            <FormFieldSelect
              name={`status-${record.id}`}
              defaultValue={record.status}
              options={() => StatusList as any}
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
        title: 'Group',
        dataIndex: 'groupId',
        key: 'groupId',
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
            <FormFieldSelect
              name={`group-${record.id}`}
              defaultValue={record.groupId}
              options={() =>
                formGroups?.map((group: any) => ({
                  text: group.title,
                  value: group.id,
                })) || []
              }
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
        title: '',
        key: 'action',
        fixed: 'right',
        width: 20,
        render: ({ id, key }: any, record: any) => {
          // console.log('vvvvv', record)
          return (
            <div
              css={css`
                text-align: right;
              `}
              data-tourid="app-table-options">
              {permissions['Design Forms'] ? (
                <a
                  href="#"
                  css={css`
                    padding: 0 10px;
                  `}
                  onClick={function (e) {
                    goto({ contentId: id, contentMode: 'view', tab: 'designer' });
                    e.stopPropagation();
                    e.preventDefault();
                  }}>
                  Design
                </a>
              ) : null}
              {/* record?.formSubmissions?.length &&  */}
              {process.env.REACT_APP_PUBLIC_URI && permissions['View Submissions'] ? (
                <a
                  href={`${process.env.REACT_APP_PUBLIC_URI}/submissions/${key}`}
                  target="_blank"
                  css={css`
                    padding: 0 10px;
                  `}>
                  Data
                </a>
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
  // console.log('45454545', 'zzz', contentItemSearch)
  function getContentItem({ params }: any) {
    if (contentItemSearch?.id && params?.contentId !== contentItemSearch.id) {
      for (const k of Object.keys(contentItemDefault)) {
        // @ts-ignore
        contentItemTemp[k] = contentItemDefault[k];
      }
      contentItemTemp.isLoading = true;
      return contentItemTemp;
    }

    if (!params?.contentMode && !params?.contentId) {
      console.log('Resetting content item object due to params', params, contentItemTemp, ':', contentItemSearch?.id);
      for (const k in contentItemTemp) {
        // @ts-ignore
        delete contentItemTemp[k];
      }
      for (const k in contentItemDefault) {
        // @ts-ignore
        contentItemTemp[k] = contentItemDefault[k];
      }
    } else if (!contentItemSearch?.meta) {
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

    if (!contentItemTemp.meta) contentItemTemp.meta = {};
    // if (!contentItemTemp.meta.Data) contentItemTemp.meta.Data = {}

    // console.log('Set temp content item', contentItemTemp)

    return contentItemTemp;
  }

  function getBreadcrumb({ contentItem, params }: any) {
    const breadcrumb: any = [
      {
        href: ``,
        title: <HomeOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
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
        label: 'Information',
        key: 'form',
        type: 'form',
        fieldsets: [
          {
            key: 'main',
            type: 'form',
            align: 'left',
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
            ],
          },
          {
            key: 'form-info',
            type: 'form',
            align: 'right',
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
                  // console.log('45454545', contentItemSearch, contentItemTemp)

                  // for (const k of Object.keys(contentItemDefault)) {
                  //   // @ts-ignore
                  //   contentItemTemp[k] = contentItemDefault[k]
                  // }
                  // for (const k of Object.keys(contentItemSearch)) {
                  //   // @ts-ignore
                  //   contentItemTemp[k] = contentItemSearch[k]
                  // }

                  // // @ts-ignore
                  // // if (!contentItemTemp.__original) {
                  // // @ts-ignore
                  // contentItemTemp.__original = _.cloneDeep(contentItemSearch)
                  // // window.queryClient.invalidateQueries('model')
                  rerender();
                  window.location.reload();
                  // console.log('45454545')
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
        ],
      },
    ];

    if (permissions['Design Forms']) {
      tabs.push({
        label: 'Designer',
        key: 'designer',
        type: 'form',
        fieldsets: [
          {
            key: 'main',
            type: 'full',
            fields: [
              {
                label: '',
                name: 'meta.data',
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
            defaultValue: {
              formSubmissions: [],
            },
            fields: [
              {
                label: '',
                name: 'formSubmissions',
                type: 'submissions',
                onRefresh: async function () {
                  await contentItemRefetch();

                  for (const k of Object.keys(contentItemSearch)) {
                    // @ts-ignore
                    contentItemTemp[k] = contentItemSearch[k];
                  }

                  rerender();
                },
                onAccept: async function (submissionId: string) {
                  // await acceptSubmission(submissionId)
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
    createText: 'Create New Form',
    isListLoading: contentListLoading,
    isLoading: contentItemLoading || createLoading || updateLoading,
    primaryKey: 'id',
    secondaryKey: 'title',
    baseUrl: '/interfaces',
    extraParams: {
      tab: 'form',
      tableMode: 'view',
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
        max-width: 90%;
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
            document.querySelectorAll('[data-tourid="app-content-edit-button"]')[0].click();
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
      <div
        css={css`
          padding: 20px 0 20px;
          text-align: right;
          font-family: 'Open Sans', sans-serif;
        `}>
        <h1
          css={css`
            color: #6fa6d4;
            font-size: 28px;
            font-weight: normal;
            font-style: normal;
          `}>
          Manage Forms
        </h1>
        <p
          css={css`
            color: rgb(51, 51, 51);
            font-weight: normal;
            font-style: normal;
            margin-top: 5px;
          `}>
          Search by Form ID
        </p>
      </div>
      <div
        css={css`
          position: relative;
        `}>
        <App {...config} />
      </div>
    </div>
  );
};

export default GameItems;
