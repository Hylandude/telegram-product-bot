import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MercadolibreService {

  constructor(
    private prisma:PrismaService, 
    private httpService: HttpService){}

  token(body:any, query:any) {
    console.log("BODY")
    console.log(JSON.stringify(body));
    console.log("QUERY")
    console.log(JSON.stringify(query));
    return true;
  }

  async refreshToken(){
    let mercados = await this.prisma.mercadoLibre.findMany();
    for(let mercado of mercados){
      mercado.access_token
    }
  }
}
