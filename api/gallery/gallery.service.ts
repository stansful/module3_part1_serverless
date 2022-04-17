import { HttpInternalServerError } from '@floteam/errors';
import { ImageService } from '@services/image.service';
import { MongoDatabase } from '@services/mongoose';
import fs from 'fs/promises';
import path from 'path';
import * as uuid from 'uuid';
import { MultipartFile } from 'lambda-multipart-parser';
import { MetaDataService } from '@services/meta-data.service';

export class GalleryService {
  private readonly imageService: ImageService;
  private readonly mongoDB: MongoDatabase;
  private readonly picturesPath = path.resolve(__dirname, '..', '..', '..', '..', 'static', 'pictures');

  constructor() {
    this.imageService = new ImageService();
    this.mongoDB = new MongoDatabase();
  }

  public async getPictures(limit: number, skip: number, uploadedByUser: boolean) {
    try {
      await this.mongoDB.connect();

      if (uploadedByUser) {
        // TODO: add for user._id
        return this.imageService.getAll({ skip, limit });
      }
      return this.imageService.getAll({ skip, limit });
    } catch (error) {
      throw new HttpInternalServerError('Cant send pictures...', error.message);
    }
  }

  public async uploadPicture(picture: MultipartFile): Promise<void> {
    const newPictureName = (uuid.v4() + '_' + picture.filename).toLowerCase();
    const metadata = await MetaDataService.getExifMetadata(picture.content);

    try {
      await this.mongoDB.connect();
      await fs.writeFile(path.join(this.picturesPath, newPictureName), picture.content);

      // TODO: add belongsTo
      await this.imageService.create({ path: newPictureName, metadata, belongsTo: null });
    } catch (error) {
      throw new HttpInternalServerError('Upload failed...', error.message);
    }
  }
}
