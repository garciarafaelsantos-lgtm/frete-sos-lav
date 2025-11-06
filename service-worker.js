/**
 * Service Worker - Calculadora de Frete
 * SOS Lavanderia Igaratá
 * 
 * Este arquivo gerencia o cache e permite que o aplicativo funcione offline.
 * Todos os arquivos necessários são armazenados em cache na primeira visita.
 */

// Nome do cache - altere a versão para forçar atualização
const CACHE_NAME = 'calculadora-frete-v1';

// Lista de arquivos a serem armazenados em cache
const URLS_PARA_CACHE = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json',
    './sos.png'
];

// ============================================
// EVENTO: INSTALL
// ============================================

/**
 * Evento disparado quando o Service Worker é instalado
 * Armazena todos os arquivos necessários em cache
 */
self.addEventListener('install', event => {
    console.log('Service Worker: Instalando...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Armazenando arquivos em cache');
                return cache.addAll(URLS_PARA_CACHE);
            })
            .then(() => {
                // Força a ativação imediata do Service Worker
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Service Worker: Erro ao armazenar em cache', error);
            })
    );
});

// ============================================
// EVENTO: ACTIVATE
// ============================================

/**
 * Evento disparado quando o Service Worker é ativado
 * Remove caches antigos e limpa recursos
 */
self.addEventListener('activate', event => {
    console.log('Service Worker: Ativando...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        // Remove caches antigos (diferentes da versão atual)
                        if (cacheName !== CACHE_NAME) {
                            console.log('Service Worker: Removendo cache antigo:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                // Força o controle de todas as páginas abertas
                return self.clients.claim();
            })
    );
});

// ============================================
// EVENTO: FETCH
// ============================================

/**
 * Evento disparado para cada requisição de rede
 * Implementa estratégia "Cache First, Network Fallback"
 * 
 * Prioridade:
 * 1. Tenta usar o arquivo do cache
 * 2. Se não estiver em cache, tenta fazer requisição de rede
 * 3. Se a rede falhar, retorna uma página offline (se aplicável)
 */
self.addEventListener('fetch', event => {
    // Ignora requisições que não são GET
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Se encontrou no cache, retorna o arquivo em cache
                if (response) {
                    console.log('Service Worker: Arquivo encontrado em cache:', event.request.url);
                    return response;
                }

                // Se não encontrou em cache, tenta fazer requisição de rede
                return fetch(event.request)
                    .then(response => {
                        // Valida a resposta da rede
                        if (!response || response.status !== 200 || response.type === 'error') {
                            return response;
                        }

                        // Cria uma cópia da resposta para armazenar em cache
                        const responseClone = response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                // Armazena em cache para futuras requisições
                                cache.put(event.request, responseClone);
                            });

                        return response;
                    })
                    .catch(error => {
                        console.error('Service Worker: Erro na requisição:', error);
                        
                        // Se a requisição falhar e for um documento HTML,
                        // tenta retornar o index.html do cache
                        if (event.request.headers.get('accept').includes('text/html')) {
                            return caches.match('./index.html');
                        }
                    });
            })
    );
});

// ============================================
// EVENTO: MESSAGE
// ============================================

/**
 * Evento para receber mensagens do cliente
 * Permite comunicação entre o app e o Service Worker
 */
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
