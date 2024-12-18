import { HospitalEntry } from '../../types';
import { Card } from '@mui/material';
import { LocalHospital, Favorite } from '@mui/icons-material';

interface Props {
  entry: HospitalEntry;
}

const Hospital = ({ entry }: Props) => {
  return (
    <Card style={{ paddingLeft: '1rem' }}>
      <p>
        {entry.date} <LocalHospital />
      </p>
      <p>{entry.description}</p>
      <p>
        <Favorite style={{ color: 'red' }} />
      </p>
      <p>diagnose by {entry.specialist}</p>
    </Card>
  );
};

export default Hospital;
