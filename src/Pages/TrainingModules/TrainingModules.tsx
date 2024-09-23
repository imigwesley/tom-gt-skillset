import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const TrainingModulesPage = () => {

  const { moduleName } = useParams();
  useEffect(() => {
    console.log('module name changed/established. now is ' + moduleName);
  },[moduleName]);

    return (
      <p>
        training module page: {moduleName}
      </p>
    );
  };
  
  export default TrainingModulesPage;