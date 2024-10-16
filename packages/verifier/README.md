<img src="https://trace4eu.eu/wp-content/uploads/2023/09/Logo_TRACE4EU_horizontal_positive_RGB.png" width="250" alt="TRACE4EU Logo">

# VERIFIER API

## Table of contents

* [Overview](#overview)
* [Presentation Flows](#presentation-flows)
* [How to build and run](#how-to-build-and-run)
* [Endpoints](#endpoints)
* [Configuration](#configuration)

## Overview

This a Web application (Backend Restful service) that acts as a Verifier/RP trusted end-point.
The Verifier API is based on [OIDC4VP draft version 20](https://openid.net/specs/openid-4-verifiable-presentations-1_0-20.html). The ID Token is also supported according to [SIOPv2](https://openid.github.io/SIOPv2/openid-connect-self-issued-v2-wg-draft.html).  
The following operations are supported:
- `Initialize a presentation`, where Verifier may define whether it wants to request a SIOP (id_token) or OpenID4VP (vp_token).
- `Get Request Object` according JWT Secured Authorization Request.
- `Get Presentation Definition` according to OpenId4VP in case of using presentation_definition_uri.
- `Direct Post` according to OpenID4VP direct_post
- `Get Wallet response`, where Verifier receives depending on the request an id_token, vp_token, or an error.
An Open API v3 specification of these operations is available

**Please note that**
- All APIs should be exposed over HTTPS.
- These endpoints: `Initialize a presentation` and `Get Wallet response`, needs to protected to allow only authorized access. These two endpoints should only be called internally by the Verifier. The wallet is not going to call those endpoints so that public access is not needed for those. 

This library has been used for validating the presentations (https://www.npmjs.com/package/@trace4eu/verifiable-presentation). This source code of this library is [here](../verifiable-presentation).

## Presentation flows

Regarding the `Response Mode`, it is only supported the mode `direct_post`. It is based on this diagram:   
https://openid.net/specs/openid-4-verifiable-presentations-1_0-20.html#name-response-mode-direct_post-2

It means that two flows have been implemented depending on whether the `redirectUri` has been informed when initializing the presentation (see [Endpoints](#endpoints)).  
Not informing the redirectUri could make sense in a cross device flow, and informing it in a same device flow. For that reason we present the two possible scenarios:

### Same device
```mermaid
sequenceDiagram    
    participant UA as User Agent
    participant W as Wallet
    participant V as Verifier(Use case component)
    participant VE as Verifier Endpoint (Verifier Umbrella Architecture component)
    UA->>V: Trigger presentation 
    
    V->>+VE: Initiate transaction
    VE-->>-V: Authorization request as request_url
    
    V->>UA: Render request as deep link
    UA->>W: Trigger wallet and pass request
    
    W->>+VE: Get authorization request via request_uri 
    VE-->>-W: authorization_request
    
    W->>W: Parse authorization request
    
    W->>+VE: Get presentation definition 
    VE-->>-W: presentation_definition
    
    W->>W: Prepare response     
    
    W->>+VE: Post vp_token response 
    VE->>VE: Validate response and prepare response_code
    VE-->>-W: Return redirect_uri with response_code
    
    W->>UA: Refresh user agent to follow redirect_uri
    UA->>V: Follow redirect_uri passing response_code
    
    V->>+VE: Get wallet response passing response_code 
    VE->>VE: Validate response_code matches wallet response
    VE-->>-V: Return wallet response
    
    V->>UA: Render wallet response 
```


### Cross device
```mermaid
sequenceDiagram    
    participant UA as User Agent
    participant W as Wallet
    participant V as Verifier(Use case component)
    participant VE as Verifier Endpoint (Verifier Umbrella Architecture component)
    UA->>V: Trigger presentation 
    
    V->>+VE:  Initiate transaction
    VE-->>-V: Authorization request as request_url
    
    V->>UA: Render request as QR Code

    loop
    V->>+VE: Get wallet response
    VE-->>-V: Return wallet response
    Note over V,VE: Verifier starts polling Verifier Endpoint for Wallet Response
    end

    UA->>W: Scan QR Code, trigger wallet, and pass request
    
    W->>+VE: Get authorization request via request_uri 
    VE-->>-W: authorization_request
    
    W->>W: Parse authorization request
    
    W->>+VE: Get presentation definition 
    VE-->>-W: presentation_definition
    
    W->>W: Prepare response     
    
    W->>+VE: Post vp_token response 
    VE->>VE: Validate response

    loop
    V->>+VE: Get wallet response
    VE-->>-V: Return wallet response
    end
    
    V->>UA: Render wallet response
```

## How to build and run

## Endpoints

## Configuration
