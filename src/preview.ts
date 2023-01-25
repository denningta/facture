import * as vscode from 'vscode';

export async function initFacturePreview() {

  const panel = vscode.window.createWebviewPanel(
    'liveHTMLPreviewer',
    'Facture',
    {
      viewColumn: -2
    },

  )


}
