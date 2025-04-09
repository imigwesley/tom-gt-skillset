import { del, get, post, put } from 'aws-amplify/api';
import { SubmissionInformation } from '../Types/types';
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


export async function getAllSubmissions(): Promise<SubmissionInformation[]> {
    try {
        const authToken = await getAuthToken();
        const restOperation = get({ 
            apiName: 'submissionApi',
            path: `/submission`,
            options: {
                headers: {
                    Authorization: authToken
                }
            }
        });
        const { body } = await restOperation.response;
        const response = JSON.parse(JSON.stringify(await body.json()));
        // console.log('All submissions: ', response);
        return response;
    } catch (e) {
        console.warn('GET all submissions call failed: ', e);
        return [];
    }
}

export async function getSubmission (submissionId: string | undefined) {
    try {
        const authToken = await getAuthToken();
        const restOperation = get({ 
            apiName: 'submissionApi',
            path: `/submission/${submissionId}`,
            options: {
                body: {
                    Authorization: authToken
                }
            }
        });
        const { body } = await restOperation.response;
        const response = JSON.parse(JSON.stringify(await body.json()));
        // console.log('Submission: ', response);
        return response;
    } catch (e) {
        console.warn('GET submission call failed: ', e);
    }
};

export async function deleteSubmission (submissionId: string | undefined) {
    try {
        const authToken = await getAuthToken();
        const restOperation = del({ 
            apiName: 'submissionApi',
            path: `/submission/object/${submissionId}`,
            options: {
                headers: {
                    Authorization: authToken
                }
            }
        });
        const response = await restOperation.response;
        return response;
    } catch (e) {
        console.warn('DELETE submission call failed: ', e);
    }
};

export async function createSubmission(submissionData: SubmissionInformation) {
    try {
        const authToken = await getAuthToken();
        const fixedBody = {
            submissionId: submissionData.submissionId,
            subsectionName: submissionData.subsectionName,
            timeSubmitted: submissionData.timeSubmitted,
            status: submissionData.status,
            submittedBy: submissionData.submittedBy,
            submissionFiles: submissionData.submissionFiles,
            submissionFeedback: submissionData.submissionFeedback
        };        
        const restOperation = post({
            apiName: 'submissionApi',
            path: '/submission/',
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
        console.warn('POST submission call failed: ', e);
    }
}



export async function updateSubmission(submissionData: SubmissionInformation) {
    try {
        const authToken = await getAuthToken();
        const fixedBody = {
            submissionId: submissionData.submissionId,
            subsectionName: submissionData.subsectionName,
            timeSubmitted: submissionData.timeSubmitted,
            status: submissionData.status,
            submittedBy: submissionData.submittedBy,
            submissionFiles: submissionData.submissionFiles,
            submissionFeedback: submissionData.submissionFeedback
        };      
        const restOperation = put({
            apiName: 'submissionApi',
            path: '/submission/',
            options: {
                body: fixedBody,
                headers: { 
                    'content-type': 'application/json',
                    Authorization: authToken
                }
            }
        });
        const response = await restOperation.response;
        // console.log('Updated submission: ', response);
        return response;
    } catch (e) {
        console.warn('PUT submission call failed: ', e);
    }
}
