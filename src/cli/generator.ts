import fs from 'fs-extra';
import { CompositeGeneratorNode, toString } from 'langium';
import path from 'path';
import { Model } from '../language-server/generated/ast';
import { extractDestinationAndName } from './cli-util';

export const RelativePath = Symbol('RelativePath');

export function generateJavaScript(model: Model, filePath: string, destination: string | undefined): string {
    
    const data = extractDestinationAndName(filePath, destination);
    const generatedFilePath = `${path.join(data.destination, data.name)}.html`;

    const fileNode = generate(model)

    if (!fs.existsSync(data.destination)) {
        fs.mkdirSync(data.destination, { recursive: true });
    }
    fs.writeFileSync(generatedFilePath, toString(fileNode));
    return generatedFilePath;
}

export function generate(model: Model) {
    const fileNode = new CompositeGeneratorNode();
    // fileNode.append('"use strict";', NL, NL);
    // model.greetings.forEach(greeting => fileNode.append(`console.log('Hello, ${greeting.person.ref?.name}!');`, NL));


    return fileNode
}

export function toHeaderString(number: '1' | '2' | '3' | '4' | '5', content: string) {
    return `<h${number}>${content}</h${number}>`
}

export function toBoldString(content: string) {
    return `<b>${content}</b>`
}

export function toItalicString(content: string): string {
    return `<em>${content}</em>`
}

export function toParagraphString(content: string): string {
    return `<p>${content}</p>`
}

