// ==========================
// TEAM INITIALIZATION
// ==========================

let team1 = {
  name: "Team-A",
  runs: 0,
  wickets: 0,
  balls: 0,
  players: []
};

let team2 = {
  name: "Team-B",
  runs: 0,
  wickets: 0,
  balls: 0,
  players: []
};

let currentBattingTeam = team1;

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
  saveState();
  currentBattingTeam.runs += run;
  currentBattingTeam.balls++;
  updateScoreDisplay();
  addBallToHistory(run);
}

function addWide() {
  saveState();
  currentBattingTeam.runs += 1;
  updateScoreDisplay();
  addBallToHistory("WD");
}

function addNoBall() {
  saveState();
  currentBattingTeam.runs += 1;
  updateScoreDisplay();
  addBallToHistory("NB");
}

function addWicket() {
  saveState();
  currentBattingTeam.wickets++;
  currentBattingTeam.balls++;
  updateScoreDisplay();
  addBallToHistory("W");
}

// ==========================
// CHANGE INNINGS FUNCTION
// ==========================

function changeInnings() {
  currentBattingTeam = currentBattingTeam === team1 ? team2 : team1;
  alert(`${currentBattingTeam.name} is now batting!`);
}

// ==========================
// HISTORY AND UNDO
// ==========================

let scoreHistory = [];
let currentOver = 1;
let legalBallsInOver = 0;

function saveState() {
  scoreHistory.push({
    team: currentBattingTeam === team1 ? 'team1' : 'team2',
    runs: currentBattingTeam.runs,
    wickets: currentBattingTeam.wickets,
    balls: currentBattingTeam.balls,
    over: currentOver,
    legalBalls: legalBallsInOver
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

  document.getElementById("current-over").textContent = `Current Over: ${currentOver}`;
}

function undoLastAction() {
  if (scoreHistory.length === 0) return;

  const lastState = scoreHistory.pop();
  currentBattingTeam = lastState.team === 'team1' ? team1 : team2;

  currentBattingTeam.runs = lastState.runs;
  currentBattingTeam.wickets = lastState.wickets;
  currentBattingTeam.balls = lastState.balls;
  currentOver = lastState.over;
  legalBallsInOver = lastState.legalBalls;

  updateScoreDisplay();

  let overToEdit = document.getElementById(`over-${currentOver}`);
  if (overToEdit && overToEdit.lastChild && overToEdit.childNodes.length > 1) {
    overToEdit.removeChild(overToEdit.lastChild);
    if (overToEdit.childNodes.length === 1) {
      overToEdit.remove();
    }
  }

  document.getElementById("current-over").textContent = `Current Over: ${currentOver}`;
}
