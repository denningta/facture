/******************************************************************************
 * This file was generated by langium-cli 1.0.0.
 * DO NOT EDIT MANUALLY!
 ******************************************************************************/

/* eslint-disable */
import { AstNode, AbstractAstReflection, Reference, ReferenceInfo, TypeMetaData } from 'langium';

export type AbstractElement = GenericObject | IntegerType | ObjectRef | StringType;

export const AbstractElement = 'AbstractElement';

export function isAbstractElement(item: unknown): item is AbstractElement {
    return reflection.isInstance(item, AbstractElement);
}

export type AbstractType = GenericObject | Interface;

export const AbstractType = 'AbstractType';

export function isAbstractType(item: unknown): item is AbstractType {
    return reflection.isInstance(item, AbstractType);
}

export type FeatureName = string;

export type Markdown = Block;

export const Markdown = 'Markdown';

export function isMarkdown(item: unknown): item is Markdown {
    return reflection.isInstance(item, Markdown);
}

export type PrimitiveType = 'boolean' | 'number' | 'string';

export type Text = string;

export interface AtomType extends AstNode {
    readonly $container: TypeAttribute;
    readonly $type: 'AtomType';
    isArray: boolean
    isFunction: boolean
    keywordType?: Keyword
    primitiveType?: PrimitiveType
    refType?: Reference<AbstractType>
}

export const AtomType = 'AtomType';

export function isAtomType(item: unknown): item is AtomType {
    return reflection.isInstance(item, AtomType);
}

export interface Block extends AstNode {
    readonly $container: BlockQuote | RenderFunction | Warning;
    readonly $type: 'Block';
    content: Array<BlockQuote | Bold | Header1 | InlineReference | Italic | ListItem | PlainText | Warning>
}

export const Block = 'Block';

export function isBlock(item: unknown): item is Block {
    return reflection.isInstance(item, Block);
}

export interface BlockQuote extends AstNode {
    readonly $container: Block;
    readonly $type: 'BlockQuote';
    content: Array<Block>
}

export const BlockQuote = 'BlockQuote';

export function isBlockQuote(item: unknown): item is BlockQuote {
    return reflection.isInstance(item, BlockQuote);
}

export interface Bold extends AstNode {
    readonly $container: Block;
    readonly $type: 'Bold';
    text: Array<Text>
}

export const Bold = 'Bold';

export function isBold(item: unknown): item is Bold {
    return reflection.isInstance(item, Bold);
}

export interface GenericObject extends AstNode {
    readonly $container: Model | Property | PropertyArray;
    readonly $type: 'GenericObject';
    interface: Reference<Interface>
    name: string
    properties: Array<Property | PropertyArray>
    render?: RenderFunction
}

export const GenericObject = 'GenericObject';

export function isGenericObject(item: unknown): item is GenericObject {
    return reflection.isInstance(item, GenericObject);
}

export interface Header1 extends AstNode {
    readonly $container: Block;
    readonly $type: 'Header1';
    text: Array<Text>
}

export const Header1 = 'Header1';

export function isHeader1(item: unknown): item is Header1 {
    return reflection.isInstance(item, Header1);
}

export interface InlineReference extends AstNode {
    readonly $container: Block;
    readonly $type: 'InlineReference';
    reference: Reference<GenericObject>
}

export const InlineReference = 'InlineReference';

export function isInlineReference(item: unknown): item is InlineReference {
    return reflection.isInstance(item, InlineReference);
}

export interface IntegerType extends AstNode {
    readonly $container: Model | Property | PropertyArray;
    readonly $type: 'IntegerType';
    data: number
}

export const IntegerType = 'IntegerType';

export function isIntegerType(item: unknown): item is IntegerType {
    return reflection.isInstance(item, IntegerType);
}

export interface Interface extends AstNode {
    readonly $container: Model | Property | PropertyArray;
    readonly $type: 'Interface';
    attributes: Array<TypeAttribute>
    name: string
}

export const Interface = 'Interface';

export function isInterface(item: unknown): item is Interface {
    return reflection.isInstance(item, Interface);
}

export interface Italic extends AstNode {
    readonly $container: Block;
    readonly $type: 'Italic';
    text: Array<Text>
}

export const Italic = 'Italic';

export function isItalic(item: unknown): item is Italic {
    return reflection.isInstance(item, Italic);
}

export interface Keyword extends AstNode {
    readonly $container: AtomType;
    readonly $type: 'Keyword';
    value: string
}

export const Keyword = 'Keyword';

export function isKeyword(item: unknown): item is Keyword {
    return reflection.isInstance(item, Keyword);
}

export interface ListItem extends AstNode {
    readonly $container: Block;
    readonly $type: 'ListItem';
    text: Array<Text>
}

export const ListItem = 'ListItem';

export function isListItem(item: unknown): item is ListItem {
    return reflection.isInstance(item, ListItem);
}

export interface Model extends AstNode {
    readonly $type: 'Model';
    interfaces: Array<Interface>
    objects: Array<GenericObject>
}

export const Model = 'Model';

export function isModel(item: unknown): item is Model {
    return reflection.isInstance(item, Model);
}

export interface ObjectRef extends AstNode {
    readonly $container: Model | Property | PropertyArray;
    readonly $type: 'ObjectRef';
    data: Reference<GenericObject>
}

export const ObjectRef = 'ObjectRef';

export function isObjectRef(item: unknown): item is ObjectRef {
    return reflection.isInstance(item, ObjectRef);
}

export interface PlainText extends AstNode {
    readonly $container: Block;
    readonly $type: 'PlainText';
    text: Array<Text>
}

export const PlainText = 'PlainText';

export function isPlainText(item: unknown): item is PlainText {
    return reflection.isInstance(item, PlainText);
}

export interface Property extends AstNode {
    readonly $container: GenericObject;
    readonly $type: 'Property';
    name: FeatureName
    value: AbstractElement
}

export const Property = 'Property';

export function isProperty(item: unknown): item is Property {
    return reflection.isInstance(item, Property);
}

export interface PropertyArray extends AstNode {
    readonly $container: GenericObject;
    readonly $type: 'PropertyArray';
    name: FeatureName
    value: Array<AbstractElement>
}

export const PropertyArray = 'PropertyArray';

export function isPropertyArray(item: unknown): item is PropertyArray {
    return reflection.isInstance(item, PropertyArray);
}

export interface RenderFunction extends AstNode {
    readonly $container: GenericObject;
    readonly $type: 'RenderFunction';
    markdown: Array<Markdown>
}

export const RenderFunction = 'RenderFunction';

export function isRenderFunction(item: unknown): item is RenderFunction {
    return reflection.isInstance(item, RenderFunction);
}

export interface StringType extends AstNode {
    readonly $container: Model | Property | PropertyArray;
    readonly $type: 'StringType';
    data: string
}

export const StringType = 'StringType';

export function isStringType(item: unknown): item is StringType {
    return reflection.isInstance(item, StringType);
}

export interface TypeAttribute extends AstNode {
    readonly $container: Interface;
    readonly $type: 'TypeAttribute';
    isOptional: boolean
    name: FeatureName
    typeAlternatives: Array<AtomType>
}

export const TypeAttribute = 'TypeAttribute';

export function isTypeAttribute(item: unknown): item is TypeAttribute {
    return reflection.isInstance(item, TypeAttribute);
}

export interface Warning extends AstNode {
    readonly $container: Block;
    readonly $type: 'Warning';
    content: Array<Block>
}

export const Warning = 'Warning';

export function isWarning(item: unknown): item is Warning {
    return reflection.isInstance(item, Warning);
}

export interface FactureAstType {
    AbstractElement: AbstractElement
    AbstractType: AbstractType
    AtomType: AtomType
    Block: Block
    BlockQuote: BlockQuote
    Bold: Bold
    GenericObject: GenericObject
    Header1: Header1
    InlineReference: InlineReference
    IntegerType: IntegerType
    Interface: Interface
    Italic: Italic
    Keyword: Keyword
    ListItem: ListItem
    Markdown: Markdown
    Model: Model
    ObjectRef: ObjectRef
    PlainText: PlainText
    Property: Property
    PropertyArray: PropertyArray
    RenderFunction: RenderFunction
    StringType: StringType
    TypeAttribute: TypeAttribute
    Warning: Warning
}

export class FactureAstReflection extends AbstractAstReflection {

    getAllTypes(): string[] {
        return ['AbstractElement', 'AbstractType', 'AtomType', 'Block', 'BlockQuote', 'Bold', 'GenericObject', 'Header1', 'InlineReference', 'IntegerType', 'Interface', 'Italic', 'Keyword', 'ListItem', 'Markdown', 'Model', 'ObjectRef', 'PlainText', 'Property', 'PropertyArray', 'RenderFunction', 'StringType', 'TypeAttribute', 'Warning'];
    }

    protected override computeIsSubtype(subtype: string, supertype: string): boolean {
        switch (subtype) {
            case Block: {
                return this.isSubtype(Markdown, supertype);
            }
            case GenericObject: {
                return this.isSubtype(AbstractElement, supertype) || this.isSubtype(AbstractType, supertype);
            }
            case IntegerType:
            case ObjectRef:
            case StringType: {
                return this.isSubtype(AbstractElement, supertype);
            }
            case Interface: {
                return this.isSubtype(AbstractType, supertype);
            }
            default: {
                return false;
            }
        }
    }

    getReferenceType(refInfo: ReferenceInfo): string {
        const referenceId = `${refInfo.container.$type}:${refInfo.property}`;
        switch (referenceId) {
            case 'AtomType:refType': {
                return AbstractType;
            }
            case 'GenericObject:interface': {
                return Interface;
            }
            case 'InlineReference:reference':
            case 'ObjectRef:data': {
                return GenericObject;
            }
            default: {
                throw new Error(`${referenceId} is not a valid reference id.`);
            }
        }
    }

    getTypeMetaData(type: string): TypeMetaData {
        switch (type) {
            case 'AtomType': {
                return {
                    name: 'AtomType',
                    mandatory: [
                        { name: 'isArray', type: 'boolean' },
                        { name: 'isFunction', type: 'boolean' }
                    ]
                };
            }
            case 'Block': {
                return {
                    name: 'Block',
                    mandatory: [
                        { name: 'content', type: 'array' }
                    ]
                };
            }
            case 'BlockQuote': {
                return {
                    name: 'BlockQuote',
                    mandatory: [
                        { name: 'content', type: 'array' }
                    ]
                };
            }
            case 'Bold': {
                return {
                    name: 'Bold',
                    mandatory: [
                        { name: 'text', type: 'array' }
                    ]
                };
            }
            case 'GenericObject': {
                return {
                    name: 'GenericObject',
                    mandatory: [
                        { name: 'properties', type: 'array' }
                    ]
                };
            }
            case 'Header1': {
                return {
                    name: 'Header1',
                    mandatory: [
                        { name: 'text', type: 'array' }
                    ]
                };
            }
            case 'Interface': {
                return {
                    name: 'Interface',
                    mandatory: [
                        { name: 'attributes', type: 'array' }
                    ]
                };
            }
            case 'Italic': {
                return {
                    name: 'Italic',
                    mandatory: [
                        { name: 'text', type: 'array' }
                    ]
                };
            }
            case 'ListItem': {
                return {
                    name: 'ListItem',
                    mandatory: [
                        { name: 'text', type: 'array' }
                    ]
                };
            }
            case 'Model': {
                return {
                    name: 'Model',
                    mandatory: [
                        { name: 'interfaces', type: 'array' },
                        { name: 'objects', type: 'array' }
                    ]
                };
            }
            case 'PlainText': {
                return {
                    name: 'PlainText',
                    mandatory: [
                        { name: 'text', type: 'array' }
                    ]
                };
            }
            case 'PropertyArray': {
                return {
                    name: 'PropertyArray',
                    mandatory: [
                        { name: 'value', type: 'array' }
                    ]
                };
            }
            case 'RenderFunction': {
                return {
                    name: 'RenderFunction',
                    mandatory: [
                        { name: 'markdown', type: 'array' }
                    ]
                };
            }
            case 'TypeAttribute': {
                return {
                    name: 'TypeAttribute',
                    mandatory: [
                        { name: 'isOptional', type: 'boolean' },
                        { name: 'typeAlternatives', type: 'array' }
                    ]
                };
            }
            case 'Warning': {
                return {
                    name: 'Warning',
                    mandatory: [
                        { name: 'content', type: 'array' }
                    ]
                };
            }
            default: {
                return {
                    name: type,
                    mandatory: []
                };
            }
        }
    }
}

export const reflection = new FactureAstReflection();
