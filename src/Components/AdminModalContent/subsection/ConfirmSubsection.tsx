import { Typography } from "@mui/material";
import { ModalPages } from "../../../Types/enums";
import { AdminModalContentProps } from "../../../Types/props";
import { isSubsectionInformation } from "../../../utils/Utils";
import '../AdminModalContent.scss';


const ConfirmSubsection = ({saveOrDelete, userInput, activityChosen}: AdminModalContentProps) => {
  const localSubsectionData = isSubsectionInformation(userInput) ? userInput: undefined;

  
  return (
    <div className='input-info-container'>
      <Typography variant='h4'>{(saveOrDelete === 'save') ? 'Confirm Subsection Information:' : 'Confirm Subsection Deletion:'}</Typography>
      <div>
        <div className='confirm-section'>
          <Typography variant="h6" className='italics'>Subsection name:</Typography>
          <Typography className='indent'>{localSubsectionData?.subsectionName}</Typography>
        </div>
        <div className='confirm-section'>
          <Typography variant="h6" className='italics'>Deliverable Assigned?</Typography>
          <Typography className='indent'>{localSubsectionData?.hasDeliverable ? 'Yes' : 'No'}</Typography>
        </div>
        { activityChosen &&
        <div className='confirm-section'>
          <Typography variant="h6" className='italics'>Adding to activity:</Typography>
          <Typography className='indent'>{activityChosen}</Typography>
        </div> }
        <div className='confirm-section'>
          <Typography variant="h6" className='italics'>Subsection Preview:</Typography>
          <div className='quill'>
            <div className='ql-snow'>
              <div className='ql-editor preview-section' dangerouslySetInnerHTML={{__html: localSubsectionData?.subsectionHtml || ''}}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmSubsection;