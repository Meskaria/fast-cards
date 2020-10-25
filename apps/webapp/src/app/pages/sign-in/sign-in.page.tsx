import React from 'react';
// import { GoogleLogin } from 'react-google-login';
// import {
//   Card,
//   FormContainer,
//   MarketingContainer,
//   Page,
//   Header,
// } from './sign-in.styled';
// import { SignInForm } from './components/sign-in-form.component';
// import { Link } from 'react-router-dom';
import ThemeSwitcher from 'libs/ui/src/components/themeSwitcher/ThemeSwitcher';

interface Props {}

export const SignInPage: React.FC<Props> = () => {
  const responseGoogle = (data) => {
    console.log(data, 'data');
  };
  return (
    <div>
      {/*<Card>*/}
        <ThemeSwitcher/>
        {/*<FormContainer>*/}
        {/*  <Header>*/}
        {/*    <Typography.Title level={3}>Fast Cards</Typography.Title>*/}
        {/*    <Typography.Paragraph>Create an account</Typography.Paragraph>*/}
        {/*  </Header>*/}
        {/*  <Divider />*/}
        {/**/}
        {/*  <SignInForm />*/}
        {/*  <Divider />*/}
        {/*  <GoogleLogin*/}
        {/*    className={'google-login'}*/}
        {/*    theme={'dark'}*/}
        {/*    // TODO pass from env variables - It's public key.*/}
        {/*    clientId="224058172199-iphpccc4fbs72pefeh2lmqalm70e98mi.apps.googleusercontent.com"*/}
        {/*    buttonText="Sign in with Google"*/}
        {/*    onSuccess={responseGoogle}*/}
        {/*    onFailure={responseGoogle}*/}
        {/*    cookiePolicy={'single_host_origin'}*/}
        {/*  />*/}
        {/*  <Typography.Paragraph type={'secondary'}>*/}
        {/*    Don't have an account? <Link to={'/sign-up'}>Register</Link>*/}
        {/*  </Typography.Paragraph>*/}
        {/*</FormContainer>*/}
        {/*<MarketingContainer>*/}
        {/*   [copy] TODO add some marketing text*/}
        {/*</MarketingContainer>*/}
      {/*</Card>*/}
    </div>
  );
};
