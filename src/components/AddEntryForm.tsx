import {
  EntryFormValues,
  Patient,
  HealthCheckRating,
  Diagnosis,
} from '../types';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Input,
  Stack,
  Select,
  SelectChangeEvent,
  OutlinedInput,
  MenuItem,
} from '@mui/material';
import {
  MedicalInformation,
  MedicalServices,
  LocalHospital,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateRange } from '@mui/x-date-pickers-pro/models';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import dayjs, { Dayjs } from 'dayjs';
import { useState, SyntheticEvent } from 'react';
import axios from 'axios';
import patientService from '../services/patients';

interface Props {
  patient: Patient;
  updatePatient: (object: Patient) => void;
}

type EntryType =
  | 'HealthCheck'
  | 'OccupationalHealthcare'
  | 'Hospital';

const AddEntryForm = ({ patient, updatePatient }: Props) => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [entryType, setEntryType] =
    useState<EntryType>('HealthCheck');
  const [description, setDescription] = useState<string>('');
  const [dateInput, setDateInput] = useState<Dayjs | null>(null);
  const [specialist, setSpecialist] = useState<string>('');
  const [healthCheckRating, setHealthCheckRating] =
    useState<HealthCheckRating>(0);
  const [employerName, setEmployerName] = useState<string>('');
  const [sickLeaveDate, setSickLeaveDate] = useState<
    DateRange<Dayjs>
  >([dayjs('2024-12-17'), dayjs('2024-12-18')]);
  const [dischargeDate, setDischargeDate] = useState<Dayjs | null>(
    null
  );
  const [dischargeCriteria, setDischargeCriteria] =
    useState<string>('');
  const [diagnosisCodes, setDiagnosisCodes] = useState<
    Array<Diagnosis['code']>
  >([]);

  const openForm = (): void => setFormOpen(true);

  const clearInputs = (): void => {
    setDescription('');
    setDateInput(null);
    setSpecialist('');
    setHealthCheckRating(0);
    setEmployerName('');
    setSickLeaveDate([dayjs('2024-12-17'), dayjs('2024-12-18')]);
    setDischargeDate(null);
    setDischargeCriteria('');
    setDiagnosisCodes([]);
    setError(undefined);
  };

  const closeForm = (): void => {
    clearInputs();
    setFormOpen(false);
  };

  const submitNewEntry = async (values: EntryFormValues) => {
    try {
      if (patient) {
        await patientService.createEntry(patient.id, values);

        const updatedPatient = await patientService.getById(
          patient.id
        );
        updatePatient(updatedPatient);
        setFormOpen(false);
      }
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (
          e?.response?.data &&
          typeof e?.response?.data === 'string'
        ) {
          const message = e.response.data.replace(
            'Something went wrong. Error: ',
            ''
          );
          console.error(message);
          setError(message);
        } else {
          setError('Unrecognized axios error');
        }
      } else {
        console.error('Unknown error', e);
        setError('Unknown error');
      }
    }
  };

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();
    const date = dateInput?.format('YYYY-MM-DD');
    const startDate = sickLeaveDate[0]?.format('YYYY-MM-DD');
    const endDate = sickLeaveDate[1]?.format('YYYY-MM-DD');
    const dischargeDateFormatted =
      dischargeDate?.format('YYYY-MM-DD');

    if (date) {
      if (entryType === 'HealthCheck') {
        submitNewEntry({
          type: entryType,
          description,
          date,
          specialist,
          healthCheckRating,
          diagnosisCodes,
        });
      } else if (entryType === 'OccupationalHealthcare') {
        if (startDate && endDate) {
          submitNewEntry({
            type: entryType,
            description,
            date,
            specialist,
            employerName,
            sickLeave: {
              startDate,
              endDate,
            },
            diagnosisCodes,
          });
        } else {
          submitNewEntry({
            type: entryType,
            description,
            date,
            specialist,
            employerName,
            diagnosisCodes,
          });
        }
      } else if (entryType === 'Hospital') {
        if (dischargeDateFormatted && dischargeCriteria) {
          submitNewEntry({
            type: entryType,
            description,
            date,
            specialist,
            discharge: {
              date: dischargeDateFormatted,
              criteria: dischargeCriteria,
            },
            diagnosisCodes,
          });
        } else {
          submitNewEntry({
            type: entryType,
            description,
            date,
            specialist,
            diagnosisCodes,
          });
        }
      }
    }

    clearInputs();
  };

  const handleTypeChange = (event: SelectChangeEvent<EntryType>) => {
    const {
      target: { value },
    } = event;
    if (
      value === 'HealthCheck' ||
      value === 'OccupationalHealthcare' ||
      value === 'Hospital'
    ) {
      clearInputs();
      setEntryType(value);
    }
  };

  const handleRatingChange = (
    event: SelectChangeEvent<HealthCheckRating>
  ) => {
    const {
      target: { value },
    } = event;
    if (value === 0 || value === 1 || value === 2 || value === 3) {
      setHealthCheckRating(value);
    }
  };

  const handleDiagnosisChange = (
    event: SelectChangeEvent<typeof diagnosisCodes>
  ) => {
    const {
      target: { value },
    } = event;
    setDiagnosisCodes(
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const entryTypesInput: EntryType[] = [
    'HealthCheck',
    'OccupationalHealthcare',
    'Hospital',
  ];

  const healthRatingInput: HealthCheckRating[] = [0, 1, 2, 3];

  const diagnosisCodesInput: typeof diagnosisCodes = [
    'M24.2',
    'M51.2',
    'S03.5',
    'J10.1',
    'J06.9',
    'Z57.1',
    'N30.0',
    'H54.7',
    'J03.0',
    'L60.1',
    'Z74.3',
    'L20',
    'F43.2',
    'S62.5',
    'H35.29',
  ];

  if (!formOpen) {
    return (
      <Button
        variant="contained"
        onClick={openForm}
        size="medium"
        sx={{ margin: '1rem 0' }}
      >
        Add Entry
      </Button>
    );
  } else {
    return (
      <Box
        component="section"
        sx={{
          border: '2px dotted black',
          margin: '1rem 0',
          paddingLeft: '1rem',
        }}
      >
        <h4>{error}</h4>
        {entryType === 'HealthCheck' && (
          <h4
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              textAlign: 'center',
            }}
          >
            New HealthCheck Entry
            <MedicalInformation />
          </h4>
        )}
        {entryType === 'OccupationalHealthcare' && (
          <h4
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              textAlign: 'center',
            }}
          >
            New OccupationalHealthcare Entry
            <MedicalServices />
          </h4>
        )}
        {entryType === 'Hospital' && (
          <h4
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              textAlign: 'center',
            }}
          >
            New Hospital Entry <LocalHospital />
          </h4>
        )}
        <Box component="form" noValidate autoComplete="off">
          <Stack spacing={2} sx={{ paddingRight: '1rem' }}>
            <FormControl>
              <InputLabel htmlFor="entryType-select-label">
                Entry type:
              </InputLabel>
              <Select
                labelId="entryType-select-label"
                id="entryType-select"
                value={entryType}
                onChange={handleTypeChange}
                input={<OutlinedInput label="Entry type" />}
              >
                {entryTypesInput.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel htmlFor="description">
                Description
              </InputLabel>
              <Input
                id="description"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
              />
            </FormControl>
            <FormControl>
              <DatePicker
                label="Date"
                value={dateInput}
                onChange={(newValue) => setDateInput(newValue)}
              />
            </FormControl>
            <FormControl>
              <InputLabel htmlFor="specialist">Specialist</InputLabel>
              <Input
                id="specialist"
                value={specialist}
                onChange={(event) =>
                  setSpecialist(event.target.value)
                }
              />
            </FormControl>
            {entryType === 'HealthCheck' && (
              <FormControl>
                <InputLabel htmlFor="healthRating-select-label">
                  Healthcheck Rating:
                </InputLabel>
                <Select
                  labelId="healthRating-select-label"
                  id="healthRating-select"
                  value={healthCheckRating}
                  onChange={handleRatingChange}
                  input={<OutlinedInput label="Healthcheck Rating" />}
                >
                  {healthRatingInput.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {entryType === 'OccupationalHealthcare' && (
              <>
                <FormControl>
                  <InputLabel htmlFor="employerName">
                    Employer
                  </InputLabel>
                  <Input
                    id="employerName"
                    value={employerName}
                    onChange={(event) =>
                      setEmployerName(event.target.value)
                    }
                  />
                </FormControl>
                <FormControl>
                  <DateRangePicker
                    value={sickLeaveDate}
                    onChange={(newValue) =>
                      setSickLeaveDate(newValue)
                    }
                  />
                </FormControl>
              </>
            )}
            {entryType === 'Hospital' && (
              <>
                <FormControl>
                  <DatePicker
                    label="dischargeDate"
                    value={dischargeDate}
                    onChange={(newValue) =>
                      setDischargeDate(newValue)
                    }
                  />
                </FormControl>
                <FormControl>
                  <InputLabel htmlFor="dischargeCriteria">
                    Discharge criteria
                  </InputLabel>
                  <Input
                    id="dischargeCriteria"
                    value={dischargeCriteria}
                    onChange={(event) =>
                      setDischargeCriteria(event.target.value)
                    }
                  />
                </FormControl>
              </>
            )}
            <FormControl>
              <InputLabel htmlFor="diagnosisCodes-select-label">
                Diagnosis codes:
              </InputLabel>
              <Select
                labelId="diagnosisCodes-select-label"
                id="diagnosisCodes-select"
                value={diagnosisCodes}
                onChange={handleDiagnosisChange}
                multiple
                input={<OutlinedInput label="Diagnosis codes" />}
              >
                {diagnosisCodesInput.map((code) => (
                  <MenuItem key={code} value={code}>
                    {code}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <Stack
            direction="row"
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Button
              variant="contained"
              onClick={closeForm}
              size="medium"
              color="error"
              sx={{ margin: '1rem 0' }}
            >
              CANCEL
            </Button>
            <Button
              variant="contained"
              onClick={addEntry}
              size="medium"
              color="success"
              sx={{ marginY: '1rem', marginRight: '1rem' }}
            >
              ADD
            </Button>
          </Stack>
        </Box>
      </Box>
    );
  }
};

export default AddEntryForm;
