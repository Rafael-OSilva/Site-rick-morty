// URL da API do Rick and Morty
const API_URL = 'https://rickandmortyapi.com/api/character';

// Elementos do DOM
const cardsContainer = document.getElementById('cardsContainer');
const loading = document.getElementById('loading');
const filterButtons = document.querySelectorAll('.filter-btn');

// Estado da aplicação
let allCharacters = [];
let currentFilter = 'all';

// Função para buscar personagens da API
async function fetchCharacters() {
    try {
        showLoading(true);
        
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        allCharacters = data.results;
        
        renderCards(allCharacters);
        
    } catch (error) {
        console.error('Erro ao buscar personagens:', error);
        cardsContainer.innerHTML = `
            <div class="error-message">
                <p>❌ Erro ao carregar os personagens!</p>
                <p>Verifique sua conexão e tente novamente.</p>
            </div>
        `;
    } finally {
        showLoading(false);
    }
}

// Função para renderizar os cards dinamicamente
function renderCards(characters) {
    // Limpa o container
    cardsContainer.innerHTML = '';
    
    if (characters.length === 0) {
        cardsContainer.innerHTML = `
            <div class="no-results">
                <p>😢 Nenhum personagem encontrado com este filtro!</p>
            </div>
        `;
        return;
    }
    
    // Cria cada card usando createElement
    characters.forEach(character => {
        const card = createCard(character);
        cardsContainer.appendChild(card);
    });
}

// Função para criar um card individual
function createCard(character) {
    // Cria o elemento card
    const card = document.createElement('div');
    card.className = 'card';
    
    // Adiciona evento de clique para mostrar mais detalhes no console
    card.addEventListener('click', () => {
        console.log(`Personagem selecionado: ${character.name}`);
        console.log(`- Status: ${character.status}`);
        console.log(`- Espécie: ${character.species}`);
        console.log(`- Localização: ${character.location.name}`);
        console.log(`- Episódios: ${character.episode.length}`);
    });
    
    // Define a classe de status para a bolinha colorida
    let statusClass = 'status-unknown';
    if (character.status === 'Alive') statusClass = 'status-alive';
    if (character.status === 'Dead') statusClass = 'status-dead';
    
    // Cria o HTML do card usando innerHTML (mas o elemento pai já foi criado com createElement)
    card.innerHTML = `
        <img class="card-image" src="${character.image}" alt="${character.name}" loading="lazy">
        <div class="card-content">
            <h3 class="card-name">${character.name}</h3>
            <div class="card-info">
                <div class="card-status">
                    <span class="status-badge ${statusClass}"></span>
                    <span>${character.status} - ${character.species}</span>
                </div>
                <div class="card-location">
                    📍 ${character.location.name}
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// Função para filtrar personagens por status
function filterCharactersByStatus(status) {
    if (status === 'all') {
        return allCharacters;
    }
    
    // Mapeia o status do filtro para o formato da API
    const statusMap = {
        'alive': 'Alive',
        'dead': 'Dead',
        'unknown': 'unknown'
    };
    
    const filterValue = statusMap[status];
    return allCharacters.filter(character => 
        character.status.toLowerCase() === filterValue.toLowerCase()
    );
}

// Função para aplicar o filtro atual
function applyFilter() {
    const filteredCharacters = filterCharactersByStatus(currentFilter);
    renderCards(filteredCharacters);
}

// Função para mostrar/esconder o loading
function showLoading(isLoading) {
    if (isLoading) {
        loading.classList.add('active');
        cardsContainer.style.display = 'none';
    } else {
        loading.classList.remove('active');
        cardsContainer.style.display = 'grid';
    }
}

// Configurar os filtros
function setupFilters() {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Adiciona active no botão clicado
            button.classList.add('active');
            
            // Atualiza o filtro atual
            currentFilter = button.dataset.status;
            
            // Aplica o filtro
            applyFilter();
        });
    });
}

// Inicialização da aplicação
async function init() {
    setupFilters();
    await fetchCharacters();
}

// Inicia a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', init);