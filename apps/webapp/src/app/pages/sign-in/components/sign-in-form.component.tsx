import React from 'react';
import { Input, FormControl, InputLabel, Button } from '@material-ui/core';
import { FormContainer } from '../sign-in.styled';

interface Props {}
export const SignInForm: React.FC<Props> = () => {
  return (
    <FormContainer name={'sign-in-form'}>
      <FormControl>
        <InputLabel>
          Email address
          <Input
            name="email"
            required
            // rules={[
            //   {
            //     type: 'string',
            //     required: true,
            //     message: 'Email address is required',
            //   },
            //   {
            //     pattern: new RegExp(
            //       /^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$/
            //     ),
            //     message: 'Invalid email format',
            //   },
            // ]}
          />
        </InputLabel>

      </FormControl>


      <Input
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: 'Cannot be empty',
          },
          {
            min: 8,
            type: 'string',
            message: 'Needs to have at least 8 characters',
          },
          {
            max: 16,
            type: 'string',
            message: 'Password too long',
          },
        ]}
      >
      </Input>
      <FormControl>
        <Button>
          Submit
        </Button>
      </FormControl>
    </form>
  );
};
