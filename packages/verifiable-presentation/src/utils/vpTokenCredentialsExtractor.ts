import jsonpath from 'jsonpath';
import joseWrapper from '../middleware/joseWrapper';
import {
  CredentialFormat,
  CredentialFormatTuple,
  ExtractionResult,
  ExtractorResult,
  JsonPresentation,
  PresentationSubmission,
  SubmissionEntry,
  VerifiablePresentation,
} from '../types';

export class VpTokenCredentialsExtractor {
  private vpTokenIssuer: string;
  private decodedVerifiablePresentation: VerifiablePresentation;

  constructor(
    private vpToken: object | object[] | string | string[],
    private presentationSubmission?: PresentationSubmission,
  ) {}

  public extract(): ExtractionResult {
    if (this.presentationSubmission) {
      return this.extractFromPresentationSubmission();
    }
    return this.extractWithoutPresentationSubmission();
  }

  private extractWithoutPresentationSubmission() {
    const verifiableCredentials: CredentialFormatTuple[] = [];
    const verifiableCredentialsDecoded = [];
    const descriptorMapIds: string[] = [];
    let vpToken: VerifiablePresentation;

    if (Array.isArray(this.vpToken)) {
      return {
        result: {
          valid: false,
          message: `Multiple presentation not supported without presentation_submission`,
        },
      };
    }

    if (typeof this.vpToken === 'string') {
      vpToken = joseWrapper.decodeJWT(this.vpToken);
    } else {
      vpToken = joseWrapper.decodeJWT(
        (this.vpToken as JsonPresentation).proof.jws,
      );
    }
    this.setVpIssuer(vpToken);
    this.decodedVerifiablePresentation = vpToken;

    for (const credential of vpToken.vp.verifiableCredential) {
      let decodedCredential: any;

      let format = CredentialFormat.JSON;
      if (typeof credential === 'string') {
        format = CredentialFormat.JWT;
        decodedCredential = joseWrapper.decodeJWT(credential);
      } else {
        decodedCredential = joseWrapper.decodeJWT(credential.proof.jws);
      }
      verifiableCredentials.push({
        format,
        verifiableCredential: credential,
      });
      verifiableCredentialsDecoded.push(decodedCredential);
    }
    return {
      result: {
        valid: true,
      },
      vpTokenData: {
        verifiableCredentials: verifiableCredentials,
        verifiableCredentialsDecoded: verifiableCredentialsDecoded,
        descriptorMapIds: descriptorMapIds,
        vpTokenIssuer: this.vpTokenIssuer,
        decodedVerifiablePresentation: this.decodedVerifiablePresentation,
        vpToken: this.vpToken,
      },
    };
  }
  private extractFromPresentationSubmission() {
    const verifiableCredentials = [];
    const verifiableCredentialsDecoded = [];
    const descriptorMapIds: string[] = [];

    for (const submissionEntry of this.presentationSubmission.descriptor_map) {
      descriptorMapIds.push(submissionEntry.id);

      const extractorResult = this.getVerifiableCredentialsFromVpToken(
        submissionEntry,
        this.vpToken,
      );
      if (!extractorResult.valid) {
        return {
          result: extractorResult,
          vpTokenData: { vpToken: this.vpToken },
        };
      }
      verifiableCredentials.push(extractorResult.verifiableCredential);
      if (
        extractorResult.verifiableCredential.format === CredentialFormat.JSON
      ) {
        extractorResult.verifiableCredentialDecoded = joseWrapper.decodeJWT(
          extractorResult.verifiableCredentialDecoded.proof.jws,
        );
      }
      verifiableCredentialsDecoded.push(
        extractorResult.verifiableCredentialDecoded,
      );
    }
    return {
      result: {
        valid: true,
      },
      vpTokenData: {
        verifiableCredentials: verifiableCredentials,
        verifiableCredentialsDecoded: verifiableCredentialsDecoded,
        descriptorMapIds: descriptorMapIds,
        vpTokenIssuer: this.vpTokenIssuer,
        decodedVerifiablePresentation: this.decodedVerifiablePresentation,
        vpToken: this.vpToken,
      },
    };
  }

  private getVerifiableCredentialsFromVpToken(
    submissionEntry: SubmissionEntry,
    vpToken: object[] | object | string | string[],
  ): ExtractorResult {
    vpToken = this.checkVpTokenIsJWT(vpToken, submissionEntry);

    const vpTokenElement: any[] | object | string = jsonpath.query(
      vpToken,
      submissionEntry.path,
    )[0];

    if (!vpTokenElement) {
      return {
        valid: false,
        message: `Verifiable presentation/credential not found for this path: ${submissionEntry.path}`,
      };
    }

    const { verifiableCredential, verifiableCredentialJWT } =
      this.checkVerifiableCredentialIsJWT(
        submissionEntry,
        vpTokenElement,
        vpToken,
      );

    this.storeIssuerAndDecodedPresentationFromVp(
      verifiableCredential as VerifiablePresentation,
    );

    if (submissionEntry.path_nested) {
      return this.getVerifiableCredentialsFromVpToken(
        submissionEntry.path_nested,
        vpToken,
      );
    }
    return {
      valid: true,
      verifiableCredential: verifiableCredentialJWT
        ? {
            format: CredentialFormat.JWT,
            verifiableCredential: verifiableCredentialJWT,
          }
        : {
            format: CredentialFormat.JSON,
            verifiableCredential: verifiableCredential,
          },
      verifiableCredentialDecoded: verifiableCredential,
    };
  }

  private storeIssuerAndDecodedPresentationFromVp(
    verifiablePresentation: VerifiablePresentation,
  ) {
    if (
      verifiablePresentation.hasOwnProperty('vp') ||
      ((verifiablePresentation as { type: string[] }).type &&
        (verifiablePresentation as { type: string[] }).type.includes(
          'VerifiablePresentation',
        ))
    ) {
      this.setVpIssuer(verifiablePresentation);
      this.decodedVerifiablePresentation = verifiablePresentation;
    }
  }

  private setVpIssuer(vpTokenElement: any[] | object | string) {
    if (vpTokenElement.hasOwnProperty('holder')) {
      this.setVpTokenIssuer((vpTokenElement as { holder: string }).holder);
      return;
    }

    if (vpTokenElement.hasOwnProperty('iss')) {
      this.setVpTokenIssuer((vpTokenElement as { iss: string }).iss);
      return;
    }
    if (
      vpTokenElement.hasOwnProperty('issuer') &&
      typeof (vpTokenElement as { issuer: string }).issuer === 'object'
    ) {
      this.setVpTokenIssuer(
        (vpTokenElement as { issuer: { id: string } }).issuer.id,
      );
      return;
    }
    if (
      vpTokenElement.hasOwnProperty('issuer') &&
      typeof (vpTokenElement as { issuer: string }).issuer === 'string'
    ) {
      this.setVpTokenIssuer((vpTokenElement as { issuer: string }).issuer);
      return;
    }
  }

  private checkVerifiableCredentialIsJWT(
    submissionEntry: SubmissionEntry,
    verifiableCredential: any[] | object | string,
    vpToken: object,
  ) {
    let verifiableCredentialJWT: string;
    if (submissionEntry.format.includes('jwt')) {
      verifiableCredentialJWT = verifiableCredential as string;
      verifiableCredential = joseWrapper.decodeJWT(verifiableCredentialJWT);
      jsonpath.apply(vpToken, submissionEntry.path, () => verifiableCredential);
    }
    return {
      verifiableCredential: verifiableCredential,
      verifiableCredentialJWT: verifiableCredentialJWT,
    };
  }

  private checkVpTokenIsJWT(
    vpToken: object[] | object | string | string[],
    submissionEntry: SubmissionEntry,
  ) {
    if (typeof vpToken === 'string') {
      vpToken = joseWrapper.decodeJWT(vpToken);
      submissionEntry.format = 'ldp_vc_converted';
    }
    return vpToken;
  }

  private setVpTokenIssuer(issuer: string) {
    if (!this.vpTokenIssuer) {
      this.vpTokenIssuer = issuer;
    }
  }
}
