import { AddPhotoAlternate } from "@mui/icons-material";
import { Typography, TextField, FormControl, Autocomplete, Checkbox, ListItemText, Chip, RadioGroup, FormControlLabel, Radio, Button, AutocompleteChangeReason } from "@mui/material";
import { Box } from "@mui/system";
import { AdminModalContentProps } from "../../../Types/props";
import { SyntheticEvent, useEffect, useState } from "react";
import { ActivityInformation, SubsectionInformation } from "../../../Types/types";
import { isActivityInformation, StyledPaper } from "../../../utils/Utils";
import { getAllSubsections } from "../../../utils/subsectionsApi";
import { useImageCache } from "../../../ImageCacheContext";
import '../AdminModalContent.scss';
import OrderedSubsections from "../../OrderedSubsections/OrderedSubsections";


const EditActivity = ({onApiInformationUpdate, onImageProvided, onLocalUrlCreated, userInput, tempImage}: AdminModalContentProps) => {

  const [localActivityData, setLocalActivityData] = useState<ActivityInformation>();
  // const [givenActivities, setGivenActivities] = useState<string[]>([]);
  const [localImage, setLocalImage] = useState('')
  const [allSubsections, setAllSubsections] = useState<SubsectionInformation[]>([]);
  const { getImage } = useImageCache();
  const passedInput = userInput as ActivityInformation;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch subsections
        const subsectionsResponse = await getAllSubsections();
        setAllSubsections(subsectionsResponse);
  
        // Check if userInput is provided and is valid
        if (userInput && isActivityInformation(userInput)) {
          setLocalActivityData(userInput);
          // setGivenActivities(userInput.subsectionNames);
        }
        if (tempImage) {
          setLocalImage(tempImage);
        } else if (userInput && isActivityInformation(userInput)) {
          const blobPath = await getImage(userInput.imagePath);
          setLocalImage(blobPath);
          onLocalUrlCreated?.(blobPath);
        }
      } catch (error) {
        console.error("Error during fetchData:", error);
      }
    };
  
    fetchData();
  }, []);


  const handleChangeActivityName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const temp: ActivityInformation = {
      activityName: event.target.value,
      subsectionNames: localActivityData?.subsectionNames || [],
      imagePath: localActivityData?.imagePath || '',
      isTeam: localActivityData?.isTeam || false,
      isIndividual: localActivityData?.isIndividual || false,
    };
    setLocalActivityData(temp);
    onApiInformationUpdate?.(temp);
  }

  const handleChangeActivitySubsectionsSelection = (event: SyntheticEvent<Element, Event>,
    newValue: SubsectionInformation[],
    reason: AutocompleteChangeReason
  ) => {
    const temp: ActivityInformation = {
      activityName: localActivityData?.activityName || '',
      subsectionNames: newValue.map((subsection) => subsection.subsectionName),
      imagePath: localActivityData?.imagePath || '',
      isTeam: localActivityData?.isTeam || false,
      isIndividual: localActivityData?.isIndividual || false,
    };
    setLocalActivityData(temp);
    onApiInformationUpdate?.(temp);
  }

  const handleChangeActivityWorkMode = (event: React.ChangeEvent<HTMLInputElement>) => {
    const temp: ActivityInformation = {
      activityName: localActivityData?.activityName || '',
      subsectionNames: localActivityData?.subsectionNames || [],
      imagePath: localActivityData?.imagePath || '',
      isTeam: event.target.value === 'team',
      isIndividual: event.target.value === 'individual',
    };
    setLocalActivityData(temp);
    onApiInformationUpdate?.(temp);
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const selectedImage = URL.createObjectURL(file);
      const temp: ActivityInformation = {
        activityName: localActivityData?.activityName || '',
        subsectionNames: localActivityData?.subsectionNames || [],
        imagePath: file.name,
        isTeam: localActivityData?.isTeam || false,
        isIndividual: localActivityData?.isIndividual || false,
      };
      setLocalImage(selectedImage);
      onLocalUrlCreated?.(selectedImage);
      setLocalActivityData(temp);
      onApiInformationUpdate?.(temp);
      onImageProvided?.(file);
    }
  };

  const handleReorderSubsections = (newOrder: string[]) => {
    const temp: ActivityInformation = {
      activityName: localActivityData?.activityName || '',
      subsectionNames: newOrder,
      imagePath: localActivityData?.imagePath || '',
      isTeam: localActivityData?.isTeam || false,
      isIndividual: localActivityData?.isIndividual || false,
    };
    setLocalActivityData(temp);
    onApiInformationUpdate?.(temp);
  }

  return (
    <div className='input-info-container'>
      <Typography variant='h4'>Edit Activity Information</Typography>
      <div className='input-info-section'>
        <Typography>Activity Name*:</Typography>
        <TextField fullWidth value={localActivityData?.activityName || passedInput?.activityName} onChange={handleChangeActivityName} className='input-box'/>
      </div>
      <div className='input-info-section'>
        <Typography>Activity Subsections*:</Typography>
        <Typography sx={{fontStyle: 'italic'}} variant="body2">can drag and drop to reorder</Typography>
        <OrderedSubsections allSubsections={allSubsections} initialChosenOptions={passedInput?.subsectionNames || []} onChange={handleReorderSubsections} />
      </div>
      <div className='input-info-section'>
        <Typography>Activity Format:</Typography>
        <FormControl>
          <RadioGroup
            name="radio-buttons-group"
            value={localActivityData ? (localActivityData?.isIndividual ? 'individual' : localActivityData?.isTeam ? 'team' : '') : (passedInput?.isIndividual ? 'individual' : passedInput?.isTeam ? 'team' : '')}
            onChange={handleChangeActivityWorkMode}
          >
            <FormControlLabel value="individual" control={<Radio disableTouchRipple />} label="Individual" />
            <FormControlLabel value="team" control={<Radio disableTouchRipple />} label="As a Team" />
          </RadioGroup>
        </FormControl>
      </div>
      <div className='input-info-section'>
        <Typography>Activity Thumbnail*:</Typography>
        <Typography className='italics'>Include an preview for the home screen. Must be a png.</Typography>
          <input 
            accept='image/png'
            id='upload-activity-image'
            type='file'
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
          {localImage ? (
            <div className='image-upload-section'>
              <Box>
                <img src={localImage} alt="Selected" style={{ width: '200px', height: '200px', objectFit: 'cover' }} />
              </Box>
              <label htmlFor='upload-activity-image' >
                <Button color="primary" component="span">
                  <AddPhotoAlternate className='button-icon'/>
                  <Typography>
                    change selection
                  </Typography>
                </Button>
              </label>
            </div>
          )
          : (
            <label htmlFor='upload-activity-image' >
              <Button color="primary" component="span">
                <AddPhotoAlternate className='button-icon'/>
                <Typography>
                  upload photo
                </Typography>
              </Button>
            </label>
          )}
      </div>
    </div>
  );
}

export default EditActivity;