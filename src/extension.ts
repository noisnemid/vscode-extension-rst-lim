import * as vscode from "vscode";
import { rstDocumentSymbolProvider } from "./features/rstDocumentSymbolProvider";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "rst-lim" is now active!');

  // DocumentSymbolProvider Demo, for Outline View Test
  let disposableRstDSP = vscode.languages.registerDocumentSymbolProvider(
    { scheme: "file", language: "restructuredtext" },
    new rstDocumentSymbolProvider()
  );
  context.subscriptions.push(disposableRstDSP);
}

export function deactivate() {}
