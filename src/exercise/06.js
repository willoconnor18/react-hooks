// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  PokemonForm,
  fetchPokemon,
  PokemonDataView,
  PokemonInfoFallback,
} from '../pokemon'

const statusType = {
  idle: 'idle',
  pending: 'pending',
  resolved: 'resolved',
  rejected: 'rejected',
}

const getStatus = (pokemonNameQuery, pokemonInfo) => {
  return !pokemonNameQuery
    ? statusType.idle
    : !!pokemonNameQuery && pokemonInfo === undefined
    ? statusType.pending
    : !!pokemonInfo
    ? statusType.resolved
    : pokemonInfo === null
    ? statusType.rejected
    : statusType.idle
}

function PokemonInfo({pokemonName}) {
  // 🐨 Have state for the pokemon (null)
  const [pokemon, setPokemon] = React.useState()
  const [status, setStatus] = React.useState(() =>
    getStatus(pokemonName, pokemon),
  )
  // 🐨 use React.useEffect where the callback should be called whenever the
  // pokemon name changes.
  React.useEffect(() => {
    if (pokemonName) {
      setPokemon()
      fetchPokemon(pokemonName, 1000)
        .then(info => {
          setPokemon(info)
        })
        .catch(e => {
          console.warn('Caught an error')
          setPokemon(null)
          // throw Error(e)
        })
    }
  }, [pokemonName])

  React.useEffect(() => {
    setStatus(getStatus(pokemonName, pokemon))
  }, [pokemon, pokemonName])

  // 💰 DON'T FORGET THE DEPENDENCIES ARRAY!
  // 💰 if the pokemonName is falsy (an empty string) then don't bother making the request (exit early).
  // 🐨 before calling `fetchPokemon`, clear the current pokemon state by setting it to null.
  // (This is to enable the loading state when switching between different pokemon.)
  // 💰 Use the `fetchPokemon` function to fetch a pokemon by its name:
  //   fetchPokemon('Pikachu').then(
  //     pokemonData => {/* update all the state here */},
  //   )
  // 🐨 return the following things based on the `pokemon` state and `pokemonName` prop:
  //   1. no pokemonName: 'Submit a pokemon'
  //   2. pokemonName but no pokemon: <PokemonInfoFallback name={pokemonName} />
  //   3. pokemon: <PokemonDataView pokemon={pokemon} />
  const statusComponents = {
    [statusType.idle]: () => 'Submit a pokemon',
    [statusType.pending]: () => <PokemonInfoFallback name={pokemonName} />,
    [statusType.resolved]: () => <PokemonDataView pokemon={pokemon} />,
    [statusType.rejected]: () => {
      console.log('WO: ', pokemonName)
      throw Error(`Error fetching pokemon: ${pokemonName}`)
    },
  }

  return status in statusComponents ? statusComponents[status]() : null
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {errorMessage: ''}
  }

  static getDerivedStateFromError(error) {
    return {errorMessage: error.message}
  }

  componentDidCatch() {
    // alert('Caught it')
  }

  render() {
    if (this.state.errorMessage) {
      return (
        <div
          style={{color: 'darkred', backgroundColor: 'rgba(255, 0, 0, 0.4)'}}
        >
          <p>{this.state.errorMessage}</p>
        </div>
      )
    } else {
      return this.props.children
    }
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary key={pokemonName}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
