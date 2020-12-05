import React from 'react';
import { TextField, TextFieldProps } from 'formik-material-ui';
import styled from 'styled-components';

const StyledInput = styled(TextField)`
  &.MuiFormControl-root {
    margin: 8px 0;
  }
  .MuiOutlinedInput-root {
      border-radius: 4px;
  }
  .MuiFormHelperText-root {
    line-height: 1;
  }
`;

export const Input = (props: TextFieldProps) => (
    <StyledInput {...props} />
  );

