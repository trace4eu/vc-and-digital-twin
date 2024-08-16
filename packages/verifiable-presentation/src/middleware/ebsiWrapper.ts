import { verifyPresentationJwt } from '@cef-ebsi/verifiable-presentation';
import {
  EbsiVerifiablePresentation,
  VerifyPresentationJwtOptions,
} from '@cef-ebsi/verifiable-presentation/dist/types';

export class EbsiWrapper {
  public async verifyPresentationJwt(
    vpToken: string,
    audience: string,
    options: VerifyPresentationJwtOptions,
  ): Promise<EbsiVerifiablePresentation> {
    return await verifyPresentationJwt(vpToken, audience, {
      ...options,
      validAt: new Date().getTime() / 1000,
    });
  }
}
