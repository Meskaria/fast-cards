interface IUseCaseError {
  message: string;
}

export abstract class UseCaseError implements IUseCaseError {
  public readonly message: string;

  protected constructor(message: string) {
    this.message = message;
  }
}
