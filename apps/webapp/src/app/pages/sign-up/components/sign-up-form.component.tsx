import React from 'react';
import { Formik, Field } from 'formik';
import { StyledForm } from '../sign-up.styled';
import { SignUpSchema } from './sign-up-form.schema';
import { ButtonWithLoader } from '../../../../lib/loading-button/loading-button';
import { Input } from '../../../../lib/input/input';

export const SignUpForm: React.FC = () => {
  return (
    <Formik
      initialValues={{
        name: '',
        surname: '',
        email: '',
        password: '',
        repeatPassword: '',
      }}
      validationSchema={SignUpSchema}
      onSubmit={() => console.log('on submit')}
    >
      {({ errors, touched, isSubmitting }) => (
        <StyledForm>
          <Field
            component={Input}
            id="name"
            name="name"
            label="First name"
            variant="outlined"
            size="small"
            error={errors.name && touched.name}
            helperText={errors.name}
          />
          <Field
            component={Input}
            id="surname"
            name="surname"
            label="Surname"
            variant="outlined"
            size="small"
            error={errors.surname && touched.surname}
            helperText={errors.surname}
          />
          <Field
            component={Input}
            id="email"
            name="email"
            label="Email"
            variant="outlined"
            size="small"
            error={errors.email && touched.email}
            helperText={errors.email}
          />
          <Field
            component={Input}
            id="password"
            name="password"
            label="Password"
            variant="outlined"
            size="small"
            type="password"
            error={errors.password && touched.password}
            helperText={errors.password}
          />
          <Field
            component={Input}
            id="repeatPassword"
            name="repeatPassword"
            label="Repeat password"
            variant="outlined"
            size="small"
            type="password"
            error={errors.repeatPassword && touched.repeatPassword}
            helperText={errors.repeatPassword}
          />
          <ButtonWithLoader label="Submit" pending={isSubmitting} />
        </StyledForm>
      )}
    </Formik>
  );
};
