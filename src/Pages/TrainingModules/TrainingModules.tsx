import { LinearProgress, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './TrainingModules.scss';
import SubsectionLink from '../../Components/SubsectionLink/SubsectionLink';

const TrainingModulesPage = () => {

  interface ModulePromise {
    moduleName: string,
    htmlContent: string
  }

  const { moduleName } = useParams();
  const [htmlContent, setHtmlContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('module name changed/established. now is ' + moduleName);
  },[moduleName]);


  useEffect(() => {

    const fetchData = async () => {

      // Simulating API call for html. remove when integrating
      const returnedHtmlForSpecificModule = await new Promise<ModulePromise>((resolve) => {
        setTimeout(() => {
          resolve({
            moduleName: 'kangaroos',
            htmlContent: '<strong>this is from the api payload</strong>'
          });
        }, 500); // Simulate network delay
      });
      setHtmlContent(returnedHtmlForSpecificModule.htmlContent);


  //   axios.get(`https://your-api-endpoint.com/moduleHtml/${moduleName}`) // replace
  //     .then((response) => {
  //       setHtmlContent(response.data.htmlContent); // Assume API returns { htmlContent: '<div>...</div>' }
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching module HTML", error);
  //   });

      setIsLoading(false);
    };

    setIsLoading(true);
    fetchData();
  }, []);

    return (
      <div>      
        {isLoading ?
          <div style={{padding:'200px', width:'300px'}}>
            <LinearProgress />
          </div>
        :
          <div className='module-page-container'>
              <div className='subsection-links-container'>
                <Typography variant='h5'>Subsections</Typography>
                <SubsectionLink isCompleted={true} name={'Learn to catch a crikey'}/>
                <SubsectionLink isCompleted={false} name={'Kookaburra watching'}/>
                <SubsectionLink isCompleted={false} name={'Meat pie eating'}/>
                <SubsectionLink isCompleted={false} name={'Explore Queensland'}/>
                <SubsectionLink isCompleted={false} name={'Go to 42 wallaby way'}/>
              </div>
              <div className='module-container'>
                <Typography variant='h2'>Subsection Name</Typography> {/* {htmlContent.subsectionName} or something like that*/}
                <div>paragraph here. include lorem ipsum and videos and stuff.</div>
                <div>
                  training module page: {moduleName}
                </div>
              </div>
          </div>
        }
      </div>

    );
  };
  // hardcode styling and big divs: only include option to rewrite module subsections, names, etc
  
  export default TrainingModulesPage;