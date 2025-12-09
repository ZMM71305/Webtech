document.getElementById('feedback-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const rating = document.querySelector('input[name="rating"]:checked').value;
    const comments = document.getElementById('comments').value;
    const timestamp = new Date().toISOString();

    const feedback = {
        rating,
        comments,
        timestamp
    };

    // Save to localStorage
    let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
    feedbacks.push(feedback);
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));

    // Show success message
    document.getElementById('success-message').style.display = 'block';

    // Reset form
    document.getElementById('feedback-form').reset();

    // Hide success message after 3 seconds
    setTimeout(() => {
        document.getElementById('success-message').style.display = 'none';
    }, 3000);
});
