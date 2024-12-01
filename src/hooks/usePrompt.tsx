import React, { createContext, useContext } from 'react';
import { notification } from 'antd';
import _ from 'lodash';

const PromptContext = createContext<any>({});

function PromptProvider({ children, value }: any) {
  const [prompt, notificationContextHolder] = notification.useNotification({
    maxCount: 1,
  });

  return (
    <PromptContext.Provider
      value={{
        prompt,
      }}
    >
      {notificationContextHolder}
      {children}
    </PromptContext.Provider>
  );
}

function usePrompt() {
  const context = useContext(PromptContext);
  return context;
}

export { PromptContext, PromptProvider, usePrompt };
