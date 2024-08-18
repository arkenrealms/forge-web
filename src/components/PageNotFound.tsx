import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Result } from 'antd';
import Button from './Button2';

export default () => {
  const history = useNavigate();
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary" onClick={() => history('/')} data-testid="back-home-button">
          Back To Home
        </Button>
      }
    />
  );
};
