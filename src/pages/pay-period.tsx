import {NextPage} from 'next';
import {addDoc, getDocs, Timestamp} from '@firebase/firestore';
import {useEffect, useState} from 'react';
import {useTrackerStore} from '~/store/useTrackerStore';
import {selectPeriods, selectSetPeriods} from '~/store/selectors/periods';
import {collectionPayPeriods, makeArrayFromSnapshot} from '~/helpers/firebase';
import FormGroup from '~/components/FormGroup';
import Label from '~/components/Label';
import DateTimePicker from 'react-datetime-picker';
import config from '~/config/sites';

import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import formatTimestamp from '~/helpers/formatTimestamp';
import moment from 'moment';

const PayPeriod: NextPage = () => {
  const periods = useTrackerStore(selectPeriods);
  const setPeriods = useTrackerStore(selectSetPeriods);

  const [from, setFrom] = useState(new Date());
  const [to, setTo] = useState(new Date());

  useEffect(() => {
    const retrievePeriods = async () => {
      const periodsSnapshot = await getDocs(collectionPayPeriods);
      const periodsFromDb = makeArrayFromSnapshot(periodsSnapshot);
      console.log('periodsFromDb', periodsFromDb);
      setPeriods(periodsFromDb);
    };

    retrievePeriods();
  }, []);

  const createPayPeriod = async () => {
    console.log('createPayPeriod\n', `${to}\n`, `${from}\n`, `${Timestamp.now()}\n`);
    const newPayPeriod = await addDoc(collectionPayPeriods, {
      to,
      from,
      createdOn: Timestamp.now()
    });

    console.log('newPayPeriod', newPayPeriod.id);
  };

  return (
    <div className="container">
      <div className="bg-white py-3 px-6 drop-shadow-3xl flex justify-between">
        <h2 className="text-2xl font-medium">Pay Period</h2>
        <button
          type="button"
          className="hover:underline"
          onClick={() => createPayPeriod()}
        >
          Create
        </button>
      </div>

      <FormGroup>
        <Label id="from">From:</Label>
        <DateTimePicker
          id="from"
          value={from}
          format={config.dateTimeFormat}
          onChange={val => {
            setFrom(val as Date);
            setTo(val as Date);
          }}
        />
      </FormGroup>

      <FormGroup>
        <Label id="to">To:</Label>
        <DateTimePicker
          id="to"
          value={to}
          format={config.dateTimeFormat}
          onChange={val => setTo(val as Date)}
        />
      </FormGroup>

      <div className="wrapper">
        <div className="flex justify-between bg-white">
          <span>From</span>
          <span>To</span>
          <span>Created</span>
        </div>
      {periods.length > 0 && periods.map(period => {
        return (
          <div className="flex justify-between bg-white" key={period.id}>
            <span>{moment(period.from).format(config.momentFormat)}</span>
            <span>{moment(period.to).format(config.momentFormat)}</span>
            <span>{moment(period.createdOn).format(config.momentFormat)}</span>
          </div>
        );
      })}
      </div>
    </div>
  )
};

export default PayPeriod;