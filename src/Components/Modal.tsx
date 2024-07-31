import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title ="" }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 relative max-w-xl w-full">
        <div className="flex items-center justify-between"> 
          <h1 className="font-bold text-xl">{title}</h1>
          <button className="text-gray-500 hover:text-gray-700 w-8 text-3xl" onClick={onClose}>
            &times;
          </button> 
        </div>
        <hr className="mb-2"/>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')!
  );
};

export default Modal;
