package main

type Game struct {
	player1     *Client
	player2     *Client
	currentTurn int
	join        chan *Client
	leave       chan *Client
}

type GameHub struct {
	games map[*Game]bool
}

func newGameHub() *GameHub {
	h := &GameHub{
		games: make(map[*Game]bool),
	}

	for i := 0; i < 5; i++ {
		game := &Game{
			currentTurn: 1,
			join:        make(chan *Client),
			leave:       make(chan *Client),
		}
		h.games[game] = true
	}

	return h
}
