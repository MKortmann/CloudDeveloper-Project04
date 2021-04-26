// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'a2g2fkmx3i'
export const apiEndpoint = `https://${apiId}.execute-api.eu-central-1.amazonaws.com/dev`

// first test with symmetric HS256
export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-oeeh6hdb.eu.auth0.com',            // Auth0 domain
  clientId: '6B8W3fvgZNitn0fnHw6brQW0sOgNNTni',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
