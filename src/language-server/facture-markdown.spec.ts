import { NodeFileSystem } from "langium/node";
import { createFactureServices } from "./facture-module";
import { Model } from "./generated/ast";
import { parseDocument } from "langium/lib/test";
import { assert, expect } from "chai";

describe('Markdown', () => {

  const services = createFactureServices(NodeFileSystem).Facture;
  const generateModel = async (input: string) => (await parseDocument<Model>(services, input)).parseResult.value


  	it('new line results in a new markdown element', async () => {
		const model = await generateModel(`
			interface WorkInstruction {
				name: string
			}

			define WorkInstruction PRT001 {
				name: 'Part 1'

				This is the first paragraph
				This is the second paragraph and should be a new element
			}		
		`)

		const markdown = model.objects[0].markdown
		expect(markdown[0]).to.exist
		if (markdown[0].$type !== 'Paragraph') 
			assert.fail(`expected type \'Paragraph\' and received type ${markdown[0].$type}`)
		expect(markdown[0].content.length).to.equal(1)

		
		expect(markdown[1]).to.exist
		if (markdown[1].$type !== 'Paragraph') 
			assert.fail(`expected type \'Paragraph\' and received type ${markdown[1].$type}`)
		expect(markdown[1].content.length).to.equal(1)
  	})

	it('inline bold and italic', async () => {
		const model = await generateModel(`
			interface WorkInstruction {
				name: string
			}

			define WorkInstruction PRT001 {
				name: 'Part 1'

				this paragraph has **inline bold text** inside
			}
		`)

		const markdown = model.objects[0].markdown
		expect(markdown[0]).to.exist
		if (markdown[0].$type !== 'Paragraph') 
			assert.fail(`expected type \'Paragraph\' and received type ${markdown[1].$type}`)
		if (markdown[0].content[3].$type !== 'Bold')
			assert.fail(`expected type \'Bold\' but received type ${markdown[0].content[3].$type}`)

	})

	

})