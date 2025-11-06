import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import apiClient from '../utils/axiosConfig'

const ProtectedRoute = ({ children }) => {
    const [hasToken, setHasToken] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let isMounted = true

        const checkToken = async () => {
            try {
                setIsLoading(true)
                const response = await apiClient.get('/api/token')

                if (isMounted) {
                    setHasToken(response.data.hasToken)
                }
            } catch (error) {
                console.error('Token check error:', error)
                if (isMounted) {
                    setHasToken(false)
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false)
                }
            }
        }

        checkToken()

        return () => {
            isMounted = false
        }
    }, [])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    return hasToken ? children : <Navigate to="/login" replace />
}

export default ProtectedRoute
