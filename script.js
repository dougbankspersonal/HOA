class EvilHOAGame {
    constructor() {
        this.sanity = 100;
        this.money = 5000;
        this.violations = 0;
        this.currentScenarioIndex = 0;
        this.selectedCard = null;
        this.gameStarted = false;
        this.gameOver = false;

        this.scenarios = [
            {
                title: "The Grass Length Incident",
                description: "Mrs. Henderson, the HOA president, has measured your grass with a ruler. It's 3.1 inches tall. The HOA rule states grass must be between 2.5 and 3.0 inches. You're facing a $500 fine.",
                type: "violation"
            },
            {
                title: "Mailbox Color Crisis",
                description: "Your mailbox is painted 'Ocean Blue' but the HOA-approved color is 'Navy Blue'. They claim it's a clear violation despite the colors being nearly identical. Fine: $750.",
                type: "violation"
            },
            {
                title: "The Parking Enforcement",
                description: "You parked your car 2 inches over the property line. The HOA has hired a professional surveyor to prove this violation. Legal fees will be added to your assessment.",
                type: "violation"
            },
            {
                title: "Holiday Decoration Drama",
                description: "Your Halloween decorations were deemed 'too scary' by the HOA. They're demanding immediate removal despite it being October 30th. Refusal may result in forced removal at your expense.",
                type: "violation"
            },
            {
                title: "The Secret Meeting",
                description: "You discovered the HOA board held a secret meeting to pass new rules without homeowner input. They've retroactively banned your type of fence, which you installed last month with approval.",
                type: "corruption"
            },
            {
                title: "Architectural Review Nightmare",
                description: "Your request to paint your front door has been under review for 6 months. The board keeps requesting more documentation and fees. The latest request is for a $300 'color impact study'.",
                type: "bureaucracy"
            },
            {
                title: "The Noise Complaint",
                description: "Mrs. Chen filed a noise complaint because your dog barked twice at 2 PM on a Tuesday. The HOA is threatening to ban all pets in the community unless you pay a $1000 'pet disturbance fee'.",
                type: "violation"
            },
            {
                title: "Assessment Surprise",
                description: "The HOA has imposed a special assessment of $2000 per household to build a gold-plated fountain that nobody wanted. Payment is due in 30 days or legal action will be taken.",
                type: "financial"
            }
        ];

        this.responseCards = [
            {
                title: "Lawyer Up",
                description: "Hire a lawyer to fight the HOA legally.",
                effect: "Cost: $1500, -10 Violations",
                cost: 1500,
                violationChange: -10,
                sanityChange: -20
            },
            {
                title: "Comply Grudgingly",
                description: "Just do what they ask to avoid further trouble.",
                effect: "Cost: $200, +5 Sanity loss from frustration",
                cost: 200,
                violationChange: 0,
                sanityChange: -5
            },
            {
                title: "Organize Neighbors",
                description: "Rally other homeowners to resist together.",
                effect: "Cost: $100, +10 Sanity, Risk of retaliation",
                cost: 100,
                violationChange: 5,
                sanityChange: 10
            },
            {
                title: "Ignore Completely",
                description: "Pretend the notice never arrived.",
                effect: "No cost, +5 Violations, -15 Sanity",
                cost: 0,
                violationChange: 5,
                sanityChange: -15
            },
            {
                title: "Move Away",
                description: "Cut your losses and find a new home.",
                effect: "Cost: $3000, End game (escape)",
                cost: 3000,
                violationChange: 0,
                sanityChange: 50,
                special: "escape"
            },
            {
                title: "Passive Aggressive",
                description: "Comply but document everything for future revenge.",
                effect: "Cost: $300, +5 Sanity, Small violation reduction",
                cost: 300,
                violationChange: -2,
                sanityChange: 5
            },
            {
                title: "Public Shame",
                description: "Post about the HOA's behavior on social media.",
                effect: "No cost, +15 Sanity, Risk of HOA retaliation",
                cost: 0,
                violationChange: 3,
                sanityChange: 15
            },
            {
                title: "Bribe Officials",
                description: "Offer a 'donation' to make the problem disappear.",
                effect: "Cost: $800, -5 Violations, Moral compromise",
                cost: 800,
                violationChange: -5,
                sanityChange: -10
            }
        ];

        this.initializeGame();
    }

    initializeGame() {
        document.getElementById('start-game').addEventListener('click', () => this.startGame());
        document.getElementById('next-scenario').addEventListener('click', () => this.nextScenario());
        document.getElementById('restart-game').addEventListener('click', () => this.restartGame());
    }

    startGame() {
        this.gameStarted = true;
        this.gameOver = false;
        document.getElementById('start-game').style.display = 'none';
        this.dealResponseCards();
        this.presentScenario();
        this.addToLog("The HOA nightmare begins! Good luck surviving...", "neutral");
    }

    dealResponseCards() {
        const handContainer = document.getElementById('hand-cards');
        handContainer.innerHTML = '';
        
        // Randomly select 3 response cards
        const shuffledCards = [...this.responseCards].sort(() => Math.random() - 0.5);
        const selectedCards = shuffledCards.slice(0, 3);

        selectedCards.forEach((card, index) => {
            const cardElement = this.createCardElement(card, index);
            handContainer.appendChild(cardElement);
        });
    }

    createCardElement(card, index) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'response-card';
        cardDiv.dataset.cardIndex = index;
        
        cardDiv.innerHTML = `
            <h4>${card.title}</h4>
            <p>${card.description}</p>
            <div class="effect">${card.effect}</div>
        `;

        cardDiv.addEventListener('click', () => this.selectCard(cardDiv, card));
        return cardDiv;
    }

    selectCard(cardElement, card) {
        // Remove previous selection
        document.querySelectorAll('.response-card').forEach(c => c.classList.remove('selected'));
        
        // Select this card
        cardElement.classList.add('selected');
        this.selectedCard = card;
        
        // Show next scenario button
        document.getElementById('next-scenario').style.display = 'inline-block';
    }

    presentScenario() {
        if (this.currentScenarioIndex >= this.scenarios.length) {
            this.endGame(true); // Won by surviving all scenarios
            return;
        }

        const scenario = this.scenarios[this.currentScenarioIndex];
        document.getElementById('scenario-title').textContent = scenario.title;
        document.getElementById('scenario-description').textContent = scenario.description;
    }

    nextScenario() {
        if (!this.selectedCard) return;

        this.applyCardEffects(this.selectedCard);
        this.currentScenarioIndex++;
        this.selectedCard = null;
        
        document.getElementById('next-scenario').style.display = 'none';
        document.querySelectorAll('.response-card').forEach(c => c.classList.remove('selected'));

        if (this.checkGameOver()) {
            return;
        }

        this.dealResponseCards();
        this.presentScenario();
    }

    applyCardEffects(card) {
        // Apply money changes
        this.money -= card.cost;
        if (this.money < 0) this.money = 0;

        // Apply violation changes
        this.violations += card.violationChange;
        if (this.violations < 0) this.violations = 0;

        // Apply sanity changes
        this.sanity += card.sanityChange;
        if (this.sanity < 0) this.sanity = 0;
        if (this.sanity > 100) this.sanity = 100;

        this.updateStats();

        // Log the action
        const logClass = card.sanityChange > 0 ? "positive" : card.sanityChange < 0 ? "negative" : "neutral";
        this.addToLog(`You chose: ${card.title}. ${card.effect}`, logClass);

        // Handle special effects
        if (card.special === "escape") {
            this.endGame(true, "You escaped the HOA tyranny! You found a new home in a neighborhood with reasonable rules.");
        }
    }

    updateStats() {
        document.getElementById('sanity').textContent = this.sanity;
        document.getElementById('money').textContent = `$${this.money}`;
        document.getElementById('violations').textContent = this.violations;
    }

    checkGameOver() {
        if (this.sanity <= 0) {
            this.endGame(false, "You've lost all sanity dealing with the evil HOA. You've been institutionalized.");
            return true;
        }
        
        if (this.money <= 0) {
            this.endGame(false, "You've gone bankrupt paying HOA fines and fees. You've lost your home.");
            return true;
        }
        
        if (this.violations >= 20) {
            this.endGame(false, "Too many violations! The HOA has foreclosed on your home.");
            return true;
        }

        return false;
    }

    endGame(won, customMessage = null) {
        this.gameOver = true;
        const gameArea = document.querySelector('.game-area');
        
        let message;
        let className = won ? 'game-won' : 'game-over';
        
        if (customMessage) {
            message = customMessage;
        } else if (won) {
            message = `Congratulations! You survived the Evil HOA! Final Stats - Sanity: ${this.sanity}, Money: $${this.money}, Violations: ${this.violations}`;
        } else {
            message = `Game Over! The Evil HOA has defeated you. Better luck next time!`;
        }

        const gameOverDiv = document.createElement('div');
        gameOverDiv.className = className;
        gameOverDiv.innerHTML = `
            <h2>${won ? '🎉 Victory! 🎉' : '💀 Defeat! 💀'}</h2>
            <p>${message}</p>
        `;

        gameArea.innerHTML = '';
        gameArea.appendChild(gameOverDiv);

        document.getElementById('restart-game').style.display = 'inline-block';
        this.addToLog(message, won ? "positive" : "negative");
    }

    addToLog(message, type = "neutral") {
        const logContent = document.getElementById('log-content');
        const logEntry = document.createElement('p');
        logEntry.textContent = message;
        logEntry.className = `log-${type}`;
        logContent.appendChild(logEntry);
        logContent.scrollTop = logContent.scrollHeight;
    }

    restartGame() {
        this.sanity = 100;
        this.money = 5000;
        this.violations = 0;
        this.currentScenarioIndex = 0;
        this.selectedCard = null;
        this.gameStarted = false;
        this.gameOver = false;

        this.updateStats();
        
        // Reset UI
        document.getElementById('log-content').innerHTML = '<p>Click "Start Game" to begin your HOA nightmare...</p>';
        document.getElementById('start-game').style.display = 'inline-block';
        document.getElementById('next-scenario').style.display = 'none';
        document.getElementById('restart-game').style.display = 'none';
        
        // Reset game area
        const gameArea = document.querySelector('.game-area');
        gameArea.innerHTML = `
            <div class="current-scenario">
                <div class="scenario-card" id="scenario-card">
                    <h3 id="scenario-title">Welcome to Suburbia!</h3>
                    <p id="scenario-description">You've just moved into a lovely neighborhood governed by the most evil HOA in existence. Prepare yourself for bureaucratic nightmares!</p>
                </div>
            </div>

            <div class="player-hand">
                <h3>Your Response Cards</h3>
                <div class="hand-cards" id="hand-cards">
                    <!-- Cards will be dynamically added here -->
                </div>
            </div>

            <div class="game-controls">
                <button id="start-game" class="btn btn-primary">Start Game</button>
                <button id="next-scenario" class="btn btn-secondary" style="display: none;">Next Scenario</button>
                <button id="restart-game" class="btn btn-danger" style="display: none;">Restart Game</button>
            </div>
        `;

        // Re-attach event listeners
        this.initializeGame();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new EvilHOAGame();
});