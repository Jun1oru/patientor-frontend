import { OccupationalHealthcareEntry } from '../../types';
import { Card } from '@mui/material';
import { MedicalServices, Favorite } from '@mui/icons-material';

interface Props {
  entry: OccupationalHealthcareEntry;
}

const OccupationalHealthcare = ({ entry }: Props) => {
  return (
    <Card style={{ paddingLeft: '1rem' }}>
      <p>
        {entry.date} <MedicalServices /> {entry.employerName}
      </p>
      <p>{entry.description}</p>
      <p>
        <Favorite style={{ color: 'yellow' }} />
      </p>
      <p>diagnose by {entry.specialist}</p>
    </Card>
  );
};

export default OccupationalHealthcare;
