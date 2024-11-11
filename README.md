<img src="https://trace4eu.eu/wp-content/uploads/2023/09/Logo_TRACE4EU_horizontal_positive_RGB.png" width="250" alt="TRACE4EU Logo">

# vc-and-digital-twin

## Issuer
Go [here](./packages/issuer) for VC Issuance following OID4VCI with pre-authorized code flow:
- authorization server runs on port: 3001 and issuer on port 3000
- depending on the use case, [authorization server](./packages/authorization-server) must be adapted, which possibly requires adaption of the [auth guard](./packages/issuer/src/auth.guard.ts) in the issuer service since it calls ``verifyTokenAccess`` endpoint of the authorization server.

## Verifier
Go [here](./packages/verifier)
