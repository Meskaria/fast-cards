import { UniqueEntityID } from 'apps/api/src/shared/domain/UniqueEntityID';
import { Injectable } from '@nestjs/common';
import { Mentor as MentorEntity } from '@prisma/client';
import { Mapper } from 'apps/api/src/shared/infra/Mapper';
import { Mentor } from 'apps/api/src/modules/teaching/mentor/domain/model/mentor';
import { MentorDto } from 'apps/api/src/modules/teaching/mentor/serializers/mentor.serializer';

@Injectable()
export class MentorMap implements Mapper<Mentor, MentorEntity> {
  public static async toDTO(mentor: Mentor): Promise<MentorDto> {
    return {
      id: mentor.id.value.toString(),
      user: mentor.userId,
    };
  }
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
