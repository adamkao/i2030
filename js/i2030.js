var game = {};
function padnum( n )    {return ('  ' + n).slice( -2 )}
function padstr( s )    {return ('                  ' + s).slice( -18 )}
function show( s ) {document.getElementById( 'output' ).value = s}
function clear() {
	document.getElementById( 'cpayamt' ).value = '';
	document.getElementById( 'ppayamt' ).value = '';
	document.getElementById( 'buybond' ).value = '';
}
function init() {clear(); prtable()}

game.round = 1;
game.costs = [ 0, 2, 4, 6, 9, 12, 16, 20, 25, 30 ];
game.bonus = [ 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 5, 5, 5 ];
game.power = [ 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 3, 4, 5, 6, 7, 8, 9, 9, 10, 10, 10 ];

function country( name, idx ) {
	return {
		name: name,
		idx: idx,
		bonds: [ '9', '8', '7', '6', '5', '4', '3', '2', '1' ],
		power: 0,
		cash: 0,
		pr:      function() {
			return( this.name + ' ' + this.bonds.join('') + ' ' + padnum( this.power ) + ' $' + padnum( this.cash ) + ' ' )
		},
		sell:    function( bond ) {
			this.bonds[ 9 - bond ] = '.';
			this.cash += game.costs[ bond ];
		},
		ret:     function( bond ) {this.bonds[ 9 - bond ] = bond;},
		factory: function() {this.cash -= 5},
		imp:     function( units ) {this.cash -= units},
		payin:   function( amt ) {this.cash += amt; return amt},
		payout:  function( amt ) {this.cash -= amt; return amt},
		powerup: function( rise ) {this.power += rise},
	}
}

game.R = country( 'R', 0 );
game.C = country( 'C', 1 );
game.I = country( 'I', 2 );
game.B = country( 'B', 3 );
game.U = country( 'U', 4 );
game.E = country( 'E', 5 );

function player( name ) {
	return {
		name: name,
		cash: 19,
		bonds: [
			[ '.', '.', '.', '.', '.', '.', '.', '.', '.' ],
			[ '.', '.', '.', '.', '.', '.', '.', '.', '.' ],
			[ '.', '.', '.', '.', '.', '.', '.', '.', '.' ],
			[ '.', '.', '.', '.', '.', '.', '.', '.', '.' ],
			[ '.', '.', '.', '.', '.', '.', '.', '.', '.' ],
			[ '.', '.', '.', '.', '.', '.', '.', '.', '.' ]
		],
		pr: function( i, owner ) {
			var mark = ((owner === this) ? '*' : ' ');
			return( '  ' + this.bonds[i].join('') + ' ' + padnum( this.interest( i ) ) + '/' + padnum( this.investment( i ) ) + mark );
		},
		buy: function( country, bond ) {
			country.sell( bond );
			this.bonds[ country.idx ][ 9 - bond ] = bond;
			this.cash -= game.costs[ bond ];
		},
		upgrade: function( country, fr, to ) {
			country.ret( fr );
			this.payin( country.payout( costs[ fr ] ) );
			this.bonds[ country.idx ][ 9 - fr ] = '.';
			this.buy( country, to );
		},
		interest: function( idx ) {
			var i, sum = 0;
			for (i = 0; i < 9; i++) {
				var bond = this.bonds[ idx ][ i ];
				sum += (bond === '.' ? 0 : bond);
			}
			return sum
		},
		investment: function( idx ) {
			var i, sum = 0;
			for (i = 0; i < 9; i++) {
				var bond = this.bonds[ idx ][ i ];
				sum += (bond === '.' ? 0 : game.costs[ bond ]);
			}
			return sum
		},
		payin: function( amt ) {this.cash += amt; return amt},
		payout: function( amt ) {this.cash -= amt; return amt},
	}
}

game.Adam = player( 'Adam' );
game.Beth = player( 'Beth' );
game.Carl = player( 'Carl' );
game.Dani = player( 'Dani' );

game.players = [ game.Adam, game.Beth, game.Carl, game.Dani ];
game.numplayers = 4;
game.countries = [
	[game.R, game.Dani],
	[game.C, game.Carl],
	[game.I, game.Beth],
	[game.B, game.Adam],
	[game.U, game.Dani],
	[game.E, game.Carl]
];
function owner( country ) {
	return game.countries[ country.idx ][1]
}
function newown( country ) {
	var i,
		own = owner( country ),
		owninv = owner( country ).investment( country.idx );
	for (i = 0; i < game.numplayers; i++) {
		if (game.players[i].investment( country.idx ) > owninv) {
			own = game.players[i];
			owninv = game.players[i].investment( country.idx );
		}
	}
	game.countries[ country.idx ] [ 1 ] = own;
}

function investor( country ) {
	var i;
	for (i = 0; i < game.numplayers; i++) {
		var p = game.players[i];
		p.payin( country.payout( p.interest( country.idx ) ) );
	}
}

function tax( player, country, at, units ) {
	country.payin( at - units );
	player.payin( country.payout( bonus[ at ] ) );
	country.powerup( power[ at ] );
}
game.turn = 0;

game.Adam.buy( game.R, 2 );
game.Beth.buy( game.R, 3 );
game.Carl.buy( game.R, 1 );
newown( game.R );
game.Dani.buy( game.C, 3 );
game.Adam.buy( game.C, 2 );
game.Beth.buy( game.C, 1 );
newown( game.C );
game.Carl.buy( game.I, 3 );
game.Dani.buy( game.I, 2 );
game.Adam.buy( game.I, 1 );
newown( game.I );
game.Beth.buy( game.B, 1 );
game.Carl.buy( game.B, 3 );
newown( game.B );
game.Dani.buy( game.U, 1 );
newown( game.U );
game.Adam.buy( game.E, 2 );
newown( game.E );

function prcountries() {
	var i, j, out = '';
	for (i = 0; i < 6; i++) {
		out += game.countries[i][0].pr();
		for (j = 0; j < 4; j++) {
			out += game.players[j].pr( i, game.countries[i][1] );
		}
		out += '\n';
	}
	return out;
}

function prnames() {
	var i, out = '                  ';
    for (i = 0; i < 4; i++ ) {
        out += padstr( game.players[i].name );
	}
    return out + '\n'
}

function prcash() {
	var i, out = '                  ';
    for (i = 0; i < 4; i++ ) {
        out += padstr( '$' + game.players[i].cash );
	}
    return out + '\n'
}

function prturn() {
	return game.round + ': ' + game.countries[game.turn][0].name + '/' + game.countries[game.turn][1].name + '\n'
}
function prtable() {
	clear();
	show( prturn() + prnames() + prcash() + prcountries() );
}

function countrypayout() {
	var amt = +document.getElementById( 'cpayamt' ).value;
	game.countries[game.turn][0].payout( amt );
	prtable()
}
function doinvestor() {
	investor( game.countries[game.turn][0] );
	game.turn = (game.turn === 5 ? 0 : (game.turn + 1));
	prtable()
}
function dotaxation() {
	game.turn = (game.turn === 5 ? 0 : (game.turn + 1));
	prtable()
}
function doturn() {
	if (game.turn === 5) {
		game.turn = 0;
		game.round++
	} else {
		game.turn++;
	}
	prtable()
}

function playerpayout() {
	var amt = +document.getElementById( 'ppayamt' ).value;
	game.countries[game.turn][1].payout( amt );
	prtable()
}
function dobuy() {
	var bond = +document.getElementById( 'buybond' ).value;
	cturn = game.countries[game.turn];
	cturn[1].buy( cturn[0], bond );
	prtable()
}