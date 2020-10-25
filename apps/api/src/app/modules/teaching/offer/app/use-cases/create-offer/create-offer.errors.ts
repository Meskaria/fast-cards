import { UseCaseError } from 'apps/api/src/app/shared/core/UseCaseError';
import { Result } from 'apps/api/src/app/shared/core/Result';

export namespace CreateOfferErrors {
  export class OfferAlreadyExistsError extends Result<UseCaseError> {
    constructor(offerId: string) {
      super(false, {
        message: `The offer with offerId: ${offerId}, already exists in the db`,
      } as UseCaseError);
    }
  }
}
