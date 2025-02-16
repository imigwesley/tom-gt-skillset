import { del, get, post, put } from 'aws-amplify/api';
import { MemberInformation } from '../Types/types';
import { fetchAuthSession } from 'aws-amplify/auth';

async function getAuthToken(): Promise<string> {
    try {
        const session = await fetchAuthSession();
        return session.tokens?.idToken?.toString() ?? '';
    } catch (error) {
        console.error('Error fetching auth token:', error);
        return '';
    }
}


export async function getAllUsersData(): Promise<MemberInformation[]> {
    try {
        const authToken = await getAuthToken();
        const restOperation = get({ 
            apiName: 'userApi',
            path: `/userData`,
            options: {
                headers: {
                    Authorization: authToken
                }
            }
        });
        const { body } = await restOperation.response;
        const response = JSON.parse(JSON.stringify(await body.json()));
        // console.log('All users: ', response);
        return response;
    } catch (e) {
        console.log('GET all users call failed: ', e);
        return [];
    }
}

// this works
export async function getSingleUserData (givenId: string | undefined) {
    try {
        const authToken = await getAuthToken();
        const restOperation = get({ 
            apiName: 'userApi',
            path: `/userData/${givenId}`,
            options: {
                body: {
                    Authorization: authToken
                }
            }
        });
        const { body } = await restOperation.response;
        const response = JSON.parse(JSON.stringify(await body.json()));
        console.log('Single user: ', response);
        return response;
    } catch (e) {
        console.log('GET single user call failed: ', e);
    }
};

export async function deleteSingleUser (givenId: string | undefined) {
    try {
        const authToken = await getAuthToken();
        const restOperation = del({ 
            apiName: 'userApi',
            path: `/userData/object/${givenId}`,
            options: {
                headers: {
                    Authorization: authToken
                }
            }
        });
        await restOperation.response;
    } catch (e) {
        console.log('GET single user call failed: ', e);
    }
};

export async function createSingleUserData(userData: MemberInformation) {
    try {
        const authToken = await getAuthToken();
        const fixedBody = {
            userId: userData.userId,
            identifiers: userData.identifiers,
            roles: userData.roles,
            teams: userData.teams,
            moduleProgress: userData.moduleProgress.map((progress) => ({
              subsectionsCpmplete: progress.subsectionsComplete,
              moduleName: progress.moduleName,
              isAssigned: progress.isAssigned,
              percentComplete: progress.percentComplete
            })),
        };        
        const restOperation = post({
            apiName: 'userApi',
            path: '/userData/',
            options: {
                body: fixedBody,
                headers: { 
                    'content-type': 'application/json',
                    Authorization: authToken
                }
            }
        });
        const response = await restOperation.response;
        console.log('Created single user: ', response);
        return response;
    } catch (e) {
        console.log('create single user call failed: ', e);
    }
}



export async function updateSingleUserData(userData: MemberInformation) {
    console.log('user data here is', userData);
    try {
        const authToken = await getAuthToken();
        const fixedBody = {
            userId: userData.userId,
            identifiers: userData.identifiers,
            roles: userData.roles,
            teams: userData.teams,
            moduleProgress: userData.moduleProgress.map((progress) => ({
              subsectionsCpmplete: progress.subsectionsComplete,
              moduleName: progress.moduleName,
              isAssigned: progress.isAssigned,
              percentComplete: progress.percentComplete
            })),
        };        
        const restOperation = put({
            apiName: 'userApi',
            path: '/userData/',
            options: {
                body: fixedBody,
                headers: { 
                    'content-type': 'application/json',
                    Authorization: authToken
                }
            }
        });
        const response = await restOperation.response;
        console.log('Created single user: ', response);
        return response;
    } catch (e) {
        console.log('create single user call failed: ', e);
    }
}
