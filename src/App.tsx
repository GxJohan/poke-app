// src/App.tsx
import React, { useState } from 'react';
import './App.css';

// Definimos una interfaz para los datos que queremos obtener del Pokémon
interface PokemonData {
  name: string;
  image: string;
  abilities: string[];
  types: string[];
}

const App: React.FC = () => {
  const [pokemonName, setPokemonName] = useState<string>(''); // Estado para el nombre ingresado
  const [pokemonData, setPokemonData] = useState<PokemonData | null>(null); // Estado para los datos del Pokémon
  const [error, setError] = useState<string>(''); // Estado para mensajes de error
  const [loading, setLoading] = useState<boolean>(false); // Estado para indicar carga

  // Función para manejar la búsqueda del Pokémon
  const handleSearch = async () => {
    if (pokemonName.trim() === '') {
      setError('Please enter a Pokémon name.');
      setPokemonData(null);
      return;
    }

    setLoading(true);
    setError('');
    setPokemonData(null);

    try {
      // Si configuraste un proxy en Vite, usa '/api/pokemon/{name}'
      // De lo contrario, usa directamente la URL de la PokéAPI
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
      // const response = await fetch(`/api/api/v2/pokemon/${pokemonName.toLowerCase()}`); // Usar si configuraste el proxy

      if (!response.ok) {
        throw new Error('Pokémon not found.');
      }

      const data = await response.json();

      // Mapeamos los datos a nuestra interfaz
      const formattedData: PokemonData = {
        name: data.name,
        image: data.sprites.front_default,
        abilities: data.abilities.map((ability: any) => ability.ability.name),
        types: data.types.map((type: any) => type.type.name),
      };

      setPokemonData(formattedData);
    } catch (err) {
      setError('Pokémon not found. Please check the name and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Maneja el evento de presionar la tecla Enter en el input
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="App" style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Pokémon Info</h1>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter Pokémon name"
          value={pokemonName}
          onChange={(e) => setPokemonName(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{ padding: '8px', width: '70%' }}
        />
        <button onClick={handleSearch} style={{ padding: '8px', marginLeft: '10px' }}>
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {pokemonData && (
        <div>
          <h2 style={{ textTransform: 'capitalize' }}>{pokemonData.name}</h2>
          {pokemonData.image && <img src={pokemonData.image} alt={pokemonData.name} />}
          <p><strong>Abilities:</strong> {pokemonData.abilities.join(', ')}</p>
          <p><strong>Types:</strong> {pokemonData.types.join(', ')}</p>
        </div>
      )}
    </div>
  );
};

export default App;