import AWS from 'aws-sdk';
import {SPACE_ACCESS_TOKEN,SPACE_SECRET,SPACE_ENDPOINT,SPACE_BUCKET} from './env'
/**
 * Digital Ocean Spaces Connection
 */

const spacesEndpoint = new AWS.Endpoint(SPACE_ENDPOINT);
const s3 = new AWS.S3({
      endpoint: SPACE_ENDPOINT,
      accessKeyId: SPACE_ACCESS_TOKEN,
      secretAccessKey: SPACE_SECRET
    });
export default s3
