import React from 'react';
import Forms from '~/components/Forms';
import Layout from '~/components/Layout';

export default ({ themeConfig }: any) => {
  return (
    <Layout>
      <Forms themeConfig={themeConfig} />
    </Layout>
  );
};
