// Get the games container
const gamesContainer = document.getElementById('gamesContainer');

fetch('final_combined_games_data.json')
    .then(response => response.json())
    .then(gamesData => {
        // Populate the games on the page
        gamesData.forEach(game => {
            const gameBox = document.createElement('div');
            gameBox.classList.add('game-box');
            gameBox.id = `game${game['#']}`;
            gameBox.classList.add('winner-' + game.winner.toLowerCase());
            gameBox.innerHTML = `
                <div class="game-number">Game ${getGameNumberString(game['#'])}</div>
                <div class="game-winner"><strong>Winner: </strong>${game.winner}</div>
                <div class="game-duration"><strong>Duration: </strong>${Math.round(game.length / 60)} minutes</div>
                <div class="game-player hidden"></div>
            `;

            // Add click event to navigate to details page
            gameBox.addEventListener('click', () => {
                window.location.href = `details.html?id=${game['#']}`;
            });

            gamesContainer.appendChild(gameBox);
        });

        // Populate the player dropdown
        const allPlayers = new Set();
        gamesData.forEach(game => {
            game.players.forEach(player => {
                allPlayers.add(player.name);
            });
        });
        const playerSelect = document.getElementById('playerSelect');
        Array.from(allPlayers).sort().forEach(playerName => {
            const option = document.createElement('option');
            option.value = playerName;
            option.textContent = playerName;
            playerSelect.appendChild(option);
        });

        // Event listener for when a player is selected
        playerSelect.addEventListener('change', function() {
            document.querySelectorAll('.game-player').forEach(gameBox => {
                gameBox.innerHTML = '';
                gameBox.classList.add('hidden')
            });
            const selectedPlayer = this.value;
            gamesData.forEach(game => {
                const gameBox = document.querySelector(`#game${game['#']} .game-player`);
                const playerDetails = game.players.find(player => player.name === selectedPlayer);
                if (playerDetails) {
                    const result = playerDetails.is_win ? 'Won' : 'Lost';
                    gameBox.classList.remove('hidden');
                    gameBox.innerHTML = `<p><strong>${selectedPlayer}</strong>: <br>${result}, ${playerDetails.role}${playerDetails.bonus === 0 ? '' : ', ' + playerDetails.bonus}</p>`;
                }
            });
        });


    })
    .catch(error => {
        console.error('Error loading JSON data:', error);
    });
