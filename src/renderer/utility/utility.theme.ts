import { ITheme } from 's.theme';

export interface Theme extends ITheme {
  colors: {
    background: string;
    color: string;
    disabled: string;
    primary: string;
    secondary: string;
  };
  fonts: {
    main: string;
  };
}
