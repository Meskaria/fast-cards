import { PrismaService } from '@app/shared/infra/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Repository } from '@app/shared/infra/Repository';
import { Mentor } from '@app/modules/teaching/mentor/domain/model/mentor';
import { MentorMap } from '@app/modules/teaching/mentor/mappers/mentor.map';

export interface IMentorRepo {
  exists(userId: string): Promise<boolean>;
  getMentorByMentorId(mentorId: string): Promise<Mentor>;
  save(mentor: Mentor): Promise<Mentor>;
}

@Injectable()
export class MentorRepository extends Repository implements IMentorRepo {
  constructor(private prisma: PrismaService) {
    super();
  }

  async getMentorByMentorId(mentorId: string): Promise<Mentor> {
    const mentor = await this.prisma.mentor.findOne({
      where: {
        id: mentorId,
      },
    });
    if (!mentor) throw new Error('Mentor not found.');

    return MentorMap.fromPersistence(mentor);
  }

  async exists(userId: string): Promise<boolean> {
    const user = await this.prisma.mentor.findOne({
      where: {
        userId: userId,
      },
    });

    return !!user;
  }

  async save(mentor: Mentor): Promise<Mentor> {
    const rawMentor = await MentorMap.toPersistence(mentor);
    const mentorModel = await this.prisma.mentor.upsert({
      where: {
        id: rawMentor.id,
      },
      create: {
        id: rawMentor.id,
        user: {
          connect: {
            id: rawMentor.userId,
          },
        },
      },
      update: {
        id: rawMentor.id,
        user: {
          connect: {
            id: rawMentor.userId,
          },
        },
      },
    });

    return MentorMap.fromPersistence(mentorModel);
  }
}
