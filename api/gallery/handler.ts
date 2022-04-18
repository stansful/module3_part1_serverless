import { HttpBadRequestError } from '@floteam/errors';
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
    // @ts-ignore
    const email = event.requestContext.authorizer.email;
    const pictures = await galleryManager.getPictures(query, email);

    return createResponse(200, pictures);
  } catch (error) {
    return errorHandler(error);
  }
};

export const uploadPicture: APIGatewayProxyHandlerV2 = async (event) => {
  log(event);
  try {
    if (event.headers['Content-Type'] !== 'multipart/form-data') {
      throw new HttpBadRequestError('Please, add content type');
    }

    // @ts-ignore
    const email = event.requestContext.authorizer.email;
    // @ts-ignore
    const pictures = await multipartParser.parse(event);

    await galleryManager.uploadPicture(pictures, email);

    return createResponse(201, 'Picture uploaded');
  } catch (error) {
    return errorHandler(error);
  }
};

export const uploadExistingPictures: APIGatewayProxyHandlerV2 = async (event) => {
  log(event);

  try {
    const response = await galleryManager.uploadExistingPictures();

    return createResponse(201, response);
  } catch (error) {
    return errorHandler(error);
  }
};
