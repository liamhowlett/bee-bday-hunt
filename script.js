// Configuration - Edit these values
const CONFIG = {
    what3wordsApiKey: 'Q2JPPSAI', // Get free key at https://what3words.com/select-plan
    clues: [
        {
            title: "Location 1 of 4",
            story: "Our journey begins looking out over our land...",
            clue: "What customers run up at the pub where you work, and what I have too many of open in my browser",
            hint: "Sounds like what you'd catch at the beach, but with a 'T' instead of a 'C'",
            answer: "polices.perky.tabs",
            wordToGuess: "tabs", // The word she needs to guess
            displayPattern: "polices.perky._____", // What to show
            successMessage: "[Message revealed after solving - could reference a memory at this location]",
            mapWords: "polices.perky.tabs",
            lat: 51.508341,  // REPLACE WITH ACTUAL LATITUDE
            lng: -0.125499   // REPLACE WITH ACTUAL LONGITUDE
        },
        {
            title: "Location 2 of 4",
            story: "'Something from the past' - this is the spot, as we crossed the broken bridge into the bluebell wood, where we realised this was the right one. I remember how emotional you got and I knew I had to make it happen (even if I can't walk through any of the doors!).",
            clue: "What my DIY projects always do to their deadlines",
            hint: "Sounds like when something is 'over' and then it 'runs'. Literally that. I'm not good at this.",
            answer: "unwanted.seemingly.overruns",
            wordToGuess: "overruns",
            displayPattern: "unwanted.seemingly._____",
            successMessage: "[Second success message]",
            mapWords: "unwanted.seemingly.overruns",
            lat: 51.508341,
            lng: -0.125499
        },
        {
            title: "Location 3 of 4",
            story: "'Something from the present' - I love this stunning view, and I absolutely love going on little walks with my best friend in our woods. I love being in your presence and I become just that little bit happier everytime I hear you come back through the door.",
            clue: "What the rest of the world does when I'm with you",
            hint: "Sounds like 'Spanish' but the 'Sp' at the beginning vanished...",
            answer: "vanish.alternate.bunkers",
            wordToGuess: "vanish",
            displayPattern: "_____.alternate.bunkers",
            successMessage: "[Third success message]",
            mapWords: "vanish.alternate.bunkers",
            lat: 51.508341,
            lng: -0.125499
        },
        {
            title: "Location 4 of 4",
            story: "'Our journey' - This gate with no fence on either side symbolises obstacles that...nah it's just a gate in the woods and I wanted to walk us back this way to make the walk more interesting. Keep going...",
            clue: "What we'd be doing to the oven right now if we actually had one",
            hint: "Sounds like \"rubbing\" but someone shoved an \"SC\" in front to make it more hygienic",
            answer: "grading.scrubbing.recorders",
            wordToGuess: "scrubbing",
            displayPattern: "grading._____.recorders",
            successMessage: "[Fourth success message]",
            mapWords: "grading.scrubbing.recorders",
            lat: 51.508341,
            lng: -0.125499
        }
    ],
    finalLocation: {
        words: "donation.decently.forgets",
        message: "Something for the future - Look up at our home, our forever home. It may not be perfect yet, but I will do everything I can to mould this place into the home you've always dreamed of. I love you Bumble Bee.",
        lat: 51.508341,
        lng: -0.125499
    }
};

// State management
let currentClueIndex = 0;
let hintRevealed = false;
let currentCoordinates = null;

// Initialize
function startHunt() {
    showScreen('quest-screen');
    loadClue(0);
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    window.scrollTo(0, 0);
}

function loadClue(index) {
    currentClueIndex = index;
    hintRevealed = false;
    
    const clue = CONFIG.clues[index];
    
    // Update progress bar
    const progress = ((index + 1) / CONFIG.clues.length) * 100;
    document.getElementById('progress-fill').style.width = progress + '%';
    
    // Update content
    document.getElementById('quest-title').textContent = clue.title;
    document.getElementById('quest-story').textContent = clue.story;
    document.getElementById('clue-text').textContent = clue.clue;
    document.getElementById('hint-text').textContent = clue.hint;
    document.getElementById('hint-text').classList.add('hidden');
    
    // Update word pattern display
    document.getElementById('word-pattern').textContent = clue.displayPattern;
    
    // Clear input and feedback
    document.getElementById('answer-input').value = '';
    const feedback = document.getElementById('feedback');
    feedback.classList.remove('show', 'success', 'error');
}

function loadMap(containerId, words, lat, lng) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear existing content
    
    if (!words || words === 'word.word.word' || !lat || !lng) {
        container.innerHTML = '<p class="map-placeholder">🗺️ Map will appear here once location is configured<br><small>Location: ' + words + '</small></p>';
        return;
    }
    
    // Create a clean map with Leaflet
    const mapDiv = document.createElement('div');
    mapDiv.id = containerId + '-leaflet';
    mapDiv.style.width = '100%';
    mapDiv.style.height = '400px';
    mapDiv.style.borderRadius = '15px';
    mapDiv.style.overflow = 'hidden';
    mapDiv.style.position = 'relative';
    container.appendChild(mapDiv);
    
    // Small delay to ensure DOM is ready
    setTimeout(() => {
        // Initialize Leaflet map
        const map = L.map(mapDiv.id).setView([lat, lng], 18);
        
        // Add Satellite imagery (Esri World Imagery)
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '© Esri',
            maxZoom: 19
        }).addTo(map);
        
        // Fix map rendering issue - invalidate size after a brief delay
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
    
        // Add marker with what3words address for the treasure location
        const marker = L.marker([lat, lng], {
            icon: L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })
        }).addTo(map);
        marker.bindPopup(`<b>🎯 ${words}</b>`).openPopup();
        
        // Track user's current location with GPS
        let userMarker = null;
        let userCircle = null;
        
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition((position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                const accuracy = position.coords.accuracy;
                
                // Remove old user marker if exists
                if (userMarker) {
                    map.removeLayer(userMarker);
                }
                if (userCircle) {
                    map.removeLayer(userCircle);
                }
                
                // Add blue circle for accuracy
                userCircle = L.circle([userLat, userLng], {
                    radius: accuracy,
                    color: '#4285F4',
                    fillColor: '#4285F4',
                    fillOpacity: 0.15,
                    weight: 1
                }).addTo(map);
                
                // Add blue dot for user's location
                userMarker = L.circleMarker([userLat, userLng], {
                    radius: 8,
                    fillColor: '#4285F4',
                    color: '#fff',
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 1
                }).addTo(map);
                
                userMarker.bindPopup('📍 You are here');
                
            }, (error) => {
                console.log('Geolocation error:', error);
            }, {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 5000
            });
        }
    }, 50);
    
    // Store words for directions (we'll open what3words directly)
    currentCoordinates = { words: words, lat: lat, lng: lng };
}

function toggleHint() {
    const hintElement = document.getElementById('hint-text');
    hintElement.classList.toggle('hidden');
    hintRevealed = !hintRevealed;
    
    const btn = document.getElementById('hint-btn');
    btn.textContent = hintRevealed ? 'Hide hint 👀' : 'Need a hint? 💡';
}

function getDirections() {
    if (!currentCoordinates || !currentCoordinates.words) {
        alert('Please wait for the map to load first!');
        return;
    }
    
    // Determine which button was clicked
    const questBtn = document.getElementById('gps-btn');
    const finalBtn = document.getElementById('final-gps-btn');
    const btn = questBtn && questBtn.offsetParent !== null ? questBtn : finalBtn;
    
    if (!btn) return;
    
    btn.textContent = '📍 Getting your location...';
    btn.disabled = true;
    
    if (!navigator.geolocation) {
        // If no GPS, just open what3words with the location
        window.open(`https://what3words.com/${currentCoordinates.words}`, '_blank');
        btn.textContent = '📍 Get Directions from My Location';
        btn.disabled = false;
        return;
    }
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            
            // Open what3words navigation page
            // This will show directions from current location to the what3words address
            const w3wUrl = `https://what3words.com/${currentCoordinates.words}?navigation=true`;
            window.open(w3wUrl, '_blank');
            
            btn.textContent = '📍 Get Directions from My Location';
            btn.disabled = false;
        },
        (error) => {
            // If GPS fails, just open the location on what3words
            window.open(`https://what3words.com/${currentCoordinates.words}`, '_blank');
            btn.textContent = '📍 Get Directions from My Location';
            btn.disabled = false;
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

function checkAnswer() {
    const input = document.getElementById('answer-input').value.trim().toLowerCase();
    const correctWord = CONFIG.clues[currentClueIndex].wordToGuess.toLowerCase();
    const feedback = document.getElementById('feedback');
    
    if (!input) {
        showFeedback('Please enter the missing word', 'error');
        return;
    }
    
    // Check if it's a valid single word (no spaces or dots)
    if (input.includes(' ') || input.includes('.')) {
        showFeedback('Just enter the single missing word', 'error');
        return;
    }
    
    if (input === correctWord) {
        showFeedback('Correct! 🎉', 'success');
        setTimeout(() => {
            showSuccessScreen();
        }, 1500);
    } else {
        showFeedback('Not quite right. Try again! 💭', 'error');
        // Optional: Add shake animation
        document.getElementById('answer-input').style.animation = 'shake 0.5s';
        setTimeout(() => {
            document.getElementById('answer-input').style.animation = '';
        }, 500);
    }
}

function skipClue() {
    // Confirm they really want to skip
    const confirmed = confirm("Are you sure you want to skip this clue? You'll still see the location and message!");
    
    if (confirmed) {
        // Clear any error feedback
        const feedback = document.getElementById('feedback');
        feedback.classList.remove('show', 'success', 'error');
        
        // Show the success screen as if they got it right
        showSuccessScreen();
    }
}

function showFeedback(message, type) {
    const feedback = document.getElementById('feedback');
    feedback.textContent = message;
    feedback.className = 'feedback show ' + type;
}

function showSuccessScreen() {
    // Load map for this location
    const clue = CONFIG.clues[currentClueIndex];
    loadMap('map-container', clue.mapWords, clue.lat, clue.lng);
    
    showScreen('success-screen');
    createConfetti();
}

function nextClue() {
    if (currentClueIndex < CONFIG.clues.length - 1) {
        showScreen('quest-screen');
        loadClue(currentClueIndex + 1);
    } else {
        showFinalScreen();
    }
}

function showFinalScreen() {
    document.getElementById('final-words').textContent = CONFIG.finalLocation.words;
    document.getElementById('final-message').textContent = CONFIG.finalLocation.message;
    loadMap('final-map', CONFIG.finalLocation.words, CONFIG.finalLocation.lat, CONFIG.finalLocation.lng);
    showScreen('final-screen');
    createConfetti();
}

function createConfetti() {
    const colors = ['#d4a5a5', '#ff9eb1', '#f5e6e8', '#a8d5a3'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 2 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 5000);
        }, i * 50);
    }
}

// Add shake animation for incorrect answers
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

// Allow Enter key to submit
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('answer-input');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                checkAnswer();
            }
        });
    }
});
