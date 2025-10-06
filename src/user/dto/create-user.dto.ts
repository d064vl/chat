import { Type } from "class-transformer";
import { IsString, IsNumber, IsDate, IsBoolean, IsOptional, MaxLength, IsEmail } from "class-validator";

export class createUserDto {
    @IsEmail()
    @MaxLength(80, {
        message: 'Summary is too long',
    })
    email: string;

    @IsOptional()
    @IsString()
    password: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    date: Date;
}