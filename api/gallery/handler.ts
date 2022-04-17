import { errorHandler } from '@helper/http-api/error-handler';
import { createResponse } from '@helper/http-api/response';
import { log } from '@helper/logger';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { GalleryQueryParams } from './gallery.interfaces';
import { GalleryManager } from './gallery.manager';
import multipartParser from 'lambda-multipart-parser';

const galleryManager = new GalleryManager();

export const getPictures: APIGatewayProxyHandlerV2 = async (event) => {
  log(event);

  try {
    const query: GalleryQueryParams = {
      page: event.queryStringParameters?.page,
      limit: event.queryStringParameters?.limit,
      filter: event.queryStringParameters?.filter,
    };

    const pictures = await galleryManager.getPictures(query);

    return createResponse(200, pictures);
  } catch (error) {
    return errorHandler(error);
  }
};

export const uploadPictures: APIGatewayProxyHandlerV2 = async (event) => {
  log(event);

  try {
    // @ts-ignore
    const pictures = await multipartParser.parse(event);
    await galleryManager.uploadPictures(pictures);

    return createResponse(201, 'Picture uploaded');
  } catch (error) {
    return errorHandler(error);
  }
};
