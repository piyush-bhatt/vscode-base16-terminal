import * as vscode from 'vscode';
import { getContext } from '../context';
import { themes } from '../themes';
import { IThemeItem } from '../types';

const kebabToTitleCase = (str: string) => {
  return str
    .split('-')
    .map((part) => {
      return part.charAt(0).toUpperCase() + part.substring(1);
    })
    .join(' ');
};

const getThemesFromContext = (): Record<string, string> => getContext().globalState.get('themes', {});

const generateTheme = (theme: string): Record<string, string> => {
  let themeJSON = {};
  try {
    const themes = getThemesFromContext();
    themeJSON = themes[theme] ? themes[theme] : {};
  } catch (e) {
  } finally {
    return themeJSON;
  }
};

export const isWSOpen = (): boolean =>
  vscode.workspace.workspaceFolders !== undefined && vscode.workspace.workspaceFolders[0] !== undefined;

export const setThemesToContext = (): void => {
  getContext().globalState.update('themes', themes);
};

export const getColorCustomizations = async (): Promise<Record<string, string>> =>
  vscode.workspace.getConfiguration().get('workbench.colorCustomizations', {});

export const setColorCustomizations = async (colorCustomizations: Record<string, string>): Promise<void> =>
  vscode.workspace.getConfiguration().update('workbench.colorCustomizations', colorCustomizations);

export const setTerminalThemePreview = async (theme: string) => {
  const currentColorCustomization = await getColorCustomizations();
  const themeColors = generateTheme(theme);
  const colorCustomizations = { ...currentColorCustomization, ...themeColors };
  await setColorCustomizations(colorCustomizations);
};

export const removeTerminalTheme = async () => {
  const currentColorCustomization = await getColorCustomizations();
  const terminalThemeKeys = Object.keys(Object.values(getThemesFromContext())[0]);
  const colorCustomizationsWithoutTerminalTheme = Object.keys(currentColorCustomization)
    .filter((key) => !terminalThemeKeys.includes(key))
    .reduce((obj: Record<string, string>, key) => {
      obj[key] = currentColorCustomization[key];
      return obj;
    }, {});
  await setColorCustomizations(colorCustomizationsWithoutTerminalTheme);
};

export const getAvailableThemeNames = (): IThemeItem[] | void[] => {
  const themes = getThemesFromContext();
  return Object.keys(themes).map((key: string) => {
    return {
      id: key,
      label: kebabToTitleCase(key),
    };
  });
};
