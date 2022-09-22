import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient{
    constructor(){
        super({
            datasources:{
                db:{
                    url: "postgresql://postgres:BeGayDoCrime@localhost:5434/devdb?schema=public"
                }
            }
        })
    }
}
