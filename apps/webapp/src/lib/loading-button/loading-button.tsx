import React from 'react';
import { LoadingButton } from '@material-ui/lab';
import styled from 'styled-components';

interface Props {
  label: string;
  pending: boolean;
}

const StyledLoadingButton = styled(LoadingButton)`
  &.MuiButton-root {
    margin-top: 16px;
  }
  .MuiLoadingButton-pendingIndicator {
    margin-right: 8px;
    position: static;
  }
`;

export const ButtonWithLoader: React.FC<Props> = ({ label, pending }) => {
  return (
    <StyledLoadingButton
      pending={pending}
      pendingPosition="start"
      startIcon={<span />}
      variant="contained"
      disableElevation
    >
      {label}
    </StyledLoadingButton>
  );
};
