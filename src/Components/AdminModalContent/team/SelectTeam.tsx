import { Typography, FormControl, Select, MenuItem, CircularProgress } from "@mui/material";
import { AdminModalContentProps } from "../../../Types/props";
import { useEffect, useState } from "react";
import { TeamInformation } from "../../../Types/types";
import teamsSample from "../../../SampleData/TeamsSample";
import '../AdminModalContent.scss';


const SelectTeam = ({onApiInformationUpdate}: AdminModalContentProps) => {

  const [localTeamData, setLocalTeamData] = useState<TeamInformation>();
  const [allTeams, setAllTeams] = useState<TeamInformation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // const usersResponse = await getAllTeamsData();
      const teamsResponse = teamsSample;
      setAllTeams(teamsResponse);
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
          <Typography variant='h5'>Select a team:</Typography>
          <FormControl className='select-autocomplete'>
            <Select
              displayEmpty
              renderValue={() => <Typography>{localTeamData?.teamName || 'Select a team'}</Typography>}
              value={localTeamData?.teamName}
              onChange={(e) => {
                const team = allTeams.find((team) => team.teamName === e.target.value);
                if (!team) return;
                setLocalTeamData(team);
                onApiInformationUpdate?.(team);
              }}            
            >
              {allTeams.sort((a, b) => a.teamName > b.teamName ? 0 : -1).map((team) => (
                <MenuItem key={team.teamName} value={team.teamName}>
                  {team.teamName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      }
    </div>
  );
}

export default SelectTeam;