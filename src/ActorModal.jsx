import React from 'react';
import {
    Modal,
    Backdrop,
    Fade,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Button
} from '@mui/material';

const modalStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const paperStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    boxShadow: '0px 3px 15px rgba(0, 0, 0, 0.2)',
    padding: 24,
    maxWidth: 800, // Increased maxWidth for wider modal
    overflowY: 'scroll',
    maxHeight: '80%',
    borderRadius: 16
};

const ActorModal = ({ open, handleClose, actors }) => {
    if (!open || !actors) {
        return null;
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
            style={modalStyle}
        >
            <Fade in={open}>
                <div style={paperStyle}>
                    <Typography variant="h5" gutterBottom>Actors</Typography>
                    <Grid container spacing={2}>
                        {actors.map(actor => (
                            <Grid item key={actor.id} xs={12} sm={6} md={4} lg={3}>
                                <Card>
                                    <CardMedia
                                        component="img"
                                        height="300"
                                        image={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                                        alt={actor.name}
                                    />
                                    <CardContent>
                                        <Typography variant="h6">{actor.name}</Typography>
                                        <Typography variant="body2">{actor.character}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Button variant="contained" color="secondary" style={{ marginTop: 20 }} onClick={handleClose}>Close</Button>
                </div>
            </Fade>
        </Modal>
    );
};

export default ActorModal;
