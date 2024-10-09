import { useState } from 'react';
import './SignMessage.css';
import { signMessage } from '../repo/vencuraBackendRepo';

export default function SignMessage({ password }) {
    const [message, setMessage] = useState(''); // Text input state
    const [signedMessage, setSignedMessage] = useState(null); // Signed message state
    const [error, setError] = useState(null); // Error handling state

    // Handle form submission
    async function handleSubmit(event) {
        event.preventDefault(); // Prevent form refresh
        setError(null); // Clear any previous errors

        if (!password) {
            setError('Password is required to sign the message.');
            return;
        }

        try {
            const result = await signMessage(message, password); // Sign the message with password
            setSignedMessage(result.signedMessage); // Set the signed message
        } catch (e) {
            console.error(e); // Log the error for debugging
            setError('Failed to sign the message. Please try again.'); // Set error message
        }
    }

    // Reset to sign another message
    function handleTryAgain() {
        setMessage(''); // Clear the text box
        setSignedMessage(null); // Reset the signed message
    }

    return (
        <div className="sign-message-container">
            {!signedMessage ? (
                <form onSubmit={handleSubmit} className="sign-form">
                    <label htmlFor="message" className="message-label">Enter a Message to Sign:</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)} // Update message state
                        required
                        className="message-input"
                    />
                    <button type="submit" className="btn btn-primary">Sign Message</button>
                </form>
            ) : (
                <div className="signed-message-container">
                    <h3>Signed Message</h3>
                    <pre className="signed-message">{signedMessage}</pre>
                    {error && <p className="error">{error}</p>}
                    <button className="btn btn-secondary" onClick={handleTryAgain}>Try Again</button>
                </div>
            )}
        </div>
    );
}
