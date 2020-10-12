export interface MentorDto {
  id: string;
  user: string;
}

export class MentorSerializer implements MentorDto {
  id: string;
  user: string;

  constructor(mentor: MentorDto) {
    Object.assign(this, mentor);
  }
}
