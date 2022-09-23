import {IsNotEmpty,IsString} from 'class-validator';
export class CreateTelegramDto {
    @IsNotEmpty()
    @IsString()
    username: string

    @IsNotEmpty()
    @IsString()
    token:    string

    @IsNotEmpty()
    @IsString()
    bot_id:   string
}