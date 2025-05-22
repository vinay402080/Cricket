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

  if (!striker) return;

  const stats = playerStats[striker];
  stats.runs += run;
  stats.balls += 1;
  if (run === 4) stats.fours += 1;
  if (run === 6) stats.sixes += 1;

  updatePlayerRow(striker);

  // Rotate strike on odd runs
  if (run % 2 === 1) [striker, nonStriker] = [nonStriker, striker];
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

  if (!striker) return;

  playerStats[striker].balls += 1;
  updatePlayerRow(striker);

  if (battingOrder.length > 0) {
    const next = prompt(`Wicket! Select next batsman:\n${battingOrder.join(", ")}`);
    if (battingOrder.includes(next)) {
      battingOrder = battingOrder.filter(p => p !== next);
      striker = next;
      addPlayerRow(next);
    } else {
      alert("Invalid player selected.");
    }
  } else {
    alert("All players are out!");
  }
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

  // Save striker and run for undo
  if (!scoreHistory[scoreHistory.length - 1].ballHistory) {
    scoreHistory[scoreHistory.length - 1].ballHistory = [];
  }
  scoreHistory[scoreHistory.length - 1].ballHistory.push({
    striker,
    run
  });

  if (run !== 'WD' && run !== 'NB') {
    legalBallsInOver++;
  }

  if (legalBallsInOver === 6) {
    currentOver++;
    legalBallsInOver = 0;

    // Optional: rotate strike at end of over
    [striker, nonStriker] = [nonStriker, striker];
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
  playerStats = JSON.parse(JSON.stringify(lastState.playerStats));
  striker = lastState.striker;
  nonStriker = lastState.nonStriker;

  updateScoreDisplay();

  // Remove last ball from history UI
  let overToEdit = document.getElementById(`over-${currentOver}`);
  if (overToEdit && overToEdit.lastChild && overToEdit.childNodes.length > 1) {
    overToEdit.removeChild(overToEdit.lastChild);
    if (overToEdit.childNodes.length === 1) {
      overToEdit.remove();
    }
  }

  document.getElementById("current-over").textContent = `Current Over: ${currentOver}`;

  // Update all player rows
  for (const player in playerStats) {
    updatePlayerRow(player);
  }
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

//=======adding palyers to table performance ==============================================================
let battingTeamPlayers = [];
let selectedPlayers = [];

function addplayertotable() {
  // Determine current team
  const teamKey = currentBattingTeam === team1 ? 'teamA' : 'teamB';
  battingTeamPlayers = [...teams[teamKey]];

  // Remove already selected players
  const availablePlayers = battingTeamPlayers.filter(p => !selectedPlayers.includes(p));

  if (selectedPlayers.length < 2) {
    // Select 2 players at the start
    const p1 = prompt(`Select first batsman:\n${availablePlayers.join(", ")}`);
    if (!availablePlayers.includes(p1)) return alert("Invalid player selected.");
    selectedPlayers.push(p1);
    addPlayerRow(p1);

    const remaining = availablePlayers.filter(p => p !== p1);
    const p2 = prompt(`Select second batsman:\n${remaining.join(", ")}`);
    if (!remaining.includes(p2)) return alert("Invalid player selected.");
    selectedPlayers.push(p2);
    addPlayerRow(p2);
  } else {
    // Select 1 player after a wicket
    const next = prompt(`Select next batsman:\n${availablePlayers.join(", ")}`);
    if (!availablePlayers.includes(next)) return alert("Invalid player selected.");
    selectedPlayers.push(next);
    addPlayerRow(next);
  }
}

function addPlayerRow(playerName) {
  const tbody = document.getElementById("player-performance-body");
  const row = document.createElement("tr");
  row.id = `row-${playerName}`;

  row.innerHTML = `
    <td>${playerName}</td>
    <td class="runs">0</td>
    <td class="balls">0</td>
    <td class="fours">0</td>
    <td class="sixes">0</td>
    <td class="strike-rate">0.00</td>
  `;

  tbody.appendChild(row);

  playerStats[playerName] = {
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0
  };

  // Assign striker/non-striker
  if (!striker) striker = playerName;
  else if (!nonStriker) nonStriker = playerName;
}


//================dynamically adding player performance=============================================================

let playerStats = {}; // { playerName: { runs: 0, balls: 0, fours: 0, sixes: 0 } }
let striker = null;   // current striker
let nonStriker = null; // current non-striker

function updatePlayerRow(playerName) {
  const row = document.getElementById(`row-${playerName}`);
  const stats = playerStats[playerName];
  const strikeRate = stats.balls > 0 ? ((stats.runs / stats.balls) * 100).toFixed(2) : "0.00";

  row.querySelector(".runs").textContent = stats.runs;
  row.querySelector(".balls").textContent = stats.balls;
  row.querySelector(".fours").textContent = stats.fours;
  row.querySelector(".sixes").textContent = stats.sixes;
  row.querySelector(".strike-rate").textContent = strikeRate;
}


