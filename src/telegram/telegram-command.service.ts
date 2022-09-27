import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../prisma/prisma.service';
import { env } from 'process';
import { MercadoLibre, User } from '@prisma/client';

@Injectable()
export class TelegramCommandService {

    constructor(
        private prisma:PrismaService, 
        private httpService: HttpService){}

    async getMercadoLibreProduct(mercadolibre:MercadoLibre, product_name:string){
        let mercado_options = {
            headers:{Authorization: `Bearer ${mercadolibre.access_token}`},
            params:{
                q: product_name
            }
        }
        let mercado_answer = await this.httpService.axiosRef.get(env.MERCADO_LIBRE_API+"sites/MLM/search", mercado_options);
        console.log(mercado_answer.data);
        type found_product = {
            name: string,
            description: string,
            image_url: string,
            product_url: string,
            price: string
        }
        let found_mercado:found_product;
        if(mercado_answer.data && mercado_answer.data.results && mercado_answer.data.results[0]){
            console.log(JSON.stringify(mercado_answer.data.results[0]));
            found_mercado = {
                name: product_name,
                description: mercado_answer.data.results[0].title,
                image_url: mercado_answer.data.results[0].thumbnail,
                product_url: mercado_answer.data.results[0].permalink,
                price: mercado_answer.data.results[0].price
            };
        }
        return found_mercado;
    }

    async search(params:string[], user:User){
        //Check for value in name param
        let product_name:string = params[0]
        if(!product_name){
            return{
                success: false,
                error: "<producto> no puede ser vacio"
            }
        }

        //check for mercadolibre api data
        let mercadolibre = await this.prisma.mercadoLibre.findFirst();
        if(!mercadolibre){
            return{
                success: false,
                error: "No se encontraron datos de mercado libre"
            }
        }

        //search in mercado libre
        let found_mercado = await this.getMercadoLibreProduct(mercadolibre, product_name);

        let message_mercado:string;
        if(found_mercado){
            message_mercado =   `Encontré este producto al buscar "${product_name}" en mercado libre
            Nombre: ${product_name}
            descripcion: ${found_mercado.description}
            precio: ${found_mercado.price}
            url: ${found_mercado.product_url}`
            return{
                success: true,
                resource: {
                    message: message_mercado,
                    mercado_product: found_mercado
                }
            }
        }else{
            return{
                success: false,
                error: "Producto No encontrado en mercado libre"
            }
        }
    }

    async subscribe (params:string[], user:User) {
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

        this.prisma.product.create({
            data:{
                user_id: user.user_id,
                price: product_price,
                name: product_name,
                description: "",
                image_url: "",
                product_url: "",
                provider: "mercadolibre",

            }
        });

        return{
            success: true,
            resource: `Listo! te notificare cuando encuentre un ${product_name} a un precio menor a ${product_price}`
        }


        
    }
}
