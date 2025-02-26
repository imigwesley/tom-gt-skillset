import { Typography } from "@mui/material";
import { ModalPages } from "../../../Types/enums";
import { AdminModalContentProps } from "../../../Types/props";
import { isActivityInformation } from "../../../utils/Utils";
import '../AdminModalContent.scss';


const ConfirmActivity = ({saveOrDelete, userInput, tempImage}: AdminModalContentProps) => {
  const localActivityData = isActivityInformation(userInput) ? userInput: undefined;

  return (
    <div className='input-info-container'>
      <Typography variant='h4'>{(saveOrDelete === 'save') ? 'Confirm Activity Information:' : 'Confirm Activity Deletion:'}</Typography>
      <div>
        <div className='confirm-section'>
          <Typography variant="h6" className='italics'>Activity name:</Typography>
          <Typography className='indent'>{localActivityData?.activityName}</Typography>
        </div>
        <div className='confirm-section'>
          <Typography variant="h6" className='italics'>Subsections:</Typography>
          <Typography className='indent'>{localActivityData?.subsectionNames.join(', ')}</Typography>
        </div>
        <div className='confirm-section'>
          <Typography variant="h6" className='italics'>Activity Format:</Typography>
          <Typography className='indent'>{localActivityData?.isIndividual ? 'Individual' : 'As a Team'}</Typography>
        </div>
        <div className='confirm-section'>
          <Typography variant="h6" className='italics'>Activity Thumbnail:</Typography>
          {tempImage && <img src={tempImage} alt="Selected" style={{ width: '200px', height: '200px', objectFit: 'cover' }} />}
        </div>
      </div>
    </div>
  );
}

export default ConfirmActivity;