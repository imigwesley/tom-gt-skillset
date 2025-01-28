import { get } from 'aws-amplify/api';
import membersSample from "../SampleData/MembersSample";


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

