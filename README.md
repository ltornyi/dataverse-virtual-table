# Dataverse virtual table

This is a PoC to explore the following architecture:
* Virtual table in Dataverse using custom plugin
* Custom plugin calls REST api using OAuth2 client credentials flow
* API is implemented as an Azure function app
* Function app is protected by Azure AD
* Function app retrieves rows from a CosmosDB table

## Set up dev tooling on a Mac

The usual stuff to install Azure CLI, Azure function core tools and VSCode extension. Summary:

    brew install azure-cli
    brew tap azure/functions
    brew install azure-functions-core-tools@4
    https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions

    az login

## Database

See db folder

## Function app

See api folder