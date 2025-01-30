import React from 'react'
import Cards from './components/Cards'
import NavBar from './components/NavBar'
import {DndContext} from '@dnd-kit/core'

const App = () => {
  return (
    <div>
      <NavBar/>
      <Cards/>
    </div>
  )
}

export default App