import { del, get, post, put } from 'aws-amplify/api';
import { ActivityInformation } from '../Types/types';
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


export async function getAllActivities(): Promise<ActivityInformation[]> {
    try {
        const authToken = await getAuthToken();
        const restOperation = get({ 
            apiName: 'activityApi',
            path: `/activity`,
            options: {
                headers: {
                    Authorization: authToken
                }
            }
        });
        const { body } = await restOperation.response;
        const response = JSON.parse(JSON.stringify(await body.json()));
        // console.log('All activities: ', response);
        return response;
    } catch (e) {
        console.warn('GET all activities call failed: ', e);
        return [];
    }
}

export async function getActivity (activityName: string | undefined) {
    try {
        const authToken = await getAuthToken();
        const restOperation = get({ 
            apiName: 'activityApi',
            path: `/activity/${activityName}`,
            options: {
                body: {
                    Authorization: authToken
                }
            }
        });
        const { body } = await restOperation.response;
        const response = JSON.parse(JSON.stringify(await body.json()));
        return response;
    } catch (e) {
        console.warn('GET activity call failed: ', e);
    }
};

export async function deleteActivity (activityName: string | undefined) {
    try {
        const authToken = await getAuthToken();
        const restOperation = del({ 
            apiName: 'activityApi',
            path: `/activity/object/${activityName}`,
            options: {
                headers: {
                    Authorization: authToken
                }
            }
        });
        const response = await restOperation.response;
        return response;
    } catch (e) {
        console.warn('DELETE activity call failed: ', e);
    }
};

export async function createActivity(activityData: ActivityInformation) {
    try {
        const authToken = await getAuthToken();
        const fixedBody = {
            isTeam: activityData.isTeam,
            isIndividual: activityData.isIndividual,
            activityName: activityData.activityName,
            subsectionNames: activityData.subsectionNames,
            imagePath: activityData.imagePath
        };
        const restOperation = post({
            apiName: 'activityApi',
            path: '/activity/',
            options: {
                body: fixedBody,
                headers: { 
                    'content-type': 'application/json',
                    Authorization: authToken
                }
            }
        });
        const response = await restOperation.response;
        return response;
    } catch (e) {
        console.warn('POST activity call failed: ', e);
    }
}



export async function updateActivity(activityData: ActivityInformation) {
    try {
        const authToken = await getAuthToken();
        const fixedBody = {
            isTeam: activityData.isTeam,
            isIndividual: activityData.isIndividual,
            activityName: activityData.activityName,
            subsectionNames: activityData.subsectionNames,
            imagePath: activityData.imagePath
        };    
        const restOperation = put({
            apiName: 'activityApi',
            path: '/activity/',
            options: {
                body: fixedBody,
                headers: { 
                    'content-type': 'application/json',
                    Authorization: authToken
                }
            }
        });
        const response = await restOperation.response;
        return response;
    } catch (e) {
        console.warn('PUT activity call failed: ', e);
    }
}

export async function addSubsectionToActivity(activityName: string, subsectionName: string) {
    const activity = await getActivity(activityName);
    const updatedActivity = { 
        ...activity[0], 
        subsectionNames: [...activity[0].subsectionNames, subsectionName] 
    };
    return updateActivity(updatedActivity);
}

