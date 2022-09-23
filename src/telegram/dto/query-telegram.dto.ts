import {IsOptional,IsString} from 'class-validator';
export class QueryTelegramDto {
    @IsOptional()
    @IsString()
    username?: string

    @IsOptional()
    @IsString()
    bot_id?:   string
}