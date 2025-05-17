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

//==========================================================================================
let players = JSON.parse(localStorage.getItem("players")) || [];
let teams = JSON.parse(localStorage.getItem("teams")) || { teamA: [], teamB: [] };

function saveData() {
  localStorage.setItem("players", JSON.stringify(players));
  localStorage.setItem("teams", JSON.stringify(teams));
}

function addPlayer() {
  const input = document.getElementById("playerInput");
  const name = input.value.trim();
  if (name && !players.includes(name)) {
    players.push(name);
    saveData();
    input.value = "";
    render();
  } else {
    alert("Player already exists or name is empty.");
  }
}

function resetAll() {
  if (confirm("Are you sure you want to reset all players and teams?")) {
    players = [];
    teams = { teamA: [], teamB: [] };
    saveData();
    render();
  }
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev, target) {
  ev.preventDefault();
  const id = ev.dataTransfer.getData("text");
  const name = document.getElementById(id).textContent;

  // Remove from all
  players = players.filter(p => p !== name);
  teams.teamA = teams.teamA.filter(p => p !== name);
  teams.teamB = teams.teamB.filter(p => p !== name);

  // Add to target
  if (target === "pool") players.push(name);
  else teams[target].push(name);

  saveData();
  render();
}

function render() {
  const pool = document.getElementById("playerPool");
  const teamA = document.getElementById("teamA");
  const teamB = document.getElementById("teamB");

  pool.innerHTML = "";
  teamA.innerHTML = "";
  teamB.innerHTML = "";

  players.forEach(p => pool.appendChild(createPlayerElement(p)));
  teams.teamA.forEach(p => teamA.appendChild(createPlayerElement(p)));
  teams.teamB.forEach(p => teamB.appendChild(createPlayerElement(p)));
}

function createPlayerElement(name) {
  const div = document.createElement("div");
  div.className = "player";
  div.textContent = name;
  div.id = "player-" + name;
  div.draggable = true;
  div.ondragstart = drag;
  return div;
}

window.onload = render;


