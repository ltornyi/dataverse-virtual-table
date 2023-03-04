import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const personalMessage = (name: string) => {
    return name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    
    context.log('x-ms-client-principal-name:', req.headers['x-ms-client-principal-name']);
    context.log('x-ms-client-principal-id:', req.headers['x-ms-client-principal-id']);
    context.log('x-ms-client-principal-idp:', req.headers['x-ms-client-principal-idp']);
    // context.log('x-ms-client-principal:', req.headers['x-ms-client-principal']);
    // the above is access token received

    const name = (req.query.name || (req.body && req.body.name));
    const greeting = personalMessage(name);
    const identifiedUser = req.headers['x-ms-client-principal-name'];
    const identifiedUserId = req.headers['x-ms-client-principal-id'];

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: {greeting, identifiedUser, identifiedUserId},
        headers: {'Content-Type': 'application/json'}
    };

};

export default httpTrigger;