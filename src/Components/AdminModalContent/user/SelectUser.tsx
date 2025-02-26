import { Typography, FormControl, Autocomplete, TextField, CircularProgress } from "@mui/material";
import { AdminModalContentProps } from "../../../Types/props";
import { MemberInformation } from "../../../Types/types";
import { useEffect, useState } from "react";
import { getAllUsersData } from "../../../utils/userApi";
import '../AdminModalContent.scss';


const SelectUser = ({onApiInformationUpdate}: AdminModalContentProps) => {
  const [localUserData, setLocalUserData] = useState<MemberInformation>();
  const [allUsers, setAllUsers] = useState<MemberInformation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  

  useEffect(() => {
    const fetchData = async () => {
      const usersResponse = await getAllUsersData();
      setAllUsers(usersResponse);
      setIsLoading(false);
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
          <Typography variant='h5'>Select a user account:</Typography>
          <FormControl className='select-autocomplete'>
            <Autocomplete
              options={allUsers.sort((a, b) => (a.identifiers.name > b.identifiers.name ? 1 : -1))}
              getOptionLabel={(option) => option.identifiers.name}
              value={localUserData}
              loading={isLoading}
              onChange={(_, newValue) => {
                if (!newValue) return;
                setLocalUserData(newValue);
                onApiInformationUpdate?.(newValue);
              }}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  placeholder="Select/type user name"
                  variant="outlined" 
                />
              )}
              renderOption={(props, option) => (
                <li {...props} key={option.identifiers.gtID}>
                  <Typography>{option.identifiers.name}</Typography>
                </li>
              )}
            />
          </FormControl>
        </div>
      }
    </div>
  );
}

export default SelectUser;