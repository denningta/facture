import { NodeFileSystem } from 'langium/node';
import { createFactureServices } from './facture-module';
import { parseDocument } from 'langium/lib/test';
import { Model } from './generated/ast';
import { FactureValidator } from './facture-validator';
import { DiagnosticInfo, Properties, ValidationAcceptor } from 'langium';
import { expect } from 'chai';

interface ValidationAcceptorResult {
    severity: "error" | "warning" | "info" | "hint";
    message: string;
    info: DiagnosticInfo<any, Properties<any>>;
}

describe('Facture Validator', () => {
    const services = createFactureServices(NodeFileSystem).Facture;
    const generateModel = async (input: string) => (await parseDocument<Model>(services, input)).parseResult.value
    const validator = new FactureValidator()
    let accept: ValidationAcceptor
    let result: ValidationAcceptorResult | undefined
    

    describe('Validate properties', () => {
        beforeEach(async () => {
            result = undefined
            accept = (severity, message, info) => { 
                result = { severity, message, info }
            } 
        })

        it('validation error when property is missing in an object', async () => {
            const model = await generateModel(`
                interface WorkInstruction {
                    name: string
                    number: string
                }
    
                define WorkInstruction PRT001 {
                    name: 'Bracket Assembly'
                }
            `)
            validator.checkObjectHasInterfaceProperties(model.objects[0], accept)
            expect(result).to.exist
            expect(result?.severity).to.equal('error')
            expect(result?.info.property).to.equal('properties')
            expect(result?.info.node).to.equal(model.objects[0])
            //Ex message: Object 'PRT001' is missing property(s): 'number' defined in interface 'WorkInstruction'
            expect(result?.message).to.have.string('PRT001')
            expect(result?.message).to.have.string('number')
            expect(result?.message).to.have.string('WorkInstruction')
        })
    
        it('passes validation if optional property is not found in the object', async () => {
            const model = await generateModel(`
                interface WorkInstruction {
                    name: string
                    number: string
                    engineer?: string
                }
    
                define WorkInstruction PRT001 {
                    name: 'Bracket Assembly'
                    number: 'PRT001'
                }
            `)
    
            validator.checkObjectHasInterfaceProperties(model.objects[0], accept)
            expect(result).to.be.undefined
        })
    
        it('validation error when a property is found in the object that is not defined in the interface', async () => {
            const model = await generateModel(`
                interface WorkInstruction {
                    name: string
                    number: string
                }
    
                define WorkInstruction PRT001 {
                    name: 'Bracket Assembly'
                    number: 'PRT001'
                    revision: 'A'
                }
            `)
    
            validator.checkObjectHasOnlyInterfaceProperties(model.objects[0], accept)
            expect(result).to.exist
            expect(result?.severity).to.equal('error')
            expect(result?.info.node).to.equal(model.objects[0])
            expect(result?.info.property).to.equal('properties')
            //Ex message: Property 'revision' does not exist on interface 'WorkInstruction'
            expect(result?.message).to.have.string('revision')
            expect(result?.message).to.have.string('WorkInstruction')
        })
    })

    describe('Validate types', () => {
        beforeEach(async () => {
            result = undefined
            accept = (severity, message, info) => { 
                result = { severity, message, info }
            } 
        })

        it('validation error if the interface type and the object property type do not match', async () => {
            const model = await generateModel(`
                interface WorkInstruction {
                    name: string
                }

                interface Part {
                    name: string   
                }
                
                define Part PRT001 {
                    name: 'Bracket'
                }

                define WorkInstruction PRT001 {
                    name: PRT001
                }
            `)

            validator.checkPropertyHasCorrectType(model.objects[1].properties[0], accept)
            expect(result).to.exist
            expect(result?.severity).to.equal('error')
            expect(result?.info.node).to.equal(model.objects[1].properties[0])
            expect(result?.info.property).to.equal('name')
            expect(result?.message).to.have.string('Type \'Part\' is not assignable to type \'string\'.')
        })

        it('validation error if the interface specifies an array type but a singleton is provided', async () => {
            const model = await generateModel(`
                interface WorkInstruction {
                    name: string
                    steps: Step[]
                }

                interface Step {
                    name: string   
                }
                
                define Step _0010 {
                    name: 'Abrade Surface'
                }

                define WorkInstruction PRT001 {
                    name: 'PRT001'
                    steps: _0010
                }
            `)

            validator.checkPropertyHasCorrectType(model.objects[1].properties[1], accept)
            expect(result).to.exist
            expect(result?.severity).to.equal('error')
            expect(result?.info.node).to.equal(model.objects[1].properties[1])
            expect(result?.info.property).to.equal('name')
            expect(result?.message).to.have.string('Type \'Step\' is not assignable to \'Step[]\'')

        })

        it('validation error if the interface specifies an object type but a singleton is provided', async () => {
            const model = await generateModel(`
                interface WorkInstruction {
                    name: string
                    steps: Step{}
                }

                interface Step {
                    name: string   
                }
                
                define Step _0010 {
                    name: 'Abrade Surface'
                }

                define WorkInstruction PRT001 {
                    name: 'PRT001'
                    steps: _0010
                }
            `)

            validator.checkPropertyHasCorrectType(model.objects[1].properties[1], accept)
            
            expect(result).to.exist
            expect(result?.severity).to.equal('error')
            expect(result?.info.node).to.equal(model.objects[1].properties[1])
            expect(result?.info.property).to.equal('name')
            expect(result?.message).to.have.string('Type \'Step\' is not assignable to \'Step{}\'')
        })


    })

})