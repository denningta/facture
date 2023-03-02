import { DefaultWorkspaceManager, LangiumDocument, LangiumDocumentFactory, LangiumSharedServices } from "langium";
import { WorkspaceFolder } from "vscode-languageserver";
import { URI } from "vscode-uri";

export const builtInLibrary = `
    interface Markdown {}
    interface Render {}
`.trimLeft();

export class FactureWorkspaceManager extends DefaultWorkspaceManager {

  private documentFactory: LangiumDocumentFactory;

  constructor(services: LangiumSharedServices) {
      super(services);
      this.documentFactory = services.workspace.LangiumDocumentFactory;
  }
  
  protected override async loadAdditionalDocuments(folders: WorkspaceFolder[], collector: (document: LangiumDocument) => void): Promise<void> {
      collector(this.documentFactory.fromString(builtInLibrary, URI.parse('builtin:///library.fac')));
  }


}