import {
  APIGatewayAuthorizerResult,
  APIGatewayProxyHandlerV2,
  APIGatewayTokenAuthorizerWithContextHandler,
} from 'aws-lambda';
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

export const uploadDevUsers: APIGatewayProxyHandlerV2 = async (event) => {
  log(event);

  try {
    await authManager.uploadDevUsers();

    return createResponse(201, 'Dev users uploaded');
  } catch (error) {
    return errorHandler(error);
  }
};

export const authenticate: APIGatewayTokenAuthorizerWithContextHandler<Record<string, any>> = async (event) => {
  log(event, '\n\n auth event! \n\n');

  try {
    const candidate = await authManager.authenticate(event.authorizationToken);

    return generatePolicy('user', 'Allow', '*', { email: candidate.email });
  } catch (error) {
    return generatePolicy('user', 'Deny', '*', {});
  }
};

export function generatePolicy<C extends APIGatewayAuthorizerResult['context']>(
  principalId: string,
  effect: 'Allow' | 'Deny',
  resource: string,
  context: C
): APIGatewayAuthorizerResult & { context: C } {
  const authResponse: APIGatewayAuthorizerResult & { context: C } = {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
    context,
  };

  return authResponse;
}
