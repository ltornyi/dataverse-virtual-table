# Function app for logging / troubleshooting

## Create

This function app was created by running

    func init spy --worker-runtime typescript
    cd spy
    rm -fr .vscode

    func new --name logger --template "HTTP trigger" --authlevel "function"
    npm install
    npm start

The example endpoint is available as

    [GET,POST] http://localhost:7071/spy/logger

## Create resource group, storage account and function app definition in Azure

    az group create \
    --name spyapp \
    --location westeurope

    az storage account create \
    --name spyappstorage \
    --location westeurope \
    --resource-group spyapp \
    --sku Standard_LRS

    az functionapp create \
    --name spyapp-funcapp \
    --resource-group spyapp \
    --storage-account spyappstorage \
    --consumption-plan-location westeurope \
    --functions-version 4 \
    --os-type Linux \
    --https-only true \
    --runtime node \
    --runtime-version 18

## Deploy to Azure

    npm run build
    func azure functionapp publish spyapp-funcapp