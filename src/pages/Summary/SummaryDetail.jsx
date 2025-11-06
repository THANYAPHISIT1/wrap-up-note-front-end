import { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'

const labelColors = {
    Study: '#8684FB',
    Hobby: '#A47EE3',
    Health: '#48EA58',
    Finance: '#E7D000',
    Diary: '#F77C7C',
}

const API_URL = import.meta.env.VITE_API_URL

const SummaryDetail = () => {
    const { SID } = useParams()
    const navigate = useNavigate()
    const { confirmDelete } = useOutletContext()
    const [summary, setSummary] = useState({ content: '', label: '' })
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await axios.get(`${API_URL}/summary/${SID}`, {
                    withCredentials: true,
                })
                setSummary(response.data.summary)
            } catch (err) {
                setError(err.message)
            }
        }

        if (SID) {
            fetchSummary()
        }
    }, [SID])

    const { content, label } = summary
    const formattedLabel = label
        ? label.charAt(0).toUpperCase() + label.slice(1)
        : ''

    const handleDelete = () => {
        confirmDelete('summary', async () => {
            try {
                await axios.delete(`${API_URL}/summary/delete/${SID}`, {
                    withCredentials: true,
                })
                navigate('/summary')
            } catch (err) {
                setError('Failed to delete summary: ' + err.message)
            }
        })
    }

    return (
        <div className="m-6 bg-white border-2 rounded-lg p-4 drop-shadow-lg">
            {error && <div className="text-red-500">{error}</div>}{' '}
            <p className="text-sm italic text-red-500 mb-2">
                สรุปและคำแนนนำนี้เป็นเพียงการสรุปจากปัญญาประดิษฐ์
                ซึ่งอาจจะมีความคลาดเคลื่อน หรือไม่ตรงตามความต้องการทั้งหมด
                โปรดอ่านทบทวนอย่างมีวิจารณญาณ
            </p>
            <div className="flex justify-between items-center mb-4">
                {label && (
                    <div
                        className="inline-block px-2 py-1 w-[8rem] text-white text-xs rounded"
                        style={{
                            backgroundColor:
                                labelColors[formattedLabel] || '#ccc',
                        }}
                    >
                        <span className="hidden md:inline">
                            {formattedLabel}
                        </span>
                    </div>
                )}
                <button
                    onClick={handleDelete}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                    Delete
                </button>
            </div>
            <div
                className="text-base p-4"
                dangerouslySetInnerHTML={{ __html: content }}
            ></div>
        </div>
    )
}

export default SummaryDetail
