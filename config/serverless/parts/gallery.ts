import { AWSPartitial } from '../types';

export const galleryConfig: AWSPartitial = {
  functions: {
    apiGalleryGetPictures: {
      handler: 'api/gallery/handler.getPictures',
      memorySize: 128,
      events: [
        {
          httpApi: {
            path: '/gallery',
            method: 'get',
          },
        },
      ],
    },
    apiGalleryUploadPicture: {
      handler: 'api/gallery/handler.uploadPictures',
      memorySize: 128,
      events: [
        {
          httpApi: {
            path: '/gallery',
            method: 'post',
          },
        },
      ],
    },
  },
};
