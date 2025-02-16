import { downloadData, uploadData } from 'aws-amplify/storage';


export async function getFile(filePath: string) {
    const { body, eTag } = await downloadData({
        path: `public/images/${filePath}`,
        options: {
            onProgress: (event) => {
                console.log(event.transferredBytes);
            }, // optional progress callback
            bytesRange: {
                start: 1024,
                end: 2048
            } // optional bytes range parameter to download a part of the file, the 2nd MB of the file in this example
        }
    }).result;
}

export async function uploadFile(file: File) {
    console.log('file to upload is ', file);
    try {
        const result = await uploadData({
          path: `public/images/${file.name}`, 
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
    } catch (error) {
        console.log('Error : ', error);
    }
}