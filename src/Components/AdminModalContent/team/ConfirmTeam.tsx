import { Typography } from "@mui/material";
import { ModalPages } from "../../../Types/enums";
import { AdminModalContentProps } from "../../../Types/props";
import { isTeamInformation } from "../../../utils/Utils";
import '../AdminModalContent.scss';


const ConfirmTeam = ({saveOrDelete, userInput}: AdminModalContentProps) => {
  const localTeamData = isTeamInformation(userInput) ? userInput: undefined;


  return (
    <div className='input-info-container'>
      <Typography variant='h4'>{(saveOrDelete === 'save') ? 'Confirm Team Information:' : 'Confirm Team Deletion:'}</Typography>
      <div>
        <div className='confirm-section'>
          <Typography variant="h6" className='italics'>Team name:</Typography>
          <Typography className='indent'>{localTeamData?.teamName}</Typography>
        </div>
        <div className='confirm-section'>
          <Typography variant="h6" className='italics'>Team Members:</Typography>
          {/* <Typography className='indent'>{localTeamData?.membership.map((gtid) => gtidMap?.[gtid]).join(', ')}</Typography> */}
        </div>
        <div className='confirm-section'>
          <Typography variant="h6" className='italics'>Team Advisor(s):</Typography>
          {/* <Typography className='indent'>{(localTeamData?.advisors && localTeamData?.advisors.length > 0) ? localTeamData?.advisors.map((gtid) => gtidMap?.[gtid]).join(', ') : 'No advisors'}</Typography> */}
        </div>
      </div>
    </div>
  );
}

export default ConfirmTeam;