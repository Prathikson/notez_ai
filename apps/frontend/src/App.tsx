import { useState } from 'react';
import FileUpload from './components/FileUpload'; // Make sure the path is correct based on where you saved the FileUpload component
import Header from './components/Header';

function App() {
  return (
    <div>
      <Header/>
      <FileUpload />
    </div>
  );
}

export default App;
