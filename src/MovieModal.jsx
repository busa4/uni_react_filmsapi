import React, { useState, useEffect } from 'react';
import {
    Modal,
    Backdrop,
    Fade,
    Typography,
    Button,
} from '@mui/material';
import ActorModal from './ActorModal'; // Import ActorModal component

const TMDB_API_KEY = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYzUxM2RjYWMzOTI5NWI5Nzc5MjFjZDhiOWMzNmI0MSIsInN1YiI6IjY2NzVhMDc1MzlkOWEzZTUxZWZjN2VjNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.dwCoFa0-2EM5wBQe_TnJ7q0MyQZh4QJdqzUBvTH1D-U';

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
    maxWidth: 600,
    overflowY: 'scroll',
    maxHeight: '80%',
    borderRadius: 16
};

const MovieModal = ({ open, handleClose, movie }) => {
    const [actors, setActors] = useState([]);
    const [openActorsModal, setOpenActorsModal] = useState(false);

    useEffect(() => {
        if (openActorsModal && movie) {
            fetchActors();
        }
    }, [openActorsModal, movie]);

    const fetchActors = async () => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/credits`, {
                headers: {
                    Authorization: TMDB_API_KEY,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch actors');
            }

            const data = await response.json();
            setActors(data.cast);
        } catch (error) {
            console.error('Error fetching actors:', error);
        }
    };

    const handleOpenActorsModal = () => {
        setOpenActorsModal(true);
    };

    const handleCloseActorsModal = () => {
        setOpenActorsModal(false);
    };

    if (!movie) {
        return null;
    }

    return (
        <>
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
                        <Typography variant="h5" gutterBottom>{movie.title}</Typography>
                        <Typography variant="body1" gutterBottom>{movie.overview}</Typography>
                        <Typography variant="body2">Release Date: {movie.release_date}</Typography>
                        <Button variant="contained" color="primary" onClick={handleOpenActorsModal}>View Actors</Button>
                        <Button variant="contained" color="secondary" style={{ margin: 20 }} onClick={handleClose}>Close</Button>
                    </div>
                </Fade>
            </Modal>

            {/* Modal for actors */}
            <ActorModal open={openActorsModal} handleClose={handleCloseActorsModal} actors={actors} />
        </>
    );
};

export default MovieModal;
