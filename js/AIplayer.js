class AIplayer extends Player {
	constructor(role, turn, opponent) {
		super(role, turn);
		this.opponent = opponent;
		this.ai = true;
	}

	think() {
		let move;

		if (this.winning()) {

			move = this.winning();
			console.log('Oh yea!, one more move to win:', move);
			return this.pickTile(move);

		} else if (this.losing()) {

			move = this.losing();
			console.log('Shit!, gonna lose, have to prevent it:', move);
			return this.pickTile(move);

		}

		let avlpat = this.getAvailablePatterns();
		console.log('Here are all the possible ways that I might win:', avlpat);

		if (avlpat.length === 0) {

			move = this.whatever();
			console.log('No way to win, so whatever move is fine:', move);

		} else {

			let pat = this.pickPattern(avlpat);
			move = this.pickTile(pat);
			console.log('Let\'s go with this way:', pat);
			console.log('I will pick this move:', move);
			
			if (!this.tileAvailable(move)) {

				console.log('Oops, this move has been played by myself');
				pat = this.anyTileOnTheSamePatternStillAvailable(pat);

				if (pat.length !== 0) {

					move = this.pickTile(pat);
					console.log('But there is still move availabe!!', move);

				} else {

				move = this.whatever();
				console.log('My opponent has played that move, so whatever move is fine:', move);

				}

			}
		}
		return move;
	}

	getTile() {
		return this.think();
	}

	// return availabe patterns
	getAvailablePatterns() {
		let available = num => this.opponent.tiles.indexOf(num) < 0;
		return (game.winPattern.filter(pattern => pattern.every(available)));
	}

	// return chosen pattern
	pickPattern(arr) {
		let ran = this.getRandomIndex(arr);
		return arr[ran];
	}

	// return tile in the chosen pattern
	pickTile(arr) {
		let ran = this.getRandomIndex(arr);
		return arr[ran];
	}

	getRandomIndex(arr) {
		return Math.floor(Math.random() * arr.length);
	}

	tileAvailable(tile) {
		if (!game.board.includes(tile)) return false;
		return true;
	}

	whatever() {
		let i = this.getRandomIndex(game.board);
		return game.board[i];
	}

	anyTileOnTheSamePatternStillAvailable(pat) {
		return pat.filter(tile => game.board.includes(tile));
	}	


	winning() {
		let moves = this.getPotentialMoves(this.tiles);
		if (moves) {
			moves = moves.map(arr => parseInt(arr)).filter(move => game.board.includes(move));
		}
		if (moves.length > 0) return moves;
		else return false;
	}

	losing() {
		let moves = this.getPotentialMoves(this.opponent.tiles);
		if (moves) {
			moves = moves.map(arr => parseInt(arr)).filter(move => game.board.includes(move));
		}
		if (moves.length > 0) return moves;
		else return false;
	}

	getPotentialMoves(tiles) {
		let arr = [];
		let moves = [];
		game.winPattern.forEach(pat => {
			arr.push(this.getMatchNumbers(tiles, pat));
		});
		arr = arr.filter(sub => sub !== false);	// get an array of moves and closing patterns
		arr.forEach(sub => {
			moves.push(this.getNotMatchNumbers(sub[1], sub[0]));	// get the potential moves for the closing patterns
		});
		if (moves.length > 0) return moves;
		else return false;
	}	

	getMatchNumbers(arr1, arr2) {
	  let matchNumbers = arr1.filter(num => arr2.indexOf(num) >= 0);
	  if (matchNumbers.length > 1) {
	  	return [matchNumbers, arr2];
	  } else {
	  	return false;
	  }
	}

	getNotMatchNumbers(arr1, arr2) {
		return arr1.filter(num => arr2.indexOf(num) < 0);
	}
}