import React from 'react';
import './Popup.css';

interface PopupProps {
  trigger: boolean;
  children: React.ReactNode;
}

function Popup(props: PopupProps): JSX.Element | null {
  return props.trigger ? (
    <div className="popup">
      <div className="popup-inner">
        {props.children}
      </div>
    </div>
  ) : null;
}

export default Popup;

// import React from 'react';
// import './Popup.css'

// function Popup(props) {
//         return (props.trigger ? (
//             <div className="popup">
//                 <div className="popup-inner">
//                     {props.children}
//                 </div>
//             </div>
//         ) : ""
//     );
// }

// export default Popup





