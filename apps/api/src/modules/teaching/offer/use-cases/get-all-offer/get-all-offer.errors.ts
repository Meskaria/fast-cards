import { UseCaseError } from 'apps/api/src/shared/core/UseCaseError';
import { Result } from 'apps/api/src/shared/core/Result';

export namespace GetAllOfferErrors {
  export class NoOffersForGivenMentorId extends Result<UseCaseError> {
    constructor(mentorId: string) {
      super(false, {
        message: `No offers were found for given mentor: ${mentorId}`,
      } as UseCaseError);
    }
  }
}
