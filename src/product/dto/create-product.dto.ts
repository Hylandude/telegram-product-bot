import {IsNotEmpty,IsNumber,IsString, IsUrl} from 'class-validator';
export class CreateProductDto {
    @IsNotEmpty()
    @IsNumber()
    user_id:     number;

    @IsNotEmpty()
    @IsNumber()
    price:       number;

    @IsNotEmpty()
    @IsString()
    name:        string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    @IsUrl()
    image_url:   string;

    @IsNotEmpty()
    @IsString()
    @IsUrl()
    product_url: string;

    @IsNotEmpty()
    @IsString()
    provider:    string;
}