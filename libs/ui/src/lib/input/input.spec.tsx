import React from 'react';
import { render } from '@testing-library/react';

import { Input } from './input';

describe('Input', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Input field={null} form={null} meta={null}/>);
    expect(baseElement).toBeTruthy();
  });
});