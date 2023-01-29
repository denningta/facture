import * as vscode from 'vscode';
import { generateActionProgramatic } from './cli';


export async function initFacturePreview(fileName: string | undefined) {

  const panel = vscode.window.createWebviewPanel(
    'facture',
    'Facture Preview',
    vscode.ViewColumn.Beside,
    {}
  )

  if (fileName) panel.webview.html = await generateActionProgramatic(fileName)

  vscode.workspace.onDidChangeTextDocument(async (e) => {
    console.log(e.document)
    panel.webview.html = await generateActionProgramatic(e.document.fileName)
  })

  vscode.workspace.onDidChangeTextDocument


}
