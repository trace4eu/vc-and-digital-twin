import { EbsiWrapper } from './middleware/ebsiWrapper';
import { EbsiPresentationValidator } from './validators/ebsiPresentationValidator';
import { isEbsiDid, isKeyDid } from './utils/utils';
import UnsupportedStatusListCredentialTypeException from './exceptions/unsupportedVeriafiablePresentationFormat';
import {
  DecodedVerifiableCredential,
  PresentationValidationOptions,
  ValidationResult,
  VPTokenData,
} from './types';

export interface PresentationValidator {
  validate(presentation: string, audience: string): Promise<ValidationResult>;
}

export class PresentationValidatorFactory {
  create(
    vpTokenData: VPTokenData,
    opts: PresentationValidationOptions,
  ): PresentationValidator {
    if (
      this.isEbsiPresentation(
        vpTokenData.vpTokenIssuer,
        vpTokenData.verifiableCredentialsDecoded,
      )
    ) {
      const ebsiWrapper = new EbsiWrapper();
      return new EbsiPresentationValidator(vpTokenData, ebsiWrapper, opts);
    }
    throw new UnsupportedStatusListCredentialTypeException();
  }

  private isEbsiPresentation(
    vpHolder: string,
    decodedCredentials: DecodedVerifiableCredential[],
  ): boolean {
    const notEbsiCredential = decodedCredentials.find((credential) => {
      !isEbsiDid(credential.iss);
    });

    return !(notEbsiCredential || !isKeyDid(vpHolder));
  }
}
