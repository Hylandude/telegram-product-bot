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
        //request to mercado libre API
        let mercado_options = {
            headers:{Authorization: `Bearer ${mercadolibre.access_token}`},
            params:{
                q: product_name
            }
        }
        let mercado_answer = await this.httpService.axiosRef.get(env.MERCADO_LIBRE_API+"sites/MLM/search", mercado_options);
        
        //return first result if found
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

    async getAmazonProduct(product_name:string){
        //request to rainforest api
        let amazon_options = {
            params:{
                api_key: env.RAINFOREST_API_KEY,
                type: "search",
                amazon_domain: "amazon.com.mx",
                search_term: product_name
            }
        }
        let amazon_answer = await this.httpService.axiosRef.get(env.RAINFOREST_API_URL, amazon_options);

        //return first result if found
        type found_product = {
            name: string,
            description: string,
            image_url: string,
            product_url: string,
            price: string
        }
        let found_mercado:found_product;
        if(amazon_answer.data && amazon_answer.data.search_results && amazon_answer.data.search_results[0]){
            console.log(JSON.stringify(amazon_answer.data.search_results[0]));
            found_mercado = {
                name: product_name,
                description: amazon_answer.data.search_results[0].title,
                image_url: amazon_answer.data.search_results[0].image,
                product_url: amazon_answer.data.search_results[0].link,
                price: amazon_answer.data.search_results[0].price ? amazon_answer.data.search_results[0].price.value : "N/A"
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
        type found_product = {
            name: string,
            description: string,
            image_url: string,
            product_url: string,
            price: string
        }
        let found_mercado:found_product;
        if(mercadolibre){
            //search in mercado libre
            found_mercado = await this.getMercadoLibreProduct(mercadolibre, product_name);
        }

        //search in amazon
        let found_amazon = await this.getAmazonProduct(product_name);

        //return error if neither product is available
        if(!found_amazon && !found_mercado){
            return {
                success: false,
                error: "No pude encontrar el producto, intenta con otro nombre"
            }
        }

        //Build message string according to results
        let message:string;
        if(found_mercado && found_mercado.product_url){
            message = `Encontré este producto al buscar "${product_name}" en mercado libre
            Nombre: ${product_name}
            descripcion: ${found_mercado.description}
            precio: ${found_mercado.price}
            url: ${found_mercado.product_url}`
        }else{
            message = `No pude encontrar "${product_name}" en mercadolibre`
        }
        if(found_amazon && found_amazon.product_url){
            message += `\nEncontré este producto al buscar "${product_name}" en amazon
            Nombre: ${product_name}
            descripcion: ${found_amazon.description}
            precio: ${found_amazon.price}
            url: ${found_amazon.product_url}`
        }else{
            message += `\nNo pude encontrar "${product_name}" en amazon`
        }
        return{
            success: true,
            resource: {
                message: message,
                mercado_product: found_mercado,
                amazon_product: found_amazon
            }
        }
    }

    async subscribe (params:string[], user:User) {
        //Check for value in name param
        console.log("SUBSCRIBE");
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

        await this.prisma.product.create({
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
        await this.prisma.product.create({
            data:{
                user_id: user.user_id,
                price: product_price,
                name: product_name,
                description: "",
                image_url: "",
                product_url: "",
                provider: "amazon",

            }
        });
        console.log("PRODUCTS CREATED")
        return{
            success: true,
            resource: {
                message:`Listo! te notificare cuando encuentre un ${product_name} a un precio menor a ${product_price}`
            }
        }
    }
}
