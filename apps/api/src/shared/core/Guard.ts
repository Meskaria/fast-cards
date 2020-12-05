import { Result } from './Result';

export interface IGuardArgument {
  argument: any;
  argumentName: string;
}

export type GuardArgumentCollection = IGuardArgument[];

export class Guard {
  public static combine(guardResults: Result<string>[]): Result<string> {
    for (const result of guardResults) {
      if (result.isFailure) return result;
    }

    return Result.ok()
  }

  public static greaterThan(
    minValue: number,
    actualValue: number
  ): Result<string>  {
    return actualValue > minValue
      ? Result.ok()
      : Result.fail(`Number given {${actualValue}} is not greater than {${minValue}}`)
  }

  public static againstAtLeast(numChars: number, text: string): Result<string>  {
    return text.length >= numChars
      ? Result.ok()
      : Result.fail(`Text is not at least ${numChars} chars.`)
  }

  public static againstAtMost(numChars: number, text: string): Result<string>  {
    return text.length <= numChars
      ? Result.ok()
      : Result.fail(`Text is greater than ${numChars} chars.`)
  }

  public static againstNullOrUndefined(
    argument: any,
    argumentName: string
  ): Result<string>  {
    if (argument === null || argument === undefined)
      return Result.fail(`${argumentName} is null or undefined`)

    return Result.ok()
  }

  public static againstNullOrUndefinedBulk(
    args: GuardArgumentCollection
  ): Result<string>  {
    for (const arg of args) {
      const result = this.againstNullOrUndefined(
        arg.argument,
        arg.argumentName
      );
      if (result.isFailure) return result;
    }

    return Result.ok()
  }

  public static isOneOf(
    value: any,
    validValues: any[],
    argumentName: string
  ): Result<string>  {
    let isValid = false;
    for (const validValue of validValues) {
      if (value === validValue) {
        isValid = true;
      }
    }

    if (isValid) {
            return Result.ok()
    } else {
      return Result.fail(`${argumentName} isn't oneOf the correct types in ${JSON.stringify(
        validValues
      )}. Got "${value}".`)
    }
  }

  public static inRange(
    num: number,
    min: number,
    max: number,
    argumentName: string
  ): Result<string>  {
    const isInRange = num >= min && num <= max;
    if (!isInRange) {
      return Result.fail(`${argumentName} is not within range ${min} to ${max}.`)

    } else {
      return Result.ok()
    }
  }

  public static allInRange(
    numbers: number[],
    min: number,
    max: number,
    argumentName: string
  ): Result<string> {
    let failingResult = null;
    for (const num of numbers) {
      const numIsInRangeResult = this.inRange(num, min, max, argumentName);
      if (numIsInRangeResult.isFailure) failingResult = numIsInRangeResult;
    }

    if (failingResult) {
      return Result.fail(`${argumentName} is not within the range.`)
    } else {
      return Result.ok()
    }
  }
}
