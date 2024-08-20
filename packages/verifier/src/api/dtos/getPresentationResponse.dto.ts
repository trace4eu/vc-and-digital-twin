import { VPTokenData } from '@trace4eu/verifiable-presentation';
import { VerificationProcessStatus } from '../../contexts/presentation/domain/verifierSession';

export interface GetPresentationResponseDto {
  status: VerificationProcessStatus;
  vpTokenData?: VPTokenData;
  idTokenData?: string;
  errorMessage?: string;
}
