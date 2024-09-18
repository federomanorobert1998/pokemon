// Restituisce un numero casuale tra 1 e 898 (quanti Pokémon ci sono fino alla generazione 8)
function getRandomPokemonId() {
    return Math.floor(Math.random() * 898) + 1;
}

let currentPokemon = {}; // Memorizza le info del Pokémon corrente

// Aggiorna le informazioni del Pokémon visualizzate sulla pagina
function updatePokemonDetails(data) {
    currentPokemon = data; // Salva il Pokémon corrente per usarlo più tardi
    // Imposta il nome del Pokémon, con la prima lettera maiuscola
    document.getElementById('name').innerText = 'Nome: ' + data.name.charAt(0).toUpperCase() + data.name.slice(1);

    // Mostra l'ID del Pokémon
    document.getElementById('id').innerText = 'ID: ' + data.id;

    // Mostra l'immagine del Pokémon
    const imageUrl = data.sprites.front_default;
    document.getElementById('image').innerHTML = '<img src="' + imageUrl + '" alt="' + data.name + '">';

    // Mostra il tipo di Pokémon
    const types = data.types.map(typeInfo => typeInfo.type.name).join(', ');
    document.getElementById('type').innerText = 'Tipo: ' + types.charAt(0).toUpperCase() + types.slice(1);

    // Mostra il peso del Pokémon
    document.getElementById('weight').innerText = 'Peso: ' + data.weight + ' hectograms';

    // Mostra l'altezza del Pokémon
    document.getElementById('height').innerText = 'Altezza: ' + data.height + ' decimetres';

    // Elenca le abilità del Pokémon
    const abilities = data.abilities.map(abilityInfo => abilityInfo.ability.name).join(', ');
    document.getElementById('abilities').innerText = 'Lista abilità: ' + abilities.charAt(0).toUpperCase() + abilities.slice(1);

    // Rendi visibile il pulsante Shiny e ripristina il colore standard
    const shinyButton = document.getElementById('shiny-button');
    shinyButton.style.display = 'block'; // Mostra il pulsante Shiny
    shinyButton.classList.remove('active'); // Torna al colore blu

    const moreInfoButton = document.getElementById('more-info-button');
    moreInfoButton.classList.remove('hidden');
    // Nascondi il titolo "Scopri nuovi Pokémon!" dopo aver caricato il primo Pokémon
    const header = document.getElementById('header');
    header.style.display = 'none';
}

// Prende un Pokémon casuale e aggiorna la pagina con i suoi dettagli
function fetchRandomPokemon() {
    const overlay = document.getElementById('loading-overlay');
    overlay.classList.add('active'); // Mostra l'overlay di caricamento

    const pokemonId = getRandomPokemonId();
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`)
        .then(response => response.json())
        .then(data => {
            updatePokemonDetails(data); // Aggiorna i dettagli del Pokémon sulla pagina
        })
        .catch(error => {
            console.error('Errore nel recupero dati:', error);
        })
        .finally(() => {
            overlay.classList.remove('active'); // Nascondi l'overlay di caricamento
        });
}

// Cambia l'immagine tra la versione normale e quella Shiny del Pokémon
function toggleShiny() {
    const imageElement = document.querySelector('.pkmn-detail img');
    const shinyButton = document.getElementById('shiny-button');
    if (imageElement) {
        const shinyImageUrl = currentPokemon.sprites.front_shiny;
        // Se Shiny è attivo, torna all'immagine normale, altrimenti mostra la Shiny
        if (shinyButton.classList.contains('active')) {
            imageElement.src = currentPokemon.sprites.front_default;
            shinyButton.classList.remove('active');
        } else {
            imageElement.src = shinyImageUrl;
            shinyButton.classList.add('active');
        }
    }
}

// Mostra o nasconde la card con i dettagli del Pokémon
function toggleCard() {
    const card = document.querySelector('.card');
    const header = document.getElementById('header');
    card.classList.toggle('expanded'); // Espandi o comprimi la card
    // Se la card è espansa, nascondi il titolo, altrimenti mostralo
    if (card.classList.contains('expanded')) {
        header.style.display = 'none';
    } else {
        header.style.display = 'block';
    }
}

// Genera una squadra di Pokémon casuali e li mostra nelle box
function generateTeam() {
    const teamBoxElements = document.querySelectorAll('.team-box');
    const overlay = document.getElementById('loading-overlay');
    overlay.classList.add('active'); // Mostra l'overlay di caricamento

    // Prendi un Pokémon casuale per ogni box della squadra
    const promises = Array.from(teamBoxElements).map((box, index) => {
        return fetch(`https://pokeapi.co/api/v2/pokemon/${getRandomPokemonId()}/`)
            .then(response => response.json())
            .then(data => {
                box.querySelector('img').src = data.sprites.front_default; // Mostra l'immagine del Pokémon
                box.querySelector('p').innerText = data.name.charAt(0).toUpperCase() + data.name.slice(1); // Mostra il nome del Pokémon
            })
            .catch(error => {
                console.error('Errore nel recupero dei dati:', error);
            });
    });

    Promise.all(promises).finally(() => {
        overlay.classList.remove('active'); // Nascondi l'overlay di caricamento
    });
}

// Aggiunge un nuovo box alla squadra con un Pokémon casuale
function addBox() {
    const teamBoxContainer = document.getElementById('team-box-container');

    const newBox = document.createElement('div'); // Crea un nuovo box
    newBox.className = 'team-box';
    newBox.innerHTML = '<img src="" alt=""><p></p>';
    teamBoxContainer.appendChild(newBox); // Aggiungi il box alla squadra

    // Prendi un Pokémon casuale per riempire il nuovo box
    const pokemonId = getRandomPokemonId();
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`)
        .then(response => response.json())
        .then(data => {
            newBox.querySelector('img').src = data.sprites.front_default;
            newBox.querySelector('p').innerText = data.name.charAt(0).toUpperCase() + data.name.slice(1);
        })
        .catch(error => {
            console.error('Errore nel recupero dati:', error);
        });
}

// Ricarica la pagina quando premi il pulsante di reset
document.getElementById('reset').addEventListener('click', function() {
    location.reload();
});

// Cerca un Pokémon per nome
function searchPokemon() {
    const pokemonApiUrl = 'https://pokeapi.co/api/v2/pokemon/';
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const searchResult = document.getElementById('search-result');
    searchResult.innerHTML = ''; // Pulisce i risultati precedenti

    // Cerca il Pokémon tramite l'API
    fetch(`${pokemonApiUrl}${searchInput}`)
        .then(response => response.json())
        .then(data => {
            const result = document.createElement('div');
            result.innerHTML = `
                <p>${data.name.charAt(0).toUpperCase() + data.name.slice(1)}</p>
                <img src="${data.sprites.other['official-artwork'].front_default}" alt="${data.name}">
                <p>Tipo: ${data.types.map(typeInfo => typeInfo.type.name).join(', ')}</p>
                <p>Altezza: ${(data.height / 10).toFixed(1)} m</p>
                <p>Peso: ${(data.weight / 10).toFixed(1)} kg</p>
            `;
            searchResult.appendChild(result);
        })
        .catch(error => {
            console.error('Errore nella ricerca del Pokémon:', error);
            searchResult.innerHTML = '<p>Pokémon non trovato.</p>';
        });
}

// Mostra le statistiche del Pokémon in un pop-up
function showStats() {
    const popup = document.getElementById('stats-popup');
    const statsContent = document.getElementById('stats-content');
    
    // Controlla se ci sono statistiche da mostrare
    if (currentPokemon.stats && currentPokemon.stats.length > 0) {
        statsContent.innerHTML = ''; // Pulisci il contenuto precedente
        currentPokemon.stats.forEach(stat => {
            const statName = stat.stat.name.replace(/-/g, ' ');
            const statBase = stat.base_stat;
            const statEffort = stat.effort;
            const statElement = document.createElement('p');
            statElement.innerText = `${statName.charAt(0).toUpperCase() + statName.slice(1)}: Base ${statBase}, Effort ${statEffort}`;
            statsContent.appendChild(statElement);
        });
    } else {
        statsContent.innerHTML = '<p>Nessuna statistica disponibile.</p>';
    }
    
    popup.classList.add('active'); // Mostra il pop-up
}

// Chiudi il pop-up delle statistiche
function closePopup() {
    const popup = document.getElementById('stats-popup');
    popup.classList.remove('active'); // Nascondi il pop-up
}

// Assegna le funzioni ai vari pulsanti della pagina
document.getElementById('fetch-button').addEventListener('click', fetchRandomPokemon);
document.getElementById('more-info-button').addEventListener('click', showStats); 
document.getElementById('close-popup').addEventListener('click', closePopup);
document.getElementById('shiny-button').addEventListener('click', toggleShiny);
document.querySelector('.expand-button').addEventListener('click', toggleCard);
document.getElementById('generate-team-button').addEventListener('click', generateTeam);
document.getElementById('add-box-button').addEventListener('click', addBox);

// Funzione per scorrere alla parte superiore della pagina
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Scorri in modo fluido
    });
}

// Mostra/nascondi il pulsante "Torna su" quando si scorre
window.addEventListener('scroll', function() {
    const scrollButton = document.getElementById('scroll-to-top');
    if (window.scrollY > 100) { // Mostra il pulsante se si scorre più di 300px
        scrollButton.style.display = 'block';
    } else {
        scrollButton.style.display = 'none';
    }
});

// Aggiungi un evento di click al pulsante "Torna su"
document.getElementById('scroll-to-top').addEventListener('click', scrollToTop);
