import { fetchAuthSession } from 'aws-amplify/auth';
import { post } from 'aws-amplify/api'

async function getAuthToken(): Promise<string> {
    try {
        const session = await fetchAuthSession();
        return session.tokens?.idToken?.toString() ?? '';
    } catch (error) {
        console.error('Error fetching auth token:', error);
        return '';
    }
}

export async function deleteUserInCognito(givenId: any) {
    try {
        const authToken = await getAuthToken();
        const restOperation = post({ 
            apiName: 'cognitoApi',
            path: `/cognito/deleteCognitoUser`,
            options: {
                body: {
                    username: givenId
                },
                headers: {
                    Authorization: authToken
                }
            }
        });
        const { body } = await restOperation.response;
        const response = JSON.parse(JSON.stringify(await body.json()));
        return response;
    } catch (e) {
        console.warn('user deletion failure: ', e);
    }
};
