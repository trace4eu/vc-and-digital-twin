import { v4 as uuidv4, validate } from 'uuid';
import { InvalidUuidFormatException } from '../exceptions/invalidUuidFormat.exception';

export class Uuid {
  constructor(protected value: string) {
    if (!validate(value)) throw new InvalidUuidFormatException(value);
  }

  static generate(): Uuid {
    return new Uuid(uuidv4());
  }

  toString() {
    return this.value;
  }
}
