import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AzureBlobService } from './azure-blob/azure-blob.service';
import { AzureBlobController } from './azure-blob/azure-blob.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, AzureBlobController],
  providers: [AppService, AzureBlobService],
})
export class AppModule {}
