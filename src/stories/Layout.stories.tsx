import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Layout from '../components/Layout'

export default {
  title: 'Main/Layout',
  component: Layout,
  parameters: {},
} as ComponentMeta<typeof Layout>

const Template: ComponentStory<typeof Layout> = (args) => <Layout {...args} />

export const Standard = Template.bind({})
Standard.args = {
  children: <>Text here</>,
}
