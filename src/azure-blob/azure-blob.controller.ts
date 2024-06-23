import { Controller, Get } from '@nestjs/common';
import { AzureBlobService } from './azure-blob.service';

@Controller('blobs')
export class AzureBlobController {
  constructor(private readonly azureBlobService: AzureBlobService) {}
  @Get('list')
  async listFiles() {
    const blobNames = await this.azureBlobService.listBlobs();
    return { blobNames };
  }
}
