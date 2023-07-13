import '../css/style.css'
import { darkModeHandel } from './utils';
import { startGame } from './game';

darkModeHandel();

const startGameButton = document.getElementById('startGame');
startGameButton.addEventListener('click', startGame);



