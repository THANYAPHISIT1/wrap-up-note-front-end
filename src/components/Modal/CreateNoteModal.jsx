import { useState, useRef } from 'react'
import { FaBook } from 'react-icons/fa'
import { IoMdFitness } from 'react-icons/io'
import { FaMoneyBill } from 'react-icons/fa'
import { FaPencilAlt } from 'react-icons/fa'
import { TiPlus } from 'react-icons/ti'
import JoditEditor from 'jodit-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const CreateNoteModal = () => {
    const [modalOpen, setModalOpen] = useState(false)
    const editor = useRef(null)
    const [content, setContent] = useState('')
    const [title, setTitle] = useState('')
    const [label, setLabel] = useState('Diary')
    const navigate = useNavigate()

    const modalHandler = (val) => {
        if (val) {
            fadeIn(document.getElementById('modal'))
        } else {
            fadeOut(document.getElementById('modal'))
        }
        setModalOpen(val)
    }

    const fadeOut = (el) => {
        el.style.opacity = 1
        ;(function fade() {
            if ((el.style.opacity -= 0.1) < 0) {
                el.style.display = 'none'
            } else {
                requestAnimationFrame(fade)
            }
        })()
    }

    const fadeIn = (el, display) => {
        el.style.opacity = 0
        el.style.display = display || 'flex'
        ;(function fade() {
            let val = parseFloat(el.style.opacity)
            if (!((val += 0.2) > 1)) {
                el.style.opacity = val
                requestAnimationFrame(fade)
            }
        })()
    }

    const handleLabelClick = (selectedLabel) => {
        if (label === selectedLabel) {
            // Unselect the label
            setLabel('')
        } else {
            // Select the label
            setLabel(selectedLabel)
        }
        console.log(selectedLabel)
    }

    const handleSubmit = async () => {
        const strippedContent = content.replace(/<[^>]*>?/gm, '') // Remove HTML tags

        if (!strippedContent.trim()) {
            alert("The note's content cannot be empty.")
            return
        }

        try {
            const response = await axios.post(
                `${API_URL}/note`,
                {
                    title,
                    content,
                    label,
                },
                { withCredentials: true }
            )

            console.log(response.data.message)

            // Close the modal
            modalHandler(false)
            navigate('/')
        } catch (error) {
            console.error('Error creating note:', error)
        }
    }

    return (
        <div>
            <div
                className={`py-12 bg-black bg-opacity-50 transition duration-150 ease-in-out z-20 fixed inset-0 ${
                    modalOpen ? 'flex' : 'hidden'
                }`}
                id="modal"
            >
                <div
                    role="alert"
                    className="container mx-auto w-11/12 md:w-2/3 max-w-4xl overflow-auto z-50"
                >
                    <div className="relative py-8 px-5 md:px-10 bg-white shadow-md rounded border border-gray-400">
                        <div className="w-full flex justify-start text-gray-600 mb-3">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="icon icon-tabler icon-tabler-wallet"
                                width="52"
                                height="52"
                                viewBox="0 0 24 24"
                                strokeWidth="1"
                                stroke="currentColor"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path stroke="none" d="M0 0h24v24H0z" />
                                <path d="M17 8v-3a1 1 0 0 0 -1 -1h-10a2 2 0 0 0 0 4h12a1 1 0 0 1 1 1v3m0 4v3a1 1 0 0 1 -1 1h-12a2 2 0 0 1 -2 -2v-12" />
                                <path d="M20 12v4h-4a2 2 0 0 1 0 -4h4" />
                            </svg>
                        </div>
                        <h1 className="text-gray-800 font-lg font-bold tracking-normal leading-tight mb-4">{`Let's take a Note`}</h1>
                        <label
                            htmlFor="name"
                            className="text-gray-800 text-sm font-bold leading-tight tracking-normal"
                        >
                            Title
                        </label>
                        <input
                            id="name"
                            className="mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border"
                            placeholder="Name of Note"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <p className="text-gray-600 text-xs italic mt-1 mb-2">
                            <span className="text-red-500">Tip : </span>
                            Selecting a label can improve the summarization of
                            your notes.
                        </p>
                        <div className="flex justify-center w-full max-w-fit mb-2">
                            <button
                                className={`w-fit px-2 py-1 h-8 ${
                                    label === 'Diary'
                                        ? 'bg-[#F77C7C]'
                                        : 'bg-gray-400'
                                } flex items-center justify-center rounded-lg m-1 font-bold text-white`}
                                onClick={() => handleLabelClick('Diary')}
                            >
                                <FaPencilAlt />
                                <p className="ml-1">Diary</p>
                            </button>
                            <button
                                className={`w-fit px-2 py-1 h-8 ${
                                    label === 'Study'
                                        ? 'bg-[#8684FB]'
                                        : 'bg-gray-400'
                                } flex items-center justify-center rounded-lg m-1 font-bold text-white`}
                                onClick={() => handleLabelClick('Study')}
                            >
                                <FaBook />
                                <p className="ml-1">Study</p>
                            </button>
                            <button
                                className={`w-fit px-2 py-1 h-8 ${
                                    label === 'Health'
                                        ? 'bg-[#48EA58]'
                                        : 'bg-gray-400'
                                } flex items-center justify-center rounded-lg m-1 font-bold text-white`}
                                onClick={() => handleLabelClick('Health')}
                            >
                                <IoMdFitness />
                                <p className="ml-1">Health</p>
                            </button>
                            <button
                                className={`w-fit px-2 py-1 h-8 ${
                                    label === 'Finance'
                                        ? 'bg-[#E7D000]'
                                        : 'bg-gray-400'
                                } flex items-center justify-center rounded-lg m-1 font-bold text-white`}
                                onClick={() => handleLabelClick('Finance')}
                            >
                                <FaMoneyBill />
                                <p className="ml-1">Finance</p>
                            </button>
                        </div>

                        <label
                            htmlFor="detail"
                            className="text-gray-800 text-sm font-bold leading-tight tracking-normal"
                        >
                            Detail
                        </label>
                        <div className="relative mb-5 mt-2">
                            <div className="absolute right-0 text-gray-600 flex items-center pr-3 h-full cursor-pointer"></div>
                            <JoditEditor
                                ref={editor}
                                value={content}
                                onBlur={(newContent) => setContent(newContent)}
                                config={{
                                    height: 400,
                                    width: '100%',
                                    theme: 'default',
                                    removeButtons: [
                                        'image',
                                        'video',
                                        'file',
                                        'speechRecognize',
                                        'spellcheck',
                                    ],
                                }}
                                className="h-[400px] w-full"
                            />
                        </div>

                        <div className="flex items-center justify-start w-full">
                            <button
                                onClick={handleSubmit}
                                className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 bg-indigo-700 rounded text-white px-8 py-2 text-sm"
                            >
                                Submit
                            </button>
                            <button
                                className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 ml-3 bg-gray-100 transition duration-150 text-gray-600 ease-in-out hover:border-gray-400 hover:bg-gray-300 border rounded px-8 py-2 text-sm"
                                onClick={() => modalHandler(false)}
                            >
                                Cancel
                            </button>
                        </div>
                        <button
                            className="cursor-pointer absolute top-0 right-0 mt-4 mr-5 text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out rounded focus:ring-2 focus:outline-none focus:ring-gray-600"
                            onClick={() => modalHandler(false)}
                            aria-label="close modal"
                            role="button"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="icon icon-tabler icon-tabler-x"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                strokeWidth="2.5"
                                stroke="currentColor"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path stroke="none" d="M0 0h24v24H0z" />
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* ANCHOR - Create Note Button */}
            <div className="w-full" id="button">
                <button
                    className="group flex h-10 items-center gap-2 rounded-full bg-neutral-200 pl-3 pr-4 transition-all duration-300 ease-in-out hover:bg-blue-600 hover:pl-2 hover:text-white active:bg-neutral-700"
                    onClick={() => modalHandler(true)}
                >
                    <span className="rounded-full bg-black p-1 text-sm transition-colors duration-300 group-hover:bg-white">
                        <TiPlus className="-translate-x-[200%] text-[0px] transition-all duration-300 group-hover:translate-x-0 group-hover:text-lg group-hover:text-blue-600 group-active:-rotate-45" />
                    </span>
                    <span>Create Note</span>
                </button>
            </div>
        </div>
    )
}

export default CreateNoteModal
