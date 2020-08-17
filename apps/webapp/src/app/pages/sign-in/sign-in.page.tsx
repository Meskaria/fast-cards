import React from 'react';
import { GoogleLogin } from 'react-google-login';
import {
  Card,
  FormContainer,
  MarketingContainer,
  Page,
  Header,
} from './sign-in.styled';
import { SignInForm } from './components/sign-in-form.component';
import { Link } from 'react-router-dom';
import { Button, Divider } from 'antd';

interface Props {}

export const SignInPage: React.FC<Props> = () => {
  const responseGoogle = (data) => {
    console.log(data, 'data');
  };
  return (
    <Page>
      <Card>
        <FormContainer>
          <Header>
            <h2>Fast Cards</h2>
            <p>Create an account</p>
          </Header>
          <GoogleLogin
            className={'google-login'}
            // TODO pass from env variables - It's public key.
            clientId="224058172199-iphpccc4fbs72pefeh2lmqalm70e98mi.apps.googleusercontent.com"
            buttonText="Sign in with Google"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={'single_host_origin'}
          />
          <Divider />
          <SignInForm />
          Don't have an account? <Link to={'/sign-up'}>Register</Link>
        </FormContainer>
        <MarketingContainer />
      </Card>
    </Page>
  );
};
