import { Identifier } from 'apps/api/src/shared/domain/Identifier';

export class UniqueEntityID extends Identifier<string> {
  constructor(id: string) {
    super(id);
  }
}
