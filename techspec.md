OMG Premium TV è un addon avanzato per Stremio che permette di visualizzare canali TV da playlist M3U/M3U8, arricchiti con dati EPG (Electronic Program Guide). L’addon offre numerose funzionalità sia a livello di interfaccia utente che “sotto il cofano”.

## Funzionalità visibili all’utente (Frontend)
###1. Configurazione di base
- Impostazione URL M3U: Permette di specificare l’URL della playlist M3U/M3U8.
-	Impostazione URL EPG: Consente di specificare l’URL del file EPG (in formato XMLTV).
-	Abilitazione/disabilitazione EPG: Attiva o disattiva la visualizzazione delle informazioni sui programmi.
###2. Catalogo dei canali
-	Visualizzazione catalogo completo: Mostra tutti i canali disponibili nella playlist.
-	Filtri per genere: Permette di filtrare i canali per genere/categoria.
-	Ricerca canali: Consente di cercare canali per nome.
-	Paginazione: Suddivide i risultati in pagine per una migliore navigazione.
###3. Dettagli dei canali
-	Informazioni sul canale: Mostra nome, logo, numero e descrizione del canale.
-	Programma corrente: Visualizza il programma attualmente in onda (se EPG abilitato).
-	Programmi futuri: Elenca i prossimi programmi in arrivo (se EPG abilitato).
-	Categorie: Mostra i generi associati al canale.
###4. Opzioni di streaming
-	Stream originale: Riproduce lo stream come presente nella playlist originale.
-	Stream con proxy: Riproduce lo stream tramite un proxy per migliorare la compatibilità.
-	Stream risolto: Utilizza uno script Python per risolvere dinamicamente gli URL degli stream.
###5. Configurazione avanzata (Pagina web)
-	Gestione proxy: Configurazione degli URL proxy e relativi parametri.
-	Opzione “Force Proxy”: Forza tutti gli stream ad utilizzare il proxy.
-	Suffisso ID: Permette di aggiungere un suffisso agli ID dei canali per evitare conflitti (valido solo in caso di mancanza degli id in playlist).
-	Percorso file remapper: Specifica un file di rimappatura per gli ID EPG.
-	Intervallo di aggiornamento: Imposta quanto spesso la playlist viene aggiornata.
###6. Gestione script Python
-	Download script Python: Scarica script Python da URL remoti.
-	Esecuzione script: Esegue script Python per generare playlist M3U personalizzate.
-	Pianificazione aggiornamenti: Imposta aggiornamenti automatici degli script Python.
-	Stato script: Visualizza informazioni sullo stato degli script Python.
###7. Gestione Resolver Python
-	Download Resolver: Scarica script di risoluzione degli URL da fonti remote.
-	Creazione template Resolver: Crea un template di base per script resolver personalizzati.
-	Verifica Resolver: Controlla che lo script resolver sia funzionante.
-	Gestione cache: Permette di svuotare la cache del resolver.
-	Aggiornamenti pianificati: Imposta la pianificazione degli aggiornamenti del resolver.
###8. Backup e ripristino
-	Backup configurazione: Scarica un file JSON con la configurazione attuale.
-	Ripristino configurazione: Carica una configurazione precedentemente salvata.

##Funzionalità “sotto il cofano” (Backend)
###1. Gestione playlist M3U
-	Parser M3U avanzato: Analizza playlist M3U/M3U8 standard e multiriga.
-	Trasformazione dei dati: Converte i dati M3U in un formato compatibile con Stremio.
-	Normalizzazione ID: Standardizza gli ID dei canali per garantire la compatibilità.
-	Gestione multi-URL: Supporta più URL in un’unica playlist.
-	Estrazione informazioni TVG: Estrae metadati come logo, numero canale, ID e nome dai tag TVG.
-	Rilevamento EPG incorporato: Rileva automaticamente gli URL EPG presenti nella playlist.
###2. Sistema di cache
-	Cache delle playlist: Memorizza i dati delle playlist per migliorare le prestazioni.
-	Aggiornamenti periodici: Aggiorna automaticamente la cache in base all’intervallo configurato.
-	Verifica obsolescenza: Controlla se i dati in cache sono obsoleti prima di utilizzarli.
-	Gestione eventi: Utilizza un sistema di eventi per notificare gli aggiornamenti della cache.
###3. Gestione EPG avanzata
-	Download e parsing XML: Scarica e analizza file XML EPG, anche compressi (gzip).
-	Elaborazione in blocchi: Elabora i file EPG in blocchi per gestire file di grandi dimensioni.
-	Normalizzazione orari: Gestisce i fusi orari e normalizza gli orari dei programmi.
-	Associazione canali: Collega i dati EPG ai canali corrispondenti nella playlist.
-	Estrazione icone: Estrae le icone dei canali dai dati EPG quando disponibili.
-	Aggiornamento programmato: Aggiorna i dati EPG in base a una pianificazione cron.
-	Verifica canali mancanti: Identifica i canali senza dati EPG corrispondenti.
###4. Sistema proxy per gli stream
-	Rilevamento tipo stream: Identifica automaticamente il tipo di stream (HLS, DASH, HTTP).
-	Controllo salute proxy: Verifica che il proxy sia attivo e funzionante.
-	Tentativi multipli: Implementa ripetuti tentativi in caso di errori.
-	Cache stato proxy: Memorizza temporaneamente lo stato di salute dei proxy.
-	Conversione formati: Converte stream DASH in HLS quando necessario.
-	Gestione fallback: Ritorna allo stream originale in caso di problemi con il proxy.
###5. Sistema di risoluzione stream
-	Integrazione Python: Esegue script Python per risolvere dinamicamente gli URL.
-	Comunicazione con file temporanei: Passa i parametri agli script Python usando file JSON.
-	Gestione cache: Memorizza gli URL risolti per migliorare le prestazioni.
-	Timeout e gestione errori: Gestisce i timeout e gli errori nella risoluzione degli URL.
-	Aggiornamenti pianificati: Aggiorna automaticamente gli script resolver.
###6. Script Python integrati
-	Environment Python isolato: Esegue script Python in un ambiente controllato.
-	Gestione ambiente Python cross-platform: Supporta sia Windows che sistemi Unix.
-	Monitoraggio esecuzione: Monitora lo stato di esecuzione degli script.
-	Rilevamento output: Rileva automaticamente i file generati dagli script.
-	Canale speciale di rigenerazione: Aggiunge un canale speciale per rigenerare la playlist.
-	Pianificazione con cron: Utilizza cron per la pianificazione degli aggiornamenti.
###7. Gestione configurazione
-	Caricamento dinamico: Carica la configurazione dinamicamente all’avvio.
-	Override configurazione: Permette l’override della configurazione di base.
-	Codifica configurazione: Codifica la configurazione in base64 per gli URL.
-	Persistenza configurazione: Salva e ripristina la configurazione tra i riavvii utilizzando l’url dell’addon presente in Stremio.
###8. Architettura modulare
-	Separazione delle responsabilità: Ogni modulo ha una responsabilità specifica.
-	Comunicazione a eventi: I moduli comunicano tramite un sistema di eventi.
-	API interne: Fornisce API interne per la comunicazione tra moduli.
-	Estensibilità: Permette l’estensione delle funzionalità senza modificare il core.

##Funzionalità tecniche avanzate
###1. Gestione stream avanzata
-	EXTVLCOPT parser: Interpreta i tag EXTVLCOPT per estrarre header personalizzati.
-	Header HTTP personalizzati: Supporta l’invio di header HTTP personalizzati per gli stream.
-	Gestione User-Agent: Gestisce e normalizza gli header User-Agent.
-	Gestione Referer e Origin: Supporta e normalizza gli header Referer e Origin.
###2. Sistema di rimappatura ID
-	Caricamento regole remote: Carica regole di rimappatura da file remoti.
-	Normalizzazione ID: Normalizza gli ID per garantire la compatibilità tra M3U ed EPG.
-	Fallback locale: Utilizza regole locali in caso di errore nel download di quelle remote.
###3. Integrazione Stremio avanzata
-	Manifest dinamico: Genera il manifest Stremio dinamicamente in base alla configurazione.
-	Arricchimento metadati: Arricchisce i metadati dei canali con informazioni EPG.
-	Personalizzazione catalogo: Personalizza il catalogo Stremio con generi dinamici.
-	Gestione paginazione: Supporta la paginazione per cataloghi di grandi dimensioni.
###4. Supporto multiple configurazioni
-	URL con configurazione codificata: Supporta URL con configurazione codificata in base64.
-	Configurazione via query string: Permette la configurazione tramite parametri nell’URL.
-	Persistenza configurazione: Mantiene la configurazione tra una sessione e l’altra.
###5. Gestione errori robusta
-	Logging dettagliato: Fornisce log dettagliati per il debugging.
-	Gestione graceful degli errori: Gestisce gli errori senza interrompere il servizio.
-	Tentativi con backoff: Implementa strategie di retry con backoff esponenziale.
-	Fallback sicuri: Fornisce sempre una risposta anche in caso di errori.

##Conclusione
OMG Premium TV è un addon ricco di funzionalità che offre un’esperienza completa per la visione di canali TV su Stremio. La sua architettura modulare e le numerose opzioni di configurazione lo rendono estremamente flessibile e potente, adattandosi a diverse esigenze e scenari d’uso.

