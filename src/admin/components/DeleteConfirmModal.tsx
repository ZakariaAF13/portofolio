import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FiTrash2, FiAlertTriangle } from 'react-icons/fi';
import { useAdminTheme } from '../context/AdminThemeContext';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  itemName?: string;
  isLoading?: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Item",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  itemName,
  isLoading = false
}: DeleteConfirmModalProps) {
  const { isLightMode } = useAdminTheme();

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={`w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all ${
                isLightMode ? 'bg-white' : 'bg-slate-800'
              }`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                    isLightMode ? 'bg-red-100' : 'bg-red-900/30'
                  }`}>
                    <FiAlertTriangle className={`w-6 h-6 ${
                      isLightMode ? 'text-red-600' : 'text-red-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <Dialog.Title
                      as="h3"
                      className={`text-lg font-medium leading-6 ${
                        isLightMode ? 'text-gray-900' : 'text-white'
                      }`}
                    >
                      {title}
                    </Dialog.Title>
                  </div>
                </div>

                <div className="mb-6">
                  <p className={`text-sm ${
                    isLightMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    {message}
                  </p>
                  {itemName && (
                    <div className={`mt-3 p-3 rounded-lg border ${
                      isLightMode ? 'bg-gray-50 border-gray-200' : 'bg-slate-700 border-slate-600'
                    }`}>
                      <p className={`text-sm font-medium ${
                        isLightMode ? 'text-gray-900' : 'text-white'
                      }`}>
                        Item to delete: <span className="font-normal">{itemName}</span>
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isLightMode 
                        ? 'bg-gray-200 text-gray-900 hover:bg-gray-300' 
                        : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
                    }`}
                    onClick={onClose}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={onConfirm}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <FiTrash2 className="w-4 h-4" />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
