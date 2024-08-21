import {
  PresentationValidationOptions,
  validateJwtVP,
  ValidationResult,
} from '@trace4eu/verifiable-presentation';
export class VpValidatorWrapper {
  validateJwtVP = async (
    jwt: string,
    audience: string,
    opts?: PresentationValidationOptions,
  ): Promise<ValidationResult> => {
    if (opts) return validateJwtVP(jwt, audience, opts);
    return validateJwtVP(jwt, audience, {});
  };
}

const vpValidatorWrapper = new VpValidatorWrapper();
export { vpValidatorWrapper };
