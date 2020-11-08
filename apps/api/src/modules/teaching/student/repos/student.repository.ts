import { PrismaService } from 'apps/api/src/shared/infra/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Repository } from 'apps/api/src/shared/infra/Repository';
import { Student } from 'apps/api/src/modules/teaching/student/domain/model/student';
import { StudentMap } from 'apps/api/src/modules/teaching/student/mappers/student.map';

export interface IStudentRepo {
  exists(userId: string): Promise<boolean>;
  getStudentByStudentId(studentId: string): Promise<Student>;
  save(student: Student): Promise<Student>;
}

@Injectable()
export class StudentRepository extends Repository implements IStudentRepo {
  constructor(private prisma: PrismaService) {
    super();
  }

  async getStudentByStudentId(studentId: string): Promise<Student> {
    const student = await this.prisma.student.findOne({
      where: {
        id: studentId,
      },
    });
    if (!student) throw new Error('Student not found.');

    return StudentMap.fromPersistence(student);
  }

  async exists(userId: string): Promise<boolean> {
    const user = await this.prisma.student.findOne({
      where: {
        userId: userId,
      },
    });

    return !!user;
  }

  async save(student: Student): Promise<Student> {
    const rawStudent = await StudentMap.toPersistence(student);
    const studentModel = await this.prisma.student.upsert({
      where: {
        id: rawStudent.id,
      },
      create: {
        id: rawStudent.id,
        user: {
          connect: {
            id: rawStudent.userId,
          },
        },
      },
      update: {
        id: rawStudent.id,
        user: {
          connect: {
            id: rawStudent.userId,
          },
        },
      },
    });

    return StudentMap.fromPersistence(studentModel);
  }
}
