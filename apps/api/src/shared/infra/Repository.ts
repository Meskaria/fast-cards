import uuid from 'uuid/v4';

export class Repository {
  public nextId() {
    return uuid();
  }
}
