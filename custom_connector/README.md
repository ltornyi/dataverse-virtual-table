# Custom connector

## Create app registration for custom connector

New app registration

* single tenant
* redirect URI: web: https://global.consent.azure-apim.net/redirect
* copy client id, it will be needed to register the custom connector
* Add API permission to use the function app, the auto-created scope is fine.
* Create a client secret and copy the value, it will be needed to register the custom connector

You might have to come back and update the redirect URI when you create the custom connector

## Create custom connector

### General
* Host: <your funcion app endpoint>.azurewebsites.net
* base URL: /api

### Security

* client id
* client secret
* auth url: https://login.microsoftonline.com/<tenant>/oauth2/v2.0/authorize
* token url: https://login.microsoftonline.com/<tenant>/oauth2/v2.0/token
* refresh url: https://login.microsoftonline.com/<tenant>/oauth2/v2.0/token
* scope: the scope of the function app registration

### Definition

Define actions, requests and responses manually. Example requests and responses help a lot.

Define a policy
* name: Set api key in header
* template: set http header
* header name: x-functions-key
* header value: <function app host key>
* run policy on: request

Hit save, create connection on test tab and test.

## Create canvas app, based on custom connector

During development, the maker creates a connection using his/her identity. When the canvas app
is shared with other users, they will need to use their own identity for the connection.

Power FX syntax

to call the API:
  <connection>.<Action>({field1: value1, field2: value2})

The value returned is a record structured according to the response definition.

## Token flow using the custom connector on the test page in the Power Automate portal

1. End-user consents to the app registration representing the custom connector getting an access token for the scope of the function app registration. This access token is not visible anywhere.
2. This access token is exchanged using OBO for an access token to allow the Microsoft Flow Portal impersonate the connection user; the audience of this token is Azure API management ("https://apihub.azure.com") and scope is user_impersonation.
3. This access token is used to call the endpoint exposed through APIM. The endpoint corresponds to the action of the custom connector.
4. APIM exchanges this token for another using OBO to allow the custom connector to call the function app endpoint;
the audience of this token is the api represented by the app registration of the function app and scope is the requested scope.
5. This final token is passed to the function.