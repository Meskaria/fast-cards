import React, { useContext } from 'react';
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
import { ThemeContext} from '@meskaria/ui';

export const SignUpPage: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <Page palette={theme.palette}>
      <Card theme={theme}>
        <FormContainer spacing={theme.spacing}>
          <Header spacing={theme.spacing}>
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
