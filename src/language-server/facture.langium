grammar Facture

entry Model:
    documentType=DocumentType
    (NEWLINE | sections+=Section | procedures+=Procedure | processes+=Process | inspections+=Inspection)*;


DocumentType:
    'define' class=('Process') type=('Instruction' | 'Specification') ':' name=ID+;

Section:
    'Section' number=INT ':' name=ID '{' NEWLINE*
        markdwon+=Markdown* NEWLINE*
        subSections+=Section* NEWLINE*
    '}';

Procedure:
    'Procedure' number=INT ':' name=ID '{' NEWLINE*
        (processes+=(ProcessRef | InspectionRef) NEWLINE*)+
    '}';

ProcessRef:
    'ref' 'Process' reference=[Process] NEWLINE*;

InspectionRef:
    'ref' 'Inspection' reference=[Inspection] NEWLINE*;

Process:
    'Process' number=INT ':' name=ID '{' NEWLINE*
        (markdown+=Markdown | steps+=Step)* NEWLINE*
    '}';

Step:
    'Step' number=INT '{' NEWLINE*
        markdown+=Markdown* NEWLINE*
    '}';

Inspection:
    'Inspection' number=INT ':' name=ID '{' NEWLINE*
        InspectionQualification NEWLINE*
        InspectionType NEWLINE*
        (markdown+=Markdown | steps+=Step)* NEWLINE*
    '}';

InspectionQualification:
    'qualification' ':' qualification=('manufacturing' | 'quality') NEWLINE*;

InspectionType:
    'type' ':' inspectionType=('witness' | 'verification') NEWLINE*;


Markdown:
    (ListItem | Bold | Italic | BlockQuote | Header1 | Paragraph | Warning);

Header:
    text=PlainText NEWLINE*;

Header1:
    '#' content=Header;

Bold:
    '**' text=PlainText '**';

Italic:
    '*' text=PlainText '*';

BlockQuote:
    '>' text=PlainText NEWLINE*;

ListItem:
    '-' index=INT? text=PlainText NEWLINE*;

Paragraph:
    text=PlainText NEWLINE*;

Warning:
    '<warning>' NEWLINE* 
        content+=Markdown* NEWLINE*
    '</warning>' NEWLINE*;

PlainText:
    text+=(ID | INT | SYMBOL)+;


hidden terminal WS: /[^\S\r\n]+/;
terminal NEWLINE: /[\n\r]+/;
terminal ID: /[_\-a-zA-Z][\w\-_]*/;
terminal INT returns number: /[0-9]+/;
terminal DOUBLE returns number: INT '.' INT;
terminal STRING: /"[^"]*"|'[^']*'/;
terminal SYMBOL: /[^\w\s]/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;