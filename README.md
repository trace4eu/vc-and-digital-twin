<img src="https://trace4eu.eu/wp-content/uploads/2023/09/Logo_TRACE4EU_horizontal_positive_RGB.png" width="250" alt="TRACE4EU Logo">

# vc-and-digital-twin

## For VC Issuance following OID4VCI with pre-authorized code flow:
- authorization server runs on port: 3001, issuer on port 3000, and client on port 8080
- depending on the use case, authorization server must be adapted. Based on use case specific changes of authorization server, the auth guard in issuer which calles ``verifyTokenAccess`` endpoint must be adapted.
