# Gitcoin Analytics Snap Server
This is a simple server to serve Metamask's Gitcoin Analytic Snap. It manages the API calls to Gitcon Passport APIs.

## Development instructions
- yarn install
- mv `.env.example` `.env`
- add your environment variables. You need:
  - Gitcoin Passport **API key**
  - Gitcoin Passport **BASE URL**
  - Gitcoin Passport **Scorer ID**
- yarn dev

## Production
- yarn build
- yarn start