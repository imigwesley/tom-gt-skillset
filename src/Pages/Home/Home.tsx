import { useNavigate } from 'react-router-dom';
import './Home.scss';
import { Card, CardContent, CardMedia, LinearProgress, Typography } from "@mui/material";
import { useEffect, useState } from 'react';
import LinearProgressWithLabel from '../../Components/LinearProgressWithLabel/LinearProgressWithLabel';
import modulesSample from '../../SampleData/ModulesSample';
import membersSample from '../../SampleData/MembersSample';
import Module from 'module';
import { MemberInformation, ModuleInformation, PersonalModuleProgress, ModuleProgress, PageProps } from '../../Types/types';

const HomePage = ({user}: PageProps) => {

  const navigate = useNavigate();

  const [personalInfo, setPersonalInfo] = useState<MemberInformation>({
    identifiers: {
      userID: '',
      accountEmail: '',
      name: '',
      gtID: '',
      contactEmails: ['']
    },
    roles: {
        role: '',
        isAdmin: false
    },
    teams: {
        teamMembership: [''],
        teamsAdvising: ['']
    },
    moduleProgress: [{
        moduleName: '',
        percentComplete: 0.0,
        isAssigned: false,
        subsectionsComplete: []
    }]
  });

  const [modules, setModules] = useState<ModuleInformation[]>([
    {
      moduleName: '',
      subsections: ['', ''],
      imageURL: ''
    }
  ]);

  const [personalProgress, setPersonalProgress] = useState<PersonalModuleProgress>(
    {
      name: '',
      modules: [
        {
          isAssigned: false,
          progress: 0,
          moduleName: '',
          subsections: ['', ''],
          imageURL: '',
        }
      ]
  })
  const [isLoading, setIsLoading] = useState(true);
  
  

  useEffect(() => {
    const fetchData = async () => {
      // Simulating API calls
      setTimeout(() => {
        setModules(modulesSample);
        setPersonalInfo(membersSample[0]);

        const combinedModules = modules.map((module: ModuleInformation) => {
        const matchingProgressModule = personalInfo.moduleProgress.find((m: ModuleProgress) => m.moduleName === module.moduleName);
          return {
            ...module,
            progress: matchingProgressModule ? matchingProgressModule.percentComplete : 0,
            isAssigned: matchingProgressModule ? matchingProgressModule.isAssigned : false
          }
        })
        console.log('combined 1', combinedModules);
    
        combinedModules.sort((a, b) => {
          return Number(b.isAssigned) - Number(a.isAssigned);
        })
        console.log('combined 2', combinedModules);
    
        setPersonalProgress({
          name: (personalInfo as any).name,
          modules: combinedModules
        });
        setIsLoading(false);
      }, 300);
    };

    setIsLoading(true);
    fetchData();
  }, [modules, personalInfo]);
  

  const handleCardClick = (moduleName: string) => {
    console.log(moduleName);
    navigate(`/modules/${moduleName}`);
  }

  return (
    <div className='home-page-container'>
      {isLoading ? 
        <div style={{padding:'200px', width:'300px'}}>
          <LinearProgress />
        </div>
      :
        <div>
          <div className='header'>
            <Typography variant='h4' align='center'>
              Hello, {user?.username}! What would you like to learn today?
            </Typography>
          </div>
          <div className='module-card-container'>
            {personalProgress.modules.map((module, index) => {
              return (
                <Card className={`module-card ${module.isAssigned ? 'assigned' : 'notAssigned'}`} onClick={() => handleCardClick(module.moduleName)} key={index}>
                  <CardMedia
                    className='module-image'
                    image={module.imageURL}
                  />
                  <CardContent className='module-card-content'>
                    <Typography>
                      {module.moduleName}
                    </Typography>
                    <LinearProgressWithLabel progress={module.progress} />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      }
    </div>
  );
};

export default HomePage;