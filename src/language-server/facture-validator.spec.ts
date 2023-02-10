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
            expect(result?.info.property).to.equal('interface')
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
            expect(result?.info.property).to.equal('interface')
            //Ex message: Property 'revision' does not exist on interface 'WorkInstruction'
            expect(result?.message).to.have.string('revision')
            expect(result?.message).to.have.string('WorkInstruction')
        })
    })

    describe('Validate singleton types', () => {
        beforeEach(async () => {
            result = undefined
            accept = (severity, message, info) => { 
                result = { severity, message, info }
            } 
        })

        it('validation error: type \'number\' (primitiveType) is not assignable to type \'string\' (primitiveType)',
            async () => {
                const model = await generateModel(`
                    interface WorkInstruction {
                        name: string
                    }

                    define WorkInstruction PRT001 {
                        name: 100.01
                    }
                `)

                validator.checkPropertyHasCorrectSingletonType(model.objects[0].properties[0], accept)
                expect(result).to.exist
                expect(result?.severity).to.equal('error')
                expect(result?.info.node).to.equal(model.objects[0].properties[0])
                expect(result?.info.property).to.equal('value')
                expect(result?.message).to.have.string('number')
                expect(result?.message).to.have.string('string')
            }
        )


        it('validation error: type \'Product\' (GenericObject) is not assignable to type \'string\' (primitiveType)', async () => {
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

            validator.checkPropertyHasCorrectSingletonType(model.objects[1].properties[0], accept)
            expect(result).to.exist
            expect(result?.severity).to.equal('error')
            expect(result?.info.node).to.equal(model.objects[1].properties[0])
            expect(result?.info.property).to.equal('value')
            //Ex msg: Type 'Part' is not assignable to type 'string'
            expect(result?.message).to.have.string('Part')
            expect(result?.message).to.have.string('string')
        })

        it('validation error: type \'string\' (primitveType) is not assignable to type \'string[]\' (primitiveType[])',
        async () => {
            const model = await generateModel(`
                interface WorkInstruction {
                    name: string[]
                }

                define WorkInstruction PRT001 {
                    name: 'PRT001'
                }
            `)

            validator.checkPropertyHasCorrectSingletonType(model.objects[0].properties[0], accept)
            expect(result).to.exist
            expect(result?.severity).to.equal('error')
            expect(result?.info.node).to.equal(model.objects[0].properties[0])
            expect(result?.info.property).to.equal('value')
            expect(result?.message).to.have.string('string')
            expect(result?.message).to.have.string('string[]')
        })

        it('validation error: type \'Step\' (GenericObject) is not assignable to type \'Step[]\' (GenericObject[])', async () => {
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

            validator.checkPropertyHasCorrectSingletonType(model.objects[1].properties[1], accept)
            expect(result).to.exist
            expect(result?.severity).to.equal('error')
            expect(result?.info.node).to.equal(model.objects[1].properties[1])
            expect(result?.info.property).to.equal('value')
            //Ex msg: Type 'Step' is not assignable to type: 'Step[]'
            expect(result?.message).to.have.string('Step')
            expect(result?.message).to.have.string('Step[]')

        })

    })

    describe('Validate array types', () => {
        beforeEach(async () => {
            result = undefined
            accept = (severity, message, info) => { 
                result = { severity, message, info }
            } 
        })

        it('validation error: type \'string[]\' (primitiveType[]) is not assignable to type \'string\' (primitiveType)', async () => {
            const model = await generateModel(`
                interface WorkInstruction {
                    name: string
                    author: string
                }

                define WorkInstruction PRT001 {
                    name: 'PRT001'
                    author: [
                        'Tim Denning'
                        'Mike Durante'
                    ]
                }
            `)

            validator.checkPropertyHasCorrectArrayType(model.objects[0].properties[1], accept)
            expect(result).to.exist
            expect(result?.severity).to.equal('error')
            expect(result?.info.node).to.equal(model.objects[0].properties[1])
            expect(result?.info.property).to.equal('value')
            expect(result?.message).to.have.string('string[]')
            expect(result?.message).to.have.string('string')
        })

        it('validation error: type \'Product[]\' (GenericObject[]) is not assignable to type \'Product\' (GenericObject)', async () => {
            const model = await generateModel(`
                interface WorkInstruction {
                    name: string
                    part: Product
                }

                interface Product {
                    name: string
                }

                define Product A40 {
                    name: 'A40'
                }

                define Product A41 {
                    name: 'A41'
                }

                define WorkInstruction PRT001 {
                    name: 'PRT001'
                    part: [
                        A40
                        A41
                    ]

                }
            `)

            validator.checkPropertyHasCorrectArrayType(model.objects[2].properties[1], accept)
            expect(result).to.exist
            expect(result?.severity).to.equal('error')
            expect(result?.info.node).to.equal(model.objects[2].properties[1])
            expect(result?.info.property).to.equal('value')
            expect(result?.message).to.have.string('Product[]')
            expect(result?.message).to.have.string('Product')
        })

        it('validation error: (mixed ObjectRef and GenericObject) type \'Product[]\' (GenericObject[]) is not assignable to type \'Product\' (GenericObject)', 
            async () => {
                const model = await generateModel(`
                    interface WorkInstruction {
                        name: string
                        part: Product
                    }

                    interface Product {
                        name: string
                    }

                    define Product A40 {
                        name: 'A40'
                    }

                    define WorkInstruction PRT001 {
                        name: 'PRT001'
                        part: [
                            A40
                            define Product A41 {
                                name: 'A41'
                            }
                        ]

                    }
                `)

                validator.checkPropertyHasCorrectArrayType(model.objects[1].properties[1], accept)
                expect(result).to.exist
                expect(result?.severity).to.equal('error')
                expect(result?.info.node).to.equal(model.objects[1].properties[1])
                expect(result?.info.property).to.equal('value')
                expect(result?.message).to.have.string('Product[]')
                expect(result?.message).to.have.string('Product')
            }
        )

        it('valdation error: (mixed types in array) type \'number\' is not assignable to type \'string\'', async () => {
            const model = await generateModel(`
                interface WorkInstruction {
                    name: string
                    author: string[]
                }

                define WorkInstruction PRT001 {
                    name: 'PRT001'
                    author: [
                        'Tim Denning'
                        100
                    ]
                }
            `)

            validator.checkPropertyHasCorrectArrayType(model.objects[0].properties[1], accept)
            expect(result).to.exist
            expect(result?.severity).to.equal('error')
            expect(result?.info.property).to.equal('value')
            expect(result?.message).to.have.string('string')
            expect(result?.message).to.have.string('number')
        })

        it('valdation error: (mixed types in array) type \'Step\' is not assignable to type \'Product\'', async () => {
            const model = await generateModel(`
                interface WorkInstruction {
                    name: string
                    steps: Step[]
                }
                
                interface Step {
                    name: string
                }
                
                interface Product {
                    name: string
                }
                
                define Step _001 {
                    name: 'step 1'
                }
                
                define Product PRT001 {
                    name: 'part 1'
                }
                
                define WorkInstruction PRT001 {
                    name: 'PRT001'
                    steps: [
                        _001
                        PRT001
                    ]
                }
            `)

            validator.checkPropertyHasCorrectArrayType(model.objects[2].properties[1], accept)
            expect(result).to.exist
            expect(result?.severity).to.equal('error')
            expect(result?.info.property).to.equal('value')
            expect(result?.message).to.have.string('Step')
            expect(result?.message).to.have.string('Product')
        })


    })

})