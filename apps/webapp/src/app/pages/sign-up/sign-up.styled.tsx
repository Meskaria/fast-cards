import styled from '@xstyled/styled-components';
import { Form } from 'formik';
import ScottWeb from '../../../assets/brian-lundquist-CxBLPzglHtw-unsplash.jpg';

export const Page = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fdfdfd;
`;

export const Card = styled.div`
  width: 800px;
  height: 640px;
  background-color: white;
  box-shadow: 3px 4px 12px 0px #ccc;
  display: flex;
`;

export const Header = styled.header`
  text-align: center;
  margin-bottom: 6px;
`;

export const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
`;

export const FormContainer = styled.div`
   display: flex;
   flex-direction: column;
   justify-content: space-around;
   padding: 50px;
   flex: 1;
`;

export const MarketingContainer = styled.div`
  flex: 2;
  min-height: 100%;
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

