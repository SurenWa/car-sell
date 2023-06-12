import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        //create a fake copy of the users service
        const users: User[] = [];

        fakeUsersService = {
            findAllUsers: (email: string) => {
                const filteredUsers = users.filter(user => user.email === email);
                return Promise.resolve(filteredUsers)
            },
            create: (email: string, password: string) => {
                const user = {
                    id: Math.floor(Math.random() * 999999),
                    email,
                    password
                } as User
                users.push(user)
                return Promise.resolve(user);
            },
        }

        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                }
            ]
        }).compile()

        service = module.get(AuthService);
    });

    it('can create an instance of auth service', async () => {
        expect(service).toBeDefined();
    })

    it('creates a new user with salted and hashed password', async () => {
        const user = await service.signup('spec@spec.com', '12345566');

        expect(user.password).not.toEqual('12345566');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    })

    it('throws an error if user signs up with email that is in use', async () => {
        // fakeUsersService.findAllUsers = () =>
        //     Promise.resolve([{ id: 1, email: 'test@test.com', password: '1' } as User]);
        await service.signup('test1@test22.com', 'asdff')

        expect(async () => {
            const email = 'test1@test22.com';
            const password = 'asdf';
            await service.signup(email, password);
        }).rejects.toThrow(BadRequestException);
    });

    it('throws an error if user signs in with unused email', async () => {
        
        expect(async () => {
            await service.signin('test@test.com', 'password');
        }).rejects.toThrow(NotFoundException);
    });

    it('throws if an invalid password is provided', async () => {
        // fakeUsersService.findAllUsers = () =>
        //     Promise.resolve([{ id: 1, email: 'test@test.com', password: '123456' } as User]);
        await service.signup('test1@test1.com', 'password')
        expect(async () => {
            await service.signin('test1@test1.com', 'password11');
        }).rejects.toThrow(BadRequestException);
    })

    it('returns a user if correct password is provided', async () => {
        await service.signup('test@test.com', 'password')
        const user = await service.signin('test@test.com', 'password');
        //console.log(user);
        expect(user).toBeDefined();
    })

});
