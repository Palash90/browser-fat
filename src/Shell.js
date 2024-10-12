import React, { useState } from 'react';
import './Shell.css'; // Add custom CSS for styling the shell interface
import { Col, Container, Row } from 'react-bootstrap';

const Shell = ({listFiles, createFile, updateFile, readFile, deleteFile}) => {
    const [history, setHistory] = useState([]); // Stores previous commands
    const [currentInput, setCurrentInput] = useState(''); // Stores current command

    // Function to handle command input (simulating a shell-like behavior)
    const handleCommand = (command) => {
        // Add a simple response for demonstration
        let output;
        switch (command.toLowerCase()) {
            case 'help':
                output = 'Available commands: help, clear, echo [message], mk <file_name> <content>, cat <file_name>, rm <file_name>';
                break;
            case 'clear':
                setHistory([]); // Clears the history
                return;
            case 'ls':
                output = listFiles()
                break;
            default:
                if (command.startsWith('echo ')) {
                    output = command.slice(5); // Echo back the message after 'echo '
                } else if (command.startsWith('mk')) {
                    var segments = command.split(' ');
                    if (segments.length != 3) {
                        output = 'mk needs 2 arguments: file name and content';
                    } else {
                        createFile(segments[1], segments[2]);
                    }
                } else if (command.startsWith('cat')) {
                    var segments = command.split(' ');
                    if (segments.length != 2) {
                        output = "cat needs 1 argument: file name"
                    } else {
                        output = readFile(segments[1])
                    }
                } else if (command.startsWith('rm')) {
                    var segments = command.split(' ');
                    if (segments.length != 2) {
                        output = "rm needs 1 argument: file name"
                    } else {
                        output = deleteFile(segments[1])
                    }
                } else {
                    output = `Command not found: ${command}`;
                }
                break;
        }
        // Add the command and the response to history
        setHistory([...history, { command, output }]);
    };

    // Function to handle form submission (when Enter is pressed)
    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentInput.trim() !== '') {
            handleCommand(currentInput);
            setCurrentInput(''); // Clear input after submission
        }
    };

    return (
        <Container><Row><Col>
            <div className="shell">
                <div className="shell-output">
                    {history.map((entry, index) => (
                        <div key={index}>
                            <div className="shell-command"> &gt; {entry.command}</div>
                            {entry.output && <div className="shell-output-text">{entry.output}</div>}
                        </div>
                    ))}
                </div>

                <form className="shell-input" onSubmit={handleSubmit}>
                    <span className="shell-prompt"> &gt; </span>
                    <input
                        type="text"
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        autoFocus
                    />
                </form>
            </div>
        </Col></Row></Container>
    );
};

export default Shell;
