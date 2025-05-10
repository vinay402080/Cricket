// Initialize teams
let team1 = {
  name: "CSK",
  runs: 0,
  wickets: 0,
  balls: 0,
  players: []
};

let team2 = {
  name: "RCB",
  runs: 0,
  wickets: 0,
  balls: 0,
  players: []
};

let playerCounter = { team1: 1, team2: 1 }; // to generate unique IDs

// Function to create teams and update the UI
function createTeams() {
  const team1Name = prompt("Enter Team 1 Name:", team1.name);
  const team2Name = prompt("Enter Team 2 Name:", team2.name);

  if (team1Name) {
    team1.name = team1Name;
    document.getElementById("team1-name").textContent = team1.name;
    document.getElementById("team1-name-display").textContent = team1.name; // Update player list header
  }

  if (team2Name) {
    team2.name = team2Name;
    document.getElementById("team2-name").textContent = team2.name;
    document.getElementById("team2-name-display").textContent = team2.name; // Update player list header
  }
  // Ensure we update player lists after team names are changed
  renderPlayerList("team1");
  renderPlayerList("team2");
}

// Function to update score display
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

// Function to add runs to the current batting team
function addRuns(run) {
  currentBattingTeam.runs += run;
  currentBattingTeam.balls++;
  updateScoreDisplay();
}

// Functions for adding wide and no-ball
function addWide() {
  currentBattingTeam.runs += 1;
  updateScoreDisplay();
}

function addNoBall() {
  currentBattingTeam.runs += 1;
  updateScoreDisplay();
}

// Function to add a wicket
function addWicket() {
  currentBattingTeam.wickets++;
  currentBattingTeam.balls++;
  updateScoreDisplay();
}

// Change innings
function changeInnings() {
  currentBattingTeam = currentBattingTeam === team1 ? team2 : team1;
  alert(`${currentBattingTeam.name} is now batting!`);
}

// Function to add players to the teams
function addPlayerToTeam(team) {
  const teamObj = team === 'team1' ? team1 : team2;
  const countKey = team === 'team1' ? 'team1' : 'team2';

  const playerName = prompt(`Enter player name for ${teamObj.name}:`);
  if (!playerName) return;

  const playerId = `${teamObj.name.toUpperCase()}-P${playerCounter[countKey]++}`;

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
  alert(`Added ${player.name} (${player.id}) to ${teamObj.name}`);
  renderPlayerList(team);
}

// Function to render the player list for each team
function renderPlayerList(teamKey) {
  const teamObj = teamKey === 'team1' ? team1 : team2;
  const listElement = document.getElementById(`${teamKey}-player-list`);
  const teamNameElement = document.getElementById(`${teamKey}-name-display`);

  // Update team name in list header
  teamNameElement.textContent = teamObj.name;

  // Clear old list
  listElement.innerHTML = "";

  // Add players
  teamObj.players.forEach(player => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.textContent = `${player.name} (${player.id})`;
    listElement.appendChild(li);
  });
}

// Event listener to load the page with initial values
window.onload = function () {
  // When the page loads, update the UI with the current teams and players
  document.getElementById("team1-name").textContent = team1.name;
  document.getElementById("team2-name").textContent = team2.name;
  
  renderPlayerList("team1");
  renderPlayerList("team2");
};
