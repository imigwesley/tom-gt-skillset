import { downloadData, uploadData, remove } from 'aws-amplify/storage';


export async function getFile(filePath: string) {
    const { body, eTag } = await downloadData({
        path: filePath,
        options: {
            onProgress: ({ transferredBytes, totalBytes }) => {
              if (totalBytes && totalBytes % 20 === 0) {
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
    // console.log('file to upload is ', file);
    try {
        const result = await uploadData({
          path: `public/${isImage ? 'images' : 'submissions'}/${file.name}`, 
          data: file,
          options: {
            onProgress: ({ transferredBytes, totalBytes }) => {
              if (totalBytes && totalBytes % 20 === 0) {
                console.log(
                  `Upload progress ${
                    Math.round((transferredBytes / totalBytes) * 100)
                  } %`
                );
              }
            }
          }
        }).result;
        // console.log('Succeeded: ', result);
        return result.path;
    } catch (error) {
        console.warn('Error : ', error);
    }
}

export async function deleteFile(deletePath: string, isImage: boolean) {
  // console.log('deleting file at this path: ', deletePath);
  try{
    await remove({ 
      path: deletePath,
    });
  } catch (e) {
    console.warn('Error deleting file: ', e)
  }
}

export async function downloadFile(filePath: string, fileName: string) {
  try {
    const { body } = await downloadData({
      path: filePath,
      options: {
        onProgress: ({ transferredBytes, totalBytes }) => {
          if (totalBytes && totalBytes % 20 === 0) {
            console.log(
              `Download progress ${Math.round((transferredBytes / totalBytes) * 100)}%`
            );
          }
        }
      }
    }).result;
    
    const blob = await body.blob();
    const url = URL.createObjectURL(blob);

    // javascript to download file
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // free up URL object after some time
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (error) {
    console.warn('Error downloading file:', error);
  }
}
