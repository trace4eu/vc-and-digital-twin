import { PresentationSubmission } from '@trace4eu/verifiable-presentation';

export interface PresentationRequest {
  state?: string;
  vp_token?: object | object[] | string | string[];
  presentation_submission: PresentationSubmission;
}
