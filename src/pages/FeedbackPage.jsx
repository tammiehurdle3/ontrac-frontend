// src/pages/FeedbackPage.jsx
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import './FeedbackPage.css'; // We'll create this CSS file

const FeedbackPage = () => {
    const [searchParams] = useSearchParams();
    const rating = searchParams.get('rating');

    return (
        <div className="feedback-container">
            <div className="feedback-box">
                <div className="feedback-icon">✓</div>
                <h2>Thank You!</h2>
                <p>Your rating of {rating} out of 5 has been received.</p>
                <p>We appreciate your feedback.</p>
                <a href="/" className="button">Back to Homepage</a>
            </div>
        </div>
    );
};

export default FeedbackPage;