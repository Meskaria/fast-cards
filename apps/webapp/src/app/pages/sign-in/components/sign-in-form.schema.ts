import * as Yup from 'yup';

export const SignInSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Required'),
  password: Yup.string()
    .min(8, 'Password should be minimum 8 characters')
    .max(16, 'Password should be maximum 16 characters')
    .required('Required'),
});
