(function() {

const startDiv = document.querySelector('#start');
const startBtn = startDiv.querySelector('#startBtn');
const p1NameInput = startDiv.querySelector('#p1-name');
const p2NameInput = startDiv.querySelector('#p2-name');
const p1Li = document.querySelector('#player1');
const p2Li = document.querySelector('#player2');
const board = document.querySelector('ul.boxes');
const tiles = board.children;
const endDiv = document.querySelector('#finish-screen');

class Player {
	constructor(role, turn) {
		this.role = role;
		this.turn = turn;
		this.tiles = [];
	}

	set name(name) { if (name !== '') this._name = name; }

	get name() { return this._name; }

	play(index) { this.tiles.push(index); }
}

class Game {
	constructor(players) {
		this.board = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		this.players = players;
		this.winPattern = [
			[1, 2, 3],
			[1, 4, 7],
			[3, 6, 9],
			[4, 5, 6],
			[7, 8, 9],
			[2, 5, 8],
			[1, 5, 9],
			[3, 5, 7]
		];
	}

	switch() {
		let cp = this.getCurrentP();
		let rp = this.getRestingP();
		cp.turn = false;
		rp.turn = true;
	}

	makeMove(tile) {
		if (this.board.includes(tile)) {
			this.board.splice(this.board.indexOf(tile), 1);
			this.getCurrentP().play(tile);
		}
	}

	win(player) {
		let result = false;
		this.winPattern.forEach(pattern => {
			if (this.arrayContainsArray(player.tiles, pattern)) { result = true; }
		});
		return result;
	}

	getWinner() { return this.players.filter(player => this.win(player))[0]; }

	finish() { return (this.board.length < 1); }

	arrayContainsArray(superset, subset) {
	  if (0 === subset.length) {
	    return false;
	  }
	  return subset.every(function (value) {
	    return (superset.indexOf(value) >= 0);
	  });
	}

	getCurrentP() { return this.players.filter(p => p.turn === true)[0]; }

	getRestingP() { return this.players.filter(p => p.turn === false)[0];	}

	renderResult(result) {
		let re = '';
		let str = 'Winner';
		switch (result) {
			case 'player1':
				re = 'screen-win-one';
				break;
			case 'player2':
				re = 'screen-win-two';
				break;
			default:
				re = 'screen-win-tie';
				str = 'Tie';
		}
		let html = `<div class="screen screen-win ${re}" id="finish">`;
		html += `<header><h1>Tic Tac Toe</h1>`;
		html += `<p class="message">${str}</p><a href="#" class="button">New game</a>`;
		html += `</header></div>`;
		document.querySelector('#finish-screen').innerHTML = html;
		hide(p1Li);
		hide(p2Li);
	}
}

function startGame() {
	hide(p1Li);
	hide(p2Li);
	startBtn.addEventListener('click', (event) => { 
		hide(startDiv);
		show(p1Li);
		show(p2Li);
		p1Li.classList.add('active');
		p1.name = p1NameInput.value.substring(0, 6);
		p2.name = p2NameInput.value.substring(0, 6);
		// if player has name, add name to player Li element
		game.players.filter(p => p.name !== undefined).forEach(p => {
			let span = document.createElement('span');
			span.textContent = p.name;
			document.querySelector(`#${p.role}`).append(span);	
		});
	});
}

let p1 = new Player('player1', true);
let p2 = new Player('player2', false);
let game = new Game([p1, p2]);
startGame();

board.addEventListener('click', (event) => {
	// when player click a tile
	if (event.target.tagName === 'LI') {
		// get the tile number
		let tileNum = parseInt(event.target.classList[1]);
		// if it is player 1's turn and tile haven't been taken
		if (p1.turn && game.board.includes(tileNum)) {
			event.target.classList.add('box-filled-1');
			game.makeMove(tileNum);
			game.switch();
		}
		// if it is player 2's turn and tile haven't been taken
		if (p2.turn && game.board.includes(tileNum)) {
			event.target.classList.add('box-filled-2');
			game.makeMove(tileNum);
			game.switch();	
		}
	}
	// get current player and add 'active' class to its Li element.
	document.querySelector(`#${game.getCurrentP().role}`).classList.toggle('active');
	// get resting player and remove 'active' class from its Li element.
	document.querySelector(`#${game.getRestingP().role}`).classList.toggle('active');

	// when there is a winner 
	if (game.getWinner() !== undefined) {
		game.renderResult(game.getWinner().role);
	} else if (game.finish()) {
		game.renderResult();
	}

	// when End Game Screen shows up 
	if (endDiv.childElementCount > 0) {
		document.querySelector('#finish .button').addEventListener('click', () => {
			// create new players and new game, and reset the UI
			p1 = new Player('player1', true);
			p2 = new Player('player2', false);
			game = new Game([p1, p2]);
			resetUI();
		});
	} 
});

board.addEventListener('mouseover', () => {
	if (event.target.tagName === 'LI') {
		let tileNum = parseInt(event.target.classList[1]);
		if (p1.turn && !p2.tiles.includes(tileNum)) {
			event.target.style.backgroundImage = 'url("img/o.svg")';
		}
		if (p2.turn && !p1.tiles.includes(tileNum)) {
			event.target.style.backgroundImage = 'url("img/x.svg")';
		}
	}
});

board.addEventListener('mouseout', () => {
	if (event.target.tagName === 'LI') {
		let tileNum = parseInt(event.target.classList[1]);
		if (!p1.tiles.includes(tileNum) && !p2.tiles.includes(tileNum)) {
			event.target.style.backgroundImage = 'none';
		}
	}
});

function resetUI() {
	show(p1Li);
	show(p2Li);
	document.querySelector('#finish-screen').innerHTML = '';
	document.querySelector(`#${game.getCurrentP().role}`).classList.add('active');
	document.querySelector(`#${game.getRestingP().role}`).classList.remove('active');
	for (let i = 0; i < tiles.length; i++) {
		tiles[i].className = `box ${i+1}`;
		tiles[i].style.backgroundImage = 'none';
	}
}

function show(node) { node.style.display = 'block'; }
function hide(node) { node.style.display = 'none'; }

}());