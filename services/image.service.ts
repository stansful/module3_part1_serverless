import { Image, imageModel } from '@models/MongoDB/image.model';
import mongoose from 'mongoose';

export class ImageService {
  async getAll(options?: mongoose.QueryOptions): Promise<Image[]> {
    return imageModel.find({ belongsTo: null }, null, options);
  }

  async getByFileName(fileName: string): Promise<Image> {
    const image = await imageModel.findOne({ path: fileName });

    if (!image) {
      throw new Error('Image does not exist');
    }

    return image;
  }

  async create(imageEntity: Image): Promise<Image> {
    try {
      await this.getByFileName(imageEntity.path);
    } catch (e) {
      const image = await imageModel.create({ ...imageEntity });
      return image.save();
    }
    throw new Error('Image already exist');
  }
}
