import { get, post, put } from 'aws-amplify/api';
import membersSample from "../SampleData/MembersSample";
import { MemberInformation } from '../Types/types';
import { Amplify } from 'aws-amplify';
import awsmobile from '../aws-exports';

Amplify.configure(awsmobile);



export function getAllUsersData() {
    // try {
    //     const restOperation = get({ 
    //         apiName: 'userApi',
    //         path: `/userData`
    //     });
    //     const response = await restOperation.response;
    //     console.log('All users: ', response);
    //     return response;
    // } catch (e) {
    //     console.log('GET all users call failed: ', e);
    // }
    const placeholder = membersSample;
    return placeholder;
}

export function getSingleUserData(givenId: string | undefined) {
    // try {
    //     const restOperation = get({ 
    //         apiName: 'userApi',
    //         path: `/userData/${givenId}`
    //     });
    //     const response = await restOperation.response;
    //     console.log('Single user: ', response);
    //     return response;
    // } catch (e) {
    //     console.log('GET single user call failed: ', e);
    // }
     
    const placeholder = {
      "identifiers": {
          "userID": "29486129469kdjfb",
          "accountEmail": "wimig3@gatech.edu",
          "name": "Wesley Imig",
          "gtID": "903656085",
          "contactEmails": ["wesley@gatech.edu", "wimig3@gmail.com"]
      },
      "roles": {
          "role": "president",
          "isAdmin": true
      },
      "teams": {
          "teamMembership": ["Design"],
          "teamsAdvising": ["Marketing"]
      },
      "moduleProgress": [
          { 
              "moduleName": "Kangaroos", 
              "percentComplete": 59.6,
              "isAssigned": true,
              "subsectionsComplete": [
                  "sharpen knife",
                  "theory of grilling"
              ]
          }
      ]
    };
    return placeholder;
};

export async function createSingleUserData(userData: MemberInformation) {
    try {
        const restOperation = post({
            apiName: 'userApi',
            path: '/userApi/',
            options: {
                body: JSON.stringify({...userData, userId: userData.identifiers.gtID}),
                headers: { 'content-type': 'application/json' }
            }
        });
        const response = await restOperation.response;
        console.log('Single user: ', response);
        return response;
    } catch (e) {
        console.log('create single user call failed: ', e);
    }
}

export async function updateSingleUserData(userData: MemberInformation) {
    try {
        const restOperation = put({
            apiName: 'userApi',
            path: `/userApi/${userData.identifiers.userID}`,
            options: {
                body: JSON.stringify(userData),
                headers: { 'Content-Type': 'application/json' }
            }
        });
        const response = await restOperation.response;
        console.log('Single user: ', response);
        return response;
    } catch (e) {
        console.log('update single user call failed: ', e);
    }
}
