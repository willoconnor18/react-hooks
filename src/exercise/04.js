// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

function useGameHistory() {
  console.log('use game history')
  const [gameStates, setGameStates] = useLocalStorageState('game-states', [
    Array(9).fill(null),
  ])
  const [currentPositionIndex, setCurrentPositionIndex] = React.useState(0)

  const addToHistory = nextState => {
    if (currentPositionIndex === gameStates.length - 1) {
      setGameStates([...gameStates, nextState])
    } else {
      setGameStates([
        ...gameStates.slice(0, currentPositionIndex + 1),
        nextState,
      ])
    }
    setCurrentPositionIndex(currentPositionIndex + 1)
  }

  const backward = () => {
    setCurrentPositionIndex(Math.max(0, currentPositionIndex - 1))
  }

  const forward = () => {
    setCurrentPositionIndex(
      Math.min(currentPositionIndex + 1, gameStates.length - 1),
    )
  }

  const clearHistory = () => {
    setGameStates([Array(9).fill(null)])
    setCurrentPositionIndex(0)
  }

  console.log(gameStates)

  return [
    gameStates[currentPositionIndex],
    addToHistory,
    backward,
    forward,
    clearHistory,
  ]
}

function Board() {
  const [currentState, addToHistory, backward, forward, clearHistory] =
    useGameHistory()

  const nextValue = calculateNextValue(currentState)
  const winner = calculateWinner(currentState)
  // 🐨 We'll need the following bits of derived state:
  // - nextValue ('X' or 'O')
  // - winner ('X', 'O', or null)
  // - status (`Winner: ${winner}`, `Scratch: Cat's game`, or `Next player: ${nextValue}`)
  // 💰 I've written the calculations for you! So you can use my utilities
  // below to create these variables

  // This is the function your square click handler will call. `square` should
  // be an index. So if they click the center square, this will be `4`.
  function selectSquare(square) {
    if (isGameOver(currentState) || currentState[square]) return
    // 🐨 first, if there's already winner or there's already a value at the
    // given square index (like someone clicked a square that's already been
    // clicked), then return early so we don't make any state changes
    //
    // 🦉 It's typically a bad idea to mutate or directly change state in React.
    // Doing so can lead to subtle bugs that can easily slip into production.
    //
    // 🐨 make a copy of the squares array
    // 💰 `[...squares]` will do it!)
    const squaresCopy = [...currentState]
    //
    // 🐨 set the value of the square that was selected
    // 💰 `squaresCopy[square] = nextValue`
    squaresCopy[square] = nextValue
    //
    // 🐨 set the squares to your copy
    addToHistory(squaresCopy)
  }

  function restart() {
    // 🐨 reset the squares
    // 💰 `Array(9).fill(null)` will do it!
    clearHistory()
  }

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {currentState[i]}
      </button>
    )
  }

  return (
    <div>
      {/* 🐨 put the status in the div below */}
      <div className="status">
        STATUS: {calculateStatus(winner, currentState, nextValue)}
      </div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <button className="restart" onClick={restart}>
        restart
      </button>
      <button className="undo" onClick={backward}>
        undo
      </button>
      <button className="redo" onClick={forward}>
        redo
      </button>
    </div>
  )
}

function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

function isGameOver(squares) {
  return calculateWinner(squares) || squares.every(Boolean)
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
