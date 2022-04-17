import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { errorHandler } from '@helper/http-api/error-handler';
import { createResponse } from '@helper/http-api/response';
import { log } from '@helper/logger';
import { AuthManager } from './auth.manager';

const authManager = new AuthManager();

export const signIn: APIGatewayProxyHandlerV2 = async (event) => {
  log(event);

  try {
    const token = await authManager.signIn(event.body);

    return createResponse(200, { token });
  } catch (error) {
    return errorHandler(error);
  }
};

export const signUp: APIGatewayProxyHandlerV2 = async (event) => {
  log(event);

  try {
    const user = await authManager.signUp(event.body);

    return createResponse(201, user);
  } catch (error) {
    return errorHandler(error);
  }
};
