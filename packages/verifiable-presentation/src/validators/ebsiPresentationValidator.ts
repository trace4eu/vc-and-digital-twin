import { PresentationValidator } from '../presentationValidatorFactory';
import { EbsiWrapper } from '../middleware/ebsiWrapper';
import {
  PresentationValidationOptions,
  ValidationResult,
  VPTokenData,
} from '../types';
export class EbsiPresentationValidator implements PresentationValidator {
  constructor(
    private vpTokenData: VPTokenData,
    private ebsiWrapper: EbsiWrapper,
    private options: PresentationValidationOptions,
  ) {}
  async validate(
    presentation: string,
    audience: string,
  ): Promise<ValidationResult> {
    try {
      await this.ebsiWrapper.verifyPresentationJwt(presentation, audience, {
        ebsiAuthority: this.options.ebsiAuthority,
      });
      return {
        vpData: this.vpTokenData,
        valid: true,
      };
    } catch (e) {
      return {
        vpData: this.vpTokenData,
        valid: false,
        messages: [e.message],
      };
    }
  }
}
