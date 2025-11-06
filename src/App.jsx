import { Routes, Route, Navigate } from 'react-router-dom'
import NotePage from './pages/Note/NotePage'
import Archive from './pages/Archive/ArchivePage'
import Trash from './pages/Trash/TrashPage'
import Summary from './pages/Summary/SummaryPage'
import SummaryDetail from './pages/Summary/SummaryDetail'
import MainRoutes from './pages/MainRoutes'
import ProtectedRoute from './Auth/ProtectedRoute'
import NotFoundPage from './pages/NotFoundPage'
import LoginRegis from './pages/LoginRegister/LoginRegis'

const API_URL = import.meta.env.VITE_API_URL
console.log('API URL:', API_URL)

function App() {
    return (
        <div>
            <Routes>
                <Route path="login" element={<LoginRegis />} />
                <Route path="register" element={<LoginRegis />} />
                <Route path="/" element={<MainRoutes />}>
                    <Route path="/" element={<Navigate to="/note" replace />} />
                    <Route
                        path="/note"
                        element={
                            <ProtectedRoute>
                                <NotePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/archive"
                        element={
                            <ProtectedRoute>
                                <Archive />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/summary"
                        element={
                            <ProtectedRoute>
                                <Summary />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/summary/:SID"
                        element={
                            <ProtectedRoute>
                                <SummaryDetail />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/trash"
                        element={
                            <ProtectedRoute>
                                <Trash />
                            </ProtectedRoute>
                        }
                    />
                </Route>
                <Route path="*" element={<Navigate to="/404" replace />} />
                <Route path="/404" element={<NotFoundPage />} />
            </Routes>
        </div>
    )
}

export default App
