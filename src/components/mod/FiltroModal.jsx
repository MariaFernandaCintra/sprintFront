import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  Button,
  IconButton,
  Typography,
  Box,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Close as CloseIcon,
  FilterList as FilterListIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon,
  CheckBox as CheckBoxIcon,
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import DiasModal from './DiasModal';

function FiltroModal({ visible, onClose, onApplyFilters }) {
  const [dataInicio, setDataInicio] = useState(new Date());
  const [dataFim, setDataFim] = useState(new Date());
  const [horaInicio, setHoraInicio] = useState(new Date());
  const [horaFim, setHoraFim] = useState(new Date());

  const [selectedDays, setSelectedDays] = useState([]);
  const [validDays, setValidDays] = useState([]);
  const [showDaySelectionModal, setShowDaySelectionModal] = useState(false);

  const diasSemanaMap = {
    1: "Segunda-Feira",
    2: "Terça-Feira",
    3: "Quarta-Feira",
    4: "Quinta-Feira",
    5: "Sexta-Feira",
    6: "Sábado",
  };
  const diasSemanaKeys = Object.keys(diasSemanaMap).map(Number).filter(key => key !== 0);

  const getDaysInRange = useCallback((startDate, endDate) => {
    const days = new Set();
    const current = new Date(startDate);
    current.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    while (current <= end) {
      const dayOfWeek = current.getDay();
      if (diasSemanaKeys.includes(dayOfWeek)) {
        days.add(dayOfWeek);
      }
      current.setDate(current.getDate() + 1);
    }
    return Array.from(days).sort((a, b) => a - b);
  }, [diasSemanaKeys]);

  useEffect(() => {
    const newCalculatedValidDays = getDaysInRange(dataInicio, dataFim);

    const areValidDaysEqual = validDays.length === newCalculatedValidDays.length &&
                              validDays.every((val, index) => val === newCalculatedValidDays[index]);

    if (!areValidDaysEqual) {
      setValidDays(newCalculatedValidDays);

      setSelectedDays((prevSelectedDays) => {
        const filteredDays = prevSelectedDays.filter((day) => newCalculatedValidDays.includes(day));
        const areSelectedDaysEqual = filteredDays.length === prevSelectedDays.length &&
                                     filteredDays.every((val, index) => val === prevSelectedDays[index]);
        if (!areSelectedDaysEqual) {
          return filteredDays;
        }
        return prevSelectedDays;
      });
    }
  }, [dataInicio, dataFim, getDaysInRange, validDays]);

  const toggleDay = (dayNum) => {
    setSelectedDays((prevSelectedDays) => {
      if (prevSelectedDays.includes(dayNum)) {
        return prevSelectedDays.filter((day) => day !== dayNum);
      } else {
        return [...prevSelectedDays, dayNum];
      }
    });
  };

  const formatDateForApi = (dateObj) => {
    if (!dateObj) return null;
    return format(dateObj, 'yyyy-MM-dd');
  };

  const formatTime24hForApi = (dateObj) => {
    if (!dateObj) return null;
    return format(dateObj, 'HH:mm:00');
  };

  const handleApply = () => {
    let diaSemanaToSend = null;
    if (selectedDays.length > 0) {
      if (selectedDays.length === 1) {
        diaSemanaToSend = selectedDays[0];
      } else {
        diaSemanaToSend = selectedDays;
      }
    }

    const filters = {
      data_inicio: formatDateForApi(dataInicio),
      data_fim: formatDateForApi(dataFim),
      hora_inicio: formatTime24hForApi(horaInicio),
      hora_fim: formatTime24hForApi(horaFim),
    };

    if (diaSemanaToSend !== null) {
      if (Array.isArray(diaSemanaToSend)) {
          filters.dias_semana = diaSemanaToSend;
      } else {
          filters.dias_semana = [diaSemanaToSend];
      }
    }

    onApplyFilters(filters);
    onClose();
  };

  const getSelectedDaysText = () => {
    if (selectedDays.length === 0) {
      return "Selecione os dias";
    }
    return selectedDays.map(dayNum => diasSemanaMap[dayNum]).join(", ");
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Dialog
        open={visible}
        onClose={onClose}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: styles.dialogPaper,
          },
        }}
      >
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={styles.closeButton}
        >
          <CloseIcon sx={{ fontSize: 30 }} />
        </IconButton>

        <Box sx={styles.headerContainer}>
          <Box sx={styles.filterIconCircle}>
            <FilterListIcon sx={styles.filterIcon} />
          </Box>
          <Typography variant="h5" component="h2" sx={styles.title}>
            Filtrar Salas
          </Typography>
        </Box>

        <DialogContent dividers sx={styles.dialogContent}>
          {/* DatePicker para Data Início */}
          <DatePicker
            label="Data Início"
            value={dataInicio}
            onChange={(newValue) => setDataInicio(newValue)}
            slotProps={{
              textField: {
                fullWidth: true,
                sx: styles.commonTextField,
                InputProps: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon sx={styles.inputIcon} />
                    </InputAdornment>
                  ),
                  readOnly: true,
                },
              },
            }}
          />

          {/* DatePicker para Data Fim */}
          <DatePicker
            label="Data Fim"
            value={dataFim}
            onChange={(newValue) => setDataFim(newValue)}
            slotProps={{
              textField: {
                fullWidth: true,
                sx: styles.commonTextField,
                InputProps: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon sx={styles.inputIcon} />
                    </InputAdornment>
                  ),
                  readOnly: true,
                },
              },
            }}
          />

          {/* TimePicker para Hora Início */}
          <TimePicker
            label="Hora Início"
            value={horaInicio}
            onChange={(newValue) => setHoraInicio(newValue)}
            ampm={false}
            slotProps={{
              textField: {
                fullWidth: true,
                sx: styles.commonTextField,
                InputProps: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTimeIcon sx={styles.inputIcon} />
                    </InputAdornment>
                  ),
                  readOnly: true,
                },
              },
            }}
          />

          {/* TimePicker para Hora Fim */}
          <TimePicker
            label="Hora Fim"
            value={horaFim}
            onChange={(newValue) => setHoraFim(newValue)}
            ampm={false}
            slotProps={{
              textField: {
                fullWidth: true,
                sx: styles.commonTextField,
                InputProps: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTimeIcon sx={styles.inputIcon} />
                    </InputAdornment>
                  ),
                  readOnly: true,
                },
              },
            }}
          />

          {/* TextField para Dias da Semana */}
          <TextField
            label="Dias da Semana"
            value={getSelectedDaysText()}
            fullWidth
            sx={styles.commonTextField}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CheckBoxIcon sx={styles.inputIcon} />
                </InputAdornment>
              ),
              readOnly: true,
            }}
            onClick={() => setShowDaySelectionModal(true)}
          />

          <Button
            variant="contained"
            onClick={handleApply}
            sx={styles.applyButton}
          >
            <Typography sx={styles.applyButtonText}>
              Aplicar Filtros
            </Typography>
          </Button>
        </DialogContent>
      </Dialog>

      <DiasModal
        visible={showDaySelectionModal}
        onClose={() => setShowDaySelectionModal(false)}
        validDays={validDays}
        selectedDays={selectedDays}
        toggleDay={toggleDay}
        diasSemanaMap={diasSemanaMap}
      />
    </LocalizationProvider>
  );
}

const styles = {
  dialogPaper: {
    borderRadius: 3,
    p: { sm: 3 },
    position: 'relative',
    boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    color: '#999',
    padding: '5px',
    zIndex: 1,
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    mb: 2,
    pt: 2,
  },
  filterIconCircle: {
    backgroundColor: 'rgb(177, 16, 16)',
    borderRadius: '50%',
    p: 2,
    mb: 1.5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: 70,
  },
  filterIcon: {
    color: 'white',
    fontSize: 48,
  },
  title: {
    fontWeight: 'bold',
    color: '#333',
    mb: 2,
  },
  dialogContent: {
    pt: 1,
    width: '89%',
    overflowX: 'auto',
  },
  commonTextField: {
    my: 1.5,
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      backgroundColor: '#f5f5f5',
      borderColor: '#ddd',
      fontSize: '1rem',
      color: '#333',
      cursor: 'pointer',
      '& fieldset': {
        borderColor: '#ddd',
      },
      '&:hover fieldset': {
        borderColor: '#bbb',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'rgb(177, 16, 16)',
        borderWidth: '1px',
      },
    },
    '& .MuiInputBase-input': {
      padding: '16px 14px',
      height: 'auto',
    },
    '& .MuiInputLabel-outlined': {
      transform: 'translate(14px, 16px) scale(1)',
      '&.MuiInputLabel-shrink': {
        transform: 'translate(14px, -9px) scale(0.75)',
      },
      color: 'gray',
    },
  },
  inputIcon: {
    mr: 1,
    color: 'gray',
  },
  applyButton: {
    mt: 3,
    mb: 1,
    backgroundColor: 'rgb(177, 16, 16)',
    '&:hover': {
      backgroundColor: 'darkred',
    },
    borderRadius: '10px',
    py: 2,
    fontSize: '1.1rem',
    fontWeight: 'bold',
    width: '80%',
    mx: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 3px 5px rgba(0,0,0,0.25)',
  },
  applyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    mr: 1,
  },
};

export default FiltroModal;