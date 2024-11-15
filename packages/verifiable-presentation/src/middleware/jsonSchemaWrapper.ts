import ajv2020, { AnySchemaObject } from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import axios from 'axios';
import { InvalidCredentialSchemaIdException } from '../exceptions/invalidCredentialSchemaIdException';

export default class JsonSchemaWrapper {
  private readonly ajv: ajv2020;
  constructor() {
    const Ajv2020 = ajv2020;
    this.ajv = new Ajv2020({
      allErrors: true,
      loadSchema: this.loadSchema(),
    });
    addFormats.default(this.ajv);
  }

  public validateJson(data: object, schema: object): boolean {
    const validate = this.ajv.compile(schema);
    return validate(data);
  }

  private loadSchema = () => {
    return async (url: string): Promise<AnySchemaObject> => {
      try {
        const response = await axios.get(url);
        return response.data;
      } catch (e) {
        throw new InvalidCredentialSchemaIdException(url);
      }
    };
  };
}
