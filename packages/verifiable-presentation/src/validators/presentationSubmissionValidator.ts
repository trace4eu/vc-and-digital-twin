import jsonpath from 'jsonpath';
import { PresentationResult } from '../utils/vpTokenCredentialsExtractor';
import JsonSchemaWrapper from '../middleware/jsonSchemaWrapper';

export class PresentationSubmissionValidator {
  private result: PresentationResult;
  constructor(
    private presentationDefinition: PresentationDefinition,
    private verifiableCredentialsDecoded: any[],
    private descriptorMapIds: string[],
    private jsonSchemaWrapper: JsonSchemaWrapper,
  ) {
    this.result = {
      valid: true,
    };
  }

  validate(): PresentationResult {
    let credentialData: any;

    for (const descriptorMap of this.descriptorMapIds) {
      const index = this.descriptorMapIds.indexOf(descriptorMap);

      const verifiableCredential = this.verifiableCredentialsDecoded[index];
      const inputDescriptor =
        this.presentationDefinition.input_descriptors.find(
          (inputDescriptor) => inputDescriptor.id === descriptorMap,
        );

      for (const constrainField of inputDescriptor.constraints.fields) {
        credentialData = this.getCredentialDataFromPath(
          constrainField,
          verifiableCredential,
        );
        if (!credentialData) {
          this.result.valid = false;
          this.result.message = `presentation_submission verifiable credential ${descriptorMap} does not match presentation_definition constrains path`;
          return this.result;
        }
        const validationResult = this.jsonSchemaWrapper.validateJson(
          credentialData,
          constrainField.filter,
        );
        if (!validationResult) {
          this.result.valid = false;
          this.result.message = `presentation_submission verifiable credential ${descriptorMap} does not match presentation_definition constrains`;
          return this.result;
        }
      }
    }
    return this.result;
  }

  private getCredentialDataFromPath(
    constrainField: { path: string[]; filter: object },
    verifiableCredential: any,
  ) {
    let credentialData: any;
    for (const path of constrainField.path) {
      credentialData = jsonpath.value(verifiableCredential, path);
      if (credentialData) {
        return credentialData;
      }
    }
    return undefined;
  }
}
