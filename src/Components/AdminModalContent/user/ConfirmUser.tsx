import { Typography } from "@mui/material";
import { ModalPages } from "../../../Types/enums";
import { AdminModalContentProps } from "../../../Types/props";
import { MemberInformation } from "../../../Types/types";
import { isMemberInformation } from "../../../utils/Utils";
import '../AdminModalContent.scss';


const ConfirmUser = ({saveOrDelete, userInput}: AdminModalContentProps) => {
  const localUserData = isMemberInformation(userInput) ? userInput: undefined;
  
  return (
    <div className='input-info-container'>
      <Typography variant='h4'>{saveOrDelete === 'save' ? 'Confirm User Information:' : 'Confirm User Deletion:'}</Typography>
      <div>
        <div className='confirm-section'>
          <Typography variant="h6" className='italics'>Name:</Typography>
          <Typography className='indent'>{localUserData?.identifiers.name}</Typography>
        </div>
        <div className='confirm-section'>
          <Typography variant="h6" className='italics'>Account Email:</Typography>
          <Typography className='indent'>{localUserData?.identifiers.accountEmail}</Typography>
        </div>
        <div className='confirm-section'>
          <Typography variant="h6" className='italics'>GTID:</Typography>
          <Typography className='indent'>{localUserData?.identifiers.gtID}</Typography>
        </div>
        <div className='confirm-section'>
          <Typography variant="h6" className='italics'>Role:</Typography>
          <Typography className='indent'>{localUserData?.roles.role}</Typography>
        </div>
        <div className='confirm-section'>
          <Typography variant="h6" className='italics'>Has Admin Access?:</Typography>
          <Typography variant="body2" className='italics'>Members by default do not have admin access.</Typography>

          <Typography className='indent'>{localUserData?.roles.isAdmin ? 'Yes' : 'No'}</Typography>
        </div>

        {(localUserData?.identifiers.otherEmails && localUserData?.identifiers.otherEmails.length > 0) &&
          <div className='confirm-section'>
            <Typography variant="h6" className='italics'>Other emails:</Typography>
              {localUserData?.identifiers.otherEmails.map((email, index) => {
                return (
                    <Typography className='indent' key={index}>{email}</Typography>
                );
              })}
          </div>
        }
        {/* <div className='confirm-section'>
          <Typography variant="h6" className='italics'>Team:</Typography>
          <Typography className='indent'>{localUserData?.teams.teamMembership}</Typography>
        </div>
        <div className='confirm-section'>
          <Typography variant="h6" className='italics'>Teams advising:</Typography>
          <Typography className='indent'>{(localUserData?.teams.teamsAdvising && localUserData?.teams.teamsAdvising.length > 0) ? localUserData?.teams.teamsAdvising.join(', ') : 'No teams advising'}</Typography>
        </div> */}
      </div>
    </div>
  );
}

export default ConfirmUser;