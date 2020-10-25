export interface StudentSerializerDto {
  id: string;
  user: string;
}

export class StudentSerializer implements StudentSerializerDto {
  id: string;
  user: string;

  constructor(student: StudentSerializerDto) {
    Object.assign(this, student);
  }
}
