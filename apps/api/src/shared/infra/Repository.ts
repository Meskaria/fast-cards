import { v4 as uuid } from 'uuid';

export class Repository {
  public nextId() {
    return uuid();
  }
}
