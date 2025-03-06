import { downloadData, uploadData, remove } from 'aws-amplify/storage';


export async function getFile(filePath: string) {
    const { body, eTag } = await downloadData({
        path: filePath,
        options: {
            onProgress: ({ transferredBytes, totalBytes }) => {
              if (totalBytes) {
                console.log(
                  `Download progress ${
                    Math.round((transferredBytes / totalBytes) * 100)
                  } %`
                );
              }
            }
        }
    }).result;
    const blob = await body.blob();
    return URL.createObjectURL(blob);
}

export async function uploadFile(file: File, isImage: boolean) {
    console.log('file to upload is ', file);
    try {
        const result = await uploadData({
          path: `public/${isImage ? 'images' : 'submissions'}/${file.name}`, 
          data: file,
          options: {
            onProgress: ({ transferredBytes, totalBytes }) => {
              if (totalBytes) {
                console.log(
                  `Upload progress ${
                    Math.round((transferredBytes / totalBytes) * 100)
                  } %`
                );
              }
            }
          }
        }).result;
        console.log('Succeeded: ', result);
        return result.path;
    } catch (error) {
        console.log('Error : ', error);
    }
}

export async function deleteFile(deletePath: string, isImage: boolean) {
  console.log('deleting file at this path: ', deletePath);
  try{
    await remove({ 
      path: deletePath,
    });
  } catch (e) {
    console.log('Error deleting file: ', e)
  }
}

export async function downloadFile(filePath: string, fileName: string) {
  try {
    const { body } = await downloadData({
      path: filePath,
      options: {
        onProgress: ({ transferredBytes, totalBytes }) => {
          if (totalBytes) {
            console.log(
              `Download progress ${Math.round((transferredBytes / totalBytes) * 100)}%`
            );
          }
        }
      }
    }).result;
    
    const blob = await body.blob();
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName; // Set the filename for the downloaded file
    document.body.appendChild(a);
    a.click(); // Trigger download
    document.body.removeChild(a); // Clean up
    
    // Free up the URL object after some time
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (error) {
    console.error('Error downloading file:', error);
  }
}
