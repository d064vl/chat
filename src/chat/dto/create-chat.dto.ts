import { Type } from "class-transformer";
import { IsString, IsNumber, IsDate, IsBoolean, IsOptional, MaxLength, IsEmail } from "class-validator";

export class createChatDto {
    @IsOptional()
    @IsString()
    id: string;

    @IsOptional()
    @IsString()
    name: string;
}