import { Type } from "class-transformer";
import { IsString, IsOptional, IsDate, IsBoolean, IsEmail } from "class-validator";

export class updateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @IsOptional()
    password: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    date: Date;
}