import { HttpBadRequestError } from '@floteam/errors';
import { MultipartRequest } from 'lambda-multipart-parser';
import { GalleryQueryParams } from './gallery.interfaces';
import { GalleryService } from './gallery.service';

export class GalleryManager {
  private readonly galleryService: GalleryService;

  constructor() {
    this.galleryService = new GalleryService();
  }

  public getPictures(query: GalleryQueryParams) {
    const requestPage = Number(query.page) || 1;

    if (requestPage < 1) {
      throw new HttpBadRequestError('Page does not exist');
    }

    const limit = Number(query.limit) || Number(process.env.DEFAULT_PICTURE_LIMIT) || 6;
    const skip = requestPage * limit - limit;
    const uploadedByUser = query.filter === 'true';

    return this.galleryService.getPictures(limit, skip, uploadedByUser);
  }

  public uploadPictures(pictures: MultipartRequest) {
    if (!pictures.files.length) {
      throw new HttpBadRequestError('File missing');
    }

    const picture = pictures.files[0];

    if (picture.contentType !== 'image/jpeg') {
      throw new HttpBadRequestError('Unfortunately we support only jpeg');
    }

    return this.galleryService.uploadPicture(picture);
  }
}
