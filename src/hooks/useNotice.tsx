import React, { createContext, useContext } from 'react';
import { message } from 'antd';
import _ from 'lodash';

const NoticeContext = createContext<any>({});

function NoticeProvider({ children, value }: any) {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <NoticeContext.Provider value={messageApi}>
      {contextHolder}
      {children}
    </NoticeContext.Provider>
  );
}

function useNotice() {
  const context = useContext(NoticeContext);
  return context;
}

export { NoticeContext, NoticeProvider, useNotice };
