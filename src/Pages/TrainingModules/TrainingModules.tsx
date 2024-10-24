import { LinearProgress, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './TrainingModules.scss';
import SubsectionLink from '../../Components/SubsectionLink/SubsectionLink';
import subSectionsSample from '../../SampleData/SubsectionsSample';
import modulesSample from '../../SampleData/ModulesSample';
import membersSample from '../../SampleData/MembersSample';
import { ModuleProgress, ModulesPromise } from '../../Types/types';

const TrainingModulesPage = () => {

  const { moduleName } = useParams();
  const [module, setModule] = useState<ModulesPromise>({
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
      // Simulating API calls
      //   axios.get(`https://your-api-endpoint.com/moduleHtml/${moduleName}`) // replace
      //     .then((response) => {
      //       setHtmlContent(response.data.htmlContent); // Assume API returns { htmlContent: '<div>...</div>' }
      //     })
      //     .catch((error) => {
      //       console.error("Error fetching module HTML", error);
      //   });
      setTimeout(() => {
        setModule(modulesSample[0]); // change to last completed one
        setSubsections(module.subsections);
        const curr = module.subsections[0];
        setCurrSubsection(curr);
        setSubsectionHtml(subSectionsSample.find((subsection) => subsection.subsectionName === curr)?.subsectionHtml || '');
        setMemberProgress(membersSample[0].moduleProgress);
        setIsLoading(false);
      }, 300)
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
              <div className='subsection-links-container'>
                <Typography variant='h4'>Subsections</Typography>
                {subsections.map((subsection) => {
                  return (
                    <div onClick={() => handleSubsectionClick(subsection)}>
                      <SubsectionLink 
                        isCurrent={currSubsection === subsection} 
                        isCompleted={memberProgress.find((curr) => curr.moduleName === moduleName)?.subsectionsComplete.includes(subsection) ? true : false} 
                        name={subsection} 
                      />
                    </div>
                  );
                })}
              </div>
              <div className='module-container'>
                <Typography variant='h2'>{moduleName}</Typography> {/* {htmlContent.subsectionName} or something like that*/}
                {/* <div>paragraph here. include lorem ipsum and videos and stuff.</div>
                <div>
                  training module page: {moduleName}
                </div> */}
                <div dangerouslySetInnerHTML={{__html: subsectionHtml}}/>
              </div>
          </div>
        }
      </div>

    );
  };
  // hardcode styling and big divs: only include option to rewrite module subsections, names, etc
  
  export default TrainingModulesPage;