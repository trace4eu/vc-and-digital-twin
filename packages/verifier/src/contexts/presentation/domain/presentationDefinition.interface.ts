interface InputDescriptor {
  id: string;
  format?: object;
  constraints: {
    fields?: {
      path: string[];
      filter: object;
    }[];
  };
}

export interface PresentationDefinition {
  id: string;
  input_descriptors: InputDescriptor[];
}
