import { MercadoLibre, Product } from '.prisma/client';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { env } from 'process';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CronService {
    constructor(
        private prisma:PrismaService,
        private httpService:HttpService){}

    async serchMercadoLibre(mercadolibre:MercadoLibre, provided_product:Product){
        //search product in mercado libre
        let mercado_options = {
            headers:{Authorization: `Bearer ${mercadolibre.access_token}`},
            params:{
                q: provided_product.name
            }
        }
        let mercado_answer = await this.httpService.axiosRef.get(env.MERCADO_LIBRE_API+"sites/MLM/search", mercado_options);
        
        //check if there is one below expected price
        for(let product of mercado_answer.data.results){
            if(product.price <= provided_product.price){
                //update product
                let result = await this.prisma.product.update({
                    where:{product_id: provided_product.product_id},
                    data:{
                        description: product.title,
                        image_url: product.thumbnail,
                        product_url: product.permalink,
                        price: product.price
                    }
                });
                return {success: true, resource: result}
            }
        }
        return {success: false}
    }

    @Cron(CronExpression.EVERY_HOUR)
    async handleCronMercadoLibre() {
        //check telegram and mercadolibre are available
        let mercadolibre = await this.prisma.mercadoLibre.findFirst();
        let telegram = await this.prisma.telegram.findFirst();
        if(!mercadolibre || !telegram){
            console.log("SIN DATOS MERCADO LIBRE O TELEGRAM");
            return
        }

        //search products that have not been updated with product_url
        let mercado_products = await this.prisma.product.findMany({
            where:{
                provider: "mercadolibre",
                product_url: ""
            }
        });

        //go through each and check if there's an available promotion
        for(let mercado_product of mercado_products){
            let promofound = await this.serchMercadoLibre(mercadolibre, mercado_product);
            if(promofound.success){
                //find user by id saved in product
                let user = await this.prisma.user.findUnique({where:{user_id:mercado_product.user_id}});
                if(!user) continue;

                //send message and media to notify user
                let mercadoMessage = `Hola! Estuve buscando y encontré una oferta para ti en mercadolibre!
                Nombre: ${promofound.resource.name}
                descripcion: ${promofound.resource.description}
                precio: ${promofound.resource.price}
                url: ${promofound.resource.product_url}`
                let telegram_message = {
                    chat_id: user.phone_number,
                    text: mercadoMessage,
                }
                let telegram_api_url = "https://api.telegram.org/bot"+telegram.token+"/sendMessage";
                this.httpService.axiosRef.post(telegram_api_url, telegram_message);
                let telegram_media = {
                    chat_id: user.phone_number,
                    photo: promofound.resource.image_url,
                }
                telegram_api_url = "https://api.telegram.org/bot"+telegram.token+"/sendPhoto";
                this.httpService.axiosRef.post(telegram_api_url, telegram_media);
            }
        }
    }
}
