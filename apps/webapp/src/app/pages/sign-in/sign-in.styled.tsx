import styled from '@xstyled/styled-components';
import ScottWeb from '../../../assets/brian-lundquist-CxBLPzglHtw-unsplash.jpg';

export const Page = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: linear-gradient(to top, #fff1eb 0%, #ace0f9 100%);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Card = styled.div`
  width: 800px;
  height: 570px;
  background-color: white;
  box-shadow: main;
  display: flex;
`;

export const FormContainer = styled.div`
  width: 40%;
  height: 100%;
  padding: 7;

  .google-login {
    width: 100% !important;
  }
`;
export const MarketingContainer = styled.div`
  width: 60%;
  height: 100%;
  background-position: center;
  background-size: cover;
  background-image: url(${ScottWeb});
`;
export const Header = styled.header`
  text-align: center;
  margin-bottom: 6;
`;
