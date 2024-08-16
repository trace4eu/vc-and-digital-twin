interface PresentationDefinition {
  id: string;
  input_descriptors: InputDescriptor[];
}

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
