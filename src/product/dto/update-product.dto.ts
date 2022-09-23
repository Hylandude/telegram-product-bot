import {IsOptional,IsNumber,IsString, IsUrl} from 'class-validator';
export class UpdateProductDto {

    @IsOptional()
    @IsNumber()
    price?:       number;

    @IsOptional()
    @IsString()
    name?:        string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    @IsUrl()
    image_url?:   string;

    @IsOptional()
    @IsString()
    @IsUrl()
    product_url?: string;

    @IsOptional()
    @IsString()
    provider?:    string;
}