import styled, { css } from '@xstyled/styled-components';
import { variant } from '@xstyled/system';

export enum ButtonAppearanceEnum {
  default = 'default',
  primary = 'primary',
  danger = 'danger',
  warning = 'warning',
  link = 'link',
  subtle = 'subtle',
  'subtle-link' = 'subtle-link',
}

export const StyledButton = styled.button`
  align-items: baseline;
  box-sizing: border-box;
  display: inline-flex;
  font-size: inherit;
  font-style: normal;
  font-weight: 400;
  max-width: 100%;
  text-align: center;
  white-space: nowrap;
  cursor: default;
  border-radius: 3px;
  padding: 0px 8px;
  transition: background 0.1s ease-out 0s,
    box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38) 0s;
  outline: none !important;
  border-width: 0px;
  text-decoration: none;
  width: auto;
  height: 2.28571em;
  line-height: 2.28571em;
  vertical-align: middle;
  cursor: pointer;
  overflow: hidden;

  ${variant({
    prop: 'appearance',
    variants: {
      [ButtonAppearanceEnum.default]: css`
        color: rgb(66, 82, 110) !important;
        background: rgba(9, 30, 66, 0.04);

        &:hover {
          background: #ebecf0;
        }
        &:active {
          box-shadow: none;
          background: #deebff;
          color: #0052cc;
        }
      `,
      [ButtonAppearanceEnum.danger]: css`
        color: rgb(255, 255, 255) !important;
        background: rgb(222, 53, 11);
      `,
      [ButtonAppearanceEnum.warning]: css`
        color: rgb(23, 43, 77) !important;
        background: rgb(255, 171, 0);

        &:hover {
          background-color: #ff5630;
        }

        &:active {
          background-color: #bf2600;
        }
      `,
      [ButtonAppearanceEnum.link]: css`
        color: rgb(0, 82, 204) !important;
        background: none;
      `,
      [ButtonAppearanceEnum.primary]: css`
        color: rgb(255, 255, 255) !important;
        background: rgb(0, 82, 204);

        &:hover {
          background-color: #0065ff;
        }
        &:active {
          background-color: #0747a6;
        }
      `,
      [ButtonAppearanceEnum.subtle]: css`
        color: rgb(66, 82, 110) !important;
        background: none;
      `,
      [ButtonAppearanceEnum['subtle-link']]: css`
        color: rgb(66, 82, 110) !important;
        background: none;
      `,
    },
  })}
`;
