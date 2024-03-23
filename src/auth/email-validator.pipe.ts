import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { isEmail, isNumberString, isString } from "class-validator";

export class EmailValidatorPipe implements PipeTransform<String,String> {
    transform(value: string, metadata: ArgumentMetadata) {
        if(
            !isString(value) ||
            !isEmail(value)
        ) throw new BadRequestException('provide correct email')
        return value
    }
}