import { VPTokenData } from '../utils/vpTokenCredentialsExtractor';

interface ValidationResult {
  valid: boolean;
  messages?: string[];
  vpData?: VPTokenData;
}
