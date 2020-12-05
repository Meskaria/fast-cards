import React from 'react';
import {
  Card,
  Page,
  Header,
  FormContainer,
  MarketingContainer,
} from './sign-up.styled';
import { SignUpForm } from './components/sign-up-form.component';
import { Link } from 'react-router-dom';
import { Divider, Typography } from '@material-ui/core';

export const SignUpPage: React.FC = () => {
  return (
    <Page>
      <Card>
        <FormContainer>
          <Header>
            <Typography component="h1" variant="h2">
              Tech couch
            </Typography>
            <Typography component="p" color="textSecondary">
              Create an account
            </Typography>
          </Header>
          <Divider />
          <SignUpForm />
          <Divider />
          <Typography component="p" variant="subtitle1" color="textSecondary">
            You already have an account? <Link to={'/sign-in'}>Log in</Link>
          </Typography>
        </FormContainer>

        <MarketingContainer />
      </Card>
    </Page>
  );
};
