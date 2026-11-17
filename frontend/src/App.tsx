import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage/HomePage'
import QuizPage from './pages/QuizPage/QuizPage'
import NotFoundPage from './pages/NotFoundPage/NotFoundPage'
import './App.css'
import JoinPage from './pages/JoinPage/JoinPage'
import RoomPage from './pages/RoomPage/RoomPage'


function App() {
    return (
        <Routes>

            <Route path='/' element={<HomePage/>}></Route>
            <Route path='/quiz/:slug' element={<QuizPage/>}></Route>
            <Route path='/join/' element={<JoinPage/>}></Route>
            <Route path='/room/:linkCode' element={<RoomPage/>}></Route>
            <Route path="*" element={<NotFoundPage />} />

        </Routes>
    )
}

export default App
