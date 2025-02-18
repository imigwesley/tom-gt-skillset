/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	USER_POOL_ID
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    
    const userPoolId = process.env.USER_POOL_ID;
    const { username } = JSON.parse(event.body);
    
    try {
        await cognito.adminDeleteUser({
            UserPoolId: userPoolId,
            Username: username,
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'User deleted successfully' }),
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
        };
    }
};

