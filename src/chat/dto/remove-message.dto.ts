import { Type } from "class-transformer";
import { IsString, IsNumber, IsDate, IsBoolean, IsOptional, MaxLength, IsEmail } from "class-validator";

export class removeMessageDto {
    @IsOptional()
    @IsString()
    id: string;

    @IsString()
    messageId: string;
    
    @IsString()
    chat: string;
}