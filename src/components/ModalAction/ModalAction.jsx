import React from 'react'
import './ModalAction.scss'
const ModalAction = ({ title, content, open, setOpen }) => {
  return (
    <div className={`overlay ${open ? 'active' : 'inactive'}`} >
        <div className={`modal-action ${open ? 'active' : 'inactive'}`}>
        <div className="modal-action__topnav">
            <div className="closeBtn">
        <i className='bx bx-chevron-right' onClick={() => setOpen(!open)}></i>
            </div>
            <h1>{title}</h1>
        </div>

        <div className="modal-content">
            {content}
        </div>
    </div>
    </div>
  )
}

export default ModalAction
