import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/all-exception.filter';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { LoggerMiddleware } from './middleware/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // global middleware
  app.use(LoggerMiddleware);
  
  // intercept any other error
  const adapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(adapterHost));
   // intercept http errors
   app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(8081);
}
bootstrap();
