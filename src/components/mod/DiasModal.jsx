import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  IconButton,
  Typography,
  Box,
  MenuItem,
} from "@mui/material";
import {
  Close as CloseIcon,
  CheckBox as CheckBoxIcon,
} from "@mui/icons-material";

export default function DiasModal({
  visible,
  onClose,
  validDays,
  selectedDays,
  toggleDay,
  diasSemanaMap,
}) {
  return (
    <Dialog open={visible} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={styles.dialogTitle}>
        <Box sx={styles.dialogTitleContent}>
          <Typography variant="h6">Selecionar Dias da Semana</Typography>
          <IconButton onClick={onClose} size="small" sx={styles.closeButton}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={styles.dialogContent}>
        {validDays.map((dayNum) => (
          <MenuItem
            key={dayNum}
            onClick={() => toggleDay(dayNum)}
            sx={styles.menuItem(selectedDays.includes(dayNum))}
          >
            <Typography>{diasSemanaMap[dayNum]}</Typography>
            {selectedDays.includes(dayNum) && (
              <CheckBoxIcon sx={styles.checkBoxIcon} />
            )}
          </MenuItem>
        ))}
      </DialogContent>
      <Box sx={styles.buttonContainer}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={styles.closeModalButton}
        >
          Fechar
        </Button>
      </Box>
    </Dialog>
  );
}

const styles = {
  dialogTitle: {
    paddingBottom: 1,
    paddingRight: 0,
    paddingTop: 1,
    paddingLeft: 0,
  },
  dialogTitleContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 24px",
  },
  closeButton: {
    color: "#999",
  },
  dialogContent: {
    paddingTop: "20px",
  },
  menuItem: (isSelected) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: isSelected ? "action.selected" : "inherit",
    borderRadius: 1.5,
    marginBottom: 1,
    py: 1.5,
  }),
  checkBoxIcon: {
    color: "darkred",
  },
  buttonContainer: {
    p: 2,
    display: "flex",
    justifyContent: "flex-end",
  },
  closeModalButton: {
    backgroundColor: "rgb(177, 16, 16)",
    "&:hover": {
      backgroundColor: "darkred",
    },
    fontWeight: "bold",
  },
};
