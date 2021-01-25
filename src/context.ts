import { ExtensionContext } from 'vscode';

let context: ExtensionContext;

export function setContext(ctx: ExtensionContext) {
  context = ctx;
}

export function getContext() {
  return context;
}
