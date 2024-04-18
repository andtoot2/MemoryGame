import React, { useState, useEffect } from 'react';
import "../styles/App.css";

const PokemonCard = ({ id, name, image, onClick }) => (
  <div className="pokemon-card" onClick={onClick}>
    <img className="pokeImg" src={image} alt={name} />
    <p className="pokeName">{name}</p>
  </div>
);

const App = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [clickedPokemonIds, setClickedPokemonIds] = useState(new Set());
  const [currentScore, setCurrentScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  useEffect(() => {
    fetchPokemonData();
  }, []);

  const fetchPokemonData = async () => {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
      const data = await response.json();
      const allPokemonData = data.results.map((pokemon, index) => ({
        id: index + 1,
        name: pokemon.name,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`
      }));
      const uniquePokemon = selectUniquePokemon(allPokemonData, 12);
      setPokemonList(uniquePokemon);
    } catch (error) {
      console.error('Error fetching Pokemon data:', error);
    }
  };

  const selectUniquePokemon = (allPokemon, count) => {
    const shuffledPokemon = allPokemon.sort(() => Math.random() - 0.5);
    const uniquePokemon = new Set();
    for (let i = 0; i < shuffledPokemon.length; i++) {
      uniquePokemon.add(shuffledPokemon[i]);
      if (uniquePokemon.size >= count) break;
    }
    return Array.from(uniquePokemon);
  };

  const handleCardClick = (id) => {
    if (clickedPokemonIds.has(id)) {
      setBestScore(Math.max(bestScore, currentScore));
      setCurrentScore(0);
      setClickedPokemonIds(new Set());
    } else {
      setCurrentScore(currentScore + 1);
      setClickedPokemonIds(new Set(clickedPokemonIds).add(id));
    }
    shufflePokemon();
  };

  const shufflePokemon = () => {
    const shuffledPokemonList = pokemonList.sort(() => Math.random() - 0.5);
    setPokemonList([...shuffledPokemonList]);
  };

  const handleShuffleButtonClick = () => {
    fetchPokemonData(); // Fetch new Pokemon data
  };

  return (
    <div className="app">
      <header className="header">
        <h1 className="game">Pokedex Challenge!</h1>
        <div className="scoreboard">
          <p className="current">Current Score: {currentScore}</p>
          <p>Best Score: {bestScore}</p>
        </div>
      </header>
      <div className="pokemon-grid">
        {pokemonList.map(pokemon => (
          <PokemonCard
            key={pokemon.id}
            id={pokemon.id}
            name={pokemon.name}
            image={pokemon.image}
            onClick={() => handleCardClick(pokemon.id)}
          />
        ))}
      </div>
      <div className="footer">
        <button className="doesNothing" onClick={handleShuffleButtonClick}></button>
        <p className="directions">Get points by clicking on an image but don't click on any more than once!</p>
      </div>
    </div>
  );
};

export default App;