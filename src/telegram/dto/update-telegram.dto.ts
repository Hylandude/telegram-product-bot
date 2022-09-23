import {IsOptional,IsString} from 'class-validator';
export class UpdateTelegramDto {
    @IsOptional()
    @IsString()
    username?: string

    @IsOptional()
    @IsString()
    token?:    string

    @IsOptional()
    @IsString()
    bot_id?:   string
}