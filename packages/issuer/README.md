# Issuer server
## How to set up default issuer and authorization server
1. Install packages of issuer server by running `npm install` in terminal while being in the folder `issuer`
2. Start issuer server on port 3000 by running `npm start` in terminal while being in the folder `issuer`
3. Open another terminal and move to foler ``authorization-server`` by running `cd ./packages/authorization-server`
4. Install packages of authorization server by running `npm install` in terminal while being in the folder `authorization-server`
5. Start authorization server on port 3001 by running `npm start` in terminal while being in the folder `authorization-server`
6. Optionally: adapt the authorization and issuer server for specific use case

## How to use Swagger for issuing VC using pre-authorization flow
1. Customize issuer and authentication server to use case or keep default 
2. Define use case specific credential configurations in `credential-configuration.ts`
3. Run issuer and authentication server by following this [guide](#how-to-set-up-default-issuer-and-authorization-server)
4. Issue VC using pre-authorized code flow
  1. POST: `offer` of `issuer`
    - input: {"credentialSubject": any object, "type": [any string values], "user_pin": "1234"}
    - returns: credential offer id (= uuid at the end of `rawCredentialOffer` string value)
  2. GET: `credential-offer/:id` of `issuer`
    - input: credential offer id as param `id`
    - returns: various information, inclduing the pre-authorization code under attribute `pre-authorized_code` of `grants` 
  3. POST: `token` of `authorization server`
    - input: {"client_id": chose random string value, "pre_authorized_code": see endpoint before, "user_pin": "1234"} as body
    - returns: access token as attribute ``access_token``
  4. POST: `credential` of `issuer`
    - headers: authorization set to ``access_token`` (see endpoint before)
    - input: proof in JWT with subject's DID as value of attribute `iss`
    - returns: credential

## How does OID4VCI with pre-authorization code flow work for user with wallet?
1. user triggers issuer to call `offer` endpoint, which returns credential offer URI
2. credential offer URI is scanned by user via its wallet
3. wallet calls two endpoints of issuer server: `credential-offer/:id` and `.well-known/openid-credential-issuer`
4. wallet uses information from `.well-known/openid-credential-issuer` endpoint to start interaction with authorization server, i. e. wallet calls two endpoints of authorization server: `authorize` and `.well-known/openid-configuration`
5. wallet calls `token` endpoint of authorization server to get access token following pre-authorization code flow
6. wallet calls `credential` endpoint of issuer server to obtain the VCs as defined in `offer` endpoint in the beginning of this process description (after successful input of user_pin by user the wallet gets the VCs). 
7. wallet calls `.well-known/openid-configuration` endpoint of authorization server
8. wallet calls `jwks` endpoint of authorization server

**NOTE**: This workflow is based on the author's experience using the issuer and authorization server in production with [grant.io's Data Wallet](https://igrant.io/datawallet.html).

## To discuss:
- how to generalize CredenitalSubject schema? --> instructions for trace4eu use cases are needed so that they can simply define their VCs structure (e.g. in a dedicated folder such as credential-configurations.ts)
