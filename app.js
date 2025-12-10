document.addEventListener('DOMContentLoaded', () => {
    const views = {
        qr: document.getElementById('qr-view'),
        feedback: document.getElementById('feedback-view'),
        thankYou: document.getElementById('thank-you-view'),
        viewFeedback: document.getElementById('view-feedback'),
    };

    const navLinks = {
        toFeedback: document.querySelectorAll('.nav-to-feedback'),
        toViewFeedback: document.querySelectorAll('.nav-to-view-feedback'),
    };

    const feedbackForm = document.getElementById('feedback-form');

    // --- Navigation ---
    function showView(viewId) {
        // Hide all views
        for (const id in views) {
            if (views[id]) {
                views[id].style.display = 'none';
            }
        }
        // Show the requested view
        if (views[viewId]) {
            views[viewId].style.display = 'block';
        }
    }

    // --- Event Listeners for Navigation ---
    navLinks.toFeedback.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showView('feedback');
        });
    });

    navLinks.toViewFeedback.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            renderFeedbackList();
            showView('viewFeedback');
        });
    });

    // --- Feedback Form Handling ---
    feedbackForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const rating = feedbackForm.querySelector('input[name="rating"]:checked');
        const comments = feedbackForm.querySelector('#comments');
        const email = feedbackForm.querySelector('#email').value.trim();

        if (!rating) {
            alert('Please select a rating.');
            return;
        }

        const feedback = {
            rating: rating.value,
            comments: comments.value,
            timestamp: new Date().toISOString(),
            email: email
        };

        // Save to localStorage
        let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
        feedbacks.push(feedback);
        localStorage.setItem('feedbacks', JSON.stringify(feedbacks));

        // If an email is provided, open the email client to send a copy
        if (email) {
            const subject = 'Your Feedback to Hotel Cuna';
            const body = `Thank you for your feedback!\n\nHere is a copy of your submission:\n\nRating: ${feedback.rating} stars\nComments: ${feedback.comments}\n`;
            window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
        }

        // Reset form and show thank you view
        feedbackForm.reset();
        showView('thankYou');
    });

    // --- Feedback Rendering ---
    function renderFeedbackList() {
        const feedbackList = document.getElementById('feedback-list');
        const feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];

        feedbackList.innerHTML = ''; // Clear existing list

        if (feedbacks.length === 0) {
            feedbackList.innerHTML = '<p>No feedback yet.</p>';
            return;
        }

        // Sort by newest first
        feedbacks.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        feedbacks.forEach(feedback => {
            const feedbackEntry = document.createElement('div');
            feedbackEntry.className = 'feedback-entry';

            const ratingStars = '★'.repeat(feedback.rating) + '☆'.repeat(5 - feedback.rating);

            feedbackEntry.innerHTML = `
                <div class="feedback-header">
                    <span class="rating">${ratingStars}</span>
                    <span class="timestamp">${new Date(feedback.timestamp).toLocaleString()}</span>
                </div>
                <p class="comments">${feedback.comments}</p>
            `;

            feedbackList.appendChild(feedbackEntry);
        });
    }

    // --- Initial State ---
    // Show the QR code view by default
    showView('qr');
});
