'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';
import DeleteConfirmationModal from '../components/elements/DeleteConfirmationModal';

interface DeleteModalContextType {
    showDeleteModal: (itemType: string, onConfirm: () => void) => void;
    closeDeleteModal: () => void;
}

const DeleteModalContext = createContext<DeleteModalContextType | undefined>(undefined);

export const useDeleteModal = () => {
    const context = useContext(DeleteModalContext);
    if (!context) {
        throw new Error('useDeleteModal must be used within a DeleteModalProvider');
    }
    return context;
};

interface DeleteModalProviderProps {
    children: ReactNode;
}

export const DeleteModalProvider = ({ children }: DeleteModalProviderProps) => {
    const [modalState, setModalState] = useState({
        isOpen: false,
        itemType: '',
        onConfirm: () => {}
    });

    const showDeleteModal = (itemType: string, onConfirm: () => void) => {
        setModalState({
            isOpen: true,
            itemType,
            onConfirm
        });
    };

    const closeDeleteModal = () => {
        setModalState({
            isOpen: false,
            itemType: '',
            onConfirm: () => {}
        });
    };

    return (
        <DeleteModalContext.Provider value={{ showDeleteModal, closeDeleteModal }}>
            {children}
            <DeleteConfirmationModal
                isOpen={modalState.isOpen}
                onClose={closeDeleteModal}
                onConfirm={() => {
                    modalState.onConfirm();
                    closeDeleteModal();
                }}
                itemType={modalState.itemType}
            />
        </DeleteModalContext.Provider>
    );
};
