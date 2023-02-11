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
    (primitiveType=PrimitiveType | refType=[AbstractType:ID] | keywordType=Keyword) isArray?='[]'?;

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
        markdown+=Markdown* EOL*
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
    (ListItem | BlockQuote | Header1 | Paragraph | Warning);

PlainText:
    text+=(FeatureName)+ EOL+;

Bold:
    '**' text+=PlainText+ '**';

Italic:
    '*' text=PlainText '*';

Header1:
    '#' (text+=(PlainText)+);

Paragraph:
    (content+=(PlainText | Bold | Italic))+ EOL*;

BlockQuote:
    '<quote>' EOL*
        content+=(PlainText | Bold | Italic)+ EOL*
    '</quote>' EOL*;

ListItem:
    '-' index=INT? text=PlainText;

Warning:
    '<warning>' EOL* 
        content+=Markdown* EOL*
    '</warning>' EOL*;



terminal EOL: /[\r\n]/;
terminal ID: /[_\-a-zA-Z][\w\-_]*/;
terminal INT returns number: /[0-9]+/;
terminal STRING: /"[^"]*"|'[^']*'/;

hidden terminal WS: /[^\S\r\n]/;
hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*[\n\r]/;