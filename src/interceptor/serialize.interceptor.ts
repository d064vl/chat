import { CallHandler, ExecutionContext, Injectable, NestInterceptor, UseInterceptors } from '@nestjs/common';
import { Observable } from 'rxjs';
import{ map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

// custom decorator
export function Serialize(dto: any) {
  return UseInterceptors(new SerializeInterceptor(dto))
}   

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('serialize interceptor before the hadler');
    
    return next.handle().pipe(
      map((data: any) => {
        console.log('interceptor handle', data, this.dto);
        return plainToInstance(this.dto, data, { excludeExtraneousValues: true });
      }))
    ;
  }
}
