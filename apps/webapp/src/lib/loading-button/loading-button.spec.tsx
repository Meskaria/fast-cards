import React from 'react';
import { render } from '@testing-library/react';

import { ButtonWithLoader } from './loading-button';

describe('LoadingButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ButtonWithLoader label="Label" pending />);
    expect(baseElement).toBeTruthy();
  });
});
