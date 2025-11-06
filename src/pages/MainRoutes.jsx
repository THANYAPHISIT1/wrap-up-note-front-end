import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import ConfirmLogoutModal from '../components/Modal/ConfirmLogoutModal'
import ConfirmDeleteModal from '../components/Modal/ConDelSumDetail'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'

const MainRoutes = () => {
    const [showConfirmLogout, setShowConfirmLogout] = useState(false)
    const [showConfirmDelete, setShowConfirmDelete] = useState(false)
    const [deleteItemName, setDeleteItemName] = useState('')
    const [deleteCallback, setDeleteCallback] = useState(null)
    // const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('')

    const handleSearchChange = (query) => {
        setSearchQuery(query)
    }

    const handleConfirmDelete = (itemName, callback) => {
        setDeleteItemName(itemName)
        setDeleteCallback(() => callback)
        setShowConfirmDelete(true)
    }

    const handleCancelDelete = () => {
        setShowConfirmDelete(false)
        setDeleteCallback(null)
    }

    const handleConfirmDeleteAction = () => {
        if (deleteCallback) {
            deleteCallback()
        }
        setShowConfirmDelete(false)
        setDeleteCallback(null)
    }

    return (
        <div className="flex bg-gray-100 min-h-screen max-h-full">
            <Sidebar onLogoutClick={() => setShowConfirmLogout(true)} />
            <div className="flex-1 ml-[20rem]">
                <Navbar onSearchChange={handleSearchChange} />
                <Outlet
                    context={{
                        searchQuery,
                        confirmDelete: handleConfirmDelete,
                        handleSearchChange: handleSearchChange,
                    }}
                />
            </div>

            {showConfirmLogout && (
                <ConfirmLogoutModal
                    onCancel={() => setShowConfirmLogout(false)}
                />
            )}

            <ConfirmDeleteModal
                isOpen={showConfirmDelete}
                onCancel={handleCancelDelete}
                onConfirm={handleConfirmDeleteAction}
                itemName={deleteItemName}
            />
        </div>
    )
}

export default MainRoutes
