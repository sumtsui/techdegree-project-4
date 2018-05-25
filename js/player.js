class Player {
	constructor(role, turn) {
		this.role = role;
		this.turn = turn;
		this.tiles = [];
	}

	set name(name) { if (name !== '') this._name = name; }

	get name() { return this._name; }

	set playFirst(turn) {
		this._playFirst = turn;
	}

	get playFirst() {
		return this._playFirst;
	}

	addTile(index) { this.tiles.push(index); }

	getTile(e) {
		if (e.target.tagName === 'LI') return parseInt(e.target.classList[1]);
	}

	getIcon() {
		return (this.role === 'player1') ? 'img/o.svg' : 'img/x.svg';
	}

	getTileClass() {
		return (this.role === 'player1') ? 'box-filled-1' : 'box-filled-2';
	}
}