// Get the game number from URL
const urlParams = new URLSearchParams(window.location.search);
const gameId = urlParams.get('id');

fetch('final_combined_games_data.json')
    .then(response => response.json())
    .then(gamesData => {
        // Find the game with the given number
        const game = gamesData.find(g => g['#'].toString() === gameId);

        const prevGameBtn = document.getElementById('prevGame');
        const nextGameBtn = document.getElementById('nextGame');
        
        const currentIndex = gamesData.findIndex(g => g['#'].toString() === gameId);
        
        // If there's a previous game
        if (currentIndex > 0) {
            prevGameBtn.href = `details.html?id=${gamesData[currentIndex - 1]['#']}`;
        } else {
            prevGameBtn.style.display = 'none';
        }
        
        // If there's a next game
        if (currentIndex < gamesData.length - 1) {
            nextGameBtn.href = `details.html?id=${gamesData[currentIndex + 1]['#']}`;
        } else {
            nextGameBtn.style.display = 'none';
        }
        
        


        if (game) {
            let winningState = '';
            if (game.winner === 'Mafia') {
                winningState = `${game.mafias_remaining} on ${game.mafias_remaining}`;
            } else { // assuming 'citizen' is the other possible winner value
                winningState = `${game.citizens_remaining} citizens alive`;
            }
            let missesString = game.misses ? `<p><strong>Misses:</strong> ${game.misses}</p>` : '';

            // Populate the game details
            const innerDetails = document.getElementById('innerDetails');
            innerDetails.innerHTML = `
                <h2><strong>Game:</strong> ${getGameNumberString(game['#'])} (${game['#']})</h2>
                <p><strong>Winner:</strong> ${game.winner}</p>
                <p><strong>Duration:</strong> ${formatDuration(game.length)}</p>
                <p><strong>Winning Move:</strong> ${game.winning_move || 'N/A'}</p>
                <p><strong>Rounds:</strong> ${game.rounds}</p>
                ${missesString}
                <p><strong>Sherrifs:</strong> ${game.sheriffs}</p>
                <p><strong>End State:</strong> ${winningState}</p>
            `;

            const tagsContainer = document.getElementById('gameTags');
            tagsContainer.innerHTML = '<strong>Tags: </strong>';

            // Iterate through the game details and check for true values
            Object.keys(game).forEach(key => {
                if (game[key] === true) {
                    const tagElement = document.createElement('span');
                    tagElement.className = 'tag';
                    tagElement.textContent = key;
                    tagsContainer.appendChild(tagElement);
                }
            });

            const btnContainer = document.getElementById('btnContainer');
            btnContainer.innerHTML = `
            <a target='_blank' href="https://the-mafia.net/rate_game/${game.id}" class="details-btn">Mafia Net Details</a>
            <a target='_blank' href="https://www.youtube.com/watch?v=${game.youtube_id}" class="details-btn youtube-btn">Youtube Video</a>
            `


            // Populate players table
            const playersTableBody = document.querySelector('#playersTable tbody');
            game.players.forEach(player => {
                const playerRow = document.createElement('tr');
                playerRow.innerHTML = `
                    <td>${player['#']}</td>
                    <td>${player.name}</td>
                    <td>${player.role}</td>
                    <td>${player.is_win ? '✅' : '❌'}</td>
                    <td>${player.bonus}</td>
                    <td>${player.is_killed_first ? '🔫' : ''}</td>
                `;
                playersTableBody.appendChild(playerRow);
            });

             // Populate game log based on leave_order
            const gameLogContainer = document.getElementById('gameLog');
            game.leave_order.forEach(order => {
                const orderBox = document.createElement('div');
                orderBox.className = 'leave-order-box';
                orderBox.innerHTML = `
                (${order.player_num})
                    <strong>${game.players[order.player_num-1].name}</strong><br>
                    ${CFL(order.method)}
                `;
                gameLogContainer.appendChild(orderBox);
            });


        } else {
            gameDetails.innerHTML = '<p>Game not found</p>';
        }
    })
    .catch(error => {
        console.error('Error loading JSON data:', error);
    });
