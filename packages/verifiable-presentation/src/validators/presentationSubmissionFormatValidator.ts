import { PresentationResult } from '../utils/vpTokenCredentialsExtractor';

export class PresentationSubmissionFormatValidator {
  private readonly result: PresentationResult;
  constructor(
    private presentationSubmission: PresentationSubmission,
    private presentationDefinition: PresentationDefinition,
  ) {
    this.result = {
      valid: true,
    };
  }

  validate(): PresentationResult {
    const validators = [
      this.validatePresentationId,
      this.validateDescriptorMapLength,
      this.validateMatchingIds,
    ];
    for (const validator of validators) {
      validator.bind(this)();
      if (!this.result.valid) {
        return this.result;
      }
    }

    return this.result;
  }

  private validatePresentationId() {
    if (
      this.presentationSubmission.definition_id !==
      this.presentationDefinition.id
    ) {
      this.result.valid = false;
      this.result.message =
        'presentation_submission definition_id does not match presentation_definition id';
    }
  }
  private validateDescriptorMapLength() {
    if (
      this.presentationSubmission.descriptor_map.length !==
      this.presentationDefinition.input_descriptors.length
    ) {
      this.result.valid = false;
      this.result.message =
        'presentation_submission descriptor_map length does not match presentation_definition input_descriptors length';
    }
  }
  private validateMatchingIds() {
    this.presentationDefinition.input_descriptors.forEach((inputDescriptor) => {
      const submissionEntry = this.presentationSubmission.descriptor_map.find(
        (descriptorMap) => descriptorMap.id === inputDescriptor.id,
      );
      if (!submissionEntry) {
        this.result.valid = false;
        this.result.message =
          'presentation_submission descriptor_map id does not match presentation_definition input_descriptors ids';
      }
    });
  }
}
