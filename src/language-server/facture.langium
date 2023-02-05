grammar Facture

entry Model:
    EOL* 
    (interfaces+=Interface | objects+=GenericObject)* 
    EOL*;

Interface:
    'interface' name=ID
    SchemaType;

fragment SchemaType:
    '{' attributes+=TypeAttribute* '}' ';'?;

TypeAttribute:
    name=FeatureName (isOptional?='?')? ':' TypeAlternatives ';'?;

fragment TypeAlternatives:
    typeAlternatives+=AtomType ('|' typeAlternatives+=AtomType)*;

AtomType:
    (primitiveType=PrimitiveType | refType=[Interface] | keywordType=Keyword) isArray?='[]'? isDefinition?='{}'?;

PrimitiveType <> returns string:
    'string' | 'number' | 'boolean' | 'Date' | 'bigint';


FeatureName returns string:
    'interface' | 'define' | PrimitiveType | ID;

Keyword:
    value=STRING;

GenericObject:
    'define' interface=[Interface] name=(ID) '{' EOL*
        properties+=Property* EOL*
    '}' EOL*;

Property:
    name=(FeatureName) ':' value=(StringValue | ObjectRef | ObjectArrayRef | ObjectDef);

StringValue:
    string=STRING;

ObjectRef:
    object=[GenericObject] EOL*;

ObjectArrayRef:
    '[' EOL*
        objects+=[GenericObject]* EOL* 
    ']' EOL*;

ObjectDef:
    '{' EOL*
        objects+=GenericObject* type='ObjectDef' EOL*
    '}' EOL*;

// Markdown:
//     (ListItem | Bold | Italic | BlockQuote | Header1 | Paragraph | Warning);

// Header:
//     text=PlainText;


// Header1:
//     '#' content=Header;

// Bold:
//     '**' text=PlainText '**';

// Italic:
//     '*' text=PlainText '*';

// BlockQuote:
//     '>' text=PlainText EOL*;

// ListItem:
//     '-' index=INT? text=PlainText EOL*;

// Paragraph:
//     text=PlainText EOL*;

// Warning:
//     '<warning>' EOL* 
//         content+=Markdown* EOL*
//     '</warning>' EOL*;

// PlainText:
//     text+=(ID | INT | SYMBOL)+;


terminal EOL: /\r?\n/;
terminal ID: /[_\-a-zA-Z][\w\-_]*/;
terminal INT returns number: /[0-9]+/;
terminal STRING: /"[^"]*"|'[^']*'/;
terminal SYMBOL: /[^\w\s]/;

hidden terminal WS: /\s+/;
hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*[\n\r]/;