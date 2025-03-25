// Your code here
document.addEventListener("DOMContentLoaded", () => {
    const characterBar = document.getElementById("character-bar");
    const nameElement = document.getElementById("name");
    const imageElement = document.getElementById("image");
    const voteCount = document.getElementById("vote-count");
    const voteForm = document.getElementById("votes-form");
    const voteInput = document.getElementById("votes");
    const resetButton = document.getElementById("reset-btn");
    const newCharacterForm = document.getElementById("new-character-form");
  
    const API_URL = "http://localhost:3000/characters"; // Change this if needed
  
    // Fetch and display characters in the character bar
    function fetchCharacters() {
      fetch(API_URL)
        .then((res) => res.json())
        .then((characters) => {
          characterBar.innerHTML = "";
          characters.forEach((character) => addCharacterToBar(character));
        });
    }
  
    // Add character name to the character bar
    function addCharacterToBar(character) {
      const span = document.createElement("span");
      span.textContent = character.name;
      span.style.cursor = "pointer";
      span.addEventListener("click", () => showCharacterDetails(character));
      characterBar.appendChild(span);
    }
  
    // Display detailed character info
    function showCharacterDetails(character) {
      nameElement.textContent = character.name;
      imageElement.src = character.image;
      imageElement.alt = character.name;
      voteCount.textContent = character.votes;
      voteForm.dataset.id = character.id;
    }
  
    // Handle voting
    voteForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const characterId = voteForm.dataset.id;
      const votesToAdd = parseInt(voteInput.value, 10) || 0;
      
      if (characterId && votesToAdd > 0) {
        const newTotalVotes = parseInt(voteCount.textContent, 10) + votesToAdd;
        voteCount.textContent = newTotalVotes;
        voteInput.value = "";
  
        // Update votes on the server
        fetch(`${API_URL}/${characterId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ votes: newTotalVotes }),
        });
      }
    });
  
    // Reset votes
    resetButton.addEventListener("click", () => {
      voteCount.textContent = "0";
      const characterId = voteForm.dataset.id;
      
      if (characterId) {
        fetch(`${API_URL}/${characterId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ votes: 0 }),
        });
      }
    });
  
    // Add a new character
    newCharacterForm.addEventListener("submit", (event) => {
      event.preventDefault();
      
      const newName = document.getElementById("new-name").value.trim();
      const newImage = document.getElementById("new-image").value.trim();
  
      if (newName && newImage) {
        const newCharacter = {
          name: newName,
          image: newImage,
          votes: 0,
        };
  
        // Send new character to the server
        fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCharacter),
        })
          .then((res) => res.json())
          .then((character) => {
            addCharacterToBar(character);
            newCharacterForm.reset();
          });
      }
    });
  
    // Load characters on page load
    fetchCharacters();
  });
  