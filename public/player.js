const groupLabel = document.getElementById('groupLabel');
const trackHidden = document.getElementById('trackHidden');
const teamNameInput = document.getElementById('teamName');
const saveNameBtn = document.getElementById('saveName');
const score1 = document.getElementById('score1');
const score2 = document.getElementById('score2');

let group = localStorage.getItem('group');
let name = localStorage.getItem('teamName') || '';
teamNameInput.value = name;

function updateScores(data) {
    score1.textContent = data.group1;
    score2.textContent = data.group2;
}

function connect() {
    const evt = new EventSource('/events');
    evt.onmessage = e => {
        const msg = JSON.parse(e.data);
        if (msg.type === 'assign') {
            group = msg.group;
            localStorage.setItem('group', group);
            groupLabel.textContent = group === 'group1' ? 'קבוצה 1' : 'קבוצה 2';
        } else if (msg.type === 'reveal') {
            trackHidden.textContent = msg.track;
        } else if (msg.type === 'scores') {
            updateScores(msg);
        }
    };
    evt.onerror = () => console.log('connection error');
}

function saveName() {
    name = teamNameInput.value;
    localStorage.setItem('teamName', name);
    fetch('/name', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ group, name }) });
}

saveNameBtn.onclick = saveName;
connect();
