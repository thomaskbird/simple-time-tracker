import moment from 'moment';
import config from '~/config/sites';

const formatTimestamp = (timeStamp: any): string => {
  return moment(timeStamp.toDate()).format(config.momentFormat);
}

export default formatTimestamp;