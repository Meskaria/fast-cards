export interface StudentDto {
  id: string;
  user: string;
}

export class StudentSerializer implements StudentDto {
  id: string;
  user: string;

  constructor(student: StudentDto) {
    Object.assign(this, student);
  }
}
