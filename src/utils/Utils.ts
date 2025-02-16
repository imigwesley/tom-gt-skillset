import { ApiSendInformation } from "../Types/types";

export const validateEmailString = (email: string) => {
  const emailRegex = new RegExp(/^\S+(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{3,}))$/);
  if (email?.length !== 0 && emailRegex.test(email)) {
    return true;
  } else {
    return false;
  }
};

export const isDataValid = (data: ApiSendInformation, imageFile: File | undefined, activeStep: number) => {
  const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{3,}))$/);

  // console.log(apiDataToSend)
  // console.log('validating user: ', data.user)
  // console.log('validating team: ', data.team)
  // console.log('validating module: ', data.module)
  // console.log('validating image ', imageFile);

  return (
    ( // user is valid
      data.user
    && (data.user.identifiers.name !== '' && /\s/.test(data.user.identifiers.name))
    && (data?.user?.identifiers.otherEmails.length == 0 || data.user.identifiers.otherEmails?.some(email => emailRegex.test(email)))
    && (data.user.identifiers.accountEmail && emailRegex.test(data.user.identifiers.accountEmail))
    && data.user.identifiers.gtID && data.user?.identifiers.gtID.length === 9
    && !isNaN(Number(data.user.identifiers.gtID))
    && data.user.teams.teamMembership.length > 0
    && data.user.roles.role !== ''
  )
  || ( // or if team is valid
    data.team
    && data.team.teamName !== ''
    && (data.team.membership?.length !== 0 && data.team.membership[0] !== '')
    && (data.team.advisors?.length !== 0 && data.team.advisors[0] !== '')
  )
  || ( // or if module is valid (necessary info exists, image is uploaded)
    data.module
    && data.module.moduleName !== ''
    && (data.module.subsections?.length !== 0 && data.module.subsections[0] !== '')
    && imageFile
  )
  || ( // or if subsection is valid
    data.subsection
    && data.subsection.subsectionName !== ''
    && data.subsection.subsectionHtml !== ''
    && (activeStep === 1 ? data.subsection.htmlEdited : true)
  )
) // or () or () 
}
