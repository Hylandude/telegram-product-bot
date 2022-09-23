import {IsOptional,IsString} from 'class-validator';
export class QueryUserDto {

    @IsOptional()
    @IsString()
    name?:         string;

    @IsOptional()
    @IsString()
    phone_number?: string;

}