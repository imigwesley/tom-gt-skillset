import { useEffect, useState } from 'react';
import './Members.scss';
import { Button, ButtonGroup, CircularProgress, Typography } from '@mui/material';
import MemberInfoCard from '../../Components/MemberInfoCard/MemberInfoCard';
import { Alphabetically, ByRole, ByTeam, MemberInformation } from '../../Types/types';
import { getAllUsersData } from '../../utils/userApi';

const MembersPage = () => {
  enum SORT_TYPE {
    ROLE,
    TEAM,
    ALPHABETICALLY
  }

  // TODO: replace these with api calls
  const [teams, setTeams] = useState(['CAD', 'Engineering', 'Design', 'Operations', 'Marketing'])
  const [allUsers, setAllUsers] = useState<MemberInformation[]>([]);
  const [isLoading, setIsLoading] = useState(true)

  const [membersByRole, setMembersByRole] = useState<ByRole>({'officers': [], 'members': []});
  const [membersByTeam, setMembersByTeam] = useState<ByTeam[]>([{'team': '', 'members': [], 'advisors': []}]);
  const [membersAlphabetically, setMembersAlphabetically] = useState<Alphabetically[]>([{'letter': '', 'members': []}]);
  const [sortType, setSortType] = useState(SORT_TYPE.ROLE);

  useEffect(() => {
    const fetchData = async () => {
      const tempAllUsers = await getAllUsersData();
      setAllUsers(tempAllUsers);

      const tempByRole = {
        'officers': tempAllUsers?.filter((member) => member.roles.isAdmin === true) || [],
        'members': tempAllUsers?.filter((member) => member.roles.isAdmin === false).sort((a, b) => a.identifiers.name > b.identifiers.name ? 0 : -1) || [],
      };
      setMembersByRole(tempByRole);
  
      // group members by team
      let tempByTeam: ByTeam[] = [];
      teams.forEach((team) => {
        tempByTeam.push(
          {
            'team': team,
            'members': tempAllUsers?.filter((member) => member.teams.teamMembership.includes(team)) || [],
            'advisors': tempAllUsers?.filter((member) => member.teams.teamsAdvising.includes(team)) || []
          }
        );
      });
      setMembersByTeam(tempByTeam);
  
      // group alphabetically
      let tempAlphabetically: Alphabetically[] = [];
      const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
      alphabet.forEach((letter) => {
        const tempArr = {
          'letter': letter,
          'members': tempAllUsers?.filter((member) => member.identifiers.name[0].toLowerCase() === letter) || []
        }
        if (tempArr.members.length > 0) {tempAlphabetically.push(tempArr);}
      });
      setMembersAlphabetically(tempAlphabetically);
  
      console.log('finished sorting')
      console.log(membersByRole);
      console.log(membersByTeam);
      console.log(membersAlphabetically);
      setIsLoading(false);
    }
    setIsLoading(true);
    fetchData();
  }, []);

  const handleSortClick = (type: SORT_TYPE) => {
    setSortType(type);
  }

    return (
      <div>
        { isLoading ? 
          <div style={{padding:'200px', width:'300px', margin: 'auto'}}>
            <CircularProgress />
          </div>
        :
        <div className='members-container'>
          <div className='sorting-section'>
            <Typography variant='h5'>
              Sort by:
            </Typography>
            <ButtonGroup>
              <Button onClick={() => handleSortClick(SORT_TYPE.ROLE)} disableRipple={sortType === SORT_TYPE.ROLE} className={sortType === SORT_TYPE.ROLE ? 'selected' : 'unselected'}>Role</Button>
              {/* <Button onClick={() => handleSortClick(SORT_TYPE.TEAM)} disableRipple={sortType === SORT_TYPE.TEAM} className={sortType === SORT_TYPE.TEAM ? 'selected' : 'unselected'}>Team</Button> */}
              <Button onClick={() => handleSortClick(SORT_TYPE.ALPHABETICALLY)} disableRipple={sortType === SORT_TYPE.ALPHABETICALLY} className={sortType === SORT_TYPE.ALPHABETICALLY ? 'selected' : 'unselected'}>Alphabetical</Button>
            </ButtonGroup>
          </div>
          <div>
            {sortType === SORT_TYPE.ROLE ?
            <div>
              <div className='sort-group'>
                <Typography variant='h3'>Officers</Typography>
                <div>
                  {membersByRole.officers.map((member, index) => {
                    return (
                      <MemberInfoCard key={member.identifiers.gtID} member={member} isEven={index % 2 === 0} isFirst={index === 0} isLast={index === membersByRole.officers.length - 1}/>
                    )
                  })}
                </div>
              </div>
              <div className='sort-group'>
                <Typography variant='h3'>Members</Typography>
                <div>
                  {membersByRole.members.map((member, index) => {
                    return (
                      <MemberInfoCard key={member.identifiers.gtID} member={member} isEven={index % 2 === 0} isFirst={index === 0} isLast={index === membersByRole.members.length - 1}/>
                    )
                  })}
                </div>
              </div>
            </div>
            :
            sortType === SORT_TYPE.TEAM ?
            <div>
              {membersByTeam.map((team) => {
                return (
                  <div className='sort-group'>
                    <Typography variant='h3'>{team.team}</Typography>
                    <div style={{borderRadius: '5px'}} id='wesley'>
                      {team.members.map((member, index) => {
                        return (
                          <MemberInfoCard key={member.identifiers.gtID} member={member} isEven={index % 2 === 0} isFirst={index === 0} isLast={index === team.members.length - 1}/>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
            :
            <div>
              <div className='lettergroups-container'>
                {membersAlphabetically.map((letterGroup, index) => {
                  return (
                    <div key={letterGroup.letter}>
                      <Typography variant='h3'>{letterGroup.letter.toUpperCase()}</Typography>
                      <div>
                        {letterGroup.members.map((member, index) => {
                          return (
                            <MemberInfoCard key={member.identifiers.gtID} member={member} isEven={index % 2 === 0} isFirst={index === 0} isLast={index === letterGroup.members.length - 1}/>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            }
          </div>
        </div>}
      </div>
    );
  };
  
  export default MembersPage;