import { useState } from 'react';

export default function PasswordPrompt({ onPasswordSubmit }) {
    const [password, setPassword] = useState(''); // Local state for the password

    function handleSubmit(event) {
        event.preventDefault();
        onPasswordSubmit(password); // Pass the password back to the parent component
    }

    return (
        <div className="password-prompt-container">
            <form onSubmit={handleSubmit}>
                <label id="passwordLabel" htmlFor="password">Enter Wallet Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} // Update password state
                    required
                />
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
}
