import { ValidationChecks } from 'langium';
import { FactureAstType, GenericObject, Property } from './generated/ast';
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
            validator.checkPropertyHasCorrectType
        ]
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class FactureValidator {
    checkObjectHasInterfaceProperties(object: GenericObject, accept: ValidationAcceptor): void {
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
                { node: object, property: 'properties' }
            )
        }

    }

    checkObjectHasOnlyInterfaceProperties(object: GenericObject, accept: ValidationAcceptor): void {
        const attributes = object.interface.ref?.attributes.map(attribute => attribute.name)
        let extraProperties: string[] = [];
        object.properties.forEach(property => {
            if (!attributes?.includes(property.name))
                extraProperties.push(property.name)
        })

        if (extraProperties.length) {
            const errormsg = `Property(s):'${extraProperties?.join(', \'')}' not defined in interface ${object.interface.ref?.name}`
            accept(
                'error',
                errormsg,
                { node: object, property: 'properties' }
            )
        }
    }

    checkPropertyHasCorrectType(property: Property, accept: ValidationAcceptor): void {
        const attribute = property.$container.interface.ref?.attributes.find(attribute => attribute.name === property.name)
        console.log(property.name, attribute?.name)
        console.log(property.value.$type)
        console.log(attribute?.typeAlternatives[0].primitiveType)
    }


}
