import './About.scss'
import { Typography } from "@mui/material";

const AboutPage = () => {


    return (
      <div className='about-container'>
        <div className='text-container'>
          <Typography variant='h2'>
            About Skillset
          </Typography>

          <div className='paragraph'>
            <Typography variant='body1'>
              &emsp;&emsp;&emsp;&emsp;&emsp;Lorem ipsum odor amet, consectetuer adipiscing elit. Ex sagittis euismod sodales augue praesent hendrerit quisque? Dolor augue habitant vivamus nulla sagittis dui egestas. Diam fusce massa faucibus, consequat aliquet penatibus suscipit porta. Nam maximus sit praesent commodo sollicitudin euismod taciti. Dis habitasse vitae aliquam; ultricies commodo dapibus. Ex conubia metus velit non conubia, sapien duis ante neque. Augue elementum tristique ac sed dolor.
            </Typography>
          </div>

          <div className='paragraph'>
            <Typography variant='h5'>
              History
            </Typography>
            <Typography variant='body1'>
              &emsp;&emsp;&emsp;&emsp;&emsp;Laoreet non primis placerat neque pharetra sodales, luctus fermentum. Rutrum posuere arcu egestas, accumsan praesent tristique. Placerat potenti eu laoreet aenean nullam suspendisse. Vel sapien eget arcu hac massa potenti condimentum euismod. Dapibus hac ipsum per ultrices nisl ad. Venenatis dictumst quam parturient nulla penatibus aenean. Molestie odio ac risus quisque; eu facilisis suspendisse integer. Eleifend pretium velit faucibus ultricies; gravida dapibus massa.
            </Typography>
          </div>
          
          <div className='paragraph'>
            <Typography variant='h5'>
              Teams
            </Typography>
            <Typography variant='body1'>
              &emsp;&emsp;&emsp;&emsp;&emsp;Luctus finibus magna aptent, magnis scelerisque ac. Taciti vehicula auctor tempor turpis orci morbi? Dapibus tristique malesuada sed; et porta fringilla habitant. Commodo risus elit facilisi aenean suspendisse varius facilisis sociosqu. Cras fermentum facilisis habitasse; pulvinar ligula amet. Congue consectetur ultricies himenaeos class habitant tellus himenaeos rutrum tempor. Litora cubilia mattis taciti parturient; convallis cubilia posuere ligula. Netus ultricies class enim vel inceptos pellentesque risus per. Magna varius primis mauris dapibus inceptos suscipit sagittis.
            </Typography>
          </div>
          
          <div className='paragraph'>
            <Typography variant='h5'>
              Other
            </Typography>
            <Typography variant='body1'>  
              &emsp;&emsp;&emsp;&emsp;&emsp;Lacinia sapien tellus rutrum porttitor inceptos primis. Nec luctus sociosqu convallis conubia id per fusce tincidunt. Semper mi elit elementum sem dictumst ultrices curabitur laoreet cursus? Arcu dapibus elit magnis, volutpat ac ultrices. Tempor nisi conubia vulputate primis pretium maximus. Ex gravida nisl nascetur litora sollicitudin, enim aptent per. Diam duis tempor; dictum urna habitasse sagittis. Aptent rhoncus gravida adipiscing vehicula scelerisque aliquet. Lacinia ante mauris facilisis bibendum proin luctus nascetur. Vivamus congue tincidunt neque vitae odio ultricies.
            </Typography>
          </div>
        </div>
        <div className='image-container'>
          <img src='/kangaroo.jpg' />
          <img src='/dingobaby.jpg' />
        </div>
      </div>
    );
  };
  
  export default AboutPage;