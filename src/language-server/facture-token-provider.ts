import { AbstractSemanticTokenProvider, AstNode, SemanticTokenAcceptor } from "langium";

export default class FactureSematicTokenProvider extends AbstractSemanticTokenProvider {
    protected override highlightElement(node: AstNode, acceptor: SemanticTokenAcceptor): void | "prune" | undefined {

    }


}