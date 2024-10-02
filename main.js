let players = [];
let playerPositions = {};
let currentPlayerIndex = 0;
let pointsPerPlayer = 10;
let playerScores = {};
let selectedCount = 0;
let targetPlayer = '';
let movingPlayers = [];

// Botones y modales
const btnAbrirModal = document.querySelector('#open-modal');
const btnCerrarModal = document.querySelector('#confirm-rewar');
const modal = document.querySelector('#modal');

const btnOpenInstructions = document.querySelector('#openInstructions');
const btnCloseInstructions = document.querySelector('#closeInstructions');
const modalInstructions = document.querySelector('#modalInstructions');

// Elementos relacionados con el juego
const banderaAtacante = document.getElementById('bandera-atacante');
const banderaAtacado = document.getElementById('bandera-atacado');

const paisAtacante = document.getElementById('pais-atacante');
const paisAtacado = document.getElementById('pais-atacado');
const jugadorActual = document.getElementById('jugador-actual');

const playerSelection = document.getElementById('player-selection');
const countrySelect = document.getElementById('country-select');
const gameBoard = document.getElementById('game-board');
const gameOver = document.getElementById('game-over');
const añadirJugadorButton = document.getElementById('add-player');
const startGameButton = document.getElementById('start-game');
const playerList = document.getElementById('players');
const playerScoresList = document.getElementById('player-scores');

// Modales y confirmaciones
const confirmarJugadorModal = document.getElementById('confirm-rewar')
const warDeclaration = document.getElementById('war-declaration');

const banderaGanador = document.getElementById('banderaGanador')
const quitarPuntoSelect = document.getElementById('quitar-punto');
const targetPlayerSelect = document.getElementById('target-player');
const confirmarJugadorButton = document.getElementById('confirm-target');
const stepsEstimation = document.getElementById('steps-estimation');
const stepCountInput = document.getElementById('step-count');
const confirmStepsButton = document.getElementById('confirm-steps');
const resultSection = document.getElementById('result');
const resultMessage = document.getElementById('result-message');
const nextRoundButton = document.getElementById('next-round');
const currentPlayerDisplay = document.getElementById('current-player');
const winnerMessage = document.getElementById('winner-message');
const restartGameButton = document.getElementById('restart-game');
const map = document.getElementById('map');
const playerIcons = document.getElementById('player-icons');

// Lista de eventos
añadirJugadorButton.addEventListener('click', añadirJugador);
startGameButton.addEventListener('click', startGame);

confirmarJugadorModal.addEventListener('click', confirmarJugadormodal);

confirmarJugadorButton.addEventListener('click', confirmarJugador);
confirmStepsButton.addEventListener('click', confirmSteps);
nextRoundButton.addEventListener('click', nextRound);
restartGameButton.addEventListener('click', restartGame);
btnAbrirModal.addEventListener("click", () => { modal.showModal(); updateModalPlayerOptions(); })
btnCerrarModal.addEventListener("click", () => { modal.close(); })

btnOpenInstructions.addEventListener("click", () => { modalInstructions.showModal() })
btnCloseInstructions.addEventListener("click", () => { modalInstructions.close() })

// los jugadores eligen un país y empieza el juego

let totalCountries = countrySelect.options.length

function añadirJugador() {
    const selectedCountry = countrySelect.value;

    players.push(selectedCountry);
    playerScores[selectedCountry] = pointsPerPlayer;

    removeOptionFromSelect(countrySelect, selectedCountry);
    updatePlayerList();

    selectedCount++
    if (selectedCount === totalCountries) {
        document.getElementById('country-select').style.display = 'none';
        document.getElementById('add-player').style.display = 'none';

    }
}

function updatePlayerList() {
    playerList.innerHTML = '';
    players.forEach(player => {
        const li = document.createElement('li');
        li.textContent = player;
        playerList.appendChild(li);
    });
}

function removeOptionFromSelect(selectElement, value) {
    const options = selectElement.options;
    for (let i = options.length - 1; i >= 0; i--) {
        if (options[i].value === value) {
            options.remove(i);
        }
    }
}

function startGame() {
    if (players.length < 3) {
        alert('Debes añadir al menos tres jugadores.');
        return;
    }

    banderaAtacado.style.display = 'none';
    banderaAtacante.style.display = 'none';

    gameStarted = true;
    playerSelection.classList.add('hidden');
    gameBoard.classList.remove('hidden');

    const container = document.getElementById('container');
    container.style.background = '#aebccf'

    initializePlayersOnMap();
    updatePlayerScores();
    currentPlayerIndex = 0;
    currentPlayerDisplay.textContent = players[currentPlayerIndex];

    declararGuerra();
}

// -----------------------------------------------------

// Posicion inicial de los jugadores

function initializePlayersOnMap() {
    playerIcons.innerHTML = '';

    const activePlayers = players.filter(player => playerScores[player] > 0);
    const radius = 50;
    const angleStep = 360 / activePlayers.length;

    activePlayers.forEach((player, index) => {
        const playerDiv = document.createElement('div');
        playerDiv.classList.add('player');
        playerDiv.textContent = player.substring(0, 2);
        playerDiv.id = `player-${player}`;
        playerIcons.appendChild(playerDiv);

        const angle = index * angleStep;
        const x = map.offsetWidth / 2 + radius * Math.cos(angle * Math.PI / 180);
        const y = map.offsetHeight / 2 + radius * Math.sin(angle * Math.PI / 180);

        playerDiv.style.left = `${x}px`;
        playerDiv.style.top = `${y}px`;
        playerPositions[player] = { x, y };
    });
}

function removePlayerFromMap(player) {
    const playerDiv = document.getElementById(`player-${player}`);
    if (playerDiv) {
        playerDiv.remove();
    }
}



// --------------------------------------------------------

// Inicio del juego

function declararGuerra() {
    warActive = true;
    warDeclaration.classList.remove('hidden');
    updateTargetPlayerOptions();
}

function movePlayersRandomly() {
    players.forEach(player => {
        if (player !== targetPlayer) {
            const playerDiv = playerIcons.children[players.indexOf(player)];

            const newX = Math.random() * (map.offsetWidth - 30);
            const newY = Math.random() * (map.offsetHeight - 30);

            anime({
                targets: playerDiv,
                left: `${newX}px`,
                top: `${newY}px`,
                duration: 1000,
                easing: 'easeOutQuad'
            });

            playerPositions[player] = { x: newX, y: newY };
            movingPlayers.push(player);
        }
    });
}

function updateTargetPlayerOptions() {
    targetPlayerSelect.innerHTML = '';

    players.forEach(player => {
        if (player !== players[currentPlayerIndex] && playerScores[player] > 0) {
            const option = document.createElement('option');
            option.value = player;
            option.textContent = player;
            targetPlayerSelect.appendChild(option);
        }
    });

}

function updateModalPlayerOptions() {
    quitarPuntoSelect.innerHTML = '';

    players.forEach(player => {
        if (player !== targetPlayer && playerScores[player] > 0) {
            const option = document.createElement('option');
            option.value = player;
            option.textContent = player;
            quitarPuntoSelect.appendChild(option);
        }
    });

}

function obtenerBandera(pais) {
    return `img/flags/${pais.toLowerCase()}.png`;
}


function confirmarJugador() {
    targetPlayer = targetPlayerSelect.value;
    paisAtacante.innerHTML = `Pais Atacante: ${targetPlayer}`;

    banderaAtacante.style.display = 'block';
    banderaAtacante.src = obtenerBandera(targetPlayer);

    banderaAtacado.style.display = 'none';

    warActive = false;
    movePlayersRandomly();

    warDeclaration.classList.add('hidden');
    btnAbrirModal.style.display = 'block';
    jugadorActual.style.display = 'none'; // <----------------------------------- quedamos aqui 

    const playerDiv = playerIcons.children[players.indexOf(targetPlayer)];
    playerDiv.classList.add('target1');

}


function confirmarJugadormodal() {
    targetPlayer = quitarPuntoSelect.value;
    paisAtacado.innerHTML = `Pais Atacado: ${targetPlayer}`;

    banderaAtacado.style.display = 'block';
    banderaAtacado.src = obtenerBandera(targetPlayer);

    stepsEstimation.classList.remove('hidden');
    btnAbrirModal.style.display = 'none';

    const playerDiv = playerIcons.children[players.indexOf(targetPlayer)];
    playerDiv.classList.add('target2');
}

// ----------------------------------------------------------


// Funciones para los pasos de los jugadores


function confirmSteps() {
    const steps = parseInt(stepCountInput.value);
    if (isNaN(steps) || steps < 1 || steps > 60) {
        alert('Introduce un número válido de pasos (entre 1 y 60).');
        return;
    }

    stepsEstimation.classList.add('hidden');
    movePlayers(steps);
}


function movePlayers(steps) {
    const targetPlayer = targetPlayerSelect.value;
    const targetPlayerModal = quitarPuntoSelect.value;

    const startX = playerPositions[targetPlayer].x;
    const startY = playerPositions[targetPlayer].y;
    const endX = playerPositions[targetPlayerModal].x;
    const endY = playerPositions[targetPlayerModal].y;

    // Calcula la distancia real entre los puntos
    const dx = endX - startX;
    const dy = endY - startY;
    const distanciaTotal = Math.sqrt(dx * dx + dy * dy);

    // Calcula cuántos pasos reales se necesitan
    const pasosReales = Math.ceil(distanciaTotal / 10);
    const pasosAMover = steps;

    let stepCount = 0;

    function moveStep() {
        if (stepCount < pasosAMover) {
            const playerDiv = playerIcons.children[players.indexOf(targetPlayer)];

            const progress = Math.min((stepCount + 1) / pasosReales, 1);
            const newX = startX + dx * progress;
            const newY = startY + dy * progress;

            anime({
                targets: playerDiv,
                left: `${newX}px`,
                top: `${newY}px`,
                duration: 300,
                easing: 'easeOutQuad'
            });

            playerPositions[targetPlayer] = { x: newX, y: newY };
            stepCount++;
            setTimeout(moveStep, 50);
        } else {
            let resultText = `Intentaste eliminar a ${targetPlayerModal} con ${steps} pasos. `;
            if (steps > pasosReales) {
                playerScores[targetPlayer]--;
                resultText += `Te pasaste. Necesitabas ${pasosReales} pasos. Pierdes un punto por pasarte.`;
            } else if (steps === pasosReales) {
                playerScores[targetPlayerModal]--;
                resultText += `¡Éxito! Usaste exactamente los pasos necesarios. ${targetPlayerModal} pierde un punto.`;
            } else {
                playerScores[targetPlayer]--;
                resultText += `Fallo. No llegaste al objetivo. Necesitabas ${pasosReales} pasos. Pierdes un punto.`;
            }
            resultMessage.textContent = resultText;
            resultSection.classList.remove('hidden');
            updatePlayerScores();
            checkGameOver();
        }
    }

    moveStep();
}

// ------------------------------------------------------

// Actualiza el marcador, elimina los jugadores del mapa e inicia la nueva ronda

function updatePlayerScores() {
    playerScoresList.innerHTML = '';

    players.forEach((player) => {
        const li = document.createElement('li');
        if (playerScores[player] > 0) {
            li.textContent = `${player}: ${playerScores[player]} puntos`;
        } else {
            li.textContent = `${player}: Eliminado`;
            li.style.color = 'red';
        }
        playerScoresList.appendChild(li);
    });
}

function nextRound() {
    resultSection.classList.add('hidden');
    stepsEstimation.classList.add('hidden');
    warDeclaration.classList.add('hidden');

    jugadorActual.style.display = 'block';

    // Eliminar jugadores con 0 puntos del mapa
    players.forEach(player => {
        if (playerScores[player] === 0) {
            removePlayerFromMap(player);
        }
    });

    do {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    } while (playerScores[players[currentPlayerIndex]] === 0 && players.some(player => playerScores[player] > 0));

    currentPlayerDisplay.textContent = players[currentPlayerIndex];

    paisAtacado.innerHTML = '';
    paisAtacante.innerHTML = '';

    banderaAtacado.style.display = 'none';
    banderaAtacante.style.display = 'none';

    banderaAtacado.innerHTML = '';
    banderaAtacante.innerHTML = '';

    updatePlayerScores();
    initializePlayersOnMap();
    updateTargetPlayerOptions();
    updateModalPlayerOptions();
    declararGuerra();
}

// ------------------------------------------------

//  Muestra la pantalla del jugador ganador

function checkGameOver() {
    const remainingPlayers = players.filter(player => playerScores[player] > 0);
    if (remainingPlayers.length === 1) {
        gameOver.classList.remove('hidden');
        gameBoard.classList.add('hidden');
        winnerMessage.textContent = `¡Ganador: ${remainingPlayers[0]}!`;

        banderaGanador.src = obtenerBandera(remainingPlayers[0]);
    }
}

// ------------------------------------------------- 

// Se reinicia el juego

function restartGame() {
    location.reload();
}

