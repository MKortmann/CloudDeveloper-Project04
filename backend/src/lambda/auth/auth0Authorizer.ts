// works only in linux environment, if you do this in windows you will need the following import
// import { APIGatewayTokenAuthorizerEvent, APIGatewayAuthorizerResult, APIGatewayAuthorizerHandler } from 'aws-lambda'

// we will not use IAM authentication or AmazonCognito & Cognito Federated Idnetity
// WE WILL USE A CUSTOM AUTHORIZER: it is basically a Lambda function that is executed before a processing a request

import { CustomAuthorizerEvent, CustomAuthorizerHandler, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

// import { verify, decode } from 'jsonwebtoken'
// import { createLogger } from '../../utils/logger'
// import Axios from 'axios'
// import { Jwt } from '../../auth/Jwt'
// import { JwtPayload } from '../../auth/JwtPayload'

// const logger = createLogger('auth')

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
// const jwksUrl = '...'

export const handler: CustomAuthorizerHandler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {

  try {
    // we first call the verifyToken function and pass the token that we need to verify.
    verifyToken(event.authorizationToken)

    console.log('User was authorized')

    // if the verifyToken does not throw any expection we will return the policy for
    // API Gateway
    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    console.log('User was not authorized', e.message)

    // if the user is not authorized, we return another police that will
    // deny access to any Lambda functions.
    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

// authHeader was send bei a client to apiGateway and passed to this function.
function verifyToken(authHeader: string) {
  // if we do not have an authentication header
  if (!authHeader)
    throw new Error('No authentication header')

  // if there is no the format expected
  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  // extract the token
  // split bei space symbol, we get an array of words
  const split = authHeader.split(' ')
  // the token is the second work in this split array
  const token = split[1]

  if(token !== '123') {
    throw new Error('Invalid token');
  }

  // no error, so a request has been authorized
}

// handler.use(
//   secretsManager({
//     awsSdkOptions: { region: 'us-east-1' },
//     cache: true,
//     cacheExpiryInMillis: 60000,
//     // Throw an error if can't read the secret
//     throwOnFailedCall: true,
//     secrets: {
//       AUTH0_SECRET: secretId
//     }
//   })
// )

// export const handler = async (
//   event: CustomAuthorizerEvent
// ): Promise<CustomAuthorizerResult> => {
//   logger.info('Authorizing a user', event.authorizationToken)
//   try {
//     const jwtToken = await verifyToken(event.authorizationToken)
//     logger.info('User was authorized', jwtToken)

//     return {
//       principalId: jwtToken.sub,
//       policyDocument: {
//         Version: '2012-10-17',
//         Statement: [
//           {
//             Action: 'execute-api:Invoke',
//             Effect: 'Allow',
//             Resource: '*'
//           }
//         ]
//       }
//     }
//   } catch (e) {
//     logger.error('User not authorized', { error: e.message })

//     return {
//       principalId: 'user',
//       policyDocument: {
//         Version: '2012-10-17',
//         Statement: [
//           {
//             Action: 'execute-api:Invoke',
//             Effect: 'Deny',
//             Resource: '*'
//           }
//         ]
//       }
//     }
//   }
// }

// async function verifyToken(authHeader: string): Promise<JwtPayload> {
//   const token = getToken(authHeader)
//   const jwt: Jwt = decode(token, { complete: true }) as Jwt

//   // TODO: Implement token verification
//   // You should implement it similarly to how it was implemented for the exercise for the lesson 5
//   // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
//   return undefined
// }

// function getToken(authHeader: string): string {
//   if (!authHeader) throw new Error('No authentication header')

//   if (!authHeader.toLowerCase().startsWith('bearer '))
//     throw new Error('Invalid authentication header')

//   const split = authHeader.split(' ')
//   const token = split[1]

//   return token
// }
