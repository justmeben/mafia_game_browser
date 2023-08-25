// Load the JSON data
fetch('final_combined_games_data.json')
    .then(response => response.json())
    .then(data => {
        let playerScores = {}; // to store scores for each player
        let playerStats = {};  // to store stats for each player

        // Initialize score arrays with zeros
        for (let game of data) {
            for (let player of game.players) {
                let playerName = player.name;
                if (!playerScores[playerName]) {
                    playerScores[playerName] = Array(data.length).fill(0);
                }
            }
        }

        // Iterate over games and calculate scores
        for (let gameIndex = 0; gameIndex < data.length; gameIndex++) {
            let game = data[gameIndex];
            for (let player of game.players) {
                let playerName = player.name;
                if (!playerStats[playerName]) {
                    playerStats[playerName] = { games_played: 0, wins: 0, bonus: 0 };
                }
                let stats = playerStats[playerName];
                stats.games_played += 1;
                stats.bonus += player.bonus;
                if (player.is_win) stats.wins += 1;

                let score = stats.games_played * 0.38 + (100 * (stats.wins + stats.bonus) / stats.games_played);
                playerScores[playerName][gameIndex] = score;
            }

            // Carry over scores for players who did not play this game
            for (let player in playerScores) {
                if (gameIndex > 0 && playerScores[player][gameIndex] === 0) {
                    playerScores[player][gameIndex] = playerScores[player][gameIndex - 1];
                }
            }
        }

        // Filter players with more than 25 games and plot
        let colors = ['red', 'blue', 'green', 'purple', 'pink', 'yellow', 'orange', 'black', 'cyan'];
        let datasets = [];
        let idx = 0;

        for (let [player, scores] of Object.entries(playerScores)) {
            if (scores.filter(score => score !== 0).length > 25) {
                datasets.push({
                    label: player,
                    data: scores,
                    borderColor: colors[idx % colors.length],
                    fill: false
                });
                idx++;
            }
        }

        // Plot using Chart.js
        var ctx = document.getElementById('scoreChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array(data.length).fill().map((_, i) => i + 1), // game numbers
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Game Number'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Score'
                        }
                    }
                }
            }
        });
    });
