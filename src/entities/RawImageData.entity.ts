import { promisify } from 'util';
import { exiftool, Tags } from 'exiftool-vendored';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);

export class RawImageDataEntity {
  width: number;
  height: number;
  metadata: Tags;
  buffer: Buffer;
  constructor(buffer: Buffer) {
    this.buffer = buffer;
  }

  async init() {
    this.metadata = await this.getMetadataFromBuffer();
    this.width = this.metadata.ImageWidth;
    this.height = this.metadata.ImageHeight;
    console.log(`Width: ${this.width}, Height: ${this.height}`);
  }

  private async getMetadataFromBuffer() {
    // Create a unique temporary file path
    const tempFilePath = path.join(os.tmpdir(), `temp_image_${Date.now()}.cr3`);

    try {
      // Write the buffer to the temporary file
      await writeFileAsync(tempFilePath, this.buffer);

      // Read metadata using exiftool
      return await exiftool.read(tempFilePath);
    } catch (error) {
      console.error('Error reading metadata:', error);
      throw error;
    } finally {
      // Clean up the temporary file
      await unlinkAsync(tempFilePath);
      await exiftool.end();
    }
  }
}
