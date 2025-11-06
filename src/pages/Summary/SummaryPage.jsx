import NotesList from '../Note/NotesList';
import { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import FilterLabelDropdowns from '../../components/FilterLabelDropdowns';

const API_URL = import.meta.env.VITE_API_URL;

const Summary = () => {
    const { searchQuery } = useOutletContext();
    const [summaries, setSummaries] = useState([]);
    const [label, setLabel] = useState('');

    useEffect(() => {
        const fetchSummaryNotes = async () => {
            try {
                const response = await axios.get(`${API_URL}/summary`, {
                    withCredentials: true,
                });

                let fetchedSummaries = response.data.summaries;

                if (label) {
                    fetchedSummaries = fetchedSummaries.filter(
                        (summary) =>
                            summary.label &&
                            summary.label.toLowerCase() === label.toLowerCase()
                    );
                }

                if (searchQuery) {
                    fetchedSummaries = fetchedSummaries.filter(
                        (summary) =>
                            summary.content
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase()) ||
                            (summary.label &&
                                summary.label
                                    .toLowerCase()
                                    .includes(searchQuery.toLowerCase()))
                    );
                }

                const sortedSummaries = fetchedSummaries.sort((a, b) => {
                    return new Date(b.date_create) - new Date(a.date_create);
                });

                setSummaries(sortedSummaries);
            } catch (error) {
                console.error('Error fetching Summary notes:', error.message);
            }
        };

        fetchSummaryNotes();
    }, [label, searchQuery]);

    const listVariants = {
        hidden: { opacity: 0, y: 20 }, // Start hidden and slightly below
        visible: { opacity: 1, y: 0 }, // Move up and fade in
        exit: { opacity: 0, y: 20 }, // Move down and fade out
    };

    return (
        <div className="p-8">
            <div className="flex justify-between">
                <h1 className="text-3xl font-bold mb-6">
                    Summary Notes ({summaries.length})
                </h1>
                <FilterLabelDropdowns label={label} setLabel={setLabel} />
            </div>
            <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6"
            >
                <AnimatePresence>
                    {summaries.map((summary) => (
                        <motion.div
                            key={summary.SID}
                            layoutId={`summary-${summary.SID}`}
                            variants={listVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <Link
                                to={`/summary/${summary.SID}`}
                                key={summary.SID}
                            >
                                <NotesList
                                    SID={summary.SID}
                                    content={summary.content}
                                    label={summary.label}
                                    dateUpdate={summary.date_create}
                                />
                            </Link>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default Summary;
