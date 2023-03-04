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

Becomes available at https://virtualtable-funcapp.azurewebsites.net/api/hello (by default function key is needed to run).