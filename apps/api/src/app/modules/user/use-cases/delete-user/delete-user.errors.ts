import { UseCaseError } from "../../../../shared/core/UseCaseError"
import { Result } from "../../../../shared/core/Result"

export namespace DeleteUserErrors {
  export class UserNotFoundError extends Result<UseCaseError> {
    constructor (userId: string) {
      super(false, {
        message: `User with ${userId} was not found`
      } as UseCaseError)
    }
  }
}
