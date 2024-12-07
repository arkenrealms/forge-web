import styled from 'styled-components';
import Container from './Container';

const Page = styled(Container)`
  // min-height: calc(100vh - 85px);
  padding-top: 16px;
  padding-bottom: 16px;
  padding-left: 15px;
  padding-right: 15px;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-top: 24px;
    padding-bottom: 24px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 32px;
    padding-bottom: 32px;
  }

  ${({ theme }) => (theme.brand === 'w4' ? `padding: 0 !important` : '')}
`;

export default Page;
