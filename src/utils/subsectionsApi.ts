import { del, get, post, put } from 'aws-amplify/api';
import { SubsectionInformation } from '../Types/types';
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


export async function getAllSubsections(): Promise<SubsectionInformation[]> {
    try {
        const authToken = await getAuthToken();
        const restOperation = get({ 
            apiName: 'subsectionsApi',
            path: `/subsections`,
            options: {
                headers: {
                    Authorization: authToken
                }
            }
        });
        const { body } = await restOperation.response;
        const response = JSON.parse(JSON.stringify(await body.json()));
        // console.log('All subsections: ', response);
        return response;
    } catch (e) {
        console.log('GET all subsections call failed: ', e);
        return [];
    }
}

export async function getSubsection (subsectionName: string | undefined) {
    try {
        const authToken = await getAuthToken();
        const restOperation = get({ 
            apiName: 'subsectionsApi',
            path: `/subsections/${subsectionName}`,
            options: {
                body: {
                    Authorization: authToken
                }
            }
        });
        const { body } = await restOperation.response;
        const response = JSON.parse(JSON.stringify(await body.json()));
        console.log('Subsection: ', response);
        return response;
    } catch (e) {
        console.log('GET subsection call failed: ', e);
    }
};

export async function deleteSubsection (subsectionName: string | undefined) {
    try {
        const authToken = await getAuthToken();
        const restOperation = del({ 
            apiName: 'subsectionsApi',
            path: `/subsections/object/${subsectionName}`,
            options: {
                headers: {
                    Authorization: authToken
                }
            }
        });
        const response = await restOperation.response;
        return response;
    } catch (e) {
        console.log('DELETE subsection call failed: ', e);
    }
};

export async function createSubsection(subsectionData: SubsectionInformation) {
    try {
        const authToken = await getAuthToken();
        const fixedBody = {
            subsectionName: subsectionData.subsectionName,
            subsectionHtml: subsectionData.subsectionHtml,
            hasDeliverable: subsectionData.hasDeliverable ?? false
        };        
        const restOperation = post({
            apiName: 'subsectionsApi',
            path: '/subsections/',
            options: {
                body: fixedBody,
                headers: { 
                    'content-type': 'application/json',
                    Authorization: authToken
                }
            }
        });
        const response = await restOperation.response;
        console.log('Created subsection: ', response);
        return response;
    } catch (e) {
        console.log('POST subsection call failed: ', e);
    }
}



export async function updateSubsection(subsectionData: SubsectionInformation) {
    console.log('about to send', subsectionData)
    try {
        const authToken = await getAuthToken();
        const fixedBody = {
            subsectionName: subsectionData.subsectionName,
            subsectionHtml: subsectionData.subsectionHtml,
            hasDeliverable: subsectionData.hasDeliverable ?? false
        };      
        const restOperation = put({
            apiName: 'subsectionsApi',
            path: '/subsections/',
            options: {
                body: fixedBody,
                headers: { 
                    'content-type': 'application/json',
                    Authorization: authToken
                }
            }
        });
        const response = await restOperation.response;
        console.log('Updated subsection: ', response);
        return response;
    } catch (e) {
        console.log('PUT subsection call failed: ', e);
    }
}
