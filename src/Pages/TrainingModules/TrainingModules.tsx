import { Divider, LinearProgress, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './TrainingModules.scss';
import SubsectionLink from '../../Components/SubsectionLink/SubsectionLink';
import subSectionsSample from '../../SampleData/SubsectionsSample';
import modulesSample from '../../SampleData/ModulesSample';
import { ModuleProgress, ModuleInformation, PageProps, MemberInformation } from '../../Types/types';
import { getSingleUserData } from '../../utils/userApi';

const TrainingModulesPage = ({loggedInUser}: PageProps) => {
  const { moduleName } = useParams();
  const [module, setModule] = useState<ModuleInformation>({
    moduleName: '',
    subsections: [],
    imageURL: ''
  });
  const [subsectionHtml, setSubsectionHtml] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currSubsection, setCurrSubsection] = useState('');
  const [subsections, setSubsections] = useState(['']);
  const [memberProgress, setMemberProgress] = useState<ModuleProgress[]>([]);




  useEffect(() => {
    const fetchData = async () => {
      const singleUserResponse = await getSingleUserData(loggedInUser?.username);
      const tempCurrUser: MemberInformation = singleUserResponse[0];
      setModule(modulesSample[0]); // change to last completed one
      setSubsections(module.subsections);
      const curr = module.subsections[0];
      setCurrSubsection(curr);
      setSubsectionHtml(subSectionsSample.find((subsection) => subsection.subsectionName === curr)?.subsectionHtml || '');
      setMemberProgress(tempCurrUser.moduleProgress);
      setIsLoading(false);
    };

    setIsLoading(true);
    fetchData();
  }, [moduleName, module]);


  const handleSubsectionClick = (passedSubsection: string) => {
    console.log(passedSubsection);
    setCurrSubsection(passedSubsection);
    setSubsectionHtml(subSectionsSample.find((subsection) => subsection.subsectionName === passedSubsection)?.subsectionHtml || '')
  }

    return (
      <div>      
        {isLoading ?
          <div style={{padding:'200px', width:'300px', margin:'auto'}}>
            <LinearProgress />
          </div>
        :
          <div className='module-page-container'>
              <div className='background-card'>
                <Typography variant='h4'>{moduleName}</Typography>
                {subsections.map((subsection, index) => {
                  return (
                    <div key={index} onClick={() => handleSubsectionClick(subsection)}>
                      <SubsectionLink 
                        isCurrent={currSubsection === subsection} 
                        isCompleted={memberProgress.find((curr) => curr.moduleName === moduleName)?.subsectionsComplete.includes(subsection) ? true : false} 
                        name={subsection} 
                      />
                    </div>
                  );
                })}
              </div>

              <div className='module-container background-card'>
                <Typography variant='h3'>{currSubsection}</Typography>
                <Divider variant='middle' />
                <div className='quill'>
                  <div className='ql-snow'>
                    <div className='ql-editor' dangerouslySetInnerHTML={{__html: subsectionHtml || ''}}/>
                  </div>
                </div>
              </div>
          </div>
        }
      </div>

    );
  };
  // hardcode styling and big divs: only include option to rewrite module subsections, names, etc
  
  export default TrainingModulesPage;