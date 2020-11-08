import React from 'react';
import { Formik, Field } from 'formik';
import { StyledForm } from '../sign-in.styled';
import { Input, ButtonWithLoader } from '@meskaria/ui';
import { SignInSchema } from './sign-in-form.schema';

export const SignInForm: React.FC = () => {
  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      validationSchema={SignInSchema}
      onSubmit={() => console.log('on submit')}
    >
      {({ errors, touched, isSubmitting }) => (
      <StyledForm>
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
        <ButtonWithLoader label="Submit" pending={isSubmitting}/>
      </StyledForm>
      )}
    </Formik>
  );
};
