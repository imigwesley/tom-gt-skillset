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


const EditActivity = ({onApiInformationUpdate, onImageProvided, onLocalUrlCreated, userInput, tempImage}: AdminModalContentProps) => {

  const [localActivityData, setLocalActivityData] = useState<ActivityInformation>();
  const [localImage, setLocalImage] = useState('')
  const [allSubsections, setAllSubsections] = useState<SubsectionInformation[]>([]);
  const { getImage } = useImageCache();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch subsections
        const subsectionsResponse = await getAllSubsections();
        setAllSubsections(subsectionsResponse);
  
        // Check if userInput is provided and is valid
        if (userInput && isActivityInformation(userInput)) {
          console.log('first, userInput is:', userInput)
          setLocalActivityData(userInput);
        }
        if (tempImage) {
          console.log('tempImage already exists, is', tempImage)
          setLocalImage(tempImage);
        } else if (userInput && isActivityInformation(userInput)) {
          const blobPath = await getImage(userInput.imagePath);
          console.log('tempImage did not exist, now is', blobPath)
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
      console.log('about to update data for AdminModal.tsx');
      onApiInformationUpdate?.(temp);
      onImageProvided?.(file);
    }
  };

  return (
    <div className='input-info-container'>
      <Typography variant='h4'>Edit Activity Information</Typography>
      <div className='input-info-section'>
        <Typography>Activity Name*:</Typography>
        <TextField fullWidth value={localActivityData?.activityName} onChange={handleChangeActivityName} className='input-box'/>
      </div>
      <div className='input-info-section'>
        <Typography>Activity Subsections*:</Typography>
        <FormControl fullWidth className='input-box'>
          <Autocomplete
            multiple
            options={allSubsections}
            value={allSubsections.filter((subsection) => localActivityData?.subsectionNames.includes(subsection.subsectionName))}
            onChange={handleChangeActivitySubsectionsSelection}
            disableCloseOnSelect
            // PaperComponent={(props) => <StyledPaper {...props} />}
            getOptionLabel={(option) => option.subsectionName}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" placeholder={localActivityData?.subsectionNames.length === 0 ? "None Selected" : ''} />
            )}
            renderOption={(props, option, { selected }) => (
              <li {...props} key={option.subsectionName}>
                <Checkbox checked={selected} />
                <ListItemText primary={option.subsectionName} />
              </li>
            )}
            renderTags={(selected) =>
              selected.length === 0 ? (
                <Typography variant="body2" color="textSecondary">
                  None Selected
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((subsection) => (
                    <Chip key={subsection.subsectionName} label={subsection.subsectionName} />
                  ))}
                </Box>
              )
            }
          />
        </FormControl>
      </div>
      <div className='input-info-section'>
        <Typography>Activity Format:</Typography>
        <FormControl>
          <RadioGroup
            name="radio-buttons-group"
            value={localActivityData?.isIndividual ? 'individual' : localActivityData?.isTeam ? 'team' : ''}
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