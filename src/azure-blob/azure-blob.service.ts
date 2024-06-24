import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { Builder } from '@nestjs/cli/lib/configuration';

@Injectable()
export class AzureBlobService {
  private containerClient: ContainerClient;
  private readonly logger = new Logger(AzureBlobService.name);

  constructor(private configService: ConfigService) {
    const connectionString = configService.get(
      'AZURE_STORAGE_CONNECTION_STRING',
    );
    const containerName = configService.get('AZURE_STORAGE_CONTAINER_NAME');

    if (!connectionString || !containerName) {
      throw new Error(
        'Azure Storage connection string or container name is missing.',
      );
    }

    const blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
    this.containerClient = blobServiceClient.getContainerClient(containerName);
  }

  async listBlobs(): Promise<string[]> {
    const blobNames: string[] = [];

    for await (const blob of this.containerClient.listBlobsFlat()) {
      blobNames.push(blob.name);
    }

    this.logger.log(`Blobs listed successfully.`);
    return blobNames;
  }

  async downloadBlob(fileName: string): Promise<Buffer> {
    const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);
    const downloadBockBlobResponse = await blockBlobClient.download(0);
    const downloaded = await this.streamToBuffer(
      downloadBockBlobResponse.readableStreamBody,
    );
    this.logger.log(`Blob ${fileName} downloaded successfully.`);
    return downloaded;
  }

  private async streamToBuffer(
    readableStream: NodeJS.ReadableStream,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      readableStream.on('data', (data) => {
        chunks.push(data instanceof Buffer ? data : Buffer.from(data));
      });
      readableStream.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      readableStream.on('error', reject);
    });
  }
}
