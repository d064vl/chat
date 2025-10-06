import { Type } from "class-transformer";
import { IsString, IsNumber, IsDate, IsBoolean, IsOptional, MaxLength, IsEmail } from "class-validator";

export class removeChatDto {
    @IsOptional()
    @IsString()
    id: string;

    @IsString()
    chat: string;
}