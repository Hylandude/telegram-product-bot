import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TelegramCommandService {

    constructor(
        private prisma:PrismaService, 
        private httpService: HttpService){}

    async search(params:string[]){
        //Check for value in name param
        let product_name:string = params[0]
        if(!product_name){
            return{
                success: false,
                error: "<producto> no puede ser vacio"
            }
        }

        return{
            success: true,
            resource: "Buscando un: "+product_name
        }
    }

    async subscribe (params:string[]) {
        //Check for value in name param
        let product_name:string = params[0];
        if(!product_name){
            return{
                success: false,
                error: "<producto> no puede ser vacio"
            }
        }
        
        //Check for value and data type in price param
        let product_price:number = parseFloat(params[1]);
        if(!product_price){
            return{
                success: false,
                error: "<precio> no puede ser vacio"
            }
        }
        return{
            success: true,
            resource: "Buscando un: "+product_name+" con precio menor a "+product_price
        }


        
    }
}
