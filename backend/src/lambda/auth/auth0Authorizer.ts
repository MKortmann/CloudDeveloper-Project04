// works only in linux environment, if you do this in windows you will need the following import
// import { APIGatewayTokenAuthorizerEvent, APIGatewayAuthorizerResult, APIGatewayAuthorizerHandler } from 'aws-lambda'

// we will not use IAM authentication or AmazonCognito & Cognito Federated Idnetity
// WE WILL USE A CUSTOM AUTHORIZER: it is basically a Lambda function that is executed before a processing a request

import { CustomAuthorizerEvent, CustomAuthorizerHandler, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'
// import Axios from 'axios'

// import { verify, decode } from 'jsonwebtoken'
import { verify } from 'jsonwebtoken'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

// import { createLogger } from '../../utils/logger'

// const logger = createLogger('auth');
// const axios = require('axios');

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
// const jwksUrl = 'https://dev-oeeh6hdb.eu.auth0.com/.well-known/jwks.json'

export const handler: CustomAuthorizerHandler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {

  try {
    // we first call the verifyToken function and pass the token that we need to verify.
    const jwtToken = await verifyToken(event.authorizationToken)

    console.log('User was authorized')

    // if the verifyToken does not throw any expection we will return the policy for
    // API Gateway
    return {
      principalId: jwtToken.sub,
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


async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  // const jwt: Jwt = decode(token, { complete: true }) as Jwt

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
    // if we do not have an authentication header
  // const cert = await axios.get(jwksUrl);
  const cert = `-----BEGIN CERTIFICATE-----
  MIIDDTCCAfWgAwIBAgIJYfwAsKroa5QnMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
  BAMTGWRldi1vZWVoNmhkYi5ldS5hdXRoMC5jb20wHhcNMjEwNDEwMTY0MTE1WhcN
  MzQxMjE4MTY0MTE1WjAkMSIwIAYDVQQDExlkZXYtb2VlaDZoZGIuZXUuYXV0aDAu
  Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAq2HjYPnk1hYuYq9a
  YqPYVndEuJ23MTaEY4to2oV3RkYpkSVwr6jcI8MdxrQFOGkugDXSb19RwdYtfGDR
  eo1gRp9Esx/ZV+RCDGFOtKf70x5ttqb9TaFt80bIQy+zRBtdqRl/AgRA9aV4TGCf
  LNMoAQ4ojCwoIEkqjGo1nR83yEzHt3osaI7iI6E3w4vx9CZ8ZiNudV6wIu9qSxsn
  DG3nPO41aCIq54/BAMQrCt8krlskpLsxD/+E0Er87vDgqM638dF2LM8V1LCk1xxu
  QdyHd8HTDpOOJsHODycgFom9rFZgBjF65MjIEE4+U61d0kpb7ByIIY1wEdfQTA8P
  s/0abQIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBSPfwzqhxv1
  h0tWP7tiwT1JYneOgDAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
  AAygdKvF78lqQ2EWP5/MZ/rWjo44/7LIKFH040M8nU2Vqb2XHn73U/x9tmbzWeyT
  D7XH/KKuzCOGiZ0RYqkSzJAsF5YGroOWFOu7iNlk09LVZjUEvJoxZ3gqucnP0mfd
  6h4/3IB9IlEHOebybj0hO96/XAVLA621uGJOUgXh47YtmejlRfKpISeHtV1AOFxX
  JMzIw06OF6cMUGSGrhOVFjYjqzafycBHw1TIzhTYAtxR/tZ/Sgqf1A+hcXHv2KdE
  1fZQsbPovRDbivDuCdP9su/SAujb1rJTlU+21h9UsOMxDfNtVGD0Nx8QfOT/mh9p
  l/sU6e+vUKY8RmPPoswoD8Y=
  -----END CERTIFICATE-----`

  // verify the function and return the result as JwtToken (cast operation)
  return verify(token, cert, {algorithms: ['RS256']}) as Jwt["payload"]
  // no error, so a request has been authorized

}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
