import React, { useState, useEffect } from 'react';
import {
    Container,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Modal,
    Backdrop,
    Fade,
    Button
} from '@mui/material';
import MovieModal from './MovieModal';
import ActorModal from './ActorModal';
import { translations } from './translations.js';

const TMDB_API_KEY = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYzUxM2RjYWMzOTI5NWI5Nzc5MjFjZDhiOWMzNmI0MSIsInN1YiI6IjY2NzVhMDc1MzlkOWEzZTUxZWZjN2VjNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.dwCoFa0-2EM5wBQe_TnJ7q0MyQZh4QJdqzUBvTH1D-U';

const MovieListByGenre = ({ language }) => {
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [actorModalOpen, setActorModalOpen] = useState(false);
    const [actors, setActors] = useState([]);
    const [selectedActor, setSelectedActor] = useState(null);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await fetch('https://api.themoviedb.org/3/genre/movie/list', {
                    headers: {
                        'Authorization': TMDB_API_KEY,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setGenres(data.genres);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };

        fetchGenres();
    }, []);

    useEffect(() => {
        const fetchMoviesByGenre = async () => {
            if (selectedGenre) {
                try {
                    const response = await fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${selectedGenre}`, {
                        headers: {
                            'Authorization': TMDB_API_KEY,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    const data = await response.json();
                    setMovies(data.results);
                } catch (error) {
                    console.error('Error fetching movies:', error);
                }
            }
        };

        fetchMoviesByGenre();
    }, [selectedGenre]);

    const handleOpenModal = (movie) => {
        setSelectedMovie(movie);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleOpenActorModal = () => {
        setActorModalOpen(true);
    };

    const handleCloseActorModal = () => {
        setActorModalOpen(false);
    };

    const handleActorClick = (actor) => {
        setSelectedActor(actor);
        fetchMoviesByActor(actor.id);
        handleCloseActorModal();
    };

    const fetchMoviesByActor = async (actorId) => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/discover/movie?with_people=${actorId}`, {
                headers: {
                    'Authorization': TMDB_API_KEY,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setMovies(data.results);
        } catch (error) {
            console.error('Error fetching movies by actor:', error);
        }
    };

    return (
        <Container>
            <FormControl fullWidth margin="normal">
                <InputLabel id="genre-select-label">{translations[language].genre}</InputLabel>
                <Select
                    labelId="genre-select-label"
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                >
                    {genres.map(genre => (
                        <MenuItem key={genre.id} value={genre.id}>
                            {genre.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>



            <Grid container spacing={4} marginTop={2}>
                {movies.map(movie => (
                    <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
                        <Card onClick={() => handleOpenModal(movie)} style={{ cursor: 'pointer' }}>
                            <CardMedia
                                component="img"
                                height="300"
                                image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                            />
                            <CardContent>
                                <Typography variant="h6">{movie.title}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {movie.release_date}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <MovieModal open={openModal} handleClose={handleCloseModal} movie={selectedMovie} />
            <ActorModal open={actorModalOpen} handleClose={handleCloseActorModal} handleActorClick={handleActorClick} />
        </Container>
    );
};

export default MovieListByGenre;
