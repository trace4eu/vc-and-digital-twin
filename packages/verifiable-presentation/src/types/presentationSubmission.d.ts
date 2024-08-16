interface PresentationSubmission {
  id: string;
  definition_id: string;
  descriptor_map: SubmissionEntry[];
}

interface SubmissionEntry {
  id?: string;
  format: string;
  path: string;
  path_nested?: SubmissionEntry;
}
