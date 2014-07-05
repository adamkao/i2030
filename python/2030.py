costs = [ 0, 2, 4, 6, 9, 12, 16, 20, 25, 30 ]
bonus = [ 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 5, 5, 5 ]
power = [ 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 3, 4, 5, 6, 7, 8, 9, 9, 10, 10, 10 ]

class Country:
    def __init__( self, name, idx ):
        self.name = name
        self.idx = idx
        self.bonds = [ "9", "8", "7", "6", "5", "4", "3", "2", "1" ]
        self.power = 0
        self.cash = 0

    def pr( self ):
        print self.name, ''.join( self.bonds ),
        print str( self.power ).rjust( 2 ),
        print '$' + str( self.cash ).rjust( 2 ) + ' ',

    def sell( self, bond ):
        self.bonds[ 9 - bond ] = '.'
        self.cash += costs[ bond ]

    def ret( self, bond ):
        self.bonds[ 9 - bond ] = str( bond )

    def factory( self ):
        self.cash -= 5

    def imp( self, units ):
        self.cash -= units
        
    def payin( self, amt ):
        self.cash += amt
        
    def payout( self, amt ):
        self.cash -= amt
        return amt
                  
    def powerup( self, rise ):
        self.power += rise

R = Country( "R", 0 )
C = Country( "C", 1 )
I = Country( "I", 2 )
B = Country( "B", 3 )
U = Country( "U", 4 )
E = Country( "E", 5 )


class Player:
    def __init__( self, name ):
        self.name = name
        self.cash = 19
        self.bonds = [ [ ".", ".", ".", ".", ".", ".", ".", ".", "." ],
                       [ ".", ".", ".", ".", ".", ".", ".", ".", "." ],
                       [ ".", ".", ".", ".", ".", ".", ".", ".", "." ],
                       [ ".", ".", ".", ".", ".", ".", ".", ".", "." ],
                       [ ".", ".", ".", ".", ".", ".", ".", ".", "." ],
                       [ ".", ".", ".", ".", ".", ".", ".", ".", "." ] ]

    def pr( self, i, owner ):
        if self == owner:
            mark = '*'
        else:
            mark = ' '
        print ' ' + ''.join( self.bonds[ i ] ),
        print str( self.interest( i ) ).rjust( 2 ) + '/' + str( self.investment( i ) ).rjust( 2 ) + mark,

    def buy( self, country, bond ):
        country.sell( bond )
        self.bonds[ country.idx ][ 9 - bond ] = str( bond )
        self.cash -= costs[ bond ]

    def upgrade( self, country, fr, to ):
        country.ret( fr )
        self.payin( country.payout( costs[ fr ] ) )
        self.bonds[ country.idx ][ 9 - fr ] = '.'
        self.buy( country, to )

    def interest( self, i ):
        return sum( [ int( bond ) for bond in self.bonds[ i ] if bond != '.' ] )

    def investment( self, i ):
        return sum( [ costs[ int( bond ) ] for bond in self.bonds[ i ] if bond != '.' ] )

    def payin( self, amt ):
        self.cash += amt
        return amt

    def payout( self, amt ):
        self.cash -= amt
        return amt

Adam = Player( "Adam" )
Charles = Player( "Charles" )
Deniz = Player( "Deniz" )
Paul = Player( "Paul" )

players = [ Adam, Charles, Deniz, Paul ]

countries = [ [R, Adam], [C, Adam], [I, Adam], [B, Adam], [U, Adam], [E, Adam] ]

def owner( country ):
    return countries[ country.idx ][1]

def investor( country ):
    for p in players:
        p.payin( country.payout( p.interest( country.idx ) ) )
    if country.cash < 0:
        country.payin( owner( country ).payout( -country.cash ) )

def tax( player, country, at, units ):
    country.payin( at - units )
    player.payin( country.payout( bonus[ at ] ) )
    country.powerup( power[ at ] )

def newown( country ):
    own = owner( country )
    owninv = owner( country ).investment( country.idx )
    for p in players:
        if p.investment( country.idx ) > owninv:
            own = p
            owninv = p.investment( country.idx )
    countries[ country.idx ][ 1 ] = own

def prcountries():
    for i in range( 6 ):
        countries[ i ][ 0 ].pr()
        for j in range( 4 ):
            players[ j ].pr( i, countries[i][1] )
        print
        
def prnames():
    print '                  ',
    for i in range( 4 ):
        print players[i].name.rjust( 17 ),
    print

def prcash():
    print '                  ',
    for i in range( 4 ):
        print ('$' + str( players[i].cash )).rjust( 17 ),
    print

def prtable():
    prnames()
    prcash()
    prcountries()
    print
