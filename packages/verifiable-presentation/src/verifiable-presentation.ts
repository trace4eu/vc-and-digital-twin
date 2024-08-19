import { VpTokenCredentialsExtractor } from './utils/vpTokenCredentialsExtractor';
import { PresentationValidatorFactory } from './presentationValidatorFactory';
import { PresentationSubmissionValidator } from './validators/presentationSubmissionValidator';
import JsonSchemaWrapper from './middleware/jsonSchemaWrapper';
import { PresentationSubmissionFormatValidator } from './validators/presentationSubmissionFormatValidator';
import {
  PresentationDefinition,
  PresentationSubmission,
  PresentationValidationOptions,
  ValidationResult,
} from './types';

async function validateJwtVP(
  presentation: string,
  audience: string,
  opts: PresentationValidationOptions,
): Promise<ValidationResult> {
  const extractionResult = new VpTokenCredentialsExtractor(
    presentation,
    opts?.presentationSubmission,
  ).extract();

  if (!extractionResult.result.valid) {
    return { valid: false, messages: [extractionResult.result.message] };
  }

  if (opts?.presentationSubmission && opts?.presentationDefinition) {
    const submissionResult = validatePresentationSubmission(
      opts.presentationSubmission,
      opts.presentationDefinition,
      extractionResult.vpTokenData.verifiableCredentialsDecoded,
      extractionResult.vpTokenData.descriptorMapIds,
    );
    if (!submissionResult.valid) {
      return submissionResult;
    }
  }

  const presentationValidatorFactory = new PresentationValidatorFactory();
  const validator = presentationValidatorFactory.create(
    extractionResult.vpTokenData,
    opts,
  );

  return validator.validate(presentation, audience);
}

function validatePresentationSubmission(
  presentationSubmission: PresentationSubmission,
  presentationDefinition: PresentationDefinition,
  verifiableCredentials: any[],
  descriptorMapIds: string[],
): ValidationResult {
  let result = new PresentationSubmissionFormatValidator(
    presentationSubmission,
    presentationDefinition,
  ).validate();
  if (!result.valid) {
    return { valid: false, messages: [result.message] };
  }

  const jsonSchemaWrapper = new JsonSchemaWrapper();
  result = new PresentationSubmissionValidator(
    presentationDefinition,
    verifiableCredentials,
    descriptorMapIds,
    jsonSchemaWrapper,
  ).validate();
  if (!result.valid) {
    return { valid: false, messages: [result.message] };
  }
  return {
    valid: true,
  };
}

export { validateJwtVP };
