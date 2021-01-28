import React from 'react'
import PropTypes from "prop-types"
import Draggable from "react-draggable"
import './signDoc.css';

class SignDocument extends React.Component {
  render (){    
    return (
      <div id="signDocument">
      <button>Sign</button>
      <div id="draggableSignature">
        <Draggable>
          <div>I can now be moved around!</div>
        </Draggable>
      </div>
      </div>
    );
  }
};

export default SignDocument;