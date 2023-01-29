import chalk from 'chalk';
import { Command } from 'commander';
import { Model } from '../language-server/generated/ast';
import { FactureLanguageMetaData } from '../language-server/generated/module';
import { createFactureServices } from '../language-server/facture-module';
import { extractAstNode } from './cli-util';
import { generate, generateJavaScript } from './generator';
import { NodeFileSystem } from 'langium/node';
import { toString } from 'langium';

export const generateAction = async (fileName: string, opts: GenerateOptions): Promise<void> => {
    const services = createFactureServices(NodeFileSystem).Facture;
    const model = await extractAstNode<Model>(fileName, services);
    const generatedFilePath = generateJavaScript(model, fileName, opts.destination);
    console.log(chalk.green(`JavaScript code generated successfully: ${generatedFilePath}`));
};

export const generateActionProgramatic = async (fileName: string): Promise<string> => {
    const services = createFactureServices(NodeFileSystem).Facture
    const model = await extractAstNode<Model>(fileName, services)
    return toString(generate(model))
}

export type GenerateOptions = {
    destination?: string;
}

export default function(): void {
    const program = new Command();

    program
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        .version(require('../../package.json').version);

    const fileExtensions = FactureLanguageMetaData.fileExtensions.join(', ');
    program
        .command('generate')
        .argument('<file>', `source file (possible file extensions: ${fileExtensions})`)
        .option('-d, --destination <dir>', 'destination directory of generating')
        .description('generates JavaScript code')
        .action(generateAction);

    program.parse(process.argv);
}
