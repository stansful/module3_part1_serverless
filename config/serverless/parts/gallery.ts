import { AWSPartitial } from '../types';

export const galleryConfig: AWSPartitial = {
  provider: {
    httpApi: {
      authorizers: {
        jwtAuthorizerApi: {
          type: 'request',
          enableSimpleResponses: true,
          functionName: 'jwtAuthorizer',
          identitySource: '$request.header.Authorization',
        },
      },
    },
  },
  functions: {
    apiGalleryGetPictures: {
      handler: 'api/gallery/handler.getPictures',
      memorySize: 128,
      events: [
        {
          httpApi: {
            path: '/gallery',
            method: 'get',
            authorizer: { name: 'jwtAuthorizer' },
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
            authorizer: { name: 'jwtAuthorizer' },
          },
        },
      ],
    },
    jwtAuthorizer: {
      handler: 'api/auth/handler.authenticate',
      memorySize: 128,
    },
  },
};
