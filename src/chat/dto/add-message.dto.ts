import { Type } from "class-transformer";
import { IsString, IsNumber, IsDate, IsBoolean, IsOptional, MaxLength, IsEmail } from "class-validator";

export class addMessageDto {
    @IsOptional()
    @IsString()
    id: string;

    @IsString()
    chat: string;

    @IsString()
    @MaxLength(200, {
        message: 'message is too long',
    })
    message: string;
}