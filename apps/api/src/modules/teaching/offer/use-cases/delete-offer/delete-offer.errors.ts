import { UseCaseError } from 'apps/api/src/shared/core/UseCaseError';
import { Result } from 'apps/api/src/shared/core/Result';

export namespace DeleteOfferErrors {
  export class NonExistentOfferError extends Result<UseCaseError> {
    constructor(offerId: string) {
      super(false, {
        message: `The offer with offerId: ${offerId}, doesn't exists`,
      } as UseCaseError);
    }
  }
}
