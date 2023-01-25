import { DocumentState, startLanguageServer } from 'langium';
import { NodeFileSystem } from 'langium/node';
import { createConnection, Diagnostic, NotificationType, ProposedFeatures } from 'vscode-languageserver/node';
import { createFactureServices } from './facture-module';

// Create a connection to the client
const connection = createConnection(ProposedFeatures.all);

// Inject the shared services and language-specific services
const { shared, Facture } = createFactureServices({ connection, ...NodeFileSystem });

// Start the language server with the shared services
startLanguageServer(shared);

type DocumentChange = { uri: string, content: string, diagnostics: Diagnostic[] };
const documentChangeNotification = new NotificationType<DocumentChange>('browser/DocumentChange');
const jsonSerializer = Facture.serializer.JsonSerializer;
shared.workspace.DocumentBuilder.onBuildPhase(DocumentState.Validated, documents => {
    for (const document of documents) {
        const json = jsonSerializer.serialize(document.parseResult.value);
        console.log(JSON.parse(json))

        shared.lsp.Connection?.sendNotification(documentChangeNotification, {
            uri: document.uri.toString(),
            content: json,
            diagnostics: document.diagnostics ?? []
        });
    }
});
