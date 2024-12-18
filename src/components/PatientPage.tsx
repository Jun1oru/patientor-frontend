import { useState, useEffect } from 'react';
import { Patient, Diagnosis, Entry } from '../types';
import patientService from '../services/patients';
import diagnosisService from '../services/diagnoses';
import { Male, Female } from '@mui/icons-material';
import HealthCheck from './EntryTypes/HealthCheck';
import OccupationalHealthcare from './EntryTypes/OccupationalHealthcare';
import Hospital from './EntryTypes/Hospital';
import { assertNever } from '../utils';
import AddEntryForm from './AddEntryForm';

interface Props {
  patientId: string;
}

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  switch (entry.type) {
    case 'HealthCheck':
      return <HealthCheck entry={entry} />;
    case 'OccupationalHealthcare':
      return <OccupationalHealthcare entry={entry} />;
    case 'Hospital':
      return <Hospital entry={entry} />;
    default:
      return assertNever(entry);
  }
};

const PatientPage = ({ patientId }: Props) => {
  const [patient, setPatient] = useState<Patient>();
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>();

  useEffect(() => {
    const fetchPatient = async (id: string) => {
      const patient = await patientService.getById(id);
      const diagnoses = await diagnosisService.getAll();
      setPatient(patient);
      setDiagnoses(diagnoses);
    };

    void fetchPatient(patientId);
  }, [patientId]);

  const updatePatient = (object: Patient): void => setPatient(object);

  if (patient && diagnoses) {
    return (
      <div>
        <h2>
          {patient.name}{' '}
          {patient.gender === 'male' ? (
            <Male />
          ) : patient.gender === 'female' ? (
            <Female />
          ) : (
            'other'
          )}
        </h2>
        <div>
          ssh: {patient.ssn}
          <br />
          occupation: {patient.occupation}
        </div>
        <AddEntryForm
          patient={patient}
          updatePatient={updatePatient}
        />
        {patient.entries && (
          <div>
            <h3>entries</h3>
            {patient.entries.map((entry) => (
              <EntryDetails key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div>
        <h1>Patient not found!</h1>
      </div>
    );
  }
};

export default PatientPage;
