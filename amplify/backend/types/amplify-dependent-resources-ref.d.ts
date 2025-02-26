export type AmplifyDependentResourcesAttributes = {
  "api": {
    "activityApi": {
      "ApiId": "string",
      "ApiName": "string",
      "RootUrl": "string"
    },
    "cognitoApi": {
      "ApiId": "string",
      "ApiName": "string",
      "RootUrl": "string"
    },
    "subsectionsApi": {
      "ApiId": "string",
      "ApiName": "string",
      "RootUrl": "string"
    },
    "userApi": {
      "ApiId": "string",
      "ApiName": "string",
      "RootUrl": "string"
    }
  },
  "auth": {
    "tomgtskillsetf97c16adf97c16ad": {
      "AppClientID": "string",
      "AppClientIDWeb": "string",
      "CreatedSNSRole": "string",
      "IdentityPoolId": "string",
      "IdentityPoolName": "string",
      "UserPoolArn": "string",
      "UserPoolId": "string",
      "UserPoolName": "string"
    }
  },
  "function": {
    "deleteCognitoUser": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    },
    "getActivity": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    },
    "getSubsections": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    },
    "getUserDataFunction": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    }
  },
  "storage": {
    "UserData": {
      "Arn": "string",
      "Name": "string",
      "PartitionKeyName": "string",
      "PartitionKeyType": "string",
      "Region": "string",
      "StreamArn": "string"
    },
    "skillsetActivities": {
      "Arn": "string",
      "Name": "string",
      "PartitionKeyName": "string",
      "PartitionKeyType": "string",
      "Region": "string",
      "StreamArn": "string"
    },
    "skillsetSubsections": {
      "Arn": "string",
      "Name": "string",
      "PartitionKeyName": "string",
      "PartitionKeyType": "string",
      "Region": "string",
      "StreamArn": "string"
    },
    "skillsets3": {
      "BucketName": "string",
      "Region": "string"
    }
  }
}