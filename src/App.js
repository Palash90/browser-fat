import { useState } from 'react';
import './App.css';
import HardDisk from './HardDisk';
import { Stack } from 'react-bootstrap';
import Shell from './Shell';
import FileSystem from './fat';


function App() {
  const [fs] = useState(() => new FileSystem(256, 8));

  const [disk, setDisk] = useState(fs.disk);

  const createFile = (fileName, content) => {
    try {
      var updatedDisk = fs.createFile(fileName, content);
      setDisk([...updatedDisk]);
    } catch (error) {
      return error.message; // Return error message if failed
    }
  };

  const readFile = (fileName) => {
    try {
      return fs.readFile(fileName); // Return file content
    } catch (error) {
      return error.message; // Return error message if failed
    }
  };

  const updateFile = (fileName, content) => {
    try {
      var updatedDisk = fs.updateFile(fileName, content);
      setDisk([...updatedDisk]);
      return true; // Success
    } catch (error) {
      return error.message; // Return error message if failed
    }
  };

  const deleteFile = (fileName) => {
    try {
      var updatedDisk = fs.deleteFile(fileName);
      setDisk([...updatedDisk]);
      return true; // Success
    } catch (error) {
      return error.message; // Return error message if failed
    }
  };

  const listFiles = () => {
    return fs.listFiles();
  };

  return (
    <Stack gap={3}>
      <div className="p-2"><HardDisk disk={disk} /></div>
      <div className="p-2"><Shell createFile={createFile} listFiles={listFiles} deleteFile={deleteFile} readFile={readFile}  /></div>
      <div className="p-2">Third item</div>
    </Stack>

  );
}

export default App;
