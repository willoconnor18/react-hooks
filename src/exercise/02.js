// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function useLocalStorage(key, initialValue) {
  const getValueFromLS = () => window.localStorage.getItem(key)

  const [value, setValue] = React.useState(
    () => getValueFromLS() || initialValue,
  )

  React.useEffect(() => {
    window.localStorage.setItem(key, value)
  }, [value, key])

  return [value, setValue]
}

function Greeting({initialName = ''}) {
  const [storedName, setStoredName] = useLocalStorage('name')

  // 🐨 initialize the state to the value from localStorage
  // 💰 window.localStorage.getItem('name') ?? initialName
  // const [name, setName] = React.useState(storedName);

  // 🐨 Here's where you'll use `React.useEffect`.
  // The callback should set the `name` in localStorage.
  // 💰 window.localStorage.setItem('name', name)
  // React.useEffect(() => {
  //   window.localStorage.setItem('name', name)
  // }, [name])

  // React.useEffect(() => {
  //   const storedName = window.localStorage.getItem('name')
  //   console.log('Read effect')
  //   if (storedName) {
  //     setName(storedName)
  //   }
  // }, [setName])

  function handleChange(event) {
    setStoredName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={storedName} onChange={handleChange} id="name" />
      </form>
      {storedName ? (
        <strong>Hello {storedName}</strong>
      ) : (
        'Please type your name'
      )}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
