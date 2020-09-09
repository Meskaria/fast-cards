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
  height: 100%;
  flex: 0 0 50%;
  padding: 7;
  text-align: center;
  color: text.lighter;

  & > .ant-typography {
    margin-top: 7;
  }
`;
export const MarketingContainer = styled.div`
  flex: 1;
  height: 100%;
  background-position: center;
  background-size: cover;
  background-image: url(${ScottWeb});
  position: relative;
  display: flex;
  align-items: flex-end;

  &:before {
    content: '';
    display: block;
    position: absolute;
    height: 100%;
    width: 100%;
    background: rgb(9, 9, 121);
    background: linear-gradient(
      180deg,
      rgba(9, 9, 121, 0) 20%,
      rgba(0, 0, 0, 1) 100%
    );
  }
`;
export const Header = styled.header`
  text-align: center;
  margin-bottom: 6;
`;
