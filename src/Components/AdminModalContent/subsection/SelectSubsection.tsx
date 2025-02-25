import { Typography, FormControl, Autocomplete, TextField, CircularProgress } from "@mui/material";
import { AdminModalContentProps } from "../../../Types/props";
import { SubsectionInformation } from "../../../Types/types";
import { useEffect, useState } from "react";
import { getAllSubsections } from "../../../utils/subsectionsApi";
import '../AdminModalContent.scss';


const SelectSubsection = ({onApiInformationUpdate}: AdminModalContentProps) => {
  const [localSubsectionData, setLocalSubsectionData] = useState<SubsectionInformation>();
  const [allSubsections, setAllSubsections] = useState<SubsectionInformation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const subsectionsResponse = await getAllSubsections();
      setAllSubsections(subsectionsResponse);
      setIsLoading(false)
    }
    fetchData();
  }, []);

  return (
    <div className='input-info-container'>
      { isLoading ?
        <div className="selector-centering"> 
          <CircularProgress />
        </div>
      :
        <div className='selector-centering'>
          <Typography variant='h5'>Select a subsection:</Typography>
          <FormControl className='select-autocomplete'>
            <Autocomplete
              options={allSubsections.sort((a, b) => (a.subsectionName > b.subsectionName ? 1 : -1))}
              getOptionLabel={(option) => option.subsectionName}
              value={localSubsectionData}
              loading={isLoading}
              onChange={(event, newValue) => {
                // const subsection = subsectionsData.find((subsection) => subsection.subsectionName === e.target.value);
                if (newValue) {
                  console.log('in the if')
                  setLocalSubsectionData(newValue);
                  onApiInformationUpdate?.(newValue);
                } else {
                  console.log('in the else')
                  setLocalSubsectionData(allSubsections?.find((subsection) => subsection.subsectionName === localSubsectionData?.subsectionName) || {
                    subsectionName: '',
                    subsectionHtml: '',
                    hasDeliverable: false
                  });
                }
              }}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  placeholder="Select/type subsection name"
                  variant="outlined" 
                />
              )}
              renderOption={(props, option) => (
                <li {...props} key={1}>
                  <Typography>{option.subsectionName}</Typography>
                </li>
              )}
            />
          </FormControl>
        </div> 
      }
    </div>
  );
}

export default SelectSubsection;