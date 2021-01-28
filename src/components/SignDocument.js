import React from 'react'
import PropTypes from "prop-types"
import Draggable from "react-draggable"
import './signDoc.css';

class SignDocument extends React.Component {
  render (){    
    return (
      <div id="draggableSignature">
        <Draggable>
          <div>Drag your signature to place it &nbsp;<button>Sign</button></div>
        </Draggable>
      </div>
    );
  }
};

export default SignDocument;