import { useNavigate } from 'react-router-dom';
import './Home.scss';
import { Card, CardContent, CardMedia, LinearProgress, Typography } from "@mui/material";
import { useEffect, useState } from 'react';
import LinearProgressWithLabel from '../../Components/LinearProgressWithLabel/LinearProgressWithLabel';

const HomePage = () => {

  interface Module {
    name: string,
    progress: number,
    src: string,
    isAssigned: boolean
  };

  interface ModulesAndProgress {
    name: string,
    modules: Module[]
  }

  const navigate = useNavigate();

  const [modulesAndProgress, setModulesAndProgress] = useState<ModulesAndProgress>({
    name: '',
    modules: []
  });

  const [isLoading, setIsLoading] = useState(true);

  // idea for modules is to store html in a dynamo table. Make call to retrieve html code. admins can edit it and post/update it. 
  // will need to make api call to grab html. Since there won't be really anything dynamic it should be fine to do this.
  // will need to make a GET /modules/allsubsections/{module_name}: get html code. Should do a useState, {isSubsection1 && <Subsection1/>}

  // TODO: need to put image, module name in dynamo tables
  // going to need to also put html in sections for next page

  // should also load person's progress and match it up with all modules

  

  useEffect(() => {
    const fetchData = async () => {
      // Simulating API call for personal progress
      const personalProgress = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            name: 'Wesley',
            modules: [
              { name: "Uluru or Ayer's Rock", progress: 67.77, isAssigned: false },
              { name: "Shrimp on the Barbie", progress: 0.00, isAssigned: true },
              { name: "Didgeridoos", progress: 0.00, isAssigned: false },
              { name: "Dingos", progress: 12.00, isAssigned: false },
              { name: "Kangaroos", progress: 0.00, isAssigned: false },
            ]
          });
        }, 500); // Simulate network delay
      });

      // Simulating API call for returned modules
      const returnedModules = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            modules: [
              { name: "Uluru or Ayer's Rock", src: "/ayersrockuluru.jpg" },
              { name: "Shrimp on the Barbie", src: "/barbieshrimp.jpg" },
              { name: "Didgeridoos", src: "/didgeridoo.jpg" },
              { name: "Dingos", src: "/dingobaby.jpg" },
              { name: "Kangaroos", src: "/kangaroo.jpg" },
            ]
          });
        }, 500); // Simulate network delay
      });

      // Combine personalProgress and returnedModules
      const combinedModules = (returnedModules as any).modules.map((module: Module) => {
        const progressModule = (personalProgress as any).modules.find((m: Module) => m.name === module.name);
        return {
          ...module,
          progress: progressModule ? progressModule.progress : 0,
          isAssigned: progressModule.isAssigned,
        };
      });

      console.log(combinedModules)
      combinedModules.sort((a: Module, b:Module) => {
        return Number(b.isAssigned) - Number(a.isAssigned)
      })

      setModulesAndProgress({
        name: (personalProgress as any).name,
        modules: combinedModules
      });
      setIsLoading(false);
    };

    setIsLoading(true);
    fetchData();
  }, []);
  

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
              Hello, {modulesAndProgress.name}! What would you like to learn today?
            </Typography>
          </div>
          <div className='module-card-container'>
            {modulesAndProgress.modules.map((module, index) => {
              return (
                <Card className={`module-card ${module.isAssigned ? 'assigned' : 'notAssigned'}`} onClick={() => handleCardClick(module.name)} key={index}>
                  <CardMedia
                    className='module-image'
                    image={module.src}
                  />
                  <CardContent className='card-content'>
                    <Typography>
                      {module.name}
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