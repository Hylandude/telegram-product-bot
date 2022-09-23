import {IsOptional,IsNumber,IsString} from 'class-validator';
export class QueryProductDto {
    @IsOptional()
    user_id?:     string;

    @IsOptional()
    min_price?:   string;

    @IsOptional()
    max_price?:   string;

    @IsOptional()
    @IsString()
    name?:        string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    provider?:    string;
}