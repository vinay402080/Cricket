// ==========================
// TEAM INITIALIZATION
// ==========================

let team1 = {
  name: "Team-A",     // Placeholder name
  runs: 0,
  wickets: 0,
  balls: 0,
  players: []    // Array to hold players
};

let team2 = {
  name: "Team-B",     // Placeholder name
  runs: 0,
  wickets: 0,
  balls: 0,
  players: []
};

// Track which team is currently batting
let currentBattingTeam = team1;

// Used to generate unique player IDs
let playerCounter = {
  team1: 1,
  team2: 1
};

// ==========================
// TEAM NAME SETUP FUNCTION
// ==========================

function createTeams() {
  const team1Name = prompt("Enter Team 1 Name:", team1.name);
  const team2Name = prompt("Enter Team 2 Name:", team2.name);

  if (team1Name) {
    team1.name = team1Name;
    document.getElementById("team1-name").textContent = team1.name;
    document.getElementById("team1-name-display").textContent = team1.name;
  }

  if (team2Name) {
    team2.name = team2Name;
    document.getElementById("team2-name").textContent = team2.name;
    document.getElementById("team2-name-display").textContent = team2.name;
  }
}


// ==========================
// SCORE DISPLAY FUNCTION
// ==========================

function updateScoreDisplay() {
  const overs = `${Math.floor(currentBattingTeam.balls / 6)}.${currentBattingTeam.balls % 6}`;
  const score = `${currentBattingTeam.runs}/${currentBattingTeam.wickets}`;

  if (currentBattingTeam === team1) {
    document.getElementById("team1-score").textContent = score;
    document.getElementById("team1-overs").textContent = `(${overs} overs)`;
  } else {
    document.getElementById("team2-score").textContent = score;
    document.getElementById("team2-overs").textContent = `(${overs} overs)`;
  }
}


// ==========================
// SCORING ACTIONS
// ==========================

function addRuns(run) {
  currentBattingTeam.runs += run;
  currentBattingTeam.balls++;
  updateScoreDisplay();
  addBallToHistory(run);
  saveState();
}

function addWide() {
  currentBattingTeam.runs += 1;
  // No ball counted
  updateScoreDisplay();
  addBallToHistory("WD");
  saveState();
}

function addNoBall() {
  currentBattingTeam.runs += 1;
  // No ball counted
  updateScoreDisplay();
  addBallToHistory("NB");
  saveState();
}

function addWicket() {
  currentBattingTeam.wickets++;
  currentBattingTeam.balls++;
  updateScoreDisplay();
  addBallToHistory("W");
  saveState();
}


// ==========================
// CHANGE INNINGS FUNCTION
// ==========================

function changeInnings() {
  currentBattingTeam = currentBattingTeam === team1 ? team2 : team1;
  alert(`${currentBattingTeam.name} is now batting!`);
}


// ==========================
// PLAYER MANAGEMENT
// ==========================

function addPlayerToTeam(team) {
  const teamObj = team === 'team1' ? team1 : team2;
  const countKey = team === 'team1' ? 'team1' : 'team2';

  const playerName = prompt(`Enter player name for ${teamObj.name}:`);
  if (!playerName) return;

  const playerId = `${team.toUpperCase()}-P${playerCounter[countKey]++}`;

  const player = {
    id: playerId,
    name: playerName,
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
    out: false
  };

  teamObj.players.push(player);
  //alert(`Added ${player.name} (${player.id}) to ${teamObj.name}`);
  renderPlayerList(team);
}


// ==========================
// UI PLAYER LIST RENDERING
// ==========================

function renderPlayerList(teamKey) {
  const teamObj = teamKey === 'team1' ? team1 : team2;
  const listElement = document.getElementById(`${teamKey}-player-list`);
  const teamNameElement = document.getElementById(`${teamKey}-name-display`);

  // Update header with team name
  teamNameElement.textContent = teamObj.name;

  // Clear existing list
  listElement.innerHTML = "";

  // Render each player
  teamObj.players.forEach(player => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.textContent = `${player.name} (${player.id})`;
    listElement.appendChild(li);
  });
}

// history
let scoreHistory = [];

let currentOver = 1;
let legalBallsInOver = 0;

function saveState() {
  scoreHistory.push({
    team: currentBattingTeam === team1 ? 'team1' : 'team2',
    runs: currentBattingTeam.runs,
    wickets: currentBattingTeam.wickets,
    balls: currentBattingTeam.balls
  });
}

function addBallToHistory(run) {
  const historyContainer = document.getElementById("ball-history");

  let overBox = document.getElementById(`over-${currentOver}`);
  if (!overBox) {
    overBox = document.createElement("div");
    overBox.className = "over-box";
    overBox.id = `over-${currentOver}`;

    const label = document.createElement("div");
    label.className = "over-label";
    label.textContent = `Over ${currentOver}`;
    overBox.appendChild(label);

    historyContainer.prepend(overBox);
  }

  const ball = document.createElement("span");
  ball.className = "badge bg-primary";
  ball.textContent = run;
  overBox.appendChild(ball);

  if (run !== 'WD' && run !== 'NB') {
    legalBallsInOver++;
  }

  if (legalBallsInOver === 6) {
    currentOver++;
    legalBallsInOver = 0;
  }
}


function undoLastAction() {
  if (scoreHistory.length === 0) return;

  const lastState = scoreHistory.pop();
  const teamObj = lastState.team === 'team1' ? team1 : team2;

  teamObj.runs = lastState.runs;
  teamObj.wickets = lastState.wickets;
  teamObj.balls = lastState.balls;

  updateScoreDisplay();

  // Remove last ball from current over
  const overBox = document.getElementById(`over-${currentOver}`);
  if (overBox && overBox.lastChild && overBox.childNodes.length > 1) {
    const lastBall = overBox.lastChild;
    const lastBallText = lastBall.textContent;

    overBox.removeChild(lastBall);

    if (lastBallText !== "WD" && lastBallText !== "NB") {
      legalBallsInOver--;
    }

    // If no balls left in the over, remove the entire over
    if (overBox.childNodes.length === 1) { // Only label remains
      overBox.remove();
      if (currentOver > 1) currentOver--;
      legalBallsInOver = 6;
    }
  }
}

