import React from 'react';
import { render } from '@testing-library/react';

import { Input } from './input';

describe('Input', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <Input
        field={{
          value: null,
          name: 'test',
          onChange: () => {},
          onBlur: () => {},
        }}
        form={{}}
        meta={{ value: null, touched: false, initialTouched: false }}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
