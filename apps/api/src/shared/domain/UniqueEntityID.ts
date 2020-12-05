import { Identifier } from '@app/shared/domain/Identifier';

export class UniqueEntityID extends Identifier<string> {
  constructor(id: string) {
    super(id);
  }
}
