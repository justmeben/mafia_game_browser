
function formatDuration(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
        return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    } else {
        return `${mins}:${String(secs).padStart(2, '0')}`;
    }
}


function CFL(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getGameNumberString(game_num){
    const base = Math.ceil(Number(game_num) / 5);
    let remainder = Number(game_num) % 5;
    remainder === 0 ? remainder = 5 : remainder;
    return `${base}.${remainder}`;
}