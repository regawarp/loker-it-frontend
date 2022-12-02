const ModalHeader = ({ children }) => {
  return <div>{children}</div>;
};

const ModalBody = ({ children }) => {
  return <div>{children}</div>;
};

const ModalFooter = ({ children }) => {
  return <div>{children}</div>;
};

const Modal = ({ show, setShow, children, customStyle }) => {
  return (
    <div>
      <input
        type="checkbox"
        className="modal-toggle"
        checked={show}
        onChange={(e) => e.preventDefault()}
      />
      <div
        className="modal cursor-pointer overflow-y-auto py-6"
        onClick={(e) => setShow(false)}
      >
        <div
          className="modal-box relative w-full max-h-max max-w-max m-auto py-10 cursor-default"
          onClick={(e) => e.stopPropagation()}
          style={customStyle}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;
