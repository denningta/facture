// import { ValidationChecks } from 'langium';
// import { FactureAstType } from './generated/ast';
import type { FactureServices } from './facture-module';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: FactureServices) {
    // const registry = services.validation.ValidationRegistry;
    // const validator = services.validation.FactureValidator;
    // const checks: ValidationChecks<FactureAstType> = {
    //     // Person: validator.checkPersonStartsWithCapital
    // };
    // registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class FactureValidator {

    // checkPersonStartsWithCapital(person: Person, accept: ValidationAcceptor): void {
    //     if (person.name) {
    //         const firstChar = person.name.substring(0, 1);
    //         if (firstChar.toUpperCase() !== firstChar) {
    //             accept('warning', 'Person name should start with a capital.', { node: person, property: 'name' });
    //         }
    //     }
    // }

}
