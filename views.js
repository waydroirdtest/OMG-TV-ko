const fs = require('fs');
const path = require('path');
const { getViewScripts } = require('./views-scripts');

const renderConfigPage = (protocol, host, query, manifest) => {
   // Verifica se il file addon-config.json esiste
   const configPath = path.join(__dirname, 'addon-config.json');
   const m3uDefaultUrl = 'https://github.com/mccoy88f/OMG-Premium-TV/blob/main/tv.png?raw=true';
   const m3uIsDisabled = !fs.existsSync(configPath);

   return `
       <!DOCTYPE html>
       <html>
       <head>
           <meta charset="utf-8">
           <title>${manifest.name}</title>
           <style>
               body {
                   margin: 0;
                   padding: 0;
                   height: 100vh;
                   overflow-y: auto;
                   font-family: Arial, sans-serif;
                   color: #fff;
                   background: purple;
               }
               #background-video {
                   position: fixed;
                   right: 0;
                   bottom: 0;
                   min-width: 100%;
                   min-height: 100%;
                   width: auto;
                   height: auto;
                   z-index: -1000;
                   background: black;
                   object-fit: cover;
                   filter: blur(5px) brightness(0.5);
               }
               .content {
                   position: relative;
                   z-index: 1;
                   max-width: 800px;
                   margin: 0 auto;
                   text-align: center;
                   padding: 50px 20px;
                   background: rgba(0,0,0,0.6);
                   min-height: 100vh;
                   display: flex;
                   flex-direction: column;
                   justify-content: flex-start;
                   overflow-y: visible;
               }

               .logo {
                   width: 150px;
                   margin: 0 auto 20px;
                   display: block;
               }
               .manifest-url {
                   background: rgba(255,255,255,0.1);
                   padding: 10px;
                   border-radius: 4px;
                   word-break: break-all;
                   margin: 20px 0;
                   font-size: 12px;
               }

               .loader-overlay {
                   position: fixed;
                   top: 0;
                   left: 0;
                   width: 100%;
                   height: 100%;
                   background: rgba(0,0,0,0.8);
                   display: none;
                   justify-content: center;
                   align-items: center;
                   z-index: 2000;
                   flex-direction: column;
               }
               
               .loader {
                   border: 6px solid #3d2a56;
                   border-radius: 50%;
                   border-top: 6px solid #8A5AAB;
                   width: 50px;
                   height: 50px;
                   animation: spin 1s linear infinite;
                   margin-bottom: 20px;
               }
               
               .loader-message {
                   color: white;
                   font-size: 18px;
                   text-align: center;
                   max-width: 80%;
               }
               
               @keyframes spin {
                   0% { transform: rotate(0deg); }
                   100% { transform: rotate(360deg); }
               }
               
               .config-form {
                   text-align: left;
                   background: rgba(255,255,255,0.1);
                   padding: 20px;
                   border-radius: 4px;
                   margin-top: 30px;
               }
               .config-form label {
                   display: block;
                   margin: 10px 0 5px;
                   color: #fff;
               }
               .config-form input[type="text"],
               .config-form input[type="url"],
               .config-form input[type="password"],
               .config-form input[type="file"] {
                   width: 100%;
                   padding: 8px;
                   margin-bottom: 10px;
                   border-radius: 4px;
                   border: 1px solid #666;
                   background: #333;
                   color: white;
               }
               .buttons {
                   margin: 30px 0;
                   display: flex;
                   justify-content: center;
                   gap: 20px;
               }
               button {
                   background: #8A5AAB;
                   color: white;
                   border: none;
                   padding: 12px 24px;
                   border-radius: 4px;
                   cursor: pointer;
                   font-size: 16px;
               }
               .bottom-buttons {
                   margin-top: 20px;
                   display: flex;
                   justify-content: center;
                   gap: 20px;
               }
               .toast {
                   position: fixed;
                   top: 20px;
                   right: 20px;
                   background: #4CAF50;
                   color: white;
                   padding: 15px 30px;
                   border-radius: 4px;
                   display: none;
               }
               input[type="submit"] {
                   background: #8A5AAB;
                   color: white;
                   border: none;
                   padding: 12px 24px;
                   border-radius: 4px;
                   cursor: pointer;
                   font-size: 16px;
                   width: 100%;
                   margin-top: 20px;
               }
               .advanced-settings {
                   background: rgba(255,255,255,0.05);
                   border: 1px solid #666;
                   border-radius: 4px;
                   padding: 10px;
                   margin-top: 10px;
               }
               .advanced-settings-header {
                   cursor: pointer;
                   display: flex;
                   justify-content: space-between;
                   align-items: center;
                   color: #fff;
               }
               .advanced-settings-content {
                   display: none;
                   padding-top: 10px;
               }
               .advanced-settings-content.show {
                   display: block;
               }
               #confirmModal {
                   display: none;
                   position: fixed;
                   top: 0;
                   left: 0;
                   width: 100%;
                   height: 100%;
                   background: rgba(0,0,0,0.8);
                   z-index: 1000;
                   justify-content: center;
                   align-items: center;
               }
               #confirmModal > div {
                   background: #333;
                   padding: 30px;
                   border-radius: 10px;
                   text-align: center;
                   color: white;
               }
               #confirmModal button {
                   margin: 0 10px;
               }
               a {
                   color: #8A5AAB;
                   text-decoration: none;
               }
               a:hover {
                   text-decoration: underline;
               }
           </style>
       </head>
       <body>
           <video autoplay loop muted id="background-video">
               <source src="https://static.vecteezy.com/system/resources/previews/001/803/236/mp4/no-signal-bad-tv-free-video.mp4" type="video/mp4">
               Il tuo browser non supporta il tag video.
           </video>

           <div class="content">
               <img class="logo" src="${manifest.logo}" alt="logo">
               <h1>${manifest.name} <span style="font-size: 16px; color: #aaa;">v${manifest.version}</span></h1>

               
               <div class="manifest-url">
                   <strong>URL Manifest:</strong><br>
                   ${protocol}://${host}/manifest.json?${new URLSearchParams(query)}
               </div>

               <div class="buttons">
                   <button onclick="copyManifestUrl()">COPIA URL MANIFEST</button>
                   <button onclick="installAddon()">INSTALLA SU STREMIO</button>
               </div>
               
               <div class="config-form">
                   <h2>Genera Configurazione</h2>
                   <form id="configForm" onsubmit="updateConfig(event)">
                       <label>M3U URL:</label>
                       <input type="text" name="m3u" 
                              value="${m3uIsDisabled ? m3uDefaultUrl : (query.m3u || '')}" 
                              ${m3uIsDisabled ? 'readonly' : ''} 
                              placeholder="https://example.com/playlist1.m3u,https://example.com/playlist2.m3u"
                              required>
                       <small style="color: #999; display: block; margin-top: 5px;">
                           💡 Puoi inserire più URL M3U separandoli con una virgola (,)
                       </small>
                       
                       <label>EPG URL:</label>
                       <input type="text" name="epg" 
                              value="${query.epg || ''}"
                              placeholder="https://example.com/epg1.xml,https://example.com/epg2.xml">
                       <small style="color: #999; display: block; margin-top: 5px;">
                           💡 Puoi inserire più URL EPG separandoli con una virgola (,)
                       </small>
                       
                       <label>
                           <input type="checkbox" name="epg_enabled" ${query.epg_enabled === 'true' ? 'checked' : ''}>
                           Abilita EPG
                       </label>

                       <label>Lingua Canali:</label>
                       <select name="language" style="width: 100%; padding: 8px; margin-bottom: 10px; border-radius: 4px; border: 1px solid #666; background: #333; color: white;">
                           <option value="Italiano" ${(query.language || 'Italiano') === 'Italiano' ? 'selected' : ''}>Italiano</option>
                           <option value="English" ${query.language === 'English' ? 'selected' : ''}>English</option>
                           <option value="Español" ${query.language === 'Español' ? 'selected' : ''}>Español</option>
                           <option value="Français" ${query.language === 'Français' ? 'selected' : ''}>Français</option>
                           <option value="Deutsch" ${query.language === 'Deutsch' ? 'selected' : ''}>Deutsch</option>
                           <option value="Português" ${query.language === 'Português' ? 'selected' : ''}>Português</option>
                           <option value="Nederlands" ${query.language === 'Nederlands' ? 'selected' : ''}>Nederlands</option>
                           <option value="Polski" ${query.language === 'Polski' ? 'selected' : ''}>Polski</option>
                           <option value="Русский" ${query.language === 'Русский' ? 'selected' : ''}>Русский</option>
                           <option value="العربية" ${query.language === 'العربية' ? 'selected' : ''}>العربية</option>
                           <option value="中文" ${query.language === '中文' ? 'selected' : ''}>中文</option>
                           <option value="日本語" ${query.language === '日本語' ? 'selected' : ''}>日本語</option>
                           <option value="한국어" ${query.language === '한국어' ? 'selected' : ''}>한국어</option>
                       </select>

                       <div class="advanced-settings">
                           <div class="advanced-settings-header" onclick="toggleAdvancedSettings()">
                               <strong>Impostazioni Avanzate</strong>
                               <span id="advanced-settings-toggle">▼</span>
                           </div>
                           <div class="advanced-settings-content" id="advanced-settings-content">
                               <label>Proxy URL:</label>
                               <input type="url" name="proxy" value="${query.proxy || ''}">
                               
                               <label>Proxy Password:</label>
                               <input type="password" name="proxy_pwd" value="${query.proxy_pwd || ''}">
                               
                               <label>
                                   <input type="checkbox" name="force_proxy" ${query.force_proxy === 'true' ? 'checked' : ''}>
                                   Forza Proxy
                               </label>

                               <label>ID Suffix:</label>
                               <input type="text" name="id_suffix" value="${query.id_suffix || ''}" placeholder="Esempio: it">

                               <label>Percorso file remapper:</label>
                               <input type="text" name="remapper_path" value="${query.remapper_path || ''}" placeholder="Esempio: https://raw.githubusercontent.com/...">

                               <label>Intervallo Aggiornamento Playlist:</label>
                               <input type="text" name="update_interval" value="${query.update_interval || '12:00'}" placeholder="HH:MM (predefinito 12:00)">
                               <small style="color: #999;">Formato HH:MM (es. 1:00 o 01:00), predefinito 12:00</small>
                               
                               <label>URL Script Resolver Python:</label>
                               <input type="url" name="resolver_script" value="${query.resolver_script || ''}">
                               
                               <label>
                                   <input type="checkbox" name="resolver_enabled" ${query.resolver_enabled === 'true' ? 'checked' : ''}>
                                   Abilita Resolver Python
                               </label>
                               
                           </div>
                       </div>
                       <input type="hidden" name="python_script_url" id="hidden_python_script_url" value="${query.python_script_url || ''}">
                       <input type="hidden" name="python_update_interval" id="hidden_python_update_interval" value="${query.python_update_interval || ''}">
                       <input type="hidden" name="resolver_update_interval" id="hidden_resolver_update_interval" value="${query.resolver_update_interval || ''}">
                       <input type="submit" value="Genera Configurazione">
                   </form>

                   <div class="bottom-buttons">
                       <button onclick="backupConfig()">BACKUP CONFIGURAZIONE</button>
                       <input type="file" id="restoreFile" accept=".json" style="display:none;" onchange="restoreConfig(event)">
                       <button onclick="document.getElementById('restoreFile').click()">RIPRISTINA CONFIGURAZIONE</button>
                   </div>
                   <div style="margin-top: 15px; background: rgba(255,255,255,0.1); padding: 1px; border-radius: 4px;">
                       <ul style="text-align: center; margin-top: 10px;">
                           <p>Ricordati di generare la configurazione prima di eseguire il backup</p>
                       </ul>
                   </div>
               </div>
               
               <div class="config-form" style="margin-top: 30px;">
                   <div class="advanced-settings">
                       <div class="advanced-settings-header" onclick="togglePythonSection()">
                           <strong>Genera Playlist con Script Python</strong>
                           <span id="python-section-toggle">▼</span>
                       </div>
                       <div class="advanced-settings-content" id="python-section-content">
                           <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 4px; margin-bottom: 20px; margin-top: 15px;">
                               <p><strong>Questa funzione permette di:</strong></p>
                               <ul style="text-align: left;">
                                   <li>Scaricare uno script Python da un URL</li>
                                   <li>Eseguirlo dentro il container Docker</li>
                                   <li>Utilizzare il file M3U generato come sorgente</li>
                               </ul>
                               <p><strong>Nota:</strong> L'URL deve puntare a uno script Python che genera un file M3U.</p>
                           </div>
            
                           <div id="pythonForm">
                               <label>URL dello Script Python:</label>
                               <input type="url" id="pythonScriptUrl" placeholder="https://example.com/script.py">
                
                               <div style="display: flex; gap: 10px; margin-top: 15px;">
                                   <button onclick="downloadPythonScript()" style="flex: 1;">SCARICA SCRIPT</button>
                                   <button onclick="executePythonScript()" style="flex: 1;">ESEGUI SCRIPT</button>
                                   <button onclick="checkPythonStatus()" style="flex: 1;">CONTROLLA STATO</button>
                               </div>
                
                               <div style="margin-top: 15px;">
                                   <h4>Aggiornamento Automatico</h4>
                                   <div style="display: flex; gap: 10px; align-items: center;">
                                       <input type="text" id="updateInterval" placeholder="HH:MM (es. 12:00)" style="flex: 2;">
                                       <button onclick="scheduleUpdates()" style="flex: 1;">PIANIFICA</button>
                                       <button onclick="stopScheduledUpdates()" style="flex: 1;">FERMA</button>
                                   </div>
                                   <small style="color: #999; display: block; margin-top: 5px;">
                                       Formato: HH:MM (es. 12:00 per 12 ore, 1:00 per 1 ora, 0:30 per 30 minuti)
                                   </small>
                               </div>
                
                               <div id="pythonStatus" style="margin-top: 15px; background: rgba(0,0,0,0.3); padding: 10px; border-radius: 4px; display: none;">
                                   <h3>Stato Script Python</h3>
                                   <div id="pythonStatusContent"></div>
                               </div>
                
                               <div id="generatedM3uUrl" style="margin-top: 15px; background: rgba(0,255,0,0.1); padding: 10px; border-radius: 4px; display: none;">
                                   <h3>URL Playlist Generata</h3>
                                   <div id="m3uUrlContent"></div>
                                   <button onclick="useGeneratedM3u()" style="width: 100%; margin-top: 10px;">USA QUESTA PLAYLIST</button>
                               </div>
                           </div>
                       </div>
                   </div>
               </div>

               <!-- Nuova sezione per il Resolver Python -->
               <div class="config-form" style="margin-top: 30px;">
                   <div class="advanced-settings">
                       <div class="advanced-settings-header" onclick="toggleResolverSection()">
                           <strong>Resolver Python per Stream</strong>
                           <span id="resolver-section-toggle">▼</span>
                       </div>
                       <div class="advanced-settings-content" id="resolver-section-content">
                           <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 4px; margin-bottom: 20px; margin-top: 15px;">
                               <p><strong>Cos'è il Resolver Python?</strong></p>
                               <p>Il Resolver Python ti permette di:</p>
                               <ul style="text-align: left;">
                                   <li>Risolvere dinamicamente gli URL di streaming</li>
                                   <li>Aggiungere token di autenticazione agli stream</li>
                                   <li>Gestire API protette per i provider di contenuti</li>
                                   <li>Personalizzare le richieste con header specifici</li>
                               </ul>
                               <p><strong>Nota:</strong> È necessario uno script Python che implementi la funzione <code>resolve_link</code>.</p>
                           </div>
                       
                           <div id="resolverForm">
                       
                               <div style="display: flex; gap: 10px; margin-top: 15px;">
                                   <button onclick="downloadResolverScript()" style="flex: 1;">SCARICA SCRIPT</button>
                                   <button onclick="createResolverTemplate()" style="flex: 1;">CREA TEMPLATE</button>
                                   <button onclick="checkResolverHealth()" style="flex: 1;">VERIFICA SCRIPT</button>
                               </div>
                       
                               <div style="margin-top: 15px;">
                                   <h4>Gestione Cache e Aggiornamenti</h4>
                                   <div style="display: flex; gap: 10px; align-items: center;">
                                       <input type="text" id="resolverUpdateInterval" placeholder="HH:MM (es. 12:00)" style="flex: 2;">
                                       <button onclick="scheduleResolverUpdates()" style="flex: 1;">PIANIFICA</button>
                                       <button onclick="stopResolverUpdates()" style="flex: 1;">FERMA</button>
                                       <button onclick="clearResolverCache()" style="flex: 1;">PULISCI CACHE</button>
                                   </div>
                                   <small style="color: #999; display: block; margin-top: 5px;">
                                       Formato: HH:MM (es. 12:00 per 12 ore, 1:00 per 1 ora, 0:30 per 30 minuti)
                                   </small>
                               </div>
                       
                               <div id="resolverStatus" style="margin-top: 15px; background: rgba(0,0,0,0.3); padding: 10px; border-radius: 4px; display: none;">
                                   <h3>Stato Resolver Python</h3>
                                   <div id="resolverStatusContent"></div>
                               </div>
                           </div>
                       </div>
                   </div>
               </div>

               <div style="margin-top: 30px; text-align: center; font-size: 14px; color: #ccc;">
                   <p>Addon creato con passione da McCoy88f - <a href="https://github.com/mccoy88f/OMG-Premium-TV" target="_blank">GitHub Repository</a></p>
                   
                   <h3 style="margin-top: 20px;">Sostieni questo progetto!</h3>
                   
                   <div style="margin-top: 15px;">
                       <a href="https://www.buymeacoffee.com/mccoy88f" target="_blank">
                           <img src="https://img.buymeacoffee.com/button-api/?text=Offrimi una birra&emoji=🍺&slug=mccoy88f&button_colour=FFDD00&font_colour=000000&font_family=Bree&outline_colour=000000&coffee_colour=ffffff" alt="Buy Me a Coffee" style="max-width: 300px; margin: 0 auto;"/>
                       </a>
                   </div>
                   
                   <p style="margin-top: 15px;">
                       <a href="https://paypal.me/mccoy88f?country.x=IT&locale.x=it_IT" target="_blank">Puoi anche offrirmi una birra con PayPal 🍻</a>
                   </p>
                   
                   <div style="margin-top: 30px; background: rgba(255,255,255,0.1); padding: 15px; border-radius: 4px;">
                       <strong>ATTENZIONE!</strong>
                       <ul style="text-align: center; margin-top: 10px;">
                           <p>Non sono responsabile per l'uso illecito dell'addon.</p>
                           <p>Verifica e rispetta la normativa vigente nel tuo paese!</p>
                       </ul>
                   </div>
               </div>
               
               <div id="confirmModal">
                   <div>
                       <h2>Conferma Installazione</h2>
                       <p>Hai già generato la configurazione?</p>
                       <div style="margin-top: 20px;">
                           <button onclick="cancelInstallation()" style="background: #666;">Indietro</button>
                           <button onclick="proceedInstallation()" style="background: #8A5AAB;">Procedi</button>
                       </div>
                   </div>
               </div>
               
               <div id="toast" class="toast">URL Copiato!</div>
               
               <script>
                   ${getViewScripts(protocol, host)}
               </script>
           </div>
           <div id="loaderOverlay" class="loader-overlay">
               <div class="loader"></div>
               <div id="loaderMessage" class="loader-message">Operazione in corso...</div>
           </div>
       </body>
       </html>
   `;
};

module.exports = {
    renderConfigPage
};
