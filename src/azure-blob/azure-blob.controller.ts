import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { AzureBlobService } from './azure-blob.service';

@Controller('blobs')
export class AzureBlobController {
  constructor(private readonly azureBlobService: AzureBlobService) {}
  @Get('list')
  async listFiles() {
    const blobNames = await this.azureBlobService.listBlobs();
    return { blobNames };
  }

  @Get('download/:fileName')
  async downloadFile(
    @Param('fileName') fileName: string,
    @Res() res: Response,
  ) {
    const fileBuffer = await this.azureBlobService.downloadBlob(fileName);
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.send(fileBuffer);
  }
}
