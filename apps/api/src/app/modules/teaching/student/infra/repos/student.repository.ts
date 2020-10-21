import { PrismaService } from 'apps/api/src/app/shared/infra/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Repository } from 'apps/api/src/app/shared/infra/Repository';
import { Student } from '../../domain/model/student';
import { StudentMap } from '../mappers/student.map';

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

    return StudentMap.fromResistance(student);
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
    const rawStudent = await StudentMap.toResistance(student);
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

    return StudentMap.fromResistance(studentModel);
  }
}
