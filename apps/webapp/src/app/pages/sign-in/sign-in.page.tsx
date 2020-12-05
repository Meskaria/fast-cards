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
import { Divider, Typography } from '@material-ui/core';

export const SignInPage: React.FC = () => {
  const responseGoogle = (data: any) => {
    console.log(data, 'data');
  };

  return (
    <Page>
      <Card>
        <FormContainer>
          <Header>
            <Typography component="h1" variant="h2">
              Tech couch
            </Typography>
            <Typography component="p" color="textSecondary">
              Log in
            </Typography>
          </Header>
          <Divider />

          <SignInForm />
          <Divider />
          <GoogleLogin
            className={'google-login'}
            theme={'dark'}
            // TODO pass from env variables - It's public key.
            clientId="224058172199-iphpccc4fbs72pefeh2lmqalm70e98mi.apps.googleusercontent.com"
            buttonText="Sign in with Google"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={'single_host_origin'}
          />
          <Typography component="p" variant="subtitle1" color="textSecondary">
            Don't have an account? <Link to={'/sign-up'}>Register</Link>
          </Typography>
        </FormContainer>
        <MarketingContainer>
          [copy] TODO add some marketing text
        </MarketingContainer>
      </Card>
    </Page>
  );
};
