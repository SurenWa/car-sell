import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/user.entity';


//Go and find express library
//Find the interface named request inside there
//Add one more property to that interface 
declare global {
    namespace Express {
        interface Request {
            currentUser?: User
        }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(
        private usersService: UsersService
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const { userId } = req.session || {};

        if(userId) {
            const user = await this.usersService.findOneUser(userId);
            
            req.currentUser = user;
        }

        next()
    }
}