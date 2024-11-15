import { Uuid } from '../../shared/domain/uuid';

export class SessionId extends Uuid {
  constructor(private id: string) {
    super(id);
  }
}
