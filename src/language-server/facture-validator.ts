import { AstNode, DiagnosticInfo, ValidationChecks } from 'langium';
import { AbstractElement, AtomType, FactureAstType, GenericObject, Property, PropertyArray } from './generated/ast';
import { ValidationAcceptor } from 'langium';
import type { FactureServices } from './facture-module';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: FactureServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.FactureValidator;
    const checks: ValidationChecks<FactureAstType> = {
        // Person: validator.checkPersonStartsWithCapital
        GenericObject: [
            validator.checkObjectHasInterfaceProperties,
            validator.checkObjectHasOnlyInterfaceProperties,
        ],
        Property: [
            validator.checkPropertyHasCorrectSingletonType,
        ],
        PropertyArray: [
            validator.checkPropertyHasCorrectArrayType
        ]
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class FactureValidator {
    checkObjectHasInterfaceProperties(object: GenericObject, accept: ValidationAcceptor): void {
        if (!object.interface) return
        const attributes = object.interface.ref?.attributes.map(attribute => ({name: attribute.name, isOptional: attribute.isOptional}))
        let missingAttributes: string[] = []
        attributes && attributes.forEach(attribute => {
            if (!object.properties.map(property => property.name).includes(attribute.name) && !attribute.isOptional) 
                missingAttributes.push(attribute.name)
        })

        if (missingAttributes.length) {
            const errormsg = `Object '${object.name}' is missing property(s): '${missingAttributes?.join(', \'')}' defined in interface ${object.interface.ref?.name}`
            accept(
                'error', 
                errormsg, 
                { node: object, property: 'interface' }
            )
        }

    }

    checkObjectHasOnlyInterfaceProperties(object: GenericObject, accept: ValidationAcceptor): void {
        if (!object.interface) return
        const attributes = object.interface.ref?.attributes.map(attribute => attribute.name)
        let extraProperties: string[] = [];
        object.properties.forEach(property => {
            if (property.name && !attributes?.includes(property.name))
                extraProperties.push(property.name)
        })

        if (extraProperties.length) {
            const errormsg = `Property(s):'${extraProperties?.join(', \'')}' not defined in interface ${object.interface.ref?.name}`
            accept(
                'error',
                errormsg,
                { node: object, property: 'interface' }
            )
        }
    }

    checkPropertyHasCorrectSingletonType(property: Property | PropertyArray, accept: ValidationAcceptor): void {
        if (Array.isArray(property.value)) return
        const value = property.value
        const allowedInterfaceTypes = this.getAllowedInterfaceTypes(property)

        const acceptor = (propertyType: string, allowedType: string) => 
            accept(
                'error', 
                `Type '${propertyType}' is not assignable to type '${allowedType}'`, 
                { node: property, property: 'value' }
            )

        const interfaceTypeTitles: string[] = []
        let objectTypeTitle: string = ''

        allowedInterfaceTypes?.forEach(allowedType => {
            if (!value) return
            objectTypeTitle = this.getObjectTypeTitle(value, allowedType)
            interfaceTypeTitles.push(this.getInterfaceTypeTitle(allowedType) ?? 'undefined')
        })

        if (!interfaceTypeTitles.includes(objectTypeTitle)) 
            acceptor(objectTypeTitle, interfaceTypeTitles.join(' | '))
        
    }

    checkPropertyHasCorrectArrayType(property: Property | PropertyArray, accept: ValidationAcceptor): void {
        if (!Array.isArray(property.value)) return
        const allowedInterfaceTypes = this.getAllowedInterfaceTypes(property)
        const values = property.value

        allowedInterfaceTypes?.forEach(allowedType => {
            const arrayTypes = this.filterUnique(values.map(element => this.getObjectTypeTitle(element, allowedType)))
            const interfaceType = this.getType(allowedType) ?? 'undefined'
            const acceptor = (propertyType: string, allowedType: string, info: DiagnosticInfo<AstNode, string>) => 
                accept(
                    'error',
                    `Type '${propertyType}' is not assignable to type '${allowedType}'`,
                    info
                )

            if (!allowedType.isArray && arrayTypes.length <= 1) {
                acceptor(arrayTypes[0] + '[]', interfaceType.title, { node: property, property: 'value' })
            }

            if (arrayTypes.length > 1) {
                values.forEach((value, index) => {
                    const propertyTypeTitle = this.getObjectTypeTitle(value, allowedType)
                    if (propertyTypeTitle !== interfaceType.base) 
                        acceptor(this.getObjectTypeTitle(value, allowedType), interfaceType.title, { node: value, property: 'value' })
                })
            }

        })



    }

    private getObjectTypeTitle(element: AbstractElement, allowedType: AtomType): string {
        if (element.$type === 'StringType') {
            if (allowedType.keywordType) return element.data
            return 'string'
        }
        if (element.$type === 'IntegerType') return 'number'
        if (element.$type === 'GenericObject') return element.interface.$refText
        if (element.$type === 'ObjectRef') return element.data.ref?.interface.$refText ?? 'undefined'
        return 'undefined'
    }

    private filterUnique(array: string[]) {
        return array.filter((element, index, array) => array.indexOf(element) === index)
    }

    private getAllowedInterfaceTypes(property: Property | PropertyArray) {
        return property.$container.interface.ref?.attributes.find(attribute => 
            attribute.name === property.name
        )?.typeAlternatives
    }

    private getInterfaceTypeTitle(atomType: AtomType) {
        return (atomType.primitiveType && (atomType.primitiveType + (atomType.isArray ? '[]' : '')))
        ?? (atomType.refType && atomType.refType?.$refText + (atomType.isArray ? '[]' : ''))
        ?? (atomType.keywordType && atomType.keywordType.value)
    }

    private getType(atomType: AtomType) {
        let base: string = 'undefined'
        let modifier: string | undefined = undefined
        if (atomType.isArray) modifier = '[]'
        if (atomType.primitiveType) base = atomType.primitiveType
        if (atomType.refType) base = atomType.refType.$refText

        return {
            title: base + (modifier && modifier),
            base: base,
            modifier: modifier
        }
    }


}
