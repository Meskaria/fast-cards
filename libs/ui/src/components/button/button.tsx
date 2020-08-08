import React from 'react';
import { ButtonAppearanceEnum, StyledButton } from './Button.styled';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: any;
  pre?: React.ElementType;
  post?: React.ElementType;
  appearance: ButtonAppearanceEnum;
}

export const Button: React.FC<Props> = ({ pre, post, children, ...props }) => (
  <StyledButton {...props}>{children}</StyledButton>
);
