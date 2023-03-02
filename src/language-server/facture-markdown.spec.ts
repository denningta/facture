import { NodeFileSystem } from "langium/node";
import { createFactureServices } from "./facture-module";
import { Model } from "./generated/ast";
import { parseDocument } from "langium/lib/test";
import { assert, expect } from "chai";

describe('Markdown', () => {

	const services = createFactureServices(NodeFileSystem).Facture;
	const generateModel = async (input: string) => (await parseDocument<Model>(services, input)).parseResult.value

	describe('markdown blocks', () => {
	  	it('new line results in a new markdown block', async () => {
			const model = await generateModel(`
				interface WorkInstruction {
					name: string
				}

				define WorkInstruction PRT001 {
					name: 'Part 1'

					render() {
						This is the first paragraph
						This is the second paragraph and should be a new element
					}	
				}	
			`)

			const markdown = model.objects[0].render?.markdown
			if (!markdown) assert.fail(`expected \'markdown\' to exist`)
			expect(markdown[0]).to.exist
			expect(markdown.length).to.equal(2)
		})

		it('inline bold, italic, and reference in a block', async () => {
			const model = await generateModel(`
				interface WorkInstruction {
					name: string
				}
			
				define WorkInstruction PRT001 {
					name: 'Part 1'
					
					render() {
						this paragraph has **inline bold text** and *inline italics* and an inline @ref(PRT002)
					}
				}

				define WorkInstruction PRT002 {
					name: 'Part 2'
				}
			`)

			const markdown = model.objects[0].render?.markdown
			if (!markdown) assert.fail(`expected \'markdown\' to exist`)
			if (markdown[0].$type !== 'Block')
				assert.fail(`expected type \'Paragraph\' but received type ${markdown[0].$type}`)
			expect(markdown[0].content[1].$type).to.equal('Bold')
			expect(markdown[0].content[3].$type).to.equal('Italic')
			expect(markdown[0].content[5].$type).to.equal('ObjReference')
		})
	})


	describe('block types', () => {

		const getMarkdownFromModel = async (block: string) => {
			const model = await generateModel(`
				interface WorkInstruction {
					name: string
				}

				define WorkInstruction PRT001 {
					name: 'Part 1'

					render() {
						${block}
					}
				}

				define WorkInstruction PRT002 {
					name: 'Part 2'
				}
			`)
			if (!model.objects[0].render) assert.fail(`expected \'markdown\' to exist`)
			return {
				markdown: model.objects[0].render?.markdown,
				blockType: model.objects[0].render?.markdown[0].content[0].$type 
			}
		}

		const tests = [
			{ input: '**bold text**', expectedType: 'Bold' },
			{ input: '*italic text*', expectedType: 'Italic' },
			{ input: '@ref(PRT002)', expectedType: 'ObjReference'},
			{ input: '- list item', expectedType: 'ListItem'},
			{ 
				input: `
					<warning>
						text that is formatted 
						as a warning and multi-line
					</warning>
				`, 
				expectedType: 'Warning'
			},
			{
				input: `
					<quote>
						text that is formated
						as a multi-line qute
					</quote>
				`,
				expectedType: 'BlockQuote'
			},
			{ input: '# heaing one', expectedType: 'Header1' },
		]

		tests.forEach(({input, expectedType}) => 
			it(expectedType, async () => {
				const { blockType } = await getMarkdownFromModel(input)
				if (blockType !== expectedType)
					assert.fail(`expected type \'${expectedType}\' received \'${blockType}\'`)
			})	
		)

	})

})