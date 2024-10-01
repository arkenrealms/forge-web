import { IoHomeOutline as HomeOutlined } from 'react-icons/io5';
import _ from 'lodash';
import qs from 'qs';
import { Modal, Form as AntForm } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { css } from 'styled-components';
import App from '@arken/forge-ui/components/App';
import FormFieldText from '@arken/forge-ui/components/FormFieldText';
import FormFieldSelect from '@arken/forge-ui/components/FormFieldSelect';
import useSettings from '@arken/forge-ui/hooks/useSettings';
import * as log from '@arken/node/util/log';
import { camelize } from '@arken/node/util/string';
import { usePrompt } from '@arken/forge-ui/hooks/usePrompt';
import { useAuth } from '@arken/forge-ui/hooks/useAuth';
import appConfig from '~/config';
import { trpc } from '~/utils/trpc';
import shortId from 'shortid';
import type { Interface, InterfaceGroup } from '@arken/node/modules/interface/interface.types';

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
  name: '',
  description: '',
  key: '',
  groupId: null,
  // commentsOnForms: [] as any,
  // revisions: [] as any,
  meta: '',
};
const contentItemTemp: FormWithRelations = { ...contentItemDefault };

const InterfaceDesigner = ({ interfaceKey }: any) => {
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

  const { data: formGroups }: any = trpc.relay.interface.getInterfaceGroups.useQuery<InterfaceGroup[]>();

  localParams.contentId = interfaceKey;

  const {
    data: contentItemSearch,
    refetch: contentItemRefetch,
    isLoading: contentItemLoading,
  }: any = trpc.relay.interface.getInterface.useQuery<Interface>(
    localParams.contentId
      ? {
          where: {
            id: { equals: localParams.contentId },
          },
        }
      : {}, // Pass an empty object instead of undefined
    {
      enabled: Boolean(localParams.contentId), // Control execution with 'enabled'
    }
  );

  const {
    data: contentListSearch,
    refetch: contentListRefetch,
    isLoading: contentListLoading,
  } = trpc.relay.interface.getInterfaces.useQuery<Interface[]>({
    where: {
      OR: [
        {
          name: { contains: localParams.value },
        },
        {
          key: { contains: localParams.value },
        },
        {
          version: { contains: localParams.value },
        },
        localParams.value
          ? {
              name: { contains: localParams.value },
            }
          : {
              name: { contains: '' }, // Get all when not searching by a term
            },
      ],
      AND: [
        {
          name: { contains: localParams.name },
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
  });

  const {
    mutateAsync: createInterface,
    isPending: createLoading,
    error: createContentItemError,
  } = trpc.relay.interface.createInterface.useMutation();

  const {
    mutateAsync: updateInterface,
    isPending: updateLoading,
    error: updateContentItemError,
  } = trpc.relay.interface.updateInterface.useMutation();

  const { mutateAsync: publishInterface } = trpc.relay.interface.publishInterface.useMutation();

  const { mutateAsync: deleteInterface } = trpc.relay.interface.deleteInterface.useMutation();

  const { mutateAsync: deactivateInterface } = trpc.relay.interface.deactivateInterface.useMutation();

  const { mutateAsync: createInterfaceDraft } = trpc.relay.interface.createInterfaceDraft.useMutation();

  const { mutateAsync: resetInterface } = trpc.relay.interface.resetInterface.useMutation();

  const { mutateAsync: acceptInterfaceSubmission } = trpc.relay.interface.acceptInterfaceSubmission.useMutation();

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
        const res: any = await updateInterface({
          data: contentItem,
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
        const res: any = await createInterface({ data: contentItem });

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
        title: 'ID',
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
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
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
            text: group.name,
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
                  text: group.name,
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
          console.log('vvvvv22', permissions);
          return (
            <div
              css={css`
                text-align: right;
              `}
              data-tourid="app-table-options">
              {permissions['Design Interfaces'] ? (
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
        if (contentItemTemp.name) {
          contentItemTemp.key = camelize(contentItemTemp.name);
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
        title: <HomeOutlined />,
      },
      {
        href: `/interfaces`,
        title: 'Interfaces',
      },
    ];

    if (contentItem?.__original) {
      breadcrumb.push({
        href: `/service/core/interfaces?contentMode=view&contentId=${contentItem.id}`,
        title: contentItem[config.secondaryKey],
      });
    } else {
      breadcrumb.push({
        href: `/service/core/interfaces?contentMode=view`,
        title: 'New Interface',
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
                label: 'Name',
                name: 'name',
                type: 'text',
                isRequired: true,
                onChange: (key: any, value: any) => {
                  // const contentItem = getContentItem({ params: localParams })
                  // contentItem.key = camelize(value)
                },
              },
              {
                label: 'Description',
                name: 'description',
                type: 'content',
                isRequired: false,
                onChange: (key: any, value: any) => {
                  // const contentItem = getContentItem({ params: localParams })
                  // contentItem.key = camelize(value)
                },
              },
              {
                label: 'ID',
                name: 'key',
                type: 'text',
                isRequired: true,
              },
              {
                label: 'Group',
                name: 'groupId',
                type: 'select',
                options: () =>
                  formGroups?.map((group: any) => ({
                    text: group.name,
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
                previewEndpoints: { Public: 'http://' },
                onDelete: async () => {
                  const contentItem = getContentItem({ params: localParams });

                  const res: any = await deleteInterface({
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

                  const res: any = await publishInterface({
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

                  const res: any = await deactivateInterface({
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

                  const res: any = await createInterfaceDraft({
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

                  const res: any = await resetInterface({
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

    if (permissions['Design Interfaces']) {
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
                previewEndpoints: { Public: 'http://' },
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
                  // await acceptInterfaceSubmission(submissionId)
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
    createText: 'Create New Interface',
    isListLoading: contentListLoading,
    isLoading: contentItemLoading || createLoading || updateLoading,
    primaryKey: 'id',
    secondaryKey: 'name',
    baseUrl: '/interfaces',
    extraParams: {
      tab: 'form',
      tableMode: 'view',
    },
    commentsFieldName: 'commentsOnForms',
    isResizable: false,
    // showContentModal: true,
    canCreate: permissions['Manage Interfaces'],
    canEdit: permissions['Manage Interfaces'],
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
    history,
    permissions,
  };

  return (
    <div
      css={css`
        width: 100%;
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
      {/* <div
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
          Manage Interfaces
        </h1>
        <p
          css={css`
            color: rgb(51, 51, 51);
            font-weight: normal;
            font-style: normal;
            margin-top: 5px;
          `}>
          Search by ID
        </p>
      </div> */}
      <div
        css={css`
          position: relative;
        `}>
        <App {...config} />
      </div>
    </div>
  );
};

export default InterfaceDesigner;
