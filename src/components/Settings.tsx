import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Breadcrumb, Layout, Spin, Menu, Form as AntForm, theme } from 'antd'
import Form from '@arken/forge-ui/components/Form'
// @ts-ignore
import useSettings from '@arken/forge-ui/hooks/useSettings'
import { usePrompt } from '@arken/forge-ui/hooks/usePrompt'
import useDocumentTitle from '@arken/forge-ui/hooks/useDocumentTitle'
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
import cerebroConfig from '@arken/forge-ui/config'

function getDocumentTitle() {
  return 'ASI Cerebro - Settings'
}

const zzz = styled.div``

const { Header, Content, Footer, Sider } = Layout

const formLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

export default function AdminSettings() {
  const [form] = AntForm.useForm()
  const { settings } = useSettings()
  const { prompt } = usePrompt()
  const [openKeys, setOpenKeys] = useState(['account'])
  const [selectedMenuItem, setSelectedMenuItem] = useState('interface-general')

  useDocumentTitle(getDocumentTitle())

  const { data: users } = useSearchModels({
    key: 'User',
    action: 'users',
    query: `
      id
      name
      email
    `,
    variables: { where: {} } as any,
  })
  console.log(3333, settings)
  return (
    <Layout style={{ height: '100%' }}>
      <Sider width={200}>
        <Menu
          mode="inline"
          style={{ height: '100%' }}
          openKeys={openKeys}
          onOpenChange={(keys) => {
            const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1)
            if (
              latestOpenKey &&
              ['account', 'interface', 'development'].indexOf(latestOpenKey!) === -1
            ) {
              setOpenKeys(keys)
            } else {
              setOpenKeys(latestOpenKey ? [latestOpenKey] : [])
            }
            setSelectedMenuItem(latestOpenKey + '-general')
          }}
          onSelect={(info: any) => {
            setSelectedMenuItem(info.key)
          }}
          items={[
            {
              key: `interface`,
              label: `Interface`,

              children: [
                {
                  key: 'interface-general',
                  label: `General`,
                },
              ],
            },
            {
              key: `account`,
              label: `Account`,

              children: [
                {
                  key: 'account-general',
                  label: `General`,
                },
              ],
            },
            {
              key: `development`,
              label: `Development`,

              children: [
                {
                  key: 'development-general',
                  label: `General`,
                },
              ],
            },
          ]}
        />
      </Sider>
      {settings ? (
        <Content style={{ padding: '0 24px', minHeight: 280, maxWidth: 800 }}>
          {selectedMenuItem === 'interface-general' ? (
            <Form
              form={form}
              layout={formLayout}
              baseUrl=""
              params={{}}
              isEditing
              defaultValue={settings}
              setIsContentChange={() => {}}
              onNavigate={() => {}}
              onSubmit={async (values: any) => {
                console.log(3333, values)
                const localSettings = JSON.parse(window.localStorage.getItem('Settings') || '{}')
                window.localStorage.setItem(
                  'Settings',
                  JSON.stringify({ ...settings, ...localSettings, ...values })
                )

                prompt.success({
                  message: 'Settings saved',
                  description: '',
                  placement: 'topRight' as any,
                  duration: 5,
                })
              }}
              onChange={(key: any, val: any) => {
                console.log(`Setting setting ${key} to`, val)
                settings[key] = val
                form.setFieldValue(key, val)
              }}
              fieldsets={[
                {
                  key: 'main',
                  type: 'full',
                  fields: [
                    {
                      label: 'Confirm Removals',
                      name: 'RemoveConfirmation',
                      type: 'toggle',
                    },
                    {
                      label: 'Show Data Trees',
                      name: 'ShowDataTrees',
                      type: 'toggle',
                    },
                    {
                      label: 'Content Editor',
                      name: 'ContentEditor',
                      type: 'radio',
                      optionType: 'button',
                      options: () => [
                        {
                          text: 'Inline',
                          value: 'inline',
                        },
                        {
                          text: 'Standalone',
                          value: 'standalone',
                        },
                        {
                          text: 'Modal',
                          value: 'modal',
                        },
                      ],
                    },
                    {
                      label: 'Dark Mode',
                      name: 'DarkMode',
                      type: 'toggle',
                    },
                    {
                      label: 'Table Width',
                      name: 'TableWidth',
                      type: 'text',
                    },
                    {
                      label: '',
                      name: 'Actions',
                      type: 'actions',
                      showCancel: false,
                    },
                  ],
                },
              ]}
            />
          ) : selectedMenuItem === 'account-general' ? (
            <Form
              form={form}
              layout={formLayout}
              baseUrl=""
              params={{}}
              isEditing
              defaultValue={settings}
              setIsContentChange={() => {}}
              onNavigate={() => {}}
              onSubmit={async (values: any) => {
                const settings = JSON.parse(window.localStorage.getItem('Settings') || '{}')
                window.localStorage.setItem('Settings', JSON.stringify({ ...settings, ...values }))

                prompt.success({
                  message: 'Settings saved',
                  description: '',
                  placement: 'topRight' as any,
                  duration: 5,
                })
              }}
              fieldsets={[
                {
                  key: 'main',
                  fields: [
                    {
                      label: 'Desktop Notifications',
                      name: 'DesktopNotifications',
                      type: 'toggle',
                    },
                    {
                      label: '',
                      name: 'Actions',
                      type: 'actions',
                      showCancel: false,
                    },
                  ],
                },
              ]}
            />
          ) : selectedMenuItem === 'development-general' ? (
            <Form
              form={form}
              layout={formLayout}
              baseUrl=""
              params={{}}
              isEditing
              defaultValue={settings}
              setIsContentChange={() => {}}
              onNavigate={() => {}}
              onSubmit={async (values: any) => {
                const settings = JSON.parse(window.localStorage.getItem('Settings') || '{}')
                window.localStorage.setItem('Settings', JSON.stringify({ ...settings, ...values }))

                if (values.LoginAsUser) {
                  window.localStorage.setItem('LoginAs', values.LoginAsUser)
                  window.location.href = '/'
                }

                prompt.success({
                  message: 'Settings saved',
                  description: '',
                  placement: 'topRight' as any,
                  duration: 5,
                })
              }}
              fieldsets={[
                {
                  key: 'main',
                  type: 'full',
                  fields: [
                    // {
                    //   label: 'Local Mode',
                    //   name: 'LocalMode',
                    //   type: 'toggle',
                    // },
                    {
                      label: 'Developer Mode',
                      name: 'DeveloperMode',
                      type: 'toggle',
                    },
                    {
                      label: 'Enable Validation',
                      name: 'Validation',
                      type: 'toggle',
                    },
                    {
                      label: 'Login As',
                      name: 'LoginAsUser',
                      type: 'select',
                      options: () =>
                        users?.map((user: any) => {
                          return { text: user.name, value: user.email }
                        }) || [],
                      elementCss: css`
                        max-width: 200px;
                      `,
                    },
                    // {
                    //   label: 'Application ID',
                    //   name: 'ApplicationId',
                    //   type: 'text',
                    // },
                    {
                      label: '',
                      name: 'Actions',
                      type: 'actions',
                      showCancel: false,
                    },
                  ],
                },
              ]}
            />
          ) : null}
        </Content>
      ) : (
        <Spin size="large" />
      )}
    </Layout>
  )
}
