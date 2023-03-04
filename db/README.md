# CosmosDB

A resource group to hold all resources. CosmosDB free tier account. SQL-api database and minimal container. For the PoC purpose the container will store to do items for users.

    az group create \
    --name cosmos \
    --location westeurope

    az cosmosdb create \
    --resource-group cosmos \
    --name cosmos-alpha96 \
    --locations regionName=westeurope \
    --enable-free-tier true

    az cosmosdb sql database create \
    --name playground \
    --account-name cosmos-alpha96 \
    --resource-group cosmos

    az cosmosdb sql container create \
    -a cosmos-alpha96 -g cosmos \
    -d playground -n todoItems \
    -p "/id" --throughput 400
