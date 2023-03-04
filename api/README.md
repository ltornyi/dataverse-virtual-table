# Function App for APIs

## Managing function app

This function app was created by running

    func init api --worker-runtime typescript
    mv api/.vscode .
    cd api

### Create example function

    func new --name hello --template "HTTP trigger" --authlevel "function"

### Run locally

    npm install
    npm start

The example endpoint is available as

    [GET,POST] http://localhost:7071/api/hello

### Create resource group, storage account and function app definition in Azure

    az group create \
    --name virtualtablepoc \
    --location westeurope

    az storage account create \
    --name virtualtablefuncappstor \
    --location westeurope \
    --resource-group virtualtablepoc \
    --sku Standard_LRS

    az functionapp create \
    --name virtualtable-funcapp \
    --resource-group virtualtablepoc \
    --storage-account virtualtablefuncappstor \
    --consumption-plan-location westeurope \
    --functions-version 4 \
    --os-type Linux \
    --https-only true \
    --runtime node \
    --runtime-version 16

### Deploy to Azure

    npm run build
    func azure functionapp publish virtualtable-funcapp

Becomes available at https://virtualtable-funcapp.azurewebsites.net/api/hello?code=... (app key is needed to run).
The api key can also be added as a custom HTTP header called "x-functions-key"

### List function app settings

    az functionapp config appsettings list \
        --name virtualtable-funcapp \
        --resource-group virtualtablepoc

## Set up integration with Azure AD

### Documentation

https://learn.microsoft.com/en-us/azure/app-service/overview-authentication-authorization
https://learn.microsoft.com/en-gb/azure/app-service/configure-authentication-provider-aad

You can automatically create an app registration or use an existing app registration.

### Auto-created app registration

The new app registration created has
* an application ID (client ID)
* client secret 
* redirect URI https://virtualtable-funcapp.azurewebsites.net/.auth/login/aad/callback
* MS Graph User.read API permission
* A scope to represent the access to the function app

The above process configured the function app, namely
* App Service authentication: enabled
* Token store: enabled
* Added an application setting named MICROSOFT_PROVIDER_AUTHENTICATION_SECRET that holds the client secret
* Configured the app registration, added the application id (client ID) and the issuer URL 

Fun fact: it still adds sts.windows.net (the v1 issuer) instead of login.microsoftconline.com (the v2 issuer)

You can check the settings by

    az webapp auth show --name virtualtable-funcapp --resource-group virtualtablepoc

Research idea: check if az webapp auth works in general.

At this point a valid access token is needed to call the API (otherwise 401)

### Postman setup to get AAD access token for a user

Register application in Azure AD representing Postman client

* Check "Access token (used for implicit flows)"
* Supported account types should be "Multitenant" if you use the common authorization endpoint (see below)
* add redirect URI http://localhost
* add MS Graph User.Read API permission
* add virtualtable-funcapp API permission

Set up Oauth2 authorization in Postman

* grant type: implicit
* callback url: http://localhost
* auth url: https://login.microsoftonline.com/<tenant id>/oauth2/authorize?resource=<the client id of the virtualtable funcapp app registration>
* auth url: https://login.microsoftonline.com/common/oauth2/authorize?resource=<the client id of the virtualtable funcapp app registration>
* client id: the client id of the postman app registration

After successfully authenticating, the access token is added to the request and the hello endpoint works again!

### Modernized setup to get AAD access token for a user

The application registration for the Postman client remains the same. We will use the v2.0 endpoint for authorization.

Set up Oauth2 authorization in Postman

* grant type: implicit
* callback url: http://localhost
* auth url: https://login.microsoftonline.com/<tenant id>/oauth2/v2.0/authorize
* client id: the client id of the postman app registration
* scope: the scope that was created under the app registration done previously for the function app

## Setup API management

At this point the function app is secured by Azure AD but also needs a function key (host or function level).
We should set up Azure API management on top of this so we can avoid distributing the function key and all
the key management/rotation problems that come with this.

Maybe later...

## Setup backend service registration for the virtual table plugin

The Postman client and the implicit flow is great for testing but otherwise a service-to-service call will be in place.

### Create app registration

https://learn.microsoft.com/en-gb/azure/app-service/configure-authentication-provider-aad#daemon-client-application-service-to-service-calls
Register application in Azure AD representing Dataverse virtual table plugin.

* Name: Dataverse virtual table plugin
* Supported account types: single tenant
* redirect URI: blank
* create a client secret
* add MS Graph User.Read API permission

### Setup Postman to test client credentials flow

* grant type: client credentials
* access token url: https://login.microsoftonline.com/<tenant id>/oauth2/v2.0/token
* client id: the client id of the Dataverse virtual table plugin registration above
* client secret: the client secret created above
* scope: the Application ID URI for the virtualtable-funcapp registration with "/.default" added. This can be found on the overview page or on "Expose an API".

Testing shows the x-ms-client-principal-name header will have the client ID of Dataverse virtual table plugin registration above. 
