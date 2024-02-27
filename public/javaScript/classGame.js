class Memory {
    constructor() {
        this.cards = [
            { "name": "square", "icon": "<i class='fa-regular fa-square'></i>" },
            { "name": "sun", "icon": "<i class='fa-regular fa-sun'></i>" },
            { "name": "expand", "icon": "<i class='fa-solid fa-expand'></i>" },
            { "name": "hand", "icon": "<i class='fa-regular fa-hand'></i>" },
            { "name": "heart", "icon": "<i class='fa-regular fa-heart'></i>" },
            { "name": "star", "icon": "<i class='fa-regular fa-star'></i>" },
            { "name": "circle-check", "icon": "<i class='fa-regular fa-circle-check'></i>" },
            { "name": "heart", "icon": "<i class='fa-regular fa-heart'></i>" },
            { "name": "star", "icon": "<i class='fa-regular fa-star'></i>" },
            { "name": "circle-check", "icon": "<i class='fa-regular fa-circle-check'></i>" },
            { "name": "square", "icon": "<i class='fa-regular fa-square'></i>" },
            { "name": "compress", "icon": "<i class='fa-solid fa-compress'></i>" },
            { "name": "sun", "icon": "<i class='fa-regular fa-sun'></i>" },
            { "name": "expand", "icon": "<i class='fa-solid fa-expand'></i>" },
            { "name": "hand", "icon": "<i class='fa-regular fa-hand'></i>" },
            { "name": "compress", "icon": "<i class='fa-solid fa-compress'></i>" },
        ];
        this.gridContainer = this.$(".grid-container");
        this.cardChosen = [];
        this.carChosenId = [];
        this.players = [
            new Player("Player 1", 0),
            new Player("Player 2", 0)
        ];
        this.player = this.players[0];
    }

    $ = (selector) => document.querySelector(selector);

    $$ = (selector) => document.querySelectorAll(selector);

    shuffleCards() {
        this.cards.sort(() => 0.5 - Math.random());
    }

    createBoard() {
        this.gridContainer.innerHTML = null;

        this.cards.forEach((card, index) => {
            const newDiv = document.createElement("div");
            newDiv.classList.add("grid-item");

            newDiv.setAttribute("data-id", index);
            newDiv.setAttribute("data-name", card.name);

            newDiv.innerHTML = card.icon;
            this.gridContainer.appendChild(newDiv);

            this.$(`[data-id='${index}'] > i`).classList.add("hide");
        });
    }

    togglePlayer() {
        this.player = this.player === this.players[0] ? this.players[1] : this.players[0];
    }

    game = (event) => {
        const clickedCard = event.target.closest(".grid-item");

        if (!clickedCard) return;

        if (clickedCard.classList.contains("hide")) return;

        this.$('.player-turn').textContent = this.player.name + " turn";

        const cardId = parseInt(clickedCard.getAttribute("data-id"));

        this.reverseCard($(`[data-id='${cardId}'] > i`));

        this.cardChosen.push(this.cards[cardId].name);
        this.carChosenId.push(cardId);

        if (this.cardChosen.length === 2) {
            this.gridContainer.removeEventListener("click", this.game);

            setTimeout(() => {
                if (!this.checkForMatch()) {
                    this.reverseCard($(`[data-id='${this.carChosenId[0]}'] > i`));
                    this.reverseCard($(`[data-id='${this.carChosenId[1]}'] > i`));
                    this.togglePlayer();
                } else {
                    this.player.score += 1;
                    if (this.player === this.players[0]) {
                        this.$$('.score')[0].textContent = this.player.score;
                    } else {
                        this.$$('.score')[1].textContent = this.player.score;
                    }
                }

                this.cardChosen = [];
                this.carChosenId = [];
            }, 500);

            setTimeout(() => {
                if (this.players[0].score + this.players[1].score === this.cards.length / 2) {
                    if (this.players[0].score > this.players[1].score) {
                        this.$('.player-turn').textContent = `${this.players[0].name} wins!`;
                    } else if (this.players[0].score < this.players[1].score) {
                        this.$('.player-turn').textContent = `${this.players[1].name} wins!`;
                    } else {
                        this.$('.player-turn').textContent = "It's a draw!";
                    }
                    this.gridContainer.removeEventListener("click", this.game);
                } else {
                    this.$('.player-turn').textContent = this.player.name + " turn";
                }

                this.gridContainer.addEventListener("click", this.game);
            }, 501);
        }
    }

    checkForMatch = () => {
        if (this.cardChosen[0] === this.cardChosen[1]) {
            this.$(`[data-id='${this.carChosenId[0]}']`).classList.add("hide");
            this.$(`[data-id='${this.carChosenId[1]}']`).classList.add("hide");
            return true;
        }
        return false;
    }

    reverseCard = (card) => {
        card.classList.toggle("hide");
    }

    resetScore = () => {
        this.players.forEach((player, index) => {
            player.score = 0;
            this.$$('.score')[index].textContent = 0;
        });
        this.$('.player-turn').textContent = this.players[0].name + " turn";
        this.player = this.players[0];
    }

    startGame() {
        this.shuffleCards();
        this.resetScore();
        this.createBoard();
        this.gridContainer.addEventListener("click", this.game);
    }
}

class Player {
    constructor(name, score) {
        this.name = name;
        this.score = score;
    }
}

const $ = (selector) => document.querySelector(selector);

const memory = new Memory();
memory.startGame();

$("#restart").addEventListener("click", () => {
    memory.startGame();
});
