import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsDateAssignableToSlot(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isDateAssignableToSlot',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        ...validationOptions,
        message: 'Date does not match criteria',
      },
      validator: {
        validate(value: Date, args: ValidationArguments) {
          return (
            Number.isInteger(value.getMinutes() / 15) &&
            value.getMilliseconds() === 0
          );
        },
      },
    });
  };
}
