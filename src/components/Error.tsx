import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate, Link } from 'react-router-dom';

export default function () {
  const navigate = useNavigate();

  return (
    <Result
      status="500"
      title="Error"
      subTitle="Sorry, an error occurred."
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          Back To Home
        </Button>
      }
    />
  );
}
