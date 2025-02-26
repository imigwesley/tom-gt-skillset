import { Typography, TextField, FormControl, Select, MenuItem, RadioGroup, FormControlLabel, Radio, CircularProgress } from "@mui/material";
import ReactQuill from "react-quill";
import { AdminModalContentProps } from "../../../Types/props";
import { useEffect, useRef, useState } from "react";
import { ActivityInformation, SubsectionInformation } from "../../../Types/types";
import { getAllActivities } from "../../../utils/activityApi";
import { isSubsectionInformation } from "../../../utils/Utils";
import '../AdminModalContent.scss';

const toolbarOptions = [
  [{ 'header': [1, 2, 3, false] }],
  ['blockquote', 'code-block'],
  ['italic', 'underline', 'strike'],
  [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
  ['link', 'video'], // TODO: image handler
  ['clean']
];

const EditSubsection = ({onApiInformationUpdate, onActivityChosenForSubsection, userInput, activityChosen}: AdminModalContentProps) => {

  const quillRef = useRef<ReactQuill>(null);
  const [incorrectSubsectionNameError, setIncorrectSubsectionNameError] = useState(false);
  const [localSubsectionData, setLocalSubsectionData] = useState<SubsectionInformation>({
    subsectionName: '',
    subsectionHtml: '',
    hasDeliverable: false
  });
  const [allActivities, setAllActivities] = useState<ActivityInformation[]>([]);
  const [chosenActivity, setChosenActivity] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const activityResponse = await getAllActivities();
      setAllActivities(activityResponse);
    }
    if (userInput && isSubsectionInformation(userInput)) {
      setLocalSubsectionData(userInput);
    }
    if (activityChosen) {
      setChosenActivity(activityChosen);
    }
    fetchData();
  }, []);

  const handleChangeSubsectionName = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length !== 0) {
      setIncorrectSubsectionNameError(false);
    }
    const temp: SubsectionInformation = {
      subsectionName: event.target.value,
      subsectionHtml: localSubsectionData?.subsectionHtml || '',
      hasDeliverable: localSubsectionData?.hasDeliverable || false,
    };
    setLocalSubsectionData(temp);
    onApiInformationUpdate?.(temp);
  };

  const handleSubsectionNameBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.target.value.length === 0) {
      setIncorrectSubsectionNameError(true);
    }
    const temp: SubsectionInformation = {
      subsectionName: event.target.value,
      subsectionHtml: localSubsectionData?.subsectionHtml || '',
      hasDeliverable: localSubsectionData?.hasDeliverable || false,
    };
    onApiInformationUpdate?.(temp);
  };

  const handleChangeSubsectionHtml = () => {
    const currentHtml = quillRef.current?.getEditor().root.innerHTML;
    
    setLocalSubsectionData((prev) => {
        if (prev?.subsectionHtml === currentHtml) return prev; // Avoid unnecessary updates
        
        const updatedData: SubsectionInformation = {
          subsectionName: prev?.subsectionName || '',
          subsectionHtml: currentHtml || '',
          hasDeliverable: prev?.hasDeliverable || false,
        };

        onApiInformationUpdate?.(updatedData);

        return updatedData;
    });
  };

  const handleChangeDeliverableAssigned = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSubsectionData((prev) => {
        const updatedData: SubsectionInformation = {
          subsectionName: prev?.subsectionName || '',
          subsectionHtml: prev?.subsectionHtml || '',
          hasDeliverable: event.target.value === 'Deliverable'
        };
        onApiInformationUpdate?.(updatedData);
        return updatedData;
    });
  };

  return (
    <div className='input-info-container'>
      <Typography variant='h4'>Edit Subsection Information</Typography>
      <div className='input-info-section'>
        <Typography>Subsection Name*:</Typography>
        <TextField 
          fullWidth 
          value={localSubsectionData?.subsectionName} 
          onChange={handleChangeSubsectionName} 
          onBlur={handleSubsectionNameBlur}
          className='input-box'
          error={incorrectSubsectionNameError}
          helperText={incorrectSubsectionNameError ? 'Subsection name is required' : ''}
        />
      </div>
      <div className='input-info-section'>
        <Typography>Assign Deliverable?</Typography>
        <FormControl>
          <RadioGroup
            name="radio-buttons-group"
            value={localSubsectionData?.hasDeliverable === undefined ? null : (localSubsectionData?.hasDeliverable ? 'Deliverable' : 'No Deliverable')}
            onChange={handleChangeDeliverableAssigned}
          >
            <FormControlLabel value="Deliverable" control={<Radio disableTouchRipple />} label="Deliverable" />
            <FormControlLabel value="No Deliverable" control={<Radio disableTouchRipple />} label="No Deliverable" />
          </RadioGroup>
        </FormControl>
      </div>
      <div className='input-info-section'>
        <Typography>Subsection Content*:</Typography>
        <ReactQuill 
          value={localSubsectionData?.subsectionHtml} 
          modules={{toolbar: toolbarOptions}}
          ref={quillRef}
          onChange={handleChangeSubsectionHtml}
        />
      </div>
      <div className='input-info-section'>
        <Typography>Assign to Activity:</Typography>
        <FormControl fullWidth className='input-box'>
          <Select  
            // fullWidth
            // renderValue={() => <Typography>{localActivityData?.activityName}</Typography>}
            value={chosenActivity}
            onChange={(e) => {
              const activity = allActivities.find((activity) => activity.activityName === e.target.value);
              console.log('e is ', e)
              console.log('activity is ', activity)
              setChosenActivity(activity?.activityName || '');
              onActivityChosenForSubsection?.(activity?.activityName || '');
            }}              
            >
            {allActivities.sort((a, b) => a.activityName > b.activityName ? 0 : -1).map((activity) => (
              <MenuItem key={activity.activityName} value={activity.activityName}>
                {activity.activityName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </div>
  );
}
export default EditSubsection;