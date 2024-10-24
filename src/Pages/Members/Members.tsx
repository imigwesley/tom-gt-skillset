import { useEffect, useState } from 'react';
import './Members.scss';
import { Avatar, Button, ButtonGroup, Typography } from '@mui/material';
import members from '../../SampleData/MembersSample';
import MemberInfoCard from '../../Components/MemberInfoCard/MemberInfoCard';

const MembersPage = () => {
  enum SORT_TYPE {
    ROLE,
    TEAM,
    ALPHABETICALLY
  }
  interface Member {
    name: string,
    email: string[],
    teamMembership: string[],
    teamsAdvising: string[],
    role: string,
    isExec: boolean,
}

  interface ByRole {
    members: Member[],
    officers: Member[]
  }

  interface ByTeam {
    team: string,
    members: Member[],
    advisors: Member[]
  }

  interface Alphabetically {
    letter: string,
    members: Member[]
  }

  // TODO: replace these with api calls
  const [teams, setTeams] = useState(['CAD', 'Engineering', 'Design', 'Operations', 'Marketing'])
  const allMembers = members;

  const [membersByRole, setMembersByRole] = useState<ByRole>({'officers': [], 'members': []});
  const [membersByTeam, setMembersByTeam] = useState<ByTeam[]>([{'team': '', 'members': [], 'advisors': []}]);
  const [membersAlphabetically, setMembersAlphabetically] = useState<Alphabetically[]>([{'letter': '', 'members': []}]);
  const [sortType, setSortType] = useState(SORT_TYPE.ROLE);

  useEffect(() => {
    // group members by role
    const tempByRole = {
      'officers': allMembers.filter((member) => member.isExec === true),
      'members': allMembers.filter((member) => member.isExec === false).sort((a, b) => a.name > b.name ? 0 : -1),
    };
    setMembersByRole(tempByRole);

    // group members by team
    let tempByTeam: ByTeam[] = [];
    teams.forEach((team) => {
      tempByTeam.push(
        {
          'team': team,
          'members': allMembers.filter((member) => member.teamMembership.includes(team)),
          'advisors': allMembers.filter((member) => member.teamsAdvising.includes(team))
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
        'members': allMembers.filter((member) => member.name[0].toLowerCase() === letter)
      }
      if (tempArr.members.length > 0) {tempAlphabetically.push(tempArr);}
    });
    setMembersAlphabetically(tempAlphabetically);


    console.log(membersByRole);
    console.log(membersByTeam);
    console.log(membersAlphabetically);

  }, []);

  const handleSortClick = (type: SORT_TYPE) => {
    setSortType(type);
  }

    return (
      <div className='members-container'>
        <div className='sorting-section'>
          <Typography>
            Sort by:
          </Typography>
          <ButtonGroup>
            <Button onClick={() => handleSortClick(SORT_TYPE.ROLE)} variant={sortType === SORT_TYPE.ROLE ? 'contained' : 'outlined'}>Role</Button>
            <Button onClick={() => handleSortClick(SORT_TYPE.TEAM)} variant={sortType === SORT_TYPE.TEAM ? 'contained' : 'outlined'}>Team</Button>
            <Button onClick={() => handleSortClick(SORT_TYPE.ALPHABETICALLY)} variant={sortType === SORT_TYPE.ALPHABETICALLY ? 'contained' : 'outlined'}>Alphabetically</Button>
          </ButtonGroup>
        </div>
        <div>
          {sortType === SORT_TYPE.ROLE ?
          <div>
            <Typography variant='h3'>Officers</Typography>
            <div>
              {membersByRole.officers.map((member, index) => {
                return (
                  <MemberInfoCard member={member} isEven={index % 2 === 0} />
                )
              })}
            </div>
            <Typography variant='h3'>Members</Typography>
            <div>
              {membersByRole.members.map((member, index) => {
                return (
                  <MemberInfoCard member={member} isEven={index % 2 === 0}/>
                )
              })}
            </div>
          </div>
          :
          sortType === SORT_TYPE.TEAM ?
          <div>
            {membersByTeam.map((team) => {
              return (
                <div>
                  <Typography variant='h3'>{team.team}</Typography>
                  <div>
                    {team.members.map((member, index) => {
                      return (
                        <MemberInfoCard member={member} isEven={index % 2 === 0}/>
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
              {membersAlphabetically.map((letterGroup) => {
                return (
                  <div>
                    <Typography variant='h3'>{letterGroup.letter.toUpperCase()}</Typography>
                    <div>
                      {letterGroup.members.map((member, index) => {
                        return (
                          <MemberInfoCard member={member} isEven={index % 2 === 0}/>
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
        
        
      </div>
    );
  };
  
  export default MembersPage;