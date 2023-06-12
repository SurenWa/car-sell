import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';


@Injectable()  
export class UsersService {    
    constructor(@InjectRepository(User) private repo: Repository<User>) {}

    create(email: string, password: string) {
        const user = this.repo.create({ email, password });

        return this.repo.save(user)
    }

    findOneUser(id: number) {
        if(!id) {
            return null
        }
        return this.repo.findOneBy({
           id
        });
    }

    //get all users having same email
    findAllUsers(email: string) {
        return this.repo.find({
            // select: {
            //     email: true
            // },
            where: {
                email: email
            }
        })
    }

    async updateUser(id: number, attrs: Partial<User>) {
        const user = await this.repo.findOne({
            where: {
                id: id  
            }
        });

        if(!user) {
            throw new NotFoundException('User not found')
        }

        Object.assign(user, attrs);
        return this.repo.save(user)
    }

    async removeUser(id: number) {
        const user = await this.repo.findOne({
            where: {
                id: id
            }
        });

        if(!user) {
            throw new NotFoundException('User not found')
        }

        return this.repo.remove(user)
    }
}
