import { Type } from "class-transformer";
import { IsString, IsNumber, Min } from "class-validator";

export class getMessageDto {
    @IsString()
    chat: string;

    @IsNumber()
    @Type(() => Number)
    @Min(0)
    page: number;
    
    @IsNumber()
    @Type(() => Number)
    @Min(1)
    limit: number;
}