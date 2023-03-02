grammar Facture

entry Model:
    EOL* 
    (interfaces+=Interface | objects+=GenericObject)* 
    EOL*;

Interface:
    'interface' name=ID
    SchemaType;

fragment SchemaType:
    '{' EOL*
        attributes+=(TypeAttribute)* EOL*
    '}' EOL*;

TypeAttribute:
    name=FeatureName (isOptional?='?')? ':' TypeAlternatives ';'?;

fragment TypeAlternatives:
    typeAlternatives+=AtomType ('|' typeAlternatives+=AtomType)* EOL*;

AtomType:
    (primitiveType=PrimitiveType | refType=[AbstractType:ID] | keywordType=Keyword) isArray?='[]'? isFunction?='()'?;

 type AbstractType = Interface | GenericObject;

PrimitiveType returns string:
    'string' | 'number' | 'boolean';

FeatureName returns string:
    'interface' | 'define' | PrimitiveType | ID;

Keyword:
    value=STRING;

GenericObject:
    'define' interface=[Interface] name=(ID) '{' EOL*
        properties+=(Property | PropertyArray)* EOL*
        render=RenderFunction? EOL*
    '}' EOL*;

RenderFunction:
    'render()' '{' EOL*
        markdown+=Markdown*
    '}' EOL*;

Property:
    (name=(FeatureName) ':' value=AbstractElement) EOL*;

PropertyArray:
    name=(FeatureName) ':' EOL* '[' EOL* 
        (value+=AbstractElement | EOL)*
    ']';

AbstractElement:
    StringType | IntegerType | ObjectRef | GenericObject;

StringType:
    data=STRING;

IntegerType:
    data=INT;

ObjectRef:
    data=[GenericObject];

Markdown:
    (Block);

ObjReference:
    '@ref' '('reference=[GenericObject] ')';

Text returns string:
    FeatureName;

PlainText:
    text+=Text+;

Bold:
    '**' text+=Text+ '**';

Italic:
    '*' text+=Text+ '*';

Header1:
    '#' (text+=(Text)+) EOL*;

Block:
    (content+=(Bold | Italic | PlainText | ListItem | BlockQuote | Header1 | Warning | ObjReference))+ EOL*;

BlockQuote:
    '<quote>' EOL*
        content+=(Block)* EOL*
    '</quote>' EOL*;

ListItem:
    '-' text+=Text+;

Warning:
    '<warning>' EOL* 
        content+=(Block)* EOL*
    '</warning>' EOL*;



terminal EOL: /[\r\n]/;
terminal ID: /[_\-a-zA-Z][\w\-_]*/;
terminal INT returns number: /[0-9]+/;
terminal STRING: /"[^"]*"|'[^']*'/;

hidden terminal WS: /[^\S\r\n]/;
hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*[\n\r]/;