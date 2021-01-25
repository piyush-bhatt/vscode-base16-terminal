import * as vscode from 'vscode';
import { getContext, setContext } from './context';
import { IThemeItem } from './types';
import {
  getAvailableThemeNames,
  getColorCustomizations,
  isWSOpen,
  setColorCustomizations,
  setTerminalThemePreview,
  setThemesToContext,
} from './utils';

export function activate(context: vscode.ExtensionContext) {
  setContext(context);
  setThemesToContext();
  let disposable = vscode.commands.registerCommand('base16-term.setTerminalTheme', async () => {
    if (isWSOpen()) {
      let currentColorCustomizations = await getColorCustomizations();
      const themeNames = getAvailableThemeNames();
      if (themeNames.length > 0) {
        const theme = await vscode.window.showQuickPick(themeNames as IThemeItem[], {
          placeHolder: 'Select Terminal Theme (Search by Name or use Up/Down Keys to Preview)',
          onDidSelectItem: (item: IThemeItem) => {
            setTerminalThemePreview(item.id);
          },
        });
        if (theme === undefined) {
          await setColorCustomizations(currentColorCustomizations);
        }
      }
    } else {
      vscode.window.showInformationMessage('Open a folder or workspace to change Terminal theme');
    }
  });
  getContext().subscriptions.push(disposable);
}

export function deactivate() {}
