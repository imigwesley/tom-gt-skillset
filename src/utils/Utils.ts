import { Paper, styled } from "@mui/material";
import { ActivityInformation, ApiSendInformation, MemberInformation, SubmissionInformation, SubsectionInformation, TeamInformation } from "../Types/types";

export const validateEmailString = (email: string) => {
  const emailRegex = new RegExp(/^\S+(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{3,}))$/);
  if (email?.length !== 0 && emailRegex.test(email)) {
    return true;
  } else {
    return false;
  }
};


// type guards
export function isMemberInformation(info: any): info is MemberInformation {
  return (info as MemberInformation)?.identifiers?.gtID !== undefined;
}

export function isActivityInformation(info: any): info is ActivityInformation {
  return (info as ActivityInformation)?.activityName !== undefined;
}

export function isSubsectionInformation(info: any): info is SubsectionInformation {
  return (info as SubsectionInformation)?.subsectionName !== undefined;
}

export function isTeamInformation(info: any): info is TeamInformation {
  return (info as TeamInformation)?.teamName !== undefined;
}

export function isSubmissionInformation(info: any): info is SubmissionInformation {
  return (info as SubmissionInformation)?.id !== undefined;
}

export const isDataValid = (data: ApiSendInformation, imageFile: File | undefined, activeStep: number) => {
  const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{3,}))$/);

  console.log('validating user: ', data.user)
  console.log('validating team: ', data.team)
  console.log('validating activity: ', data.activity)
  console.log('validating image ', imageFile);

  const temp = (
    ( // user is valid
      data.user
    && (data.user.identifiers.name !== '' && /\s/.test(data.user.identifiers.name))
    && (data?.user?.identifiers.otherEmails.length == 0 || data.user.identifiers.otherEmails?.some(email => emailRegex.test(email)))
    && (data.user.identifiers.accountEmail && emailRegex.test(data.user.identifiers.accountEmail))
    && data.user.identifiers.gtID && data.user?.identifiers.gtID.length === 9
    && !isNaN(Number(data.user.identifiers.gtID))
    // && data.user.teams.teamMembership.length > 0
    && data.user.roles.role !== ''
    )
    || ( // or if team is valid
      data.team
      && data.team.teamName !== ''
      && (data.team.membership?.length !== 0 && data.team.membership[0] !== '')
      && (data.team.advisors?.length !== 0 && data.team.advisors[0] !== '')
    )
    || ( // or if activity is valid (necessary info exists, image is uploaded)
      data.activity
      && data.activity.activityName !== ''
      && (data.activity.subsectionNames?.length !== 0 && data.activity.subsectionNames[0] !== '')
      && data.activity.imagePath
    )
    || ( // or if subsection is valid
      data.subsection
      && data.subsection.subsectionName !== ''
      && data.subsection.subsectionHtml !== ''
    )
  ) // or () or () 
  console.log('isDataValid returns', temp || false)
  return temp || false; // case where data is not defined
}

export const StyledPaper = styled(Paper)(({ theme }) => ({
  maxHeight: '200px', // Set your desired max height
  overflowY: 'auto',   // Enable vertical scrolling if needed
}));

