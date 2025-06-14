const axios = require('axios');
const { URL } = require('url');
const config = require('./config');

class StreamProxyManager {
    constructor() {
        this.proxyCache = new Map();
        this.lastCheck = new Map();
        this.CACHE_DURATION = 1 * 60 * 1000;
        this.MAX_RETRY_ATTEMPTS = 3;
        this.RETRY_DELAY = 500;
    }

    async validateProxyUrl(url) {
        if (!url) return false;
        try {
            const parsed = new URL(url);
            return parsed.protocol === 'http:' || parsed.protocol === 'https:';
        } catch {
            return false;
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // **CORREZIONE SPECIFICA**: Normalizza URL VAVOO malformati
    normalizeVavooUrl(url) {
        if (!url || typeof url !== 'string') {
            return url;
        }

        // Controlla se è un URL VAVOO con formato malformato
        if (url.includes('vavoo.to') && url.includes('.m3u8&')) {
            console.log(`🔧 Rilevato URL VAVOO malformato: ${url}`);
            
            // Trova la posizione di .m3u8 e sostituisci il primo & con ?
            const m3u8Index = url.indexOf('.m3u8');
            if (m3u8Index !== -1) {
                const beforeM3u8 = url.substring(0, m3u8Index + 5); // Include .m3u8
                const afterM3u8 = url.substring(m3u8Index + 5);
                
                if (afterM3u8.startsWith('&')) {
                    const normalizedUrl = beforeM3u8 + '?' + afterM3u8.substring(1);
                    console.log(`✅ URL normalizzato: ${normalizedUrl}`);
                    return normalizedUrl;
                }
            }
        }

        return url;
    }

    // **FUNZIONE MIGLIORATA**: Rilevamento del tipo di stream con gestione URL malformati
    detectStreamType(url) {
        if (!url || typeof url !== 'string') {
            return 'HLS';
        }
        
        // Prima normalizza l'URL se necessario
        const normalizedUrl = this.normalizeVavooUrl(url);
        
        try {
            const urlObj = new URL(normalizedUrl);
            const pathname = urlObj.pathname.toLowerCase();
            
            console.log(`🔍 Analizzando URL normalizzato: ${normalizedUrl}`);
            console.log(`🔍 Pathname estratto: ${pathname}`);
            
            // Controllo per HLS
            if (pathname.includes('.m3u8')) {
                console.log(`✅ HLS rilevato tramite pathname`);
                return 'HLS';
            }
            
            // Altri tipi di stream
            if (pathname.endsWith('.mpd')) {
                return 'DASH';
            }
            
            if (pathname.endsWith('.mp4')) {
                return 'HTTP';
            }
            
            if (pathname.endsWith('.php') || 
                normalizedUrl.includes('/stream/stream-') || 
                normalizedUrl.includes('daddylive.dad') || 
                normalizedUrl.includes('/extractor/video')) {
                return 'PHP';
            }
            
            return 'HLS';
            
        } catch (error) {
            // Fallback: controlla l'URL originale come stringa
            console.warn(`⚠️ Errore parsing URL, uso fallback: ${error.message}`);
            
            if (url.includes('.m3u8')) {
                console.log(`✅ HLS rilevato tramite fallback`);
                return 'HLS';
            }
            if (url.includes('.mpd')) {
                return 'DASH';
            }
            if (url.includes('.mp4')) {
                return 'HTTP';
            }
            if (url.includes('.php') || 
                url.includes('/stream/stream-') || 
                url.includes('daddylive.dad') || 
                url.includes('/extractor/video')) {
                return 'PHP';
            }
            return 'HLS';
        }
    }

    async checkProxyHealth(proxyUrl, headers = {}) {
        const cacheKey = proxyUrl;
        const now = Date.now();
        const lastCheckTime = this.lastCheck.get(cacheKey);

        if (lastCheckTime && (now - lastCheckTime) < this.CACHE_DURATION) {
            return this.proxyCache.get(cacheKey);
        }

        const finalHeaders = {
            'User-Agent': headers['User-Agent'] || headers['user-agent'] || config.defaultUserAgent
        };

        if (headers['referer'] || headers['Referer'] || headers['referrer'] || headers['Referrer']) {
            finalHeaders['Referer'] = headers['referer'] || headers['Referer'] || 
                                    headers['referrer'] || headers['Referrer'];
        }

        if (headers['origin'] || headers['Origin']) {
            finalHeaders['Origin'] = headers['origin'] || headers['Origin'];
        }

        let attempts = 0;
        let isHealthy = false;
        let lastError = null;

        while (attempts < this.MAX_RETRY_ATTEMPTS && !isHealthy) {
            attempts++;
            
            try {                
                const response = await axios.get(proxyUrl, {
                    timeout: 10000,
                    validateStatus: status => status < 400,
                    headers: finalHeaders
                });
                
                isHealthy = response.status < 400;

            } catch (error) {
                lastError = error;
                
                if (attempts < this.MAX_RETRY_ATTEMPTS) {
                    await this.sleep(this.RETRY_DELAY);
                }
            }
        }

        this.proxyCache.set(cacheKey, isHealthy);
        this.lastCheck.set(cacheKey, now);
        
        if (!isHealthy) {
            console.error('❌ ERRORE PROXY HEALTH CHECK - Tutti i tentativi falliti:');
            
            if (lastError) {
                console.error(`  Ultimo errore: ${lastError.message}`);
                console.error(`  Codice errore: ${lastError.code || 'N/A'}`);
            } else {
                console.error(`  Nessun errore specifico rilevato, controllo fallito senza eccezioni`);
            }
            
            console.error('============================================================');
        } else if (attempts > 1) {
            console.log(`✅ Proxy verificato con successo dopo ${attempts} tentativi`);
        }
        
        return isHealthy;
    }

    async buildProxyUrl(streamUrl, headers = {}, userConfig = {}) {
        if (!userConfig.proxy || !userConfig.proxy_pwd || !streamUrl || typeof streamUrl !== 'string') {
            console.warn('⚠️ buildProxyUrl: Parametri mancanti o non validi');
            return null;
        }

        // **CORREZIONE PRINCIPALE**: Normalizza l'URL prima di elaborarlo
        const normalizedStreamUrl = this.normalizeVavooUrl(streamUrl);
        
        const baseUrl = userConfig.proxy.replace(/\/+$/, '');
        const params = new URLSearchParams({
            api_password: userConfig.proxy_pwd,
            d: normalizedStreamUrl, // Usa l'URL normalizzato
        });

        const userAgent = headers['User-Agent'] || headers['user-agent'] || config.defaultUserAgent || 'Mozilla/5.0';
        params.set('h_user-agent', userAgent);

        let referer = headers['referer'] || headers['Referer'] || headers['referrer'] || headers['Referrer'];
        if (referer) {
            params.set('h_referer', referer);
        }

        let origin = headers['origin'] || headers['Origin'];
        if (origin) {
            params.set('h_origin', origin);
        }

        // Usa la funzione detectStreamType che ora gestisce la normalizzazione
        let streamType = this.detectStreamType(streamUrl);

        let proxyUrl;
        if (streamType === 'HLS') {
            proxyUrl = `${baseUrl}/proxy/hls/manifest.m3u8?${params.toString()}`;
        } else if (streamType === 'DASH') {
            proxyUrl = `${baseUrl}/proxy/mpd/manifest.m3u8?${params.toString()}`;
        } else if (streamType === 'PHP') {
            proxyUrl = `${baseUrl}/extractor/video?host=DLHD&redirect_stream=true&${params.toString()}`;
        } else {
            proxyUrl = `${baseUrl}/proxy/stream?${params.toString()}`;
        }

        console.log(`🔧 Stream rilevato come: ${streamType}`);
        console.log(`🔧 URL originale: ${streamUrl}`);
        console.log(`🔧 URL normalizzato: ${normalizedStreamUrl}`);
        console.log(`🔧 URL proxy generato: ${proxyUrl}`);
        
        return proxyUrl;
    }

    async getProxyStreams(input, userConfig = {}) {
        if (input.url.includes(userConfig.proxy)) {
            return [];
        }
        
        if (!userConfig.proxy || !userConfig.proxy_pwd) {
            console.log('⚠️ Proxy non configurato per:', input.name);
            return [];
        }

        let streams = [];
        
        try {
            const headers = input.headers || {};
            
            if (!headers['User-Agent'] && !headers['user-agent']) {
                headers['User-Agent'] = config.defaultUserAgent;
            }

            let proxyUrl = await this.buildProxyUrl(input.url, headers, userConfig);

            let isHealthy = await this.checkProxyHealth(proxyUrl, headers);
            
            if (!isHealthy) {
                console.log(`⚠️ Proxy non valido, provo versione con slash finale per: ${input.url}`);
                
                const urlWithSlash = input.url.endsWith('/') ? input.url : input.url + '/';
                const proxyUrlWithSlash = await this.buildProxyUrl(urlWithSlash, headers, userConfig);
                const isHealthyWithSlash = await this.checkProxyHealth(proxyUrlWithSlash, headers);
                
                if (isHealthyWithSlash) {
                    console.log(`✅ Versione con slash finale funzionante per: ${input.url}`);
                    proxyUrl = proxyUrlWithSlash;
                    isHealthy = true;
                }
            }
            
            let streamType = this.detectStreamType(input.url);

            if (isHealthy) {
                streams.push({
                    name: input.name,
                    title: `🌐 ${input.originalName}\n[Proxy ${streamType}]`,
                    url: proxyUrl,
                    behaviorHints: {
                        notWebReady: false,
                        bingeGroup: "tv"
                    }
                });
                
                console.log(`✅ Stream proxy aggiunto: ${input.name} (${streamType})`);
            } else {
                console.log(`⚠️ Proxy non valido per: ${input.url}, mantengo stream originale`);
                
                if (userConfig.force_proxy === 'true') {
                    streams.push({
                        name: input.name,
                        title: `${input.originalName}`,
                        url: input.url,
                        headers: input.headers,
                        behaviorHints: {
                            notWebReady: false,
                            bingeGroup: "tv"
                        }
                    });
                }
            }
        
        } catch (error) {
            console.error('❌ Errore durante l\'elaborazione del proxy:', error.message);
            
            if (userConfig.force_proxy === 'true') {
                streams.push({
                    name: input.name,
                    title: `${input.originalName}`,
                    url: input.url,
                    headers: input.headers,
                    behaviorHints: {
                        notWebReady: false,
                        bingeGroup: "tv"
                    }
                });
            }
        }

        return streams;
    }
}

module.exports = () => new StreamProxyManager();
