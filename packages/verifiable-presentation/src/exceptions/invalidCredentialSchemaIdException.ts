import CustomError from './customError';

export class InvalidCredentialSchemaIdException extends CustomError {
  constructor(private schemaId: string) {
    super();
    this.message = `[${this.constructor.name}] Invalid credential schema id: ${this.schemaId}`;
  }
}
