// Configuração do Three.js
const scene = new THREE.Scene(); // Cria a cena
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // Define a câmera
const renderer = new THREE.WebGLRenderer({ antialias: true }); // Cria o renderizador WebGL com antialiasing para suavizar arestas

renderer.setSize(window.innerWidth, window.innerHeight); // Ajusta o tamanho do renderizador
document.getElementById("game-container").appendChild(renderer.domElement); // Anexa ao contêiner do jogo

// Criar um tabuleiro 3x3 para o jogo do galo
const boardSize = 3; // Dimensões do tabuleiro
const squareSize = 1; // Tamanho de cada quadrado
const board = []; // Matriz para armazenar os quadrados do tabuleiro





// Criar os quadrados do tabuleiro
for (let i = 0; i < boardSize; i++) {
   board[i] = [];
    for (let j = 0; j < boardSize; j++) {
       const geometry = new THREE.BoxGeometry(squareSize, squareSize, 0.2); // Geometria para cada quadrado
        const material = new THREE.MeshBasicMaterial({ color: 0xdddddd, transparent: true, opacity: 0.8 }); // Material do quadrado
        const square = new THREE.Mesh(geometry, material); // Cria o quadrado
        square.position.set(i - 1, j - 1, 0); // Define a posição dos quadrados no tabuleiro
        board[i][j] = square; // Adiciona à matriz do tabuleiro
        scene.add(square); // Adiciona à cena
   }
}

// Define a posição da câmera para ver o tabuleiro
camera.position.z = 5;

// Lógica do jogo do galo
let currentPlayer = 'X'; // Jogador inicial
const gameBoard = [['', '', ''], ['', '', ''], ['', '', '']]; // Matriz para verificar o jogo

// Função para verificar se há um vencedor
function checkWinner() {
    const winConditions = [
        // Linhas
        [gameBoard[0][0], gameBoard[0][1], gameBoard[0][2]],
        [gameBoard[1][0], gameBoard[1][1], gameBoard[1][2]],
        [gameBoard[2][0], gameBoard[2][1], gameBoard[2][2]],
        // Colunas
        [gameBoard[0][0], gameBoard[1][0], gameBoard[2][0]],
        [gameBoard[0][1], gameBoard[1][1], gameBoard[2][1]],
        [gameBoard[0][2], gameBoard[1][2], gameBoard[2][2]],
        // Diagonais
        [gameBoard[0][0], gameBoard[1][1], gameBoard[2][2]],
        [gameBoard[0][2], gameBoard[1][1], gameBoard[2][0]],
    ];

    for (const condition of winConditions) {
        if (condition[0] !== '' && condition[0] === condition[1] && condition[1] === condition[2]) {
            return condition[0]; // Retorna o vencedor ('X' ou 'O')
        }
    }

    return null; // Sem vencedor
}

// Função para capturar cliques no jogo
function onClick(event) {
    const rect = renderer.domElement.getBoundingClientRect(); // Para obter a posição do mouse
    const mouseX = ((event.clientX - rect.left) / renderer.domElement.clientWidth) * 2 - 1; // Converte para coordenadas Three.js
    const mouseY = -((event.clientY - rect.top) / renderer.domElement.clientHeight) * 2 + 1; // Converte para coordenadas Three.js

    const raycaster = new THREE.Raycaster(); // Para detectar cliques
    raycaster.setFromCamera({ x: mouseX, y: mouseY }, camera); // Define o raio do raycaster

    const intersects = raycaster.intersectObjects(scene.children); // Verifica se houve intersecção

    if (intersects.length > 0) { // Se houve intersecção
        const clickedObject = intersects[0].object; // Objeto clicado
        const boardX = Math.round(clickedObject.position.x + 1); // Define a posição no tabuleiro
        const boardY = Math.round(clickedObject.position.y + 1); // Define a posição no tabuleiro

        if (gameBoard[boardX][boardY] === '') { // Se o quadrado está vazio
            // Cria a marca para o jogador atual
            const markMaterial = new THREE.MeshBasicMaterial({
                color: currentPlayer === 'X' ? 0xff0000 : 0x0000ff, // Vermelho para 'X', Azul para 'O'
            });

            const markGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.2); // Geometria da marca
            const mark = new THREE.Mesh(markGeometry, markMaterial); // Cria a marca
            mark.position.copy(clickedObject.position); // Copia a posição do objeto clicado
            mark.position.z = 0.1; // Sobe um pouco para ser visível

            scene.add(mark); // Adiciona à cena

            gameBoard[boardX][boardY] = currentPlayer; // Atualiza a matriz do jogo

            const winner = checkWinner(); // Verifica se há um vencedor
            if (winner) {
                alert(`O vencedor é: ${winner}`); // Mostra uma mensagem para o vencedor
                // Reiniciar o jogo
                currentPlayer = 'X'; // Começa com o jogador 'X' novamente
                gameBoard.forEach((row, x) => {
                    row.fill(''); // Limpa a matriz do jogo
                });
                // Remove todas as marcas do tabuleiro
                scene.children.splice(boardSize ** 2); // Mantém apenas os quadrados do tabuleiro
            } else {
                // Alterna entre os jogadores
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            }
        }
    }
}

// Adiciona um ouvinte para capturar cliques
document.addEventListener('click', onClick); // Ouvinte para capturar cliques

// Função para renderizar a cena continuamente
function animate() {
    requestAnimationFrame(animate); // Chama-se a si mesmo para continuar animando
    renderer.render(scene, camera); // Renderiza a cena
}

// Inicia a animação
animate(); 