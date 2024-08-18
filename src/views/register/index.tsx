import queryString from 'query-string';
import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import useWeb3 from '~/hooks/useWeb3';
import { Button, Card, Flex, Heading } from '~/ui';

const MainCard = styled(Card)`
  position: relative;
  font-weight: bold;
  border-width: 15px;
  border-style: solid;
  border-color: transparent;
  border-image: url('/images/frame.png') 80 repeat;
  border-image-width: 80px;
  padding: 20px;
  background: none;
  // transform: scale(0.8);
  text-shadow: 1px 1px 1px black;
  // box-shadow: 0 2px 0 0 rgb(0 0 0 / 80%), inset 0 -1px 0 0 rgb(0 0 0 / 10%), 0 0 66px 66px rgb(0 0 0 / 10%);
  text-align: center;
  background: #000;
  color: #bb955e;
  text-shadow: 1px 1px 1px black;
  font-weight: bold;
`;

const parseMatch = (location) => {
  const match = {
    params: queryString.parse(location?.search || ''),
  };

  for (const key in match.params) {
    if (match.params[key] === 'false') {
      // @ts-ignore
      match.params[key] = false;
    } else if (match.params[key] === 'true') {
      // @ts-ignore
      match.params[key] = true;
    }
  }

  return match;
};

const Register: React.FC<any> = () => {
  const location = useLocation();
  const match = parseMatch(location);
  const { account, library } = useWeb3();
  const { web3 } = useWeb3();
  return (
    <div>
      <MainCard>
        <Flex flexDirection="column" alignItems="center" justifyContent="center">
          <Heading as="h2" size="xl" color="#fff" mb="24px">
            Register Account
          </Heading>
          <br />
          <p>Welcome. To create an account please install Metamask, connect your wallet, and create your character.</p>
          <br />
          <br />
          <Flex flexDirection="column" alignItems="center" justifyContent="center">
            <Button
              scale="sm"
              as={RouterLink}
              to="/account"
              onClick={() => {
                window.scrollTo(0, 0);
              }}>
              Create Character
            </Button>
          </Flex>
        </Flex>
      </MainCard>
    </div>
  );
};

export default Register;

// {/* <p>Loading {progression * 100} percent...</p> */}
