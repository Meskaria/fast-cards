import { UniqueEntityID } from 'apps/api/src/app/shared/domain/UniqueEntityID';
import { Injectable } from '@nestjs/common';
import { Student as StudentEntity } from '@prisma/client';
import { Mapper } from 'apps/api/src/app/shared/infra/Mapper';
import { Student } from '../../domain/model/student';
import { StudentSerializerDto } from '../http/serializers/student.serializer';

@Injectable()
export class StudentMap implements Mapper<Student, StudentEntity> {
  public static async toDTO(student: Student): Promise<StudentSerializerDto> {
    return {
      id: student.id.value.toString(),
      user: student.userId,
    };
  }
  public static fromResistance(raw: StudentEntity): Student {
    return new Student({ userId: raw.userId }, new UniqueEntityID(raw.id));
  }

  public static async toResistance(
    student: Student
  ): Promise<Omit<StudentEntity, 'createdAt' | 'updatedAt'>> {
    return {
      id: student.id.value.toString(),
      userId: student.userId,
    };
  }
}
