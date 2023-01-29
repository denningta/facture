import fs from 'fs';
import { CompositeGeneratorNode, NL, toString } from 'langium';
import path from 'path';
import { Model, Procedure } from '../language-server/generated/ast';
import { camelCaseToTitleCase, extractDestinationAndName } from './cli-util';

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

    


    let key: keyof Model
    for (key in model) {
        console.log(key, model[key] === typeof Procedure)
    }


    model.procedures.forEach((procedure) => {
        fileNode.append(`<h1>Procedure ${procedure.number} - ${camelCaseToTitleCase(procedure.name)}</h1>`, NL)
        procedure.processes.forEach((process, i) => {
            fileNode.append(camelCaseToTitleCase(process.reference.ref?.name), NL)
        })
    })

    return fileNode
}

export function isPrivateKey(key: keyof Model): boolean {
    return key.match(/\$\w+/) !== null ? true : false
}
