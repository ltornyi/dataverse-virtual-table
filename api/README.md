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