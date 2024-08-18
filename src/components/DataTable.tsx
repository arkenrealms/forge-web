import React, { useCallback, useLayoutEffect, useMemo, useEffect, useState, useRef } from 'react'
import { BsArrowRightSquareFill } from 'react-icons/bs'
import styled, { css } from 'styled-components'
import ReactJson from 'react-json-view'
import addresses from 'rune-backend-sdk/build/contractInfo'
import useMatchBreakpoints from '~/hooks/useMatchBreakpoints'
import { Card, CardBody, CardHeader, Flex, Heading, Text } from '~/ui'
import { HomeOutlined, UserOutlined, InboxOutlined, UploadOutlined } from '@ant-design/icons'
import {
  Button,
  Table,
  Space,
  Layout,
  Breadcrumb,
  Tag,
  Checkbox,
  Col,
  Form,
  InputNumber,
  Radio,
  Rate,
  Row,
  Select,
  Slider,
  Switch,
  Upload,
} from 'antd'
import { formatDistance, parseISO } from 'date-fns'
import qs from 'qs'
import type { ColumnsType, TableProps, TablePaginationConfig } from 'antd/es/table'
import type { FilterValue, SorterResult } from 'antd/es/table/interface'
import { useHistory, Link } from 'react-router-dom'
import history from '~/routerHistory'

const { Header, Content, Footer, Sider } = Layout

const nothing = styled.div``

const { Option } = Select

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
}

const contractAddressToKey = {}

for (const contractKey of Object.keys(addresses)) {
  contractAddressToKey[addresses[contractKey][56]] = contractKey
}

const onFinish = (values: any) => {
  console.log('Received values of form: ', values)
}

interface DateItemType {
  rewardName: string
}

interface DataType {
  key: React.Key
  id: string
  username: string
  createdAt: number
  address: string
  to: string
  updatedAt: number
  claimedAt: number
  message: string
  status: string
  tokenAddresses: string[]
  tokenAmounts: number[]
  itemIds: DateItemType[]
}

interface TableParams {
  pagination?: TablePaginationConfig
  sortField?: string
  sortOrder?: string
  filters?: Record<string, FilterValue>
}

export default function ({ primaryKey, getBreadcrumb, getColumns, contentModel, getContentList, getContentItem }) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [loading, setLoading] = useState(false)
  const history2 = useHistory()
  const [columns, setColumns] = useState([])
  const [contentItem, setContentItem] = useState(undefined)
  const { isMd, isLg, isXl, isXxl, isXxxl } = useMatchBreakpoints()
  const isMobile = !isMd && !isLg && !isXl && !isXxl && !isXxxl

  const start = () => {
    setLoading(true)
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([])
      setLoading(false)
    }, 1000)
  }

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys)
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }
  const hasSelected = selectedRowKeys.length > 0

  const [contentList, setContentList] = useState<DataType[]>(undefined)
  const localParams = qs.parse(window.location.search.replace('?', ''))
  const [params, setParams] = useState({
    current: localParams.current ? localParams.current : '1',
    pageSize: localParams.pageSize ? localParams.pageSize : '20',
    contentId: localParams.contentId || null,
    status: localParams.status || null,
    total: 0,
  })

  useEffect(
    function () {
      history2.listen(function () {
        const p: any = qs.parse(window.location.search.replace('?', ''))

        if (qs.stringify(p) === qs.stringify(params)) return

        delete params.status
        delete params.contentId

        if (!p.contentId) {
          setContentItem(undefined)
        }

        setParams({
          ...params,
          ...p,
        })
      })
    },
    [params, setParams, setContentItem, history2]
  )

  const paramsCache = useMemo(
    function () {
      return JSON.stringify(params)
    },
    [params]
  )

  useEffect(
    function () {
      async function run() {
        setColumns(await getColumns({ params }))
      }

      run()
    },
    [params, getColumns]
  )

  const breadcrumb = getBreadcrumb({ params })

  useEffect(
    function () {
      if (contentItem && contentItem[primaryKey] === params.contentId) return

      async function run() {
        setContentItem(await getContentItem({ contentList, params }))
      }

      run()
    },
    [contentItem, contentList, primaryKey, paramsCache, params, getContentItem]
  )

  useEffect(() => {
    if (contentList && paramsCache === JSON.stringify(params)) return

    setLoading(true)

    async function run() {
      const responseData = await getContentList({ params })
      setContentList(responseData)
      setLoading(false)
      setParams({
        ...params,
        total: responseData.length,
      })
    }

    run()
  }, [setLoading, setContentList, setParams, getContentList, params, paramsCache, contentList])

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue>,
    sorter: SorterResult<DataType> | SorterResult<DataType>[],
    extra
  ) => {
    const params2 = qs.parse(window.location.search.replace('?', ''))
    const p = qs.parse(window.location.search.replace('?', ''))

    params2.pageSize = String(pagination.pageSize)
    params2.current = String(pagination.current)

    delete params2.status

    if (filters.status) params2.status = String(filters.status)

    if (qs.stringify(p) === qs.stringify(params2)) return

    history.push(`${breadcrumb[1]}?${qs.stringify(params2)}`)
  }

  function itemRender(route, params2, routes, paths) {
    const last = routes.indexOf(route) === routes.length - 1
    return last ? <span>{route.title}</span> : <Link to={route.path}>{route.title}</Link>
  }

  const ref = useRef(null)
  const [sideWidth, setSideWidth] = useState(isMobile ? 0 : 800)

  useLayoutEffect(() => {
    const width = (ref.current.offsetWidth > 800 ? ref.current.offsetWidth - 300 : ref.current.offsetWidth) - 20

    if (width === sideWidth) return

    setSideWidth(width)
  }, [sideWidth, ref])

  const p2 = qs.parse(window.location.search.replace('?', ''))

  const isFiltered = Object.keys(p2).length > 0

  delete p2.contentId

  const queries = qs.stringify(p2)

  const breadcrumbItems = [
    {
      path: breadcrumb[0].path,
      title: <HomeOutlined />,
    },
    {
      path: `${breadcrumb[1].path}?${queries}`,
      title: breadcrumb[1].label,
    },
  ]

  if (contentItem) {
    breadcrumbItems.push({
      title: params.contentId,
      path: `${breadcrumb[1].path}?${queries}`,
    })
  }

  return (
    <>
      <Layout ref={ref} style={{ padding: '0' }}>
        <Content style={{ padding: '0', minWidth: isMobile ? (contentItem ? '0%' : '100%') : 320, overflow: 'hidden' }}>
          <Card>
            <CardBody css={css``}>
              <Space style={{ marginBottom: 16 }}>
                <Button onClick={() => history.push(breadcrumb[1])} disabled={!isFiltered}>
                  Clear filters
                </Button>
                <Button type="primary" onClick={start} disabled={!hasSelected} loading={loading}>
                  Reload
                </Button>
                <span style={{ marginLeft: 8 }}>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}</span>
              </Space>
              <Table
                scroll={{ x: 'max-content', y: isMobile ? 500 : undefined }}
                rowSelection={rowSelection}
                rowKey={(record) => record.id}
                columns={columns}
                dataSource={contentList}
                size="middle"
                onChange={handleTableChange}
                pagination={{
                  pageSize: parseInt(String(params.pageSize)),
                  current: parseInt(String(params.current)),
                  // total: params.total,
                  simple: true,
                  position: ['bottomRight'],
                }}
                loading={loading}
              />
            </CardBody>
          </Card>
        </Content>
        <Sider width={sideWidth} collapsed={!contentItem}>
          {contentItem ? (
            <>
              <Card>
                <CardBody css={css``}>
                  <Breadcrumb itemRender={itemRender} items={breadcrumbItems} />
                </CardBody>
              </Card>
              <Form
                name="validate_other"
                {...formItemLayout}
                onFinish={onFinish}
                initialValues={{ 'input-number': 3, 'checkbox-group': ['A', 'B'], rate: 3.5 }}>
                {contentModel.fieldsets.map((fieldset, fieldsetIndex) => {
                  const styles: any = {}

                  if (fieldset.align === 'left') {
                    styles.float = 'left'
                  }

                  if (fieldset.align === 'right') {
                    styles.float = 'right'
                  }

                  if (fieldset.type === 'form') {
                    styles.maxWidth = 600
                    styles.width = '50%'
                  }

                  if (fieldset.type === 'full') {
                    styles.clear = 'both'
                    styles.width = '100%'
                  }

                  return (
                    <Card key={fieldsetIndex} style={styles}>
                      <CardBody css={css``}>
                        {fieldset.type === 'actions' ? <h2 style={{ marginBottom: 20 }}>Actions</h2> : null}
                        {fieldset.fields.map((field) => {
                          if (field.type === 'text') {
                            return (
                              <Form.Item key={field.key} label={field.label}>
                                <span className="ant-form-text">{contentItem[field.key] || field.default}</span>
                              </Form.Item>
                            )
                          }
                          if (field.type === 'date') {
                            return (
                              <Form.Item key={field.key} label={field.label}>
                                <span className="ant-form-text">
                                  {formatDistance(
                                    parseISO(new Date(contentItem[field.key]).toISOString()),
                                    new Date(),
                                    {
                                      addSuffix: true,
                                    }
                                  )}{' '}
                                  ({contentItem[field.key]})
                                </span>
                              </Form.Item>
                            )
                          }
                          if (field.type === 'tokens') {
                            return (
                              <Form.Item key={field.key} label="Tokens">
                                {Object.keys(contentItem[field.key]).length ? (
                                  <div style={{ marginBottom: 0 }}>
                                    {Object.keys(contentItem[field.key]).map((index) => {
                                      return (
                                        <small key={index} style={{ fontSize: '0.8rem' }}>
                                          {contentItem[field.valueKey][index].toFixed(3)}{' '}
                                          {contractAddressToKey[contentItem[field.key][index]].toUpperCase()}
                                          {', '}
                                        </small>
                                      )
                                    })}
                                  </div>
                                ) : (
                                  <>None</>
                                )}
                              </Form.Item>
                            )
                          }
                          if (field.type === 'items') {
                            return (
                              <Form.Item key={field.key} label="Items">
                                {Object.keys(contentItem[field.key]).length ? (
                                  <div style={{ marginTop: 0 }}>
                                    {Object.keys(contentItem[field.key]).map((index) => {
                                      return (
                                        <small key={index} style={{ fontSize: '0.8rem' }}>
                                          {contentItem[field.key][index]?.rewardName}
                                          <br />
                                        </small>
                                      )
                                    })}
                                  </div>
                                ) : (
                                  <>None</>
                                )}
                              </Form.Item>
                            )
                          }
                          if (field.type === 'select') {
                            return (
                              <Form.Item
                                key={field.key}
                                name="select"
                                label="Select"
                                hasFeedback
                                rules={[{ required: true, message: field.label }]}>
                                <Select placeholder={field.label} defaultValue={contentItem[field.key]} disabled>
                                  {field.options.map((option) => (
                                    <Option value={option}>{option}</Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            )
                          }
                          if (field.type === 'jsonviewer') {
                            return (
                              <div
                                key={field.key}
                                css={css`
                                  height: 400px;
                                  width: 100%;
                                  overflow-y: scroll;
                                  .react-json-view {
                                    background: none !important;
                                  }
                                `}>
                                <ReactJson
                                  src={field.key === '@' ? contentItem : contentItem[field.key]}
                                  theme="brewer"
                                  collapsed={1}
                                  enableClipboard
                                  collapseStringsAfterLength={15}
                                  iconStyle="triangle"
                                  quotesOnKeys={false}
                                />
                              </div>
                            )
                          }
                          if (field.type === 'rune-user-info') {
                            return (
                              <Form.Item key={field.key} label={field.label}>
                                <Button href={`https://arken.gg/user/${contentItem[field.key]}`} target="_blank">
                                  Open arken.gg Profile
                                </Button>
                              </Form.Item>
                            )
                          }

                          return (
                            <div key={field.key}>
                              Unknown field: {field.key} = {field.type} ({field.label})
                            </div>
                          )
                        })}
                      </CardBody>
                    </Card>
                  )
                })}
                {/* <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
                    <Button type="primary" htmlType="submit">
                      Submit
                    </Button>
                  </Form.Item> */}
              </Form>
            </>
          ) : null}
        </Sider>
      </Layout>
    </>
  )
}
