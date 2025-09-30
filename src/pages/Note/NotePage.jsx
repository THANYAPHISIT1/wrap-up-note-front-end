import CreateNoteModal from "../../components/Modal/CreateNoteModal";
import NotesList from "./NotesList";
import EditNoteModal from "../../components/Modal/EditNoteModal";
import ConfirmationModal from "../../components/Modal/ConfirmationModal";
import FilterLabelDropdowns from "../../components/FilterLabelDropdowns";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useOutletContext } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const NotePage = () => {
  const { searchQuery } = useOutletContext();
  const [notes, setNotes] = useState([]);
  const [pinnedNotes, setPinnedNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [filter, setFilter] = useState("last update");
  const [label, setLabel] = useState("");
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [selectionLabel, setSelectionLabel] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [summarySID, setSummarySID] = useState(null);
  const [isSummaryCompleted, setIsSummaryCompleted] = useState(false);

  const fetchNotes = useCallback(
    async (labelToFilter = "") => {
      try {
        const response = await axios.get(`${API_URL}/note`, {
          params: { filter, label: labelToFilter || label },
          withCredentials: true,
        });

        let activeNotes = response.data.note.filter(
          (note) => note.status !== "deleted" && note.status !== "archive"
        );

        // Apply label filtering
        if (labelToFilter || label) {
          activeNotes = activeNotes.filter(
            (note) =>
              note.label &&
              note.label.toLowerCase() ===
                (labelToFilter || label).toLowerCase()
          );
        }

        // Apply search filtering
        if (searchQuery) {
          activeNotes = activeNotes.filter(
            (note) =>
              note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              note.content.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        console.log("Fetching notes with filter:", filter, "and label:", label);
        const sortedNotes = activeNotes.sort((a, b) => {
          if (filter === "title") {
            return a.title.localeCompare(b.title);
          } else if (filter === "date create") {
            return new Date(b.date_create) - new Date(a.date_create);
          } else if (filter === "last update") {
            return new Date(b.date_update) - new Date(a.date_update);
          }
          return 0;
        });

        // Separate pinned and unpinned notes
        const pinned = sortedNotes.filter((note) => note.pin === 1);
        const unpinned = sortedNotes.filter((note) => note.pin !== 1);

        setNotes(unpinned);
        setPinnedNotes(pinned);
      } catch (error) {
        console.error("Error fetching notes:", error.message);
      }
    },
    [filter, label, searchQuery]
  );

  useEffect(() => {
    fetchNotes();
  }, [filter, label, searchQuery, fetchNotes]);

  const handleNoteClick = (note) => {
    if (isSelectionMode) {
      if (selectedNotes.includes(note.NID)) {
        const newSelectedNotes = selectedNotes.filter((id) => id !== note.NID);
        setSelectedNotes(newSelectedNotes);
        if (newSelectedNotes.length === 0) {
          setSelectionLabel("");
          fetchNotes();
        }
      } else {
        setSelectedNotes([...selectedNotes, note.NID]);
        if (selectedNotes.length === 0) {
          setSelectionLabel(note.label);
          fetchNotes(note.label);
        }
      }
      console.log(`Selected notes:`, selectedNotes);
    } else {
      setSelectedNote(note);
    }
  };

  const handleConfirmSummary = async (selectedNote) => {
    try {
      console.log(selectedNote, selectionLabel);
      const response = await axios.post(
        `${API_URL}/summarize`,
        { NIDs: selectedNotes, promptType: selectionLabel },
        { withCredentials: true }
      );
      console.log(response.data);

      const { SID } = response.data;
      setSummarySID(SID);
      setIsSummaryCompleted(true);
    } catch (error) {
      console.error("Error generating summary:", error);
      alert("Summary generation failed.");
      setIsModalOpen(false);
    }
    setIsSelectionMode(false);
    setSelectedNotes([]);
    setSelectionLabel(null);
    fetchNotes();
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    if (isSummaryCompleted) {
      fetchNotes();
      setSummarySID(null);
      setIsSummaryCompleted(false);
    }
  };

  const listVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  };

  const closeModal = () => {
    setSelectedNote(null);
  };

  const handleSave = () => {
    closeModal();
    fetchNotes();
  };

  const handleSelectionToggle = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedNotes([]);
    setSelectionLabel(null);
    fetchNotes();
  };

  const handlePinClick = async (note) => {
    try {
      if (note.pin === 1) {
        await axios.put(
          `${API_URL}/note/unpin/${note.NID}`,
          {},
          { withCredentials: true }
        );
        setPinnedNotes(pinnedNotes.filter((n) => n.NID !== note.NID));
        setNotes([...notes, note]);
      } else {
        await axios.put(
          `${API_URL}/note/pin/${note.NID}`,
          {},
          { withCredentials: true }
        );
        setNotes(notes.filter((n) => n.NID !== note.NID));
        setPinnedNotes([...pinnedNotes, note]);
      }
      fetchNotes();
    } catch (error) {
      console.error("Error updating pin status:", error.message);
    }
  };

  const handleSummaryClick = () => {
    setIsModalOpen(true);
  };

  console.log(selectedNotes, selectionLabel);
  console.log(`Label is there selected`, selectionLabel);

  return (
    <div>
      <div className="flex justify-between m-4">
        <FilterLabelDropdowns
          filter={filter}
          setFilter={setFilter}
          label={label}
          setLabel={setLabel}
        />
        <CreateNoteModal />
      </div>
      <hr />

      <div className="p-8 z-0">
        <h1 className="text-3xl font-bold mb-6">My Notes</h1>

        {pinnedNotes.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Pinned Notes ({pinnedNotes.length})
            </h2>
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8"
            >
              <AnimatePresence>
                {pinnedNotes.map((note) => (
                  <motion.div
                    key={note.NID}
                    layoutId={`note-${note.NID}`}
                    variants={listVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <NotesList
                      title={note.title}
                      content={note.content}
                      onClick={() => handleNoteClick(note)}
                      onPinClick={() => handlePinClick(note)}
                      dateUpdate={note.date_update}
                      isPinned={note.pin === 1}
                      isSelected={selectedNotes.includes(note.NID)}
                      label={note.label}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-semibold mb-4">
            All Notes ({notes.length})
          </h2>
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
                    title={note.title}
                    content={note.content}
                    onClick={() => handleNoteClick(note)}
                    onPinClick={() => handlePinClick(note)}
                    dateUpdate={note.date_update}
                    isPinned={note.pin === 1}
                    isSelected={selectedNotes.includes(note.NID)}
                    label={note.label}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {selectedNote && (
          <EditNoteModal
            isOpen={!!selectedNote}
            onClose={closeModal}
            title={selectedNote.title}
            content={selectedNote.content}
            NID={selectedNote.NID}
            status={selectedNote.status}
            label={selectedNote.label}
            onSave={handleSave}
          />
        )}
      </div>

      {isSelectionMode ? (
        <div className="fixed z-10 bottom-4 right-4 flex space-x-2">
          <button
            onClick={handleSelectionToggle}
            className="relative inline-flex items-center justify-start px-6 py-3 overflow-hidden font-medium transition-all bg-white rounded hover:bg-white group border-2 border-black drop-shadow-md"
          >
            <span className="w-48 h-48 rounded rotate-[-40deg] bg-red-500 absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
            <span className="relative w-full text-left text-black transition-colors duration-300 ease-in-out group-hover:text-white">
              Exit Selection Mode
            </span>
          </button>
          <button
            onClick={handleSummaryClick}
            className="relative inline-flex items-center justify-start px-6 py-3 overflow-hidden font-medium transition-all bg-white rounded hover:bg-white group border-2 border-black drop-shadow-md"
          >
            <span className="w-48 h-48 rounded rotate-[-40deg] bg-purple-600 absolute bottom-0 right-0 translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 mr-9 group-hover:mr-0 group-hover:mb-32 group-hover:translate-x-0"></span>
            <span className="relative w-full text-left text-black transition-colors duration-300 ease-in-out group-hover:text-white">
              Summary
            </span>
          </button>
        </div>
      ) : (
        <button
          onClick={handleSelectionToggle}
          className="fixed bottom-4 right-4 inline-flex items-center justify-start px-6 py-3 overflow-hidden font-medium transition-all bg-white rounded hover:bg-white group border-2 border-black drop-shadow-md"
        >
          <span className="w-64 h-48 rounded rotate-[-40deg] bg-purple-600 absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
          <span className="relative w-full text-left text-black transition-colors duration-300 ease-in-out group-hover:text-white">
            Select Notes for summary
          </span>
        </button>
      )}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleConfirmSummary}
        selectedNotes={selectedNotes}
        summarySID={summarySID}
      />
    </div>
  );
};

export default NotePage;
