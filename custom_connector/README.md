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
* refresh url: https://login.microsoftonline.com/<tenant>/oauth2/v2.0/authorize
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