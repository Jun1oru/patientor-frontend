import { HealthCheckEntry } from '../../types';
import { Card } from '@mui/material';
import { MedicalInformation, Favorite } from '@mui/icons-material';

interface Props {
  entry: HealthCheckEntry;
}

const HealthCheck = ({ entry }: Props) => {
  return (
    <Card style={{ paddingLeft: '1rem' }}>
      <p>
        {entry.date} <MedicalInformation />
      </p>
      <p>{entry.description}</p>
      <p>
        <Favorite style={{ color: 'green' }} />
      </p>
      <p>diagnose by {entry.specialist}</p>
    </Card>
  );
};

export default HealthCheck;
