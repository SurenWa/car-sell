import {
    Body,
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Param,
    Query,  
    NotFoundException,
    Session,
    UseGuards
    //UseInterceptors
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { CurrentUser } from './decorators/current-user.decorator';
//import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';

@Controller('auth')
@Serialize(UserDto)
//@UseInterceptors(CurrentUserInterceptor)
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService  
    ) { }


    // //session example
    // //set session
    // @Get('/colors/:color')
    // setColor(@Param('color') color: string, @Session() session: any) {
    //     session.color = color;
    // }

    // //get session
    // @Get('/colors')
    // getColor(@Session() session: any) {
    //     return session.color;
    // }

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        //console.log(body)
        const user = await this.authService.signup(body.email, body.password);
        session.userId = user.id
        return user;
    }

    @Post('/signin')
    async signin(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signin(body.email, body.password);
        session.userId = user.id
        return user;
    }

    @Get('/current-user')
    @UseGuards(AuthGuard)
    currentuser(@CurrentUser() user: User) {
        return user;
    }


    @Post('/signout')
    signOut(@Session() session: any) {
        session.userId = null
    }


    //@UseInterceptors(new SerializeInterceptor(UserDto))
    //@Serialize(UserDto)
    //'auth/1232323' Nest naturally parses it to number
    @Get('/:id')
    async findUser(@Param('id') id: string) {
        console.log('Handler is running')
        const user = await this.usersService.findOneUser(parseInt(id));
        if(!user) {
            throw new NotFoundException('User not found')
        }
        return user;
    }

    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.usersService.findAllUsers(email);
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this.usersService.removeUser(parseInt(id))
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.usersService.updateUser(parseInt(id), body)
    }
}
