const loginBtn = document.getElementById('loginBtn');
const searchBtn = document.getElementById('searchBtn');
const results = document.getElementById('results');
const revealBtn = document.getElementById('revealBtn');
const currentTrack = document.getElementById('currentTrack');
const group1Btn = document.getElementById('group1Btn');
const group2Btn = document.getElementById('group2Btn');
const score1 = document.getElementById('score1');
const score2 = document.getElementById('score2');
const gameSection = document.getElementById('game');

let accessToken = sessionStorage.getItem('spotify_token');
let current = null;
let scores = { group1: 0, group2: 0 };

function updateScores() {
    score1.textContent = scores.group1;
    score2.textContent = scores.group2;
}

function reveal() {
    if (current) {
        currentTrack.textContent = `${current.name} - ${current.artists[0].name}`;
    }
}

function choose(track) {
    current = track;
    currentTrack.textContent = 'Hidden';
    results.innerHTML = '';
}

function search() {
    const q = document.getElementById('search').value;
    fetch(`https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(q)}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    })
    .then(r => r.json())
    .then(data => {
        results.innerHTML = '';
        data.tracks.items.forEach(t => {
            const li = document.createElement('li');
            li.textContent = `${t.name} - ${t.artists[0].name}`;
            li.onclick = () => choose(t);
            results.appendChild(li);
        });
    });
}

function login() {
    const clientId = 'YOUR_SPOTIFY_CLIENT_ID';
    const redirectUri = location.origin + '/admin.html';
    const scopes = 'user-read-private';
    const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;
    location.href = authUrl;
}

function checkToken() {
    const hash = location.hash.substring(1);
    const params = new URLSearchParams(hash);
    if (params.get('access_token')) {
        accessToken = params.get('access_token');
        sessionStorage.setItem('spotify_token', accessToken);
        history.replaceState(null, '', location.pathname);
    }
    if (accessToken) {
        document.getElementById('login').classList.add('hidden');
        gameSection.classList.remove('hidden');
    }
}

loginBtn.onclick = login;
searchBtn.onclick = search;
revealBtn.onclick = reveal;
group1Btn.onclick = () => { scores.group1++; updateScores(); };
group2Btn.onclick = () => { scores.group2++; updateScores(); };

checkToken();
