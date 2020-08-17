import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';

interface Props {}
export const SignInForm: React.FC<Props> = () => {
  return (
    <Form name={'sign-in-form'} layout={'vertical'} hideRequiredMark>
      <Form.Item
        label="Email address"
        name="email"
        rules={[
          {
            type: 'string',
            required: true,
            message: 'Email address is required',
          },
          {
            pattern: new RegExp(
              /^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$/
            ),
            required: true,
            message: 'Invalid email format',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
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
            required: true,
            message: 'Needs to have at least 8 characters',
          },
          {
            max: 16,
            type: 'string',
            required: true,
            message: 'Password too long',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button block type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
