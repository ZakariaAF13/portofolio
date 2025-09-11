import { Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FiCheck, FiX } from 'react-icons/fi';
import { useAdminTheme } from '../context/AdminThemeContext';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  type?: 'success' | 'info' | 'warning';
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export default function SuccessModal({
  isOpen,
  onClose,
  title = "Success!",
  message = "Operation completed successfully.",
  type = 'success',
  autoClose = true,
  autoCloseDelay = 3000
}: SuccessModalProps) {
  const { isLightMode } = useAdminTheme();

  // Auto close functionality
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bgColor: isLightMode ? 'bg-green-100' : 'bg-green-900/30',
          iconColor: isLightMode ? 'text-green-600' : 'text-green-400',
          borderColor: 'border-green-500'
        };
      case 'info':
        return {
          bgColor: isLightMode ? 'bg-blue-100' : 'bg-blue-900/30',
          iconColor: isLightMode ? 'text-blue-600' : 'text-blue-400',
          borderColor: 'border-blue-500'
        };
      case 'warning':
        return {
          bgColor: isLightMode ? 'bg-yellow-100' : 'bg-yellow-900/30',
          iconColor: isLightMode ? 'text-yellow-600' : 'text-yellow-400',
          borderColor: 'border-yellow-500'
        };
      default:
        return {
          bgColor: isLightMode ? 'bg-green-100' : 'bg-green-900/30',
          iconColor: isLightMode ? 'text-green-600' : 'text-green-400',
          borderColor: 'border-green-500'
        };
    }
  };

  const typeStyles = getTypeStyles();

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
              <Dialog.Panel className={`w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all border-l-4 ${typeStyles.borderColor} ${
                isLightMode ? 'bg-white' : 'bg-slate-800'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${typeStyles.bgColor}`}>
                      <FiCheck className={`w-6 h-6 ${typeStyles.iconColor}`} />
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
                      <div className="mt-2">
                        <p className={`text-sm ${
                          isLightMode ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          {message}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    className={`ml-4 rounded-md p-2 transition-colors ${
                      isLightMode 
                        ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100' 
                        : 'text-gray-500 hover:text-gray-300 hover:bg-slate-700'
                    }`}
                    onClick={onClose}
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                {autoClose && (
                  <div className="mt-4">
                    <div className={`w-full rounded-full h-1 ${
                      isLightMode ? 'bg-gray-200' : 'bg-slate-700'
                    }`}>
                      <div 
                        className={`h-1 rounded-full transition-all duration-300 ${
                          type === 'success' ? 'bg-green-500' :
                          type === 'info' ? 'bg-blue-500' :
                          type === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{
                          width: '100%',
                          animation: `shrink ${autoCloseDelay}ms linear forwards`
                        }}
                      />
                    </div>
                    <p className={`text-xs mt-2 text-center ${
                      isLightMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Auto-closing in {Math.ceil(autoCloseDelay / 1000)} seconds
                    </p>
                  </div>
                )}

                <style>{`
                  @keyframes shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                  }
                `}</style>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
