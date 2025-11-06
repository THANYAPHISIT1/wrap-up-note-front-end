import { useState } from 'react'
import apiClient from '../utils/axiosConfig'

const TokenDebugger = () => {
    const [tokenInfo, setTokenInfo] = useState(null)
    const [loading, setLoading] = useState(false)

    const checkToken = async () => {
        setLoading(true)
        try {
            const response = await apiClient.get('/api/token')
            setTokenInfo(response.data)
        } catch (error) {
            setTokenInfo({ error: error.message })
        } finally {
            setLoading(false)
        }
    }

    const checkCookies = () => {
        const cookies = document.cookie
        console.log('All cookies from frontend:', cookies)
        setTokenInfo({ cookies: cookies || 'No cookies found' })
    }

    return (
        <div className="p-4 border border-gray-300 rounded-lg bg-gray-50 m-4">
            <h3 className="text-lg font-bold mb-4">Token Debugger</h3>

            <div className="space-x-2 mb-4">
                <button
                    onClick={checkToken}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    {loading ? 'Checking...' : 'Check Token'}
                </button>

                <button
                    onClick={checkCookies}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Check Cookies
                </button>
            </div>

            {tokenInfo && (
                <div className="bg-white p-3 rounded border">
                    <h4 className="font-semibold">Result:</h4>
                    <pre className="text-sm">
                        {JSON.stringify(tokenInfo, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    )
}

export default TokenDebugger
