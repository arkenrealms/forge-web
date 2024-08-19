import React from 'react'
import AdminGroups from '~/components/Groups'
import AdminLayout from '~/components/Layout'
import type { ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import dayjs from 'dayjs'

export type TableListItem = {
  key: number
  name: string
  creator: string
  createdDate: number
}
const tableListDataSource: TableListItem[] = []

const creators = ['付小小', '曲丽丽', '林东东', '陈帅帅', '兼某某']

for (let i = 0; i < 1; i += 1) {
  tableListDataSource.push({
    key: i,
    name: 'AppName',
    creator: creators[Math.floor(Math.random() * creators.length)],
    createdDate: Date.now() - Math.floor(Math.random() * 100000),
  })
}

const columns: ProColumns<TableListItem>[] = [
  {
    title: '应用名称',
    dataIndex: 'name',
    render: (_: any) => <a>{_}</a>,
    formItemProps: {
      lightProps: {
        labelFormatter: (value: any) => `app-${value}`,
      },
    },
  },
  {
    title: '日期范围',
    dataIndex: 'startTime',
    valueType: 'dateRange',
    hideInTable: true,
    initialValue: [dayjs(), dayjs().add(1, 'day')],
  },
  {
    title: '创建者',
    dataIndex: 'creator',
    valueType: 'select',
    valueEnum: {
      all: { text: '全部' },
      付小小: { text: '付小小' },
      曲丽丽: { text: '曲丽丽' },
      林东东: { text: '林东东' },
      陈帅帅: { text: '陈帅帅' },
      兼某某: { text: '兼某某' },
    },
  },
]

export default ({ themeConfig }: any) => {
  return (
    <AdminLayout>
      <ProTable<TableListItem>
        columns={columns}
        request={(params: any, sorter: any, filter: any) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          console.log(params, sorter, filter)
          return Promise.resolve({
            data: tableListDataSource,
            success: true,
          })
        }}
        headerTitle="Light Filter"
        rowKey="key"
        pagination={{
          showQuickJumper: true,
        }}
        options={false}
        search={{
          filterType: 'light',
        }}
        dateFormatter="string"
      />
      <AdminGroups themeConfig={themeConfig} />
    </AdminLayout>
  )
}
