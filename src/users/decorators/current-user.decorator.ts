import { 
    createParamDecorator, 
    ExecutionContext 
} from '@nestjs/common';

export const CurrentUser = createParamDecorator(
    //Context is a wrapper around incoming request
    (data: never, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        //console.log(request.session.userId);
        return request.currentUser;
    }
)
