
import './App.css'
import ChatCard from './view/Chat';
import LoginForm from './view/LoginForm'
import SignUpForm from './view/SignUp'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserTable from './view/UserTable';
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/chat/:userId" element={<ChatCard />} />
        <Route path="/" element={<UserTable />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
