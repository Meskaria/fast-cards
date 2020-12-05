import { UniqueEntityID } from '@app/shared/domain/UniqueEntityID';
import { Injectable } from '@nestjs/common';
import { Mentor as MentorEntity } from '@prisma/client';
import { Mapper } from '@app/shared/infra/Mapper';
import { Mentor } from '@app/modules/teaching/mentor/domain/model/mentor';

@Injectable()
export class MentorMap implements Mapper<Mentor, MentorEntity> {

  public static fromPersistence(raw: MentorEntity): Mentor {
    return new Mentor({ userId: raw.userId }, new UniqueEntityID(raw.id));
  }

  public static async toPersistence(
    mentor: Mentor
  ): Promise<Omit<MentorEntity, 'createdAt' | 'updatedAt'>> {
    return {
      id: mentor.id.value.toString(),
      userId: mentor.userId,
    };
  }
}
