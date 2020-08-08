import React from 'react';
import { SignInPage, SignUpPage } from './pages';
import { Route, Redirect, Link, Switch } from 'react-router-dom';

const SignInRoutes = () => (
  <>
    <Route exact path="/" render={() => <Redirect to="/sign-in" />} />
    <Route path="/sign-in" component={SignInPage} />
  </>
);

const SignUpRoutes = () => (
  <>
    <Route exact path="/" render={() => <Redirect to="/sign-up" />} />
    <Route path="/sign-up" component={SignUpPage} />
  </>
);

export const DefaultContainer = () => (
  <div>
    <div className="container">
      <div role="navigation">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/sign-up">Sign-up</Link>
          </li>
          <li>
            <Link to="/sign-in">Sign-in</Link>
          </li>
        </ul>
      </div>
      <Route path="/" component={() => <div>Generated container</div>} />
    </div>
  </div>
);

export default () => (
  <Switch>
    <Route exact path="/(sign-in)" component={SignInRoutes} />
    <Route exact path="/(sign-up)" component={SignUpRoutes} />
    <Route component={DefaultContainer} />
  </Switch>
);
