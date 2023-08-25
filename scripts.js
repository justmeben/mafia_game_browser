// Get the games container
const gamesContainer = document.getElementById('gamesContainer');

fetch('final_combined_games_data.json')
    .then(response => response.json())
    .then(gamesData => {
        // Populate the games on the page
        gamesData.forEach(game => {
            const gameBox = document.createElement('div');
            gameBox.classList.add('game-box');
            gameBox.innerHTML = `
                <div class="game-number">Game: ${game['#']}</div>
                <div class="game-winner">Winner: ${game.winner}</div>
                <div class="game-duration">Duration: ${Math.round(game.length / 60)} minutes</div>
            `;

            // Add click event to navigate to details page
            gameBox.addEventListener('click', () => {
                window.location.href = `details.html?id=${game['#']}`;
            });

            gamesContainer.appendChild(gameBox);
        });
    })
    .catch(error => {
        console.error('Error loading JSON data:', error);
    });