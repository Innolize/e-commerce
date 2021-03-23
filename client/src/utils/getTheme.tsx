import { PaletteType } from '@material-ui/core';
import dark from '../themes/darkTheme';
import light from '../themes/lightTheme';

const themes = {
  dark,
  light,
};

export const getTheme = (themeType: PaletteType) => {
  return themes[themeType];
};
