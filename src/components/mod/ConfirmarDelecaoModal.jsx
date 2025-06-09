import React from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    Box,
} from "@mui/material";

function ConfirmarDelecaoModal({ open, onClose, onConfirm, title, message }) {
    const styles = getStyles();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
            sx={styles.modalContainer}
            slotProps={{
                paper: {
                    sx: styles.modalBox
                }
            }}
        >
            <Box sx={styles.header}>
                <DialogTitle id="confirm-dialog-title" sx={styles.title}>
                    {title}
                </DialogTitle>
            </Box>
            <DialogContent>
                <DialogContentText id="confirm-dialog-description">
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={styles.containerButtons}>
                <Button onClick={onClose} variant="contained" sx={styles.confirmButton}>
                    Cancelar
                </Button>
                <Button onClick={onConfirm} variant="contained" sx={styles.cancelButton}>
                    Confirmar
                </Button>
            </DialogActions>
        </Dialog>
    );
}

function getStyles() {
    return {
        modalContainer: {
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        modalBox: {
            display: "flex",
            flexDirection: "column",
            width: 350,
            maxWidth: "90%",
            padding: 4,
            backgroundColor: "rgb(255, 255, 255)",
            borderRadius: 10,
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.07)",
            outline: "none",
        },
        header: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        title: {
            fontWeight: 600,
            color: "#37474F",
            fontSize: "22px",
            textAlign: "center",
            flexGrow: 1,
        },
        containerButtons: {
            alignItems: "center",
            justifyContent: "space-around",
        },
        confirmButton: {
            backgroundColor: "rgb(206, 0, 0)",
            "&:hover": {
                backgroundColor: "rgba(187, 0, 0, 0.76)",
            },
            textTransform: "none",
            width: "40%",
            paddingY: 1.5,
            fontSize: "16px",
            fontWeight: 600,
            borderRadius: 8,
        },
        cancelButton: {
            backgroundColor: "rgb(161, 0, 0)",
            "&:hover": {
                backgroundColor: "rgba(161, 0, 0, 0.76)",
            },
            color: "white",
            textTransform: "none",
            width: "40%",
            paddingY: 1.5,
            fontSize: "16px",
            fontWeight: 600,
            borderRadius: 8,
        },
    };
}

export default ConfirmarDelecaoModal;