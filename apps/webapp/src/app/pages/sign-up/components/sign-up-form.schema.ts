import * as Yup from 'yup';

export const SignUpSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Name should be at least 3 characters')
    .max(16, "Name shouldn't be longer than 16 characters")
    .matches(/^[A-Za-z ]*$/, 'Invalid name')
    .required('Required'),
  surname: Yup.string()
    .min(3, 'Surname should be at least 3 characters')
    .max(16, "Surname shouldn't be longer than 16 characters")
    .matches(/^[A-Za-z ]*$/, 'Invalid surname')
    .required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .min(8, 'Password should be minimum 8 characters')
    .max(16, 'Password should be maximum 16 characters')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      'Must Contain one uppercase character, one lowercase, one number and one special case character'
    )
    .required('Required'),
  repeatPassword: Yup.string().oneOf(
    [Yup.ref('password'), undefined],
    'Passwords must match'
  ),
});
