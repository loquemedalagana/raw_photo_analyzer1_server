import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';

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
}
