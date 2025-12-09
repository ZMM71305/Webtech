document.addEventListener('DOMContentLoaded', () => {
    const views = {
        qr: document.getElementById('qr-view'),
        feedback: document.getElementById('feedback-view'),
        viewFeedback: document.getElementById('view-feedback'),
    };

    const navLinks = {
        toFeedback: document.querySelectorAll('.nav-to-feedback'),
        toViewFeedback: document.querySelectorAll('.nav-to-view-feedback'),
    };

    const feedbackForm = document.getElementById('feedback-form');
    const successMessage = document.getElementById('success-message');

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
            views[viewId].style.display = 'block'; // or 'flex' if needed for centering
            if(viewId === 'qr' || viewId === 'feedback') {
                 views[viewId].style.display = 'flex';
            }
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

        if (!rating) {
            alert('Please select a rating.');
            return;
        }

        const feedback = {
            rating: rating.value,
            comments: comments.value,
            timestamp: new Date().toISOString()
        };

        // Save to localStorage
        let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
        feedbacks.push(feedback);
        localStorage.setItem('feedbacks', JSON.stringify(feedbacks));

        // Show success message and reset form
        successMessage.style.display = 'block';
        feedbackForm.reset();

        // Hide success message after 3 seconds, then show feedback list
        setTimeout(() => {
            successMessage.style.display = 'none';
            renderFeedbackList();
            showView('viewFeedback');
        }, 2000);
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
