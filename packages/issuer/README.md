<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

## How to set up default issuer and authentication server
1. ... TODO

## How to issue VC using pre-authorization flow
1. Customize issuer and authentication server to use case or keep default (see [here](#how-to-set-up-default-issuer-and-authentication-server))
2. Define use case specific credential configurations in `credential-configuration.ts`
3. Run issuer and authentication server
4. Issue VC using pre-authorized code flow
  1. POST: `issuer/offer`
    - input: none
    - returns: credential offer id
  2. GET: `issuer/credential-offer/:id`
    - input: credential offer id as param `id`
    - returns: issuer_state, pre-auht-code
  3. GET: `auth/authorize`
    - input: as query (see swagger???)
    - returns: redirect to: `${redirect_uri}?state=${state}&client_id=${client_id}&redirect_uri=${redirectURI}&response_type=${responseType}&response_mode=${responseMode}&scope=openid&nonce=${nonce}&request=${requestJar}`
  4. POST: `auth/direct_post`????
    - input:
    - returns: redirect to: `http://localhost:8080?code=${authorizationCode}&state=${state}` --> what is run on 8080 (issuer is on 7000 port and auth is on 7001)
  4. POST: `auth/token`???? TODO
  5. POST: `issuer/credential`???? TODO

## How does OID4VCI with pre-authorization code flow work?
1. user triggers issuer to call `offer` endpoint, which returns credential offer URI
2. credential offer URI is scanned by user via its wallet
3. wallet calls two endpoints of issuer service: `credential-offer/:id` and `.well-known/openid-credential-issuer`
4. wallet uses information from `.well-known/openid-credential-issuer` endpoint to start interaction with authorization service, i. e. wallet calls two endpoints of authorization service: `authorize` and `.well-known/openid-configuration`
5. wallet calls `token` endpoint of authorization server to get access token following pre-authorization code flow
6. wallet calls `credential` endpoint of issuer server to obtain the VCs as defined in `offer` endpoint in the beginning of this process description (after successful input of user_pin by user the wallet gets the VCs)
7. wallet calls `.well-known/openid-configuration` endpoint of authorization server
8. wallet calls `jwks` endpoint of authorization server

## To discuss:
- how to generalize CredenitalSubject schema? --> instructions for trace4eu use cases are needed so that they can simply define their VCs structure (e.g. in a dedicated folder such as credential-configurations.ts)
