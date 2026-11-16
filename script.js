/**
 * ==========================================================================
 * 1. CONFIGURACIÓ DE MEMÒRIA I HISTORIAL GENERAL DEL REGNE
 * ==========================================================================
 */
const dbSel = { 0: null, 1: null, 2: null, 3: null, 4: null };
const baseDadesColorsElectorals = {};
const baseDadesDetallsMunicipis = {};
let idMunicipiEnEdicio = null;

let zoomScale = 1.5; 
let activeTier = 0;
let colorPartitSeleccionat = null; //partit sel·lecionat
let mostrarEtiquetesActiu = false; //etiquetes amagaes

let modeExploracioActiu = false; // Memòria del interruptor de navegació


 

const v = document.getElementById('v'); //view-side meitat esquerre
const canvasMain = document.getElementById('canvas-main'); //mapa
const tId = document.getElementById('t-id'); //text de Tier0?
const tDetall = document.getElementById('t-detall'); // municipi info 

v.scrollLeft = 1050;
v.scrollTop = 950;



function syncZoom() { 
    document.getElementById('election-svg').style.transform = `scale(${zoomScale})`; 
}

const diccionariNomsGovernacions = {
	0: " ",
    1: "Governació de l'Uixò (o de Castelló)",
    2: "Governació de l'Interior",
    3: "Governació del Túria (o de València)",
    4: "Governació del Xúquer (o de Xàtiva)",
    5: "Governació del Vinalopó (o d'Oriola)"
};

const diccionariNomsComarques = {
    1: "la Tinença de Benifassà", 
	2: "els Ports de Morella", 
	3: "Baix Maestrat",
    4: "Mitjà Maestrat", 
	5: "Alt Maestrat", 
	6: "Tinença d'Alcalatén",
    7: "el Pla de l'Arc", 
	8: "la Plana", 
	9: "Baix Espadà", 
	10: "Conca del Millars",
	11: "l'Alt Palància",
	12: "el Racó d'Ademús",
	13: "la Serrania",
	14: "Foia de Bunyol",
	15: "la Canal de Navarrés",
	16: "Vall de Cofrents",
	17: "Camp de Llíria",
	18: "Calderona",
	19: "Pla de Quart",
	20: "Vall de Segó",
	21: "l'Horta Nord",
	22: "Ciutat de València",
	23: "l'Horta Sud",
	24: "Ribera Baixa",
	25: "Ribera Alta",
	26: "Alt Xúquer",
	27: "Vall de Montesa",
	28: "Costera de Ranes",
	29: "Horta de Xàtiva",
	30: "Terres del Vernissa",
	31: "la Vall d'Albaida",
	32: "el Marquesat",
	33: "les Valls de la Baronia de Pego",
	34: "la Marina",
	35: "la Safor",
	36: "la Valldigna",
	37: "les Valls d'Alcoi",
	38: "Foia de Castalla",
	39: "Foia de Xixona",
	40: "Horta d'Alacant",
	41: "Camp d'Elx",
	42: "Alt Vinalopó",
	43: "Conca del Vinalopó",
	44: "Horta d'Oriola"
};

const diccionariNomsSubcomarques = {
	0: " ",
    1: "la Tinença de Benifassà",
    2: "els Ports",
    3001: "Castell de Peníscola",
    3002: "Batllia de Cervera",
    4001: "Comanda d'Alcalà",
    4002: "Setena de les Coves",
    5001: "Setena de Culla",
    5002: "Castell d'Ares",
    6: "Tinença d'Alcalatén",
    7001: "Baronia de la Pobla de Tornesa",
    7002: "Comanda de Vilafamés",
    7003: "Tinença de Miravet",
    8001: "la Plana de Castelló",
    8002: "la Baronia de Nules",
    9: "Baix Espadà",
    10001: "Alto Millars",
    10002: "la Baronia d'Aiòder",
	11001: "Pla de Barraques",
	11002: "Tinença de Xèrica",
	11003: "Tinença de Begís",
	11004: "el Castell d'Almonesir",
	11005: "Alt Espadà",
	11006: "la Vall de Sogorb",
	12: "lo Rincón d'Ademuz",
	13001: "Antinc Reialenc d'Alpont",
	13002: "Vescomtat de Xelva",
	13003: "Subcomarca del Villar",
	13004: "Alt Túria",
	14001: "la Foia de Bunyol",
	14002: "la Vall de Xiva",
	15001: "les Goles del Xúquer",
	15002: "la Canal de Navarrés",
	16: "Serrania d'Aiora",
	17001: "la Vallbona",
	17002: "el Camp de Llíria",
	18001: "la Baronia Alta",
	18002: "la Baronia Mitjana",
	18003: "la Baronia Baixa",
	18004: "Alt Carraixet",
	19: "Pla de Quart",
	20: "Vall de Segó",
	21: "l'Horta Nord",
	22: "Ciutat de València",
	23: "l'Horta Sud",
	24: "Ribera Baixa",
	25001: "Vall dels Alcalans (CN)",
	25002: "Ribera Mitjana",
	25003: "Baronia d'Alberic",
	26001: "Vall de Càrcer",
	26002: "Castelló i les Énoves",
	27: "Vall de Montesa",
	28: "Costera de Ranes",
	29: "Horta de Xàtiva",
	30001: "Foia de Salem",
	30002: "Baronia de Llutxent",
	30003: "Terres de Rugat",
	30004: "Vall del Vernissa",
	31001: "Marquesat d'Albaida",
	31002: "Antic Reialenc de Xàtiva",
	31003: "Arc Industrial d'Ontinyent",
	32001: "el Marquesat",
	32002: "la Rectoria",
	33001: "Valls de Pego",
	33002: "Valls de l'Aixa-Pop",
	34001: "la Marina",
	34002: "sa Vall de Tàrbena",
	34003: "la Vall de Guadalest",
	35: "l'Horta de Gandia",
	36: "la Vall d'Alfàndec",
	37001: "Comtat de Cocentaina",
	37002: "Baronia de Planes",
	37003: "Vall de Perputxent",
	37004: "Vall de Travadell",
	37005: "Frainós",
	37006: "Valleta d'Agres",
	37007: "Vall de Seta",
	37008: "Vall d'Alcoi",
	37009: "Vall de Biar",
	38: "Foia de Castalla",
	39: "Foia de Xixona",
	40: "Horta d'Alacant",
	41: "Camp d'Elx",
	42001: "Alt Vinalopó",
	42002: "la Vall d'Elda-Asp",
	43: "Valls del Vinalopó",
	44: "Baix Segura"

};

const diccionariPartits = {
    'partit-blau': { nom: 'PP', color: '#3b82f6' },
    'partit-roig': { nom: 'PSOE', color: '#de1a00' },
    'partit-verd': { nom: 'VoX', color: '#10b981' },
    'partit-groc': { nom: 'BLOC', color: '#eab308' }
};

/**
 *  MOTOR DE CHROMATISME REGIONAL (A TOTA HORA):
 * Agrupa sectors per la seua comarca mare usant un ton base compartit,
 * però desvia els graus HSL segons el sector local perquè no siguen iguals.
 * Assegura un fort contrast entre comarques veïnes fent salts grans a la roda HSL,
 * però manté els sub-sectors d'una mateixa comarca units en la mateixa gamma.
 */
function obtenirColorCartograficSubcomarca(idComarca, idSector) {
    if (!idComarca) return "#cbd5e1"; // Gris protector per si falta informació
    
    const cNum = parseInt(idComarca, 10);
    const sNum = idSector ? parseInt(idSector, 10) : 0;

    // 🚀 L'ALGORISME DE DISPERSIÓ DAURADA: Forcem salts de ~132 graus per a evitar que comarques
    // consecutives es claven o compartisquen tons idèntics a la pantalla
    let tonBaseComarca = (cNum * 132.5) % 360;

    // El sector local genera la seua xicoteta variació harmònica de matís interna (gamma)
    let desviacioSector = ((sNum * 47) % 30) - 15; // Un marge més estret (-15 a +15) per a cohesionar millor
    
    let tonFinalHarmonic = (tonBaseComarca + desviacioSector + 360) % 360;

    // Retornem un color amb bona saturació (65%) i lluminositat nítida (64%) d'estil atles
    return `hsl(${tonFinalHarmonic}, 65%, 64%)`;
}





/**
 * ==========================================================================
 * 2. REACCIÓ DE TEXTS DEL PANELL DE DETALLS DRET (SA I RESTABLERT)
 * ==========================================================================
 */
function up(elementClicat = null) {
    //tId.innerText = `Tier ${activeTier}`;
    const g = dbSel[activeTier];
    const targetaEditor = document.getElementById('targeta-editor-municipi');
    const contenidorInputsVots = document.getElementById('contenidor-inputs-vots-locals');
    
    if (g !== null) {
        if (activeTier !== 4) {
            tDetall.innerHTML = activeTier === 0 ? `<strong>Jurisdicció:</strong> Tot el territori valencià.` : `<strong>Demarcació Històrica:</strong> Nivell ${activeTier}, ID: ${g}.`;
            if (targetaEditor) targetaEditor.style.display = 'none';
        } else if (activeTier === 1) {
            // 🚀 ACTUALITZAT: Nom històric real de la gran Governació General
            const nomGovReal = diccionariNomsGovernacions[g] || `Governació General № ${g}`;
            tDetall.innerHTML = `<strong>Governació General Històrica:</strong> ${nomGovReal}<br><strong>Codi Foral:</strong> T1_G${g}<br><strong>Jurisdicció:</strong> S'ha desdoblat la cambra legislativa autònoma d'aquesta província històrica.`;
            if (targetaEditor) targetaEditor.style.display = 'none';
        } else if (activeTier === 2) {
            const nomComarcaReal = diccionariNomsComarques[g] || `Comarca Nº ${g + 1}`;
            tDetall.innerHTML = `<strong>Demarcació Comarcal:</strong> ${nomComarcaReal}<br><strong>Jurisdicció Històrica:</strong> Codi T2_C${g}<br><strong>Efecte:</strong> S'ha seleccionat la comarca, agrupant els seus municipis.`;
            if (targetaEditor) targetaEditor.style.display = 'none';
        } else if (activeTier === 3) {
            // 🚀 ACTUALITZAT: Nom d'identitat de la Subcomarca o Sector local
            const nomSubReal = diccionariNomsSubcomarques[g] || `Subcomarca / Sector № ${g}`;
            tDetall.innerHTML = `<strong>Subcomarca / Sector Històric:</strong> ${nomSubReal}<br><strong>Codi Local:</strong> T3_S${g}<br><strong>Jurisdicció:</strong> Unitat de detall geogràfic de la malla territorial.`;
            if (targetaEditor) targetaEditor.style.display = 'none';		
		} else if (activeTier === 4) {
            const nomPobleReal = elementClicat ? elementClicat.getAttribute('data-nom') : null;
            const nomFinal = nomPobleReal || "Municipi Foral Nº " + (g + 1);
            
            const poblacioHTML = elementClicat ? elementClicat.getAttribute('data-poblacio') : null;
            const dadesGuardades = baseDadesDetallsMunicipis[g] || { 
                vots: {}, 
                text: '', 
                poblacio: poblacioHTML ? parseInt(poblacioHTML, 10) : '' 
            };
            
            let votsTeclejatsTotals = 0;
            let resumVotsText = "";
            
            Object.keys(diccionariPartits).forEach(idP => {
                const numVots = dadesGuardades.vots[idP] || 0;
                votsTeclejatsTotals += numVots;
                if (numVots > 0) {
                    resumVotsText += `<br>• ${diccionariPartits[idP].nom}: ${numVots.toLocaleString()} vots`;
                }
            });

            const habFixes = dadesGuardades.poblacio ? `${parseInt(dadesGuardades.poblacio, 10).toLocaleString()} hab.` : 'Sense especificar';
            tDetall.innerHTML = `
                <strong>Municipi:</strong> ${nomFinal}<br>
                <strong>Codi Local:</strong> T4_M${g + 1}<br>
                <strong>Població (Ref):</strong> ${habFixes}<br>
                <strong>Vots totals emesos:</strong> ${votsTeclejatsTotals.toLocaleString()} paperetes<br>
                <strong>Escrutini Local:</strong> ${resumVotsText || "Sense vots registrats."}<br>
                <strong>Ressenya:</strong> <em>${dadesGuardades.text || 'Sense informació històrica afegida.'}</em>
            `;

            idMunicipiEnEdicio = g;
            
            if (contenidorInputsVots) {
                contenidorInputsVots.innerHTML = '';
                Object.keys(diccionariPartits).forEach(idPartit => {
                    const partitInfo = diccionariPartits[idPartit];
                    const filaInput = document.createElement('div');
                    filaInput.style.display = 'flex';
                    filaInput.style.alignItems = 'center';
                    filaInput.style.justifyContent = 'space-between';
                    filaInput.style.fontSize = '12px';
                    
                    filaInput.innerHTML = `
                        <span style="font-weight:500; color:${partitInfo.color};">■ ${partitInfo.nom}:</span>
                        <input type="number" class="input-vot-local-partit" data-partit="${idPartit}" 
                               value="${dadesGuardades.vots[idPartit] || 0}" min="0"
                               style="width: 100px; padding: 2px 6px; border: 1px solid #cbd5e1; border-radius: 4px; text-align: right;">
                    `;
                    contenidorInputsVots.appendChild(filaInput);
                });
            }

            const inpPob = document.getElementById('input-poblacio');
            const inpTex = document.getElementById('input-info-text');
            if (inpPob) inpPob.value = dadesGuardades.poblacio || '';
            if (inpTex) inpTex.value = dadesGuardades.text || '';
            if (targetaEditor) targetaEditor.style.display = 'block';
        }
    } else {
        tDetall.innerText = "Cap element o demarcació seleccionada en aquest nivell de mapa.";
        if (targetaEditor) targetaEditor.style.display = 'none';
        idMunicipiEnEdicio = null;
    }
}

window.canviarPartitActiu = function(nomClassePartit) {
    colorPartitSeleccionat = nomClassePartit;
    actualitzarInterficiePartits(); 
};

window.canviarEstatEtiquetes = function() {
    mostrarEtiquetesActiu = !mostrarEtiquetesActiu;
	const btn = document.getElementById('btn-toggle-etiquetes');
    if (btn) {
        btn.innerText = mostrarEtiquetesActiu ? "Visibles" : "Ocults";
        btn.style.backgroundColor = mostrarEtiquetesActiu ? "#10b981" : "#475569";
    }
    refrescarEtiquetesSobreMapa();
};

function renderSelectionColors() {
    const mapSvg = document.getElementById('election-svg');
    if (!mapSvg) return;

        mapSvg.querySelectorAll('.frag').forEach(path => {
        const valM = path.getAttribute('data-m');
        const valC = path.getAttribute('data-c'); // 🚀 Afegim lectura de comarca
        const valS = path.getAttribute('data-s');
        
        path.classList.remove('sel');
        path.style.fill = ''; 

        // Si el mode exploració territorial està encès, apliquem les gammes harmòniques regional
        if (modeExploracioActiu) {
            path.style.fill = obtenirColorCartograficSubcomarca(valC, valS);
        } else {
            // Pintura de partits clàssica... 👇
            if (baseDadesColorsElectorals[valM] && diccionariPartits[baseDadesColorsElectorals[valM]]) {
                path.style.fill = diccionariPartits[baseDadesColorsElectorals[valM]].color;
            }
        }
    });

    
    const g = dbSel[activeTier];
    if (g === null) {
        calcularEscrutiniGlobal(); 
        refrescarEtiquetesSobreMapa();
        return;
    }

    mapSvg.querySelectorAll('.frag').forEach(path => {
        let targetMatch = false;
        if (activeTier === 0) targetMatch = true;
        else if (activeTier === 1) targetMatch = (parseInt(path.getAttribute('data-g'), 10) === g);
        else if (activeTier === 2) targetMatch = (parseInt(path.getAttribute('data-c'), 10) === g);
        else if (activeTier === 3) targetMatch = (parseInt(path.getAttribute('data-s'), 10) === g);
        else if (activeTier === 4) targetMatch = (parseInt(path.getAttribute('data-m'), 10) === g);

        if (targetMatch) path.classList.add('sel'); 
    });

    calcularEscrutiniGlobal();
    refrescarEtiquetesSobreMapa();	
}

function chg(val) { 
    activeTier = parseInt(val, 10); 
    renderSelectionColors(); 
    up(null); 
}

/**
 * ==========================================================================
 * refrescarEtiquetesSobreMapa - MOTOR D'ETIQUETATGE HISTÒRIC ADAPTATIU PROPORCIONAL
 * ==========================================================================
 */
function refrescarEtiquetesSobreMapa() {
    const mapSvg = document.getElementById('election-svg');
    const contenidorEtiquetes = document.getElementById('capa-etiquetes-html-superiors');
    
    if (!mapSvg || !contenidorEtiquetes) return;

    // Buidem el contenidor de textos anteriors
    contenidorEtiquetes.innerHTML = '';
    if (!mostrarEtiquetesActiu) return;

    const rectScrollArea = contenidorEtiquetes.parentElement.getBoundingClientRect();
    const paths = mapSvg.querySelectorAll('.frag');
    
    // Memòria elàstica per a calcular els centres de masses dels grups
    const acumuladorCoordenadesGrup = {};

    // 1. CÀLCUL GEOMÈTRIC EN VIU: Recorrem la malla de municipis
    paths.forEach(path => {
        const valM = path.getAttribute('data-m') || "0";
        const valG = path.getAttribute('data-g') || "0";
        const valC = path.getAttribute('data-c') || "0";
        const valS = path.getAttribute('data-s') || "0";

        let idGrupActiu = "";
        let textNomGrup = "";

        if (activeTier === 0) { idGrupActiu = "0"; textNomGrup = "Regne de València/República de València"; }
        else if (activeTier === 1) { idGrupActiu = valG; textNomGrup = diccionariNomsGovernacions[parseInt(valG, 10)] || "Governació " + valG; }
        else if (activeTier === 2) { idGrupActiu = valC; textNomGrup = diccionariNomsComarques[parseInt(valC, 10)] || "Comarca " + valC; }
        else if (activeTier === 3) { idGrupActiu = valS; textNomGrup = diccionariNomsSubcomarques[parseInt(valS, 10)] || "Sector " + valS; }
        else if (activeTier === 4) { idGrupActiu = valM; const nomAtribut = path.getAttribute('data-nom'); textNomGrup = (nomAtribut && nomAtribut.trim() !== "") ? nomAtribut : "Vila " + (parseInt(valM, 10) + 1); }

        // Mesurem on s'està dibuixant físicament el municipi a la pantalla ara mateix
        const rectPathVisual = path.getBoundingClientRect();
        
        // Calculem el mig real en píxels del finestrer
        const centreX = rectPathVisual.left - rectScrollArea.left + (rectPathVisual.width / 2);
        const centreY = rectPathVisual.top - rectScrollArea.top + (rectPathVisual.height / 2);

        if (rectPathVisual.width > 0 && rectPathVisual.height > 0) {
            if (activeTier !== 4) {
                // Acumulem coordenades per als grups territorials majors (0, 1, 2, 3)
                if (!acumuladorCoordenadesGrup[idGrupActiu]) {
                    acumuladorCoordenadesGrup[idGrupActiu] = { xSuma: 0, ySuma: 0, comptador: 0, nom: textNomGrup, ampleMaxim: 0 };
                }
                acumuladorCoordenadesGrup[idGrupActiu].xSuma += centreX;
                acumuladorCoordenadesGrup[idGrupActiu].ySuma += centreY;
                acumuladorCoordenadesGrup[idGrupActiu].comptador++;
                acumuladorCoordenadesGrup[idGrupActiu].ampleMaxim += rectPathVisual.width;
            } else {
                // Tier 4: Municipis individuals invariants
                acumuladorCoordenadesGrup[idGrupActiu] = {
                    xFinal: centreX, yFinal: centreY, nom: textNomGrup, ampleReferencia: rectPathVisual.width
                };
            }
        }
    });

    // 2. IMPRESIÓ DIGITAL: Projectem els rètols amb mida adaptada a la seua circumscripció
    Object.keys(acumuladorCoordenadesGrup).forEach(idGrup => {
        const dadesGrup = acumuladorCoordenadesGrup[idGrup];
        if (dadesGrup.comptador === 0) return;

        let xPantalla = dadesGrup.xFinal || (dadesGrup.xSuma / dadesGrup.comptador);
        let yPantalla = dadesGrup.yFinal || (dadesGrup.ySuma / dadesGrup.comptador);

        // 🚀 ESCALADOR UNITARI ADAPTATIU: Canvia l'altura del text en viu segons l'àmbit territorial
        let ampleMesurat = dadesGrup.ampleReferencia || (dadesGrup.ampleMaxim / dadesGrup.comptador);
        let midaFontCalculada = 11;

        if (activeTier === 0) midaFontCalculada = 24;      // Gran cambra sobirana
        else if (activeTier === 1) midaFontCalculada = 16; // Governacions majoritàries
        else if (activeTier === 2) midaFontCalculada = 13; // Comarques mitjanes
        else if (activeTier === 3) midaFontCalculada = 11; // Sectors de detall
        else if (activeTier === 4) {
            // Municipis: Si el poble fa menys de 25px d'ample, encongim el text per no desbordar els confins
            midaFontCalculada = ampleMesurat < 25 ? 9 : 11;
        }

        const divEtiqueta = document.createElement('div');
        divEtiqueta.innerText = dadesGrup.nom;
        
        Object.assign(divEtiqueta.style, {
            position: 'absolute',
            left: `${xPantalla}px`,
            top: `${yPantalla}px`,
            transform: 'translate(-50%, -50%)', // Centrat invariant absolut
            color: '#0f172a',
            fontSize: `${midaFontCalculada}px`,
            fontWeight: activeTier < 3 ? '800' : 'bold', // Text més gruixut per a les demarcacions grans
            fontFamily: 'system-ui, sans-serif',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: '99999',
            textShadow: '2px 2px 0 #fff, -2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff, 0 2px 4px rgba(0,0,0,0.15)'
        });

        contenidorEtiquetes.appendChild(divEtiqueta);
    });
}



/**
 * ==========================================================================
 * 5. MOTORS UNIFICATS: CONTROL D'ARROSSEGAMENT I ZOOM (RATOLÍ + MÒBIL A L'HORA)
 * ==========================================================================
 */
let isMouseDown = false;
let startX, startY;
let viewBoxStart = { x: 0, y: 0 };
let isStaticClick = true;

// Variables exclusives per al gest de pinça tàctil
let distànciaInicialPinça = null;
let viewBoxInicialPinça = { w: 0, h: 0, x: 0, y: 0 };

/* === A) INICI DE LA INTERACCIÓ (RATOLÍ I TÀCTIL) === */

// Clic de ratolí ordinari
v.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return; // Només clic esquerre
    isMouseDown = true;
    isStaticClick = true;
    startX = e.clientX;
    startY = e.clientY;
    viewBoxStart.x = currentViewBox.x;
    viewBoxStart.y = currentViewBox.y;
});

// Toc a la pantalla tàctil
v.addEventListener('touchstart', (e) => {
    isStaticClick = true;

    if (e.touches.length === 1) {
        // Un sol dit: Equival a mousedown
        isMouseDown = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        viewBoxStart.x = currentViewBox.x;
        viewBoxStart.y = currentViewBox.y;
    } else if (e.touches.length === 2) {
        // Dos dits: Iniciem gest de pinça per a zoom involuntari
        isMouseDown = false; 
        distànciaInicialPinça = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );
        viewBoxInicialPinça = { ...currentViewBox };
    }
}, { passive: true });


/* === B) MOVIMENT EN DIRECTE (RATOLÍ I TÀCTIL) === */

// Moviment del ratolí
window.addEventListener('mousemove', (e) => {
    if (!isMouseDown) return;
    processarArrossegament(e.clientX, e.clientY);
});

// Moviment dels dits per la pantalla
window.addEventListener('touchmove', (e) => {
    const svgEl = document.getElementById('election-svg');
    if (!svgEl) return;

    if (e.touches.length === 1 && isMouseDown) {
        // Moure el mapa amb un sol dit
        processarArrossegament(e.touches[0].clientX, e.touches[0].clientY);
    } else if (e.touches.length === 2 && distànciaInicialPinça) {
        // Fer zoom amb dos dits (pinça)
        e.preventDefault(); // Evita el zoom natiu del navegador mòbil
        isStaticClick = false;

        const distànciaActual = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );

        if (distànciaActual > 0) {
            let factor = distànciaInicialPinça / distànciaActual;
            
            // Centre geomètric exacte entre els dos dits
            const centreX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
            const centreY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

            const matriuPantalla = svgEl.getScreenCTM();
            if (!matriuPantalla) return;

            const puntSVG = svgEl.createSVGPoint();
            puntSVG.x = centreX;
            puntSVG.y = centreY;
            const puntRealSVG = puntSVG.matrixTransform(matriuPantalla.inverse());

            let nouW = viewBoxInicialPinça.w * factor;
            let nouH = viewBoxInicialPinça.h * factor;
            const nivellZoomCalculat = 1296 / nouW;

            if (nivellZoomCalculat >= 0.1 && nivellZoomCalculat <= 40) {
                currentViewBox.w = nouW;
                currentViewBox.h = nouH;
                currentViewBox.x = puntRealSVG.x - (puntRealSVG.x - viewBoxInicialPinça.x) * factor;
                currentViewBox.y = puntRealSVG.y - (puntRealSVG.y - viewBoxInicialPinça.y) * factor;

                svgEl.setAttribute('viewBox', `${currentViewBox.x} ${currentViewBox.y} ${currentViewBox.w} ${currentViewBox.h}`);
                refrescarEtiquetesSobreMapa();
            }
        }
    }
}, { passive: false });

// Funció centralitzadora d'arrossegament (calcula la matriu per a ratolí o dit)
function processarArrossegament(pantallaX, pantallaY) {
    const svgEl = document.getElementById('election-svg');
    if (!svgEl) return;

    const deltaX = pantallaX - startX;
    const deltaY = pantallaY - startY;

    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
        isStaticClick = false; 
    }

    const rect = svgEl.getBoundingClientRect();
    const factorEscalaX = currentViewBox.w / rect.width;
    const factorEscalaY = currentViewBox.h / rect.height;

    currentViewBox.x = viewBoxStart.x - (deltaX * factorEscalaX);
    currentViewBox.y = viewBoxStart.y - (deltaY * factorEscalaY);

    svgEl.setAttribute('viewBox', `${currentViewBox.x} ${currentViewBox.y} ${currentViewBox.w} ${currentViewBox.h}`);
    refrescarEtiquetesSobreMapa();
}


/* === C) FINALITZACIÓ DE LA INTERACCIÓ (RATOLÍ I TÀCTIL) === */

// En amollar el clic del ratolí
window.addEventListener('mouseup', () => { 
    isMouseDown = false; 
});

// En aixecar els dits de la pantalla
window.addEventListener('touchend', (e) => {
    if (e.touches.length === 0) {
        isMouseDown = false;
        distànciaInicialPinça = null;
    } else if (e.touches.length === 1) {
        // Si es queda un dit recolzat, es reajusta com a inici d'arrossegament d'un sol dit
        isMouseDown = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        viewBoxStart.x = currentViewBox.x;
        viewBoxStart.y = currentViewBox.y;
        distànciaInicialPinça = null;
    }
});


/* === D) CONTROL DE ZOOM PER RODA (SENSE CANVIS, MANTÉ EL RATOLÍ) === */
document.addEventListener('DOMContentLoaded', () => {
    const svgEl = document.getElementById('election-svg');
    if (!svgEl) return;

    svgEl.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        const matriuPantalla = svgEl.getScreenCTM();
        if (!matriuPantalla) return;

        const puntSVG = svgEl.createSVGPoint();
        puntSVG.x = e.clientX;
        puntSVG.y = e.clientY;
        
        const puntRealSVG = puntSVG.matrixTransform(matriuPantalla.inverse());
        const mouseX = puntRealSVG.x;
        const mouseY = puntRealSVG.y;

        let factor = (e.deltaY < 0) ? 0.9 : 1.1;
        let nouW = currentViewBox.w * factor;
        let nouH = currentViewBox.h * factor;
        const nivellZoomCalculat = 1296 / nouW;

        if (nivellZoomCalculat >= 0.1 && nivellZoomCalculat <= 40) {
            currentViewBox.x = mouseX - (mouseX - currentViewBox.x) * factor;
            currentViewBox.y = mouseY - (mouseY - currentViewBox.y) * factor;
            currentViewBox.w = nouW;
            currentViewBox.h = nouH;
            
            svgEl.setAttribute('viewBox', `${currentViewBox.x} ${currentViewBox.y} ${currentViewBox.w} ${currentViewBox.h}`);
            refrescarEtiquetesSobreMapa();
        }
    }, { passive: false });
});



/**
 * ==========================================================================
 * 7. GESTIÓ DINÀMICA DE PARTITS I CONTROLADORS DE LA INTERFÍCIE
 * ==========================================================================
 */
function actualitzarInterficiePartits() {
    const contenidor = document.getElementById('contenidor-botons-partits');
    if (!contenidor) return;
    contenidor.innerHTML = '';

    Object.keys(diccionariPartits).forEach(idPartit => {
        const partit = diccionariPartits[idPartit];
        const estaActiu = colorPartitSeleccionat === idPartit;

        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.border = estaActiu ? '2px solid #0f172a' : '1px solid #cbd5e1';
        wrapper.style.borderRadius = '6px';
        wrapper.style.overflow = 'hidden';

        const btnSeleccio = document.createElement('button');
        btnSeleccio.innerText = partit.nom;
        btnSeleccio.style.padding = '6px 12px';
        btnSeleccio.style.background = partit.color;
        btnSeleccio.style.color = obtenirColorTextSegonsFons(partit.color);
        btnSeleccio.style.border = 'none';
        btnSeleccio.style.cursor = 'pointer';
        btnSeleccio.style.fontWeight = '600';
        btnSeleccio.style.fontSize = '13px';
        btnSeleccio.onclick = () => canviarPartitActiu(idPartit);

        const btnEliminar = document.createElement('button');
        btnEliminar.innerText = '×';
        btnEliminar.style.padding = '6px 8px';
        btnEliminar.style.background = '#f1f5f9';
        btnEliminar.style.color = '#ef4444';
        btnEliminar.style.border = 'none';
        btnEliminar.style.borderLeft = '1px solid #cbd5e1';
        btnEliminar.style.cursor = 'pointer';
        btnEliminar.style.fontWeight = 'bold';
        btnEliminar.style.fontSize = '14px';
        btnEliminar.onclick = () => eliminarPartitExistent(idPartit);

        wrapper.appendChild(btnSeleccio);
        wrapper.appendChild(btnEliminar);
        contenidor.appendChild(wrapper);
    });
}

function eliminarPartitExistent(idPartit) {
    if (colorPartitSeleccionat === idPartit) {
        const clausRestants = Object.keys(diccionariPartits).filter(k => k !== idPartit);
        colorPartitSeleccionat = clausRestants.length > 0 ? clausRestants[0] : '';
    }
    delete diccionariPartits[idPartit];
    Object.keys(baseDadesColorsElectorals).forEach(idM => {
        if (baseDadesColorsElectorals[idM] === idPartit) delete baseDadesColorsElectorals[idM];
    });
    actualitzarInterficiePartits();
    renderSelectionColors();
}

function obtenirColorTextSegonsFons(hexcolor) {
    const r = parseInt(hexcolor.substr(1,2), 16);
    const g = parseInt(hexcolor.substr(3,2), 16);
    const b = parseInt(hexcolor.substr(5,2), 16);
    return (((r*299)+(g*587)+(b*114))/1000 >= 128) ? '#0f172a' : '#ffffff';
}

/**
 * ==========================================================================
 * calcularEscrutiniGlobal - MOTOR DE PARLAMENTS PROPRIS AMB ESCONS EDITABLES
 * ==========================================================================
 */
function calcularEscrutiniGlobal() {
    const totalMunicipis = 538;
    const vilesGuanyadesPerPartit = {};
    const votsTotalsPerPartit = {}; 
    
    // 🚀 LLEGIM ELS VALORS EDITABLES: Extraiem els números que has escrit a l'HTML
    const inpRegne = document.getElementById('escons-parlament-regne');
    const inpG = document.getElementById('escons-parlament-g');
    const inpC = document.getElementById('escons-parlament-c');

    const CAMBRA_REGNE_ESCONS = inpRegne ? parseInt(inpRegne.value, 10) || 99 : 99;
    const CAMBRA_GOV_ESCONS = inpG ? parseInt(inpG.value, 10) || 25 : 25;
    const CAMBRA_COM_ESCONS = inpC ? parseInt(inpC.value, 10) || 11 : 11;

    Object.keys(diccionariPartits).forEach(k => {
        vilesGuanyadesPerPartit[k] = 0;
        votsTotalsPerPartit[k] = 0;
    });
    
    let municipisComptatsTerritori = 0;
    let votsTotalsRegne = 0;

    const selectorCirc = document.getElementById('selector-circumscripcio-electoral');
    const tipusCircumscripcio = selectorCirc ? selectorCirc.value : 'regne';

    // 1. RECOMPTE DE PAPERETES: Sumem vots globals poble a poble
    Object.keys(baseDadesDetallsMunicipis).forEach(idM => {
        const dadesM = baseDadesDetallsMunicipis[idM];
        if (dadesM && dadesM.vots) {
            Object.keys(dadesM.vots).forEach(idP => {
                const numVots = parseInt(dadesM.vots[idP], 10) || 0;
                if (votsTotalsPerPartit[idP] !== undefined) {
                    votsTotalsPerPartit[idP] += numVots;
                    votsTotalsRegne += numVots;
                }
            });
        }
    });

    Object.keys(baseDadesColorsElectorals).forEach(idM => {
        const partitGuanyadorLocal = baseDadesColorsElectorals[idM];
        if (partitGuanyadorLocal && vilesGuanyadesPerPartit[partitGuanyadorLocal] !== undefined) {
            vilesGuanyadesPerPartit[partitGuanyadorLocal]++;
            municipisComptatsTerritori++;
        }
    });

    const escrutatsEl = document.getElementById('vots-escrutats');
    if (escrutatsEl) escrutatsEl.innerText = `${municipisComptatsTerritori} / ${totalMunicipis} (${((municipisComptatsTerritori / totalMunicipis) * 100).toFixed(1)}%)`;

    const contenidorBarres = document.getElementById('barra-escrutini-contenidor');
    if (contenidorBarres) {
        contenidorBarres.innerHTML = '';
        Object.keys(vilesGuanyadesPerPartit).forEach(partitId => {
            const viles = vilesGuanyadesPerPartit[partitId];
            const pctViles = municipisComptatsTerritori > 0 ? ((viles / municipisComptatsTerritori) * 100).toFixed(1) : 0;
            if (viles > 0 && diccionariPartits[partitId]) {
                const partitInfo = diccionariPartits[partitId];
                const filaBarra = document.createElement('div');
                filaBarra.innerHTML = `<div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:2px; color: #334155;"><span>Partit ${partitInfo.nom}</span><strong>${viles} viles (${pctViles}%)</strong></div><div class="progress-bar-bg"><div class="progress-fill" style="width: ${pctViles}%; background-color: ${partitInfo.color};"></div></div>`;
                contenidorBarres.appendChild(filaBarra);
            }
        });
    }

    const escrutatsPobEl = document.getElementById('poblacio-escrutada');
    if (escrutatsPobEl) escrutatsPobEl.innerText = `${votsTotalsRegne.toLocaleString()} vots acumulats`;

    // 2. 🚀 MOTOR DE DISTRIBUCIÓ DE CAMBRES SOBIRANES INDEPENDENTS
    const contenidorEscons = document.getElementById('barra-escons-contenidor');
    if (!contenidorEscons) return;
    contenidorEscons.innerHTML = '';

        if (tipusCircumscripcio === 'regne') {
        // MODEL GENERAL DEL REGNE MULTI-DIVISOR SANEJAT
        const esconsAssignatsRegne = {};
        const llistaCocientsRegne = [];

        Object.keys(votsTotalsPerPartit).forEach(partitId => {
            esconsAssignatsRegne[partitId] = 0;
            const votsPartit = votsTotalsPerPartit[partitId];
            
            if (votsPartit > 0) {
                for (let divisor = 1; divisor <= CAMBRA_REGNE_ESCONS; divisor++) {
                    llistaCocientsRegne.push({ partit: partitId, valorCocient: votsPartit / divisor });
                }
            }
        });

        llistaCocientsRegne.sort((a, b) => b.valorCocient - a.valorCocient);
        const límitRegne = Math.min(CAMBRA_REGNE_ESCONS, llistaCocientsRegne.length);
        for (let i = 0; i < límitRegne; i++) {
            esconsAssignatsRegne[llistaCocientsRegne[i].partit]++;
        }

        // Dibuixat de la targeta del Regne AMB EL NOMBRE DE VOTS INJECTAT
        Object.keys(votsTotalsPerPartit).forEach(partitId => {
            const escons = esconsAssignatsRegne[partitId] || 0;
            const votsAcumulatsPartit = votsTotalsPerPartit[partitId];
            const pctVotProporcional = votsTotalsRegne > 0 ? ((votsAcumulatsPartit / votsTotalsRegne) * 100).toFixed(1) : 0;

            if (escons > 0 && diccionariPartits[partitId]) {
                const partitInfo = diccionariPartits[partitId];
                const fila = document.createElement('div');
                fila.innerHTML = `
                    <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:2px; color:#334155;">
                        <span>Partit ${partitInfo.nom}</span>
                        <strong>${escons} Escons (${pctVotProporcional}%)</strong>
                    </div>
                    <div style="font-size:10px; color:#64748b; margin-bottom:2px;">Vots totals acumulats: ${votsAcumulatsPartit.toLocaleString()} paperetes</div>
                    <div class="progress-bar-bg"><div class="progress-fill" style="width: ${pctVotProporcional}%; background-color: ${partitInfo.color};"></div></div>
                `;
                contenidorEscons.appendChild(fila);
            }
        });
    } else {
        // MODEL TERRITORIAL DESDOBLAT (Aplica el valor fix triat per a cada mini-parlament local)
        const votsPerBlocGeografic = {}; 
        const pathsMunicipis = document.getElementById('election-svg').querySelectorAll('.frag');
        
        pathsMunicipis.forEach(path => {
            const idM = path.getAttribute('data-m');
            const blocTerritori = path.getAttribute(tipusCircumscripcio === 'g' ? 'data-g' : 'data-c');
            const dadesM = baseDadesDetallsMunicipis[idM];
            
            if (blocTerritori && dadesM && dadesM.vots) {
                if (!votsPerBlocGeografic[blocTerritori]) {
                    votsPerBlocGeografic[blocTerritori] = { total: 0, partits: {} };
                    Object.keys(diccionariPartits).forEach(k => votsPerBlocGeografic[blocTerritori].partits[k] = 0);
                }
                Object.keys(dadesM.vots).forEach(idPartit => {
                    const v = parseInt(dadesM.vots[idPartit], 10) || 0;
                    votsPerBlocGeografic[blocTerritori].partits[idPartit] += v;
                    votsPerBlocGeografic[blocTerritori].total += v;
                });
            }
        });

        // Triem quin valor de mini-parlament s'ha d'aplicar de manera fixa a cada casella local
        const esconsFixesPerCambraLocal = tipusCircumscripcio === 'g' ? CAMBRA_GOV_ESCONS : CAMBRA_COM_ESCONS;

        Object.keys(votsPerBlocGeografic).forEach(idBloc => {
            const dadesBloc = votsPerBlocGeografic[idBloc];
            if (dadesBloc.total === 0) return;

            const etiquetaTitol = tipusCircumscripcio === 'g' ? (diccionariNomsGovernacions[idBloc] || `Corts de la Governació № ${idBloc}`) : (diccionariNomsComarques[idBloc] || `Consell de la Comarca № ${idBloc}`);
            
            const subTargetaBloc = document.createElement('div');
            subTargetaBloc.style.cssText = "background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px; margin-bottom: 8px;";
            subTargetaBloc.innerHTML = `<div style="font-size:12px; font-weight:700; color:#4338ca; margin-bottom:6px; border-bottom:1px solid #cbd5e1; padding-bottom:2px;">🏛️ ${etiquetaTitol} (${esconsFixesPerCambraLocal} Diputats propis)</div>`;

            // 🚀 APLICACIÓ DE LA LLEI D'HONDT REAL: Creem la llista de cocients
            const esconsAssignatsHondt = {};
            const llistaCocients = [];

            // Inicialitzem els escons de cada partit a zero
            Object.keys(dadesBloc.partits).forEach(idPartit => {
                esconsAssignatsHondt[idPartit] = 0;
                const votsPartit = dadesBloc.partits[idPartit];
                
                // Generem els cocients dividint els vots consecutivament per 1, 2, 3, 4...
                if (votsPartit > 0) {
                    for (let divisor = 1; divisor <= esconsFixesPerCambraLocal; divisor++) {
                        llistaCocients.push({
                            partit: idPartit,
                            valorCocient: votsPartit / divisor
                        });
                    }
                }
            });

            // Ordenem tots els cocients de tot el districte de major a menor valor
            llistaCocients.sort((a, b) => b.valorCocient - a.valorCocient);

            // Repartim els escons un a un de manera estricta als cocients més alts
            const límitEsconsARepartir = Math.min(esconsFixesPerCambraLocal, llistaCocients.length);
            for (let i = 0; i < límitEsconsARepartir; i++) {
                const cocientGuanyador = llistaCocients[i];
                esconsAssignatsHondt[cocientGuanyador.partit]++;
            }

            // Dibuixem la llista utilitzant els nous escons calculats per la Llei d'Hondt
            Object.keys(dadesBloc.partits).forEach(idPartit => {
                const votsPartitAlBloc = dadesBloc.partits[idPartit];
                const pctIntern = dadesBloc.total > 0 ? ((votsPartitAlBloc / dadesBloc.total) * 100).toFixed(1) : 0;
                const esconsCalculatsAlBloc = esconsAssignatsHondt[idPartit] || 0;

                if (votsPartitAlBloc > 0 && diccionariPartits[idPartit]) {
                    const partitInfo = diccionariPartits[idPartit];
                    const filaPartitBloc = document.createElement('div');
                    filaPartitBloc.innerHTML = `
                        <div style="display:flex; justify-content:space-between; font-size:11px; color:#475569; margin-top:4px;">
                            <span>■ ${partitInfo.nom}: ${votsPartitAlBloc.toLocaleString()} vots</span>
                            <strong>${esconsCalculatsAlBloc} Escons (${pctIntern}%)</strong>
                        </div>
                        <div class="progress-bar-bg" style="height:6px; margin-bottom:2px;"><div class="progress-fill" style="width: ${pctIntern}%; background-color: ${partitInfo.color};"></div></div>
                    `;
                    subTargetaBloc.appendChild(filaPartitBloc);
                }
            });

            contenidorEscons.appendChild(subTargetaBloc);
        });

    }
}



/**
 * ==========================================================================
 * 8. INICIALITZACIÓ UNIFICADA I ACUBLAMENT DELS ESDEVENIMENTS DEL DOM
 * ==========================================================================
 */
window.addEventListener('DOMContentLoaded', () => {
    // 🚀 ACTIU: Connectem el desplegable morat a dalt de tot de l'arrancada
	
	const inpRegne = document.getElementById('escons-parlament-regne');
    const inpG = document.getElementById('escons-parlament-g');
    const inpC = document.getElementById('escons-parlament-c');

    if (inpRegne) inpRegne.oninput = () => calcularEscrutiniGlobal();
    if (inpG) inpG.oninput = () => calcularEscrutiniGlobal();
    if (inpC) inpC.oninput = () => calcularEscrutiniGlobal();
    const selectorCircElectoral = document.getElementById('selector-circumscripcio-electoral');
    if (selectorCircElectoral) {
        selectorCircElectoral.onchange = () => {
            calcularEscrutiniGlobal();
        };
    }

    const selectorMenu = document.querySelector('select');
    if (selectorMenu) selectorMenu.value = "0";
    activeTier = 0;
    
    const svgEl = document.getElementById('election-svg');
    if (svgEl) {
        currentViewBox = { x: 0, y: 0, w: 1296, h: 1760 }; 
        svgEl.setAttribute('viewBox', `${currentViewBox.x} ${currentViewBox.y} ${currentViewBox.w} ${currentViewBox.h}`);
		
        svgEl.querySelectorAll('.frag').forEach(el => {
            el.addEventListener('click', (e) => {
                if (!isStaticClick) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }
                    e.stopPropagation();
                    
                    const valM = parseInt(el.getAttribute('data-m'), 10);
                    const valS = parseInt(el.getAttribute('data-s'), 10);
                    const valC = parseInt(el.getAttribute('data-c'), 10);
                    const valG = parseInt(el.getAttribute('data-g'), 10);
                    
                    let clickedGroup = 0;
                    if (activeTier === 0) clickedGroup = 0;
                    else if (activeTier === 1) clickedGroup = valG;
                    else if (activeTier === 2) clickedGroup = valC;
                    else if (activeTier === 3) clickedGroup = valS;
                    else if (activeTier === 4) clickedGroup = valM;

                    // 1. REGLA DE SELECCIÓ (PERMET EXPLORAR DATA): Triem el grup actiu per a ressaltar contorns
                    if (dbSel[activeTier] === clickedGroup) {
                        dbSel[activeTier] = null;
                        // 🚀 BLOC DE PINTURA PROTEGIT: Només esborra vots si el mode exploració està OFF!
                        if (!modeExploracioActiu && activeTier === 4 && colorPartitSeleccionat !== 'neutre') {
                            delete baseDadesColorsElectorals[valM]; 
                        }
                        up(null);
                    } else {
                        dbSel[activeTier] = clickedGroup;
                        // 🚀 BLOC DE PINTURA PROTEGIT: Només injecta color electoral si el mode exploració està OFF!
                        if (!modeExploracioActiu && activeTier === 4 && colorPartitSeleccionat !== 'neutre') {
                            if (diccionariPartits[colorPartitSeleccionat]) {
                                baseDadesColorsElectorals[valM] = colorPartitSeleccionat; 
                            }
                        }
                        up(el); //  SEMPRE OPERATIU: Obre la targeta de dades del lloc a tota hora!
                    }
                    
                    // Actualitzem les il·luminacions i rètols
                    renderSelectionColors();
                
            });
        });


            // ==========================================
			// VISOR DE COORDENADES VECTORIAL EN CONTEXT
			// ==========================================
			const puntSVG = svgEl.createSVGPoint();
			let visorCoordenades = document.getElementById('coordenades-visor');
    
			// Si no existeix el div a l'HTML, el creem dinàmicament amb estils elegants
			if (!visorCoordenades) {
				visorCoordenades = document.createElement('div');
				visorCoordenades.id = 'coordenades-visor';
				Object.assign(visorCoordenades.style, {
					position: 'fixed', 
					bottom: '20px', 
					left: '20px', 
					backgroundColor: 'rgba(15, 23, 42, 0.95)',
					color: '#f8fafc', 
					padding: '8px 16px', 
					borderRadius: '6px', 
					fontFamily: 'monospace',
					fontSize: '13px', 
					zIndex: '999999', 
					pointerEvents: 'none', 
					border: '1px solid #334155', 
					boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
				});
				document.body.appendChild(visorCoordenades);
			}

			// Actualització mil·limètrica basada en la matriu de transformació del viewBox actual
			svgEl.addEventListener('mousemove', (e) => {
				const matriuPantalla = svgEl.getScreenCTM();
				if (matriuPantalla) {
					puntSVG.x = e.clientX; 
					puntSVG.y = e.clientY;
            
					// Invertim la matriu de la pantalla per obtenir la coordenada real interna de l'atles
					const puntRealSVG = puntSVG.matrixTransform(matriuPantalla.inverse());
					visorCoordenades.innerText = `X: ${puntRealSVG.x.toFixed(1)} | Y: ${puntRealSVG.y.toFixed(1)}`;
				}
			});

			// Reset quan el ratolí surt del mapa
			svgEl.addEventListener('mouseleave', () => { 
				visorCoordenades.innerText = "X: ---.- | Y: ---.-"; 
			});

    }

    const btnAfegir = document.getElementById('btn-afegir-partit');
    const inputNom = document.getElementById('nou-partit-nom');
    const inputColor = document.getElementById('nou-partit-color');
    const btnReiniciar = document.getElementById('btn-reiniciar-escrutini');

    if (btnAfegir) {
        btnAfegir.onclick = () => {
            const nom = inputNom.value.trim();
            const color = inputColor.value;
            if (!nom) return;
            const idNouPartit = `partit-${Date.now()}`;
            diccionariPartits[idNouPartit] = { nom: nom, color: color };
            inputNom.value = '';
            colorPartitSeleccionat = idNouPartit;
            actualitzarInterficiePartits();
            renderSelectionColors();
        };
    }

    if (btnReiniciar) {
        btnReiniciar.onclick = () => {
            if (confirm("Segur que vols esborrar absolutament tots els vots registrats al mapa?")) {
                Object.keys(baseDadesColorsElectorals).forEach(idM => delete baseDadesColorsElectorals[idM]);
                Object.keys(baseDadesDetallsMunicipis).forEach(idM => delete baseDadesDetallsMunicipis[idM]);
                renderSelectionColors();
                up(null);
            }
        };
    }

    const inputCercador = document.getElementById('map-searcher');
    const botoCercar = document.getElementById('search-btn');
    const errorCercador = document.getElementById('search-error');

    if (botoCercar && inputCercador) {
        botoCercar.onclick = () => {
            const textBuscat = inputCercador.value.trim().toLowerCase();
            if (!textBuscat) return;
            if (errorCercador) errorCercador.style.display = 'none';
            const paths = document.getElementById('election-svg').querySelectorAll('.frag');
            let elementTrobat = null;

            for (let path of paths) {
                const nomPoble = path.getAttribute('data-nom');
                if (nomPoble && nomPoble.toLowerCase().includes(textBuscat)) {
                    elementTrobat = path;
                    break;
                }
            }

            if (elementTrobat) {
                const valM = parseInt(elementTrobat.getAttribute('data-m'), 10);
                if (activeTier === 4) {
                    dbSel[activeTier] = valM;
                    if (colorPartitSeleccionat !== 'neutre' && diccionariPartits[colorPartitSeleccionat]) {
                        baseDadesColorsElectorals[valM] = colorPartitSeleccionat;
                    }
                    renderSelectionColors();
                    up(elementTrobat);
                }
                const rectVisor = v.getBoundingClientRect();
                const rectPath = elementTrobat.getBoundingClientRect();
                v.scrollLeft += (rectPath.left - rectVisor.left - (rectVisor.width / 2) + (rectPath.width / 2));
                v.scrollTop += (rectPath.top - rectVisor.top - (rectVisor.height / 2) + (rectPath.height / 2));
            } else {
                if (errorCercador) errorCercador.style.display = 'block';
            }
        };
    }

    const btnDesarMunicipi = document.getElementById('btn-desar-municipi');
    if (btnDesarMunicipi) {
        btnDesarMunicipi.onclick = () => {
            if (idMunicipiEnEdicio === null) return;
            const inputPoblacio = document.getElementById('input-poblacio');
            const inputInfoText = document.getElementById('input-info-text');
            const valorPoblacio = inputPoblacio ? inputPoblacio.value.trim() : "";
            const valorText = inputInfoText ? inputInfoText.value.trim() : "";
            const votsRecollits = {};
            let maximVotsLocals = 0;
            let partitGuanyadorLocal = null;

            const inputsVots = document.querySelectorAll('.input-vot-local-partit');
            inputsVots.forEach(inp => {
                const idPartit = inp.getAttribute('data-partit');
                const votsVal = parseInt(inp.value, 10) || 0;
                votsRecollits[idPartit] = votsVal;
                if (votsVal > maximVotsLocals) {
                    maximVotsLocals = votsVal;
                    partitGuanyadorLocal = idPartit;
                }
            });

            baseDadesDetallsMunicipis[idMunicipiEnEdicio] = {
                vots: votsRecollits,
                text: valorText,
                poblacio: valorPoblacio !== "" ? parseInt(valorPoblacio, 10) : ""
            };

            if (maximVotsLocals > 0 && partitGuanyadorLocal) {
                baseDadesColorsElectorals[idMunicipiEnEdicio] = partitGuanyadorLocal;
            } else {
                delete baseDadesColorsElectorals[idMunicipiEnEdicio];
            }

            const pathActiu = document.querySelector(`#election-svg .frag[data-m="${idMunicipiEnEdicio}"]`);
            renderSelectionColors();
            up(pathActiu);
            alert("Escrutini municipal i dades forals guardades amb èxit!");
        };
    }

    const btnExportar = document.getElementById('btn-exportar-mapa');
    const zonaCompartir = document.getElementById('zona-compartir');
    const textIntercanvi = document.getElementById('text-intercanvi');

    if (btnExportar && zonaCompartir && textIntercanvi) {
        btnExportar.onclick = () => {
            const mapaDadesACompartir = {
                colorsElectorals: baseDadesColorsElectorals,
                detallsMunicipis: baseDadesDetallsMunicipis,
                partitsCreats: diccionariPartits
            };
            const textSequencia = JSON.stringify(mapaDadesACompartir);
            textIntercanvi.value = textSequencia;
            zonaCompartir.style.display = 'flex';
            
            const blobB = new Blob([textSequencia], { type: 'text/plain' });
            const enllaçDescarrega = document.createElement('a');
            enllaçDescarrega.download = `mapa-regne-proporcional-${Date.now()}.txt`;
            enllaçDescarrega.href = window.URL.createObjectURL(blobB);
            enllaçDescarrega.click();
            alert("S'ha generat el fitxer amb els teus partits i vots. Comparteix l'arxiu .txt descarregat!");
        };
    }

    const btnImportar = document.getElementById('btn-importar-mapa');
    const btnProcessarImportacio = document.getElementById('btn-processar-importacio');

    if (btnImportar && zonaCompartir) {
        btnImportar.onclick = () => {
            if (textIntercanvi) textIntercanvi.value = '';
            zonaCompartir.style.display = 'flex';
        };
    }

    if (btnProcessarImportacio && textIntercanvi) {
        btnProcessarImportacio.onclick = () => {
            const rawText = textIntercanvi.value.trim();
            if (!rawText) return;
            try {
                const dadesImportades = JSON.parse(rawText);
                if (dadesImportades.partitsCreats) {
                    Object.keys(diccionariPartits).forEach(k => delete diccionariPartits[k]);
                    Object.assign(diccionariPartits, dadesImportades.partitsCreats);
                }
                if (dadesImportades.colorsElectorals) {
                    Object.keys(baseDadesColorsElectorals).forEach(k => delete baseDadesColorsElectorals[k]);
                    Object.assign(baseDadesColorsElectorals, dadesImportades.colorsElectorals);
                }
                if (dadesImportades.detallsMunicipis) {
                    Object.keys(baseDadesDetallsMunicipis).forEach(k => delete baseDadesDetallsMunicipis[k]);
                    Object.assign(baseDadesDetallsMunicipis, dadesImportades.detallsMunicipis);
                }
                actualitzarInterficiePartits();
                renderSelectionColors();
                up(null);
                zonaCompartir.style.display = 'none';
                alert("Mapa i paleta de partits importats amb èxit!");
            } catch (err) {
                alert("Error: El text introduït no és vàlid.");
            }
        };
    }
    // 🚀 SENSOR DEL BOTÓ DEL MODE NAVEGACIÓ TERRITORIAL
    const btnExploracio = document.getElementById('btn-toggle-exploracio');
    const areaTaula = document.querySelector('.table-side');
    
    if (btnExploracio) {
        btnExploracio.onclick = () => {
            modeExploracioActiu = !modeExploracioActiu;
            
            // Canviem el text i la il·luminació del botó
            btnExploracio.innerText = modeExploracioActiu ? "ON (Mode Explorar)" : "OFF (Mode Edició)";
            btnExploracio.classList.toggle('mode-exploracio-actiu', modeExploracioActiu);
            
            // Afegim una classe a la taula per reduir la brillantor de les barres electorals
            if (areaTaula) areaTaula.classList.toggle('mapa-congelat-explorant', modeExploracioActiu);
            
            // Forcem el repintat immediat de la malla vectorial
            renderSelectionColors();
        };
    }

	// ==========================================================================
	// MOTOR D'IMPORTACIÓ DINÀMIC MULTI-PARTIT ULTRA-PROTEGIT (CSV)
	// ==========================================================================
	const inputCsvMassiu = document.getElementById('csv-file-input');

	if (inputCsvMassiu) {
		inputCsvMassiu.addEventListener('change', function(e) {
			const arxiuSeleccionat = e.target.files[0]; // Asegurem agafar el primer arxiu
			if (!arxiuSeleccionat) return;

			const lectorFitxers = new FileReader();
			
			lectorFitxers.onload = function(esdeveniment) {
				try {
					let contingutText = esdeveniment.target.result;
					
					// SEGURETAT 1: Eliminem el caràcter invisible BOM de UTF-8 que clava l'Excel
					if (contingutText.startsWith('\uFEFF')) {
						contingutText = contingutText.substring(1);
					}

					// SEGURETAT 2: Trossegem de manera universal per a qualsevol sistema operatiu (Win/Mac/Linux)
					const filesCSV = contingutText.split(/\r?\n|\r/);
					
					if (filesCSV.length < 2) {
						alert("⚠️ Error: El fitxer està buit o no s'ha pogut leer cap línia.");
						return;
					}

					// 1. LLEGIM LA CAPÇALERA (Fila 0)
					const primeralinia = filesCSV[0].trim();
					const capçalera = primeralinia.split(',');
					
					if (capçalera.length < 4) {
						alert("⚠️ Error: El format del CSV no és correcte. Ha de tenir com a mínim les columnes: id, poblacio, ressenya i un partit.");
						return;
					}

					const índexPartits = {};

					// Recorrem les columnes de partits (a partir de la posició 3)
					for (let c = 3; c < capçalera.length; c++) {
						const nomPartitCSV = capçalera[c].trim().replace(/^["']|["']$/g, ''); // Neteja de cometes
						if (!nomPartitCSV) continue;

						let idPartitTrobat = null;
						Object.keys(diccionariPartits).forEach(idP => {
							if (diccionariPartits[idP].nom.toLowerCase() === nomPartitCSV.toLowerCase()) {
								idPartitTrobat = idP;
							}
						});

						// Si el partit és nou, el registrem automàticament
						if (!idPartitTrobat) {
							idPartitTrobat = `partit-dinamic-${nomPartitCSV.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
							
							// Generem un color aleatori vistós i lluminós
							const colorAleatori = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
							
							diccionariPartits[idPartitTrobat] = { 
								nom: nomPartitCSV.toUpperCase(), 
								color: colorAleatori 
							};
						}

						índexPartits[c] = idPartitTrobat;
					}

					// Actualitzem la paleta de botons de la dreta
					if (typeof actualitzarInterficiePartits === 'function') actualitzarInterficiePartits();

					let vilesActualitzades = 0;

					// 2. LLEGIM LES DADES DE CADA MUNICIPI
					for (let i = 1; i < filesCSV.length; i++) {
						const filaNeta = filesCSV[i].trim();
						if (!filaNeta) continue;

						const columnes = filaNeta.split(',');
						const idM = parseInt(columnes[0], 10) - 1; // Columna 0 = ID (ajustat a índex 0)
						
						if (isNaN(idM) || idM < 0 || idM >= 538) continue;

						const dadaPoblacio = parseInt(columnes[1], 10) || 0; // Columna 1 = Població
						const dadaRessenya = columnes[2] ? columnes[2].replace(/"/g, '') : ""; // Columna 2 = Ressenya

						const estructuraVotsLocals = {};
						
						// Inicialitzem tots els partits activats a 0 per a aquest municipi
						Object.keys(diccionariPartits).forEach(idP => estructuraVotsLocals[idP] = 0);

						// Injectem els vots llegits des de les seues columnes dinàmiques
						Object.keys(índexPartits).forEach(colIdx => {
							const idPartit = índexPartits[colIdx];
							const votsPartit = parseInt(columnes[colIdx], 10) || 0;
							estructuraVotsLocals[idPartit] = votsPartit;
						});

						// Guardem la fitxa en memòria
						baseDadesDetallsMunicipis[idM] = {
							vots: estructuraVotsLocals,
							text: dadaRessenya,
							poblacio: dadaPoblacio > 0 ? dadaPoblacio : ""
						};

						// 3. RECOMPTE LOCAL PER AL COLOR DEL MAPA
						let maximVotsCercats = 0;
						let partitGuanyadorLocal = null;

						Object.keys(estructuraVotsLocals).forEach(idPartit => {
							if (estructuraVotsLocals[idPartit] > maximVotsCercats) {
								maximVotsCercats = estructuraVotsLocals[idPartit];
								partitGuanyadorLocal = idPartit;
							}
						});

						if (maximVotsCercats > 0 && partitGuanyadorLocal) {
							baseDadesColorsElectorals[idM] = partitGuanyadorLocal;
						} else {
							delete baseDadesColorsElectorals[idM];
						}

						vilesActualitzades++;
					}

					// 4. REFRESC GENERAL DELS COMANTS VISUALS
					if (typeof renderSelectionColors === 'function') renderSelectionColors();
					if (typeof calcularEscrutiniGlobal === 'function') calcularEscrutiniGlobal();
					if (typeof up === 'function') up(null);

					alert(`🚀 S'han carregat correctament ${vilesActualitzades} municipis!`);

				} catch (error) {
					console.error(error);
					alert("⚠️ S'ha produït un error en processar el contingut del CSV. Revisa el format de les files.");
				}
				
				inputCsvMassiu.value = '';
			};

			lectorFitxers.readAsText(arxiuSeleccionat);
		});
	}

	// ==========================================================================
	// MOTOR GENERADOR DE PLANTILLA CSV AMB NOMS REALS DE MUNICIPIOS
	// ==========================================================================
	const btnGenerarPlantilla = document.getElementById('btn-exportar-plantilla');

	if (btnGenerarPlantilla) {
		btnGenerarPlantilla.onclick = function() {
			// 1. Busquem tots els municipis directament en els vectors del mapa SVG
			const caminsMunicipis = document.querySelectorAll('#election-svg .frag');
			
			// 2. Creem la capçalera afegint la columna "nom"
			let contingutCSV = "id,nom,poblacio,ressenya";
			
			// Injectem de manera automàtica els partits registrats al sistema
			Object.keys(diccionariPartits).forEach(idP => {
				contingutCSV += `,${diccionariPartits[idP].nom}`;
			});
			contingutCSV += "\n";

			// 3. Cas clau: Si el mapa encara no s'ha carregat del tot o falta l'SVG, fem un bucle numèric de reserva
			if (caminsMunicipis.length === 0) {
				for (let i = 1; i <= 538; i++) {
					contingutCSV += `${i},Municipi ${i},0,Sense ressenya`;
					Object.keys(diccionariPartits).forEach(() => { contingutCSV += ",0"; });
					contingutCSV += "\n";
				}
			} else {
				// Mapegem cada municipi real seguint el seu ordre d'ID vectorial
				const llistaOrdenada = new Array(538);

				caminsMunicipis.forEach(path => {
					const mIdx = parseInt(path.getAttribute('data-m'), 10);
					const nomReal = path.getAttribute('data-nom') || `Vila ${mIdx + 1}`;
					
					if (!isNaN(mIdx) && mIdx >= 0 && mIdx < 538) {
						llistaOrdenada[mIdx] = nomReal;
					}
				});

				// Generem el text del CSV ordenat de l'ID 1 al 538 amb la seua identitat
				for (let i = 0; i < 538; i++) {
					const idFila = i + 1;
					const nomPoble = llistaOrdenada[i] || `Vila ${idFila}`;
					
					// Escrivim la informació de control amb el seu nom real
					contingutCSV += `${idFila},"${nomPoble}",0,Sense informació històrica`;
					
					// Deixem les caselles dels partits a 0 per a poder editar-los fàcilment
					Object.keys(diccionariPartits).forEach(() => {
						contingutCSV += ",0";
					});
					contingutCSV += "\n";
				}
			}

			// 4. Llançament i descàrrega automàtica del fitxer texturitzat
			const blobPlantilla = new Blob([contingutCSV], { type: 'text/csv;charset=utf-8;' });
			const enllaçDescarrega = document.createElement('a');
			
			enllaçDescarrega.download = `plantilla_identificada_regne.csv`;
			enllaçDescarrega.href = window.URL.createObjectURL(blobPlantilla);
			enllaçDescarrega.style.display = 'none';
			
			document.body.appendChild(enllaçDescarrega);
			enllaçDescarrega.click();
			document.body.removeChild(enllaçDescarrega);
		};
	}




    actualitzarInterficiePartits();
    renderSelectionColors();
    up();
});

