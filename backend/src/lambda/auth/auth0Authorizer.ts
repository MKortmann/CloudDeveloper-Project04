// works only in linux environment, if you do this in windows you will need the following import
// import { APIGatewayTokenAuthorizerEvent, APIGatewayAuthorizerResult, APIGatewayAuthorizerHandler } from 'aws-lambda'

// we will not use IAM authentication or AmazonCognito & Cognito Federated Idnetity
// WE WILL USE A CUSTOM AUTHORIZER: it is basically a Lambda function that is executed before a processing a request

import {
	CustomAuthorizerEvent,
	CustomAuthorizerHandler,
	CustomAuthorizerResult
} from 'aws-lambda'
import 'source-map-support/register'
import Axios from 'axios'
import { verify, decode } from 'jsonwebtoken'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

import { createLogger } from '../../utils/logger'

const logger = createLogger('auth')

const jwksUrl = 'https://dev-oeeh6hdb.eu.auth0.com/.well-known/jwks.json'

export const handler: CustomAuthorizerHandler = async (
	event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
	try {
		// we first call the verifyToken function and pass the token that we need to verify.
		const jwtToken = await verifyToken(event.authorizationToken)

		logger.info('User was authorized', { jwtToken: jwtToken })

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
		logger.error('User was not authorized', { error: e.message })

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

// more info https://auth0.com/blog/navigating-rs256-and-jwks/

async function verifyToken(authHeader: string): Promise<JwtPayload> {
	const token = getToken(authHeader)
	// Decode the JWT
	const jwt: Jwt = decode(token, { complete: true }) as Jwt
	// get the kid property from the header
	const jwtKid = jwt.header.kid
	let cert: string | Buffer

	try {
		const jwks = await Axios.get(jwksUrl)
		// kid: is the unique identifier for the key
		const signing = jwks.data.keys.filter((k) => k.kid === jwtKid)[0]

		logger.info('signInKey', signing)

		if (!signing) {
			throw new Error(`Unable to find a signing key that matches '${jwtKid}'`)
		}
		// extract the x509 certificate chain
		const { x5c } = signing

		cert = `-----BEGIN CERTIFICATE-----\n${x5c[0]}\n-----END CERTIFICATE-----`
	} catch (error) {
		logger.error('Error While getting Certificate : ', error)
	}

	return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
}

function getToken(authHeader: string): string {
	if (!authHeader) throw new Error('No authentication header')

	if (!authHeader.toLowerCase().startsWith('bearer '))
		throw new Error('Invalid authentication header')

	const split = authHeader.split(' ')
	const token = split[1]

	return token
}
