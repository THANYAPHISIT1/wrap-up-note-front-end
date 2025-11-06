import NotesList from '../Note/NotesList'
import NoteModal from '../../components/Modal/EditNoteModal'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { useOutletContext } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL

const Archive = () => {
    const { searchQuery } = useOutletContext()
    const [notes, setNotes] = useState([])
    const [selectedNote, setSelectedNote] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const fetchNotes = async () => {
        try {
            const response = await axios.get(`${API_URL}/archive/`, {
                withCredentials: true,
            })

            let activeNotes = response.data.notes.filter(
                (note) => note.status !== 'deleted'
            )

            if (searchQuery) {
                activeNotes = activeNotes.filter(
                    (note) =>
                        note.title
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                        note.content
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                        (note.label &&
                            note.label
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase()))
                )
            }

            const sortedNotes = activeNotes.sort(
                (a, b) => new Date(b.date_update) - new Date(a.date_update)
            )

            setNotes(sortedNotes)
        } catch (error) {
            console.error('Error fetching notes:', error.message)
        }
    }

    useEffect(() => {
        fetchNotes()
    }, [searchQuery])

    const handleNoteClick = (note) => {
        setSelectedNote(note)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedNote(null)
    }

    const handleSave = () => {
        closeModal()
        fetchNotes()
    }

    const listVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 },
    }

    return (
        <div>
            <div className="p-8">
                <div className="flex justify-between">
                    <h1 className="text-3xl font-bold mb-6">
                        Archived Notes ({notes.length})
                    </h1>
                </div>
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6"
                >
                    <AnimatePresence>
                        {notes.map((note) => (
                            <motion.div
                                key={note.NID}
                                layoutId={`note-${note.NID}`}
                                variants={listVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <NotesList
                                    key={note.NID}
                                    title={note.title}
                                    content={note.content}
                                    dateUpdate={note.date_update}
                                    label={note.label}
                                    onClick={() => handleNoteClick(note)}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
            {selectedNote && (
                <NoteModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    title={selectedNote.title}
                    content={selectedNote.content}
                    NID={selectedNote.NID}
                    status={selectedNote.status}
                    onSave={handleSave}
                />
            )}
        </div>
    )
}

export default Archive
