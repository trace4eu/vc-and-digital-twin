import {
  verifyPresentationJwt,
  EbsiVerifiablePresentation,
  VerifyPresentationJwtOptions,
} from '@cef-ebsi/verifiable-presentation';

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
