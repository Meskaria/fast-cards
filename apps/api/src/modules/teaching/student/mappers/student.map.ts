import { UniqueEntityID } from '@app/shared/domain/UniqueEntityID';
import { Injectable } from '@nestjs/common';
import { Student as StudentEntity } from '@prisma/client';
import { Mapper } from '@app/shared/infra/Mapper';
import { Student } from '@app/modules/teaching/student/domain/model/student';

@Injectable()
export class StudentMap implements Mapper<Student, StudentEntity> {

  public static fromPersistence(raw: StudentEntity): Student {
    return new Student({ userId: raw.userId }, new UniqueEntityID(raw.id));
  }

  public static async toPersistence(
    student: Student
  ): Promise<Omit<StudentEntity, 'createdAt' | 'updatedAt'>> {
    return {
      id: student.id.value.toString(),
      userId: student.userId,
    };
  }
}
