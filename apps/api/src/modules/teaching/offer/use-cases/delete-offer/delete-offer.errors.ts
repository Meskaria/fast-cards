import { UseCaseError } from '@app/shared/core/UseCaseError';
import { Result } from '@app/shared/core/Result';

export namespace DeleteOfferErrors {
  export class NonExistentOfferError extends Result<UseCaseError> {
    constructor(offerId: string) {
      super(false, {
        message: `The offer with offerId: ${offerId}, doesn't exists`,
      } as UseCaseError);
    }
  }
}
