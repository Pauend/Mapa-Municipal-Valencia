/**
 * ==========================================================================
 * 1. CONFIGURACIÓ DE MEMÒRIA I HISTORIAL GENERAL DEL REGNE
 * ==========================================================================
 */
const dbSel = { 0: null, 1: null, 2: null, 3: null, 4: null };
const baseDadesColorsElectorals = {};
const baseDadesDetallsMunicipis = {};
let idMunicipiEnEdicio = null;

let zoomScale = 1; 
let activeTier = 0;
let colorPartitSeleccionat = 'partit-roig'; 
let mostrarEtiquetesActiu = false;

let modeExploracioActiu = false; // Memòria del interruptor de navegació

const startEvent = window.PointerEvent ? 'pointerdown' : 'mousedown';
const moveEvent  = window.PointerEvent ? 'pointermove' : 'mousemove';
const endEvent   = window.PointerEvent ? 'pointerup'   : 'mouseup';


 

const v = document.getElementById('v');
const canvasMain = document.getElementById('canvas-main');
const tId = document.getElementById('t-id');
const tDetall = document.getElementById('t-detall');

v.scrollLeft = 850;
v.scrollTop = 950;

function syncZoom() { 
    document.getElementById('election-svg').style.transform = `scale(${zoomScale})`; 
}

const diccionariNomsGovernacions = {
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
    'partit-blau': { nom: 'Blau', color: '#3b82f6' },
    'partit-roig': { nom: 'Roig', color: '#de1a00' },
    'partit-verd': { nom: 'Verd', color: '#10b981' },
    'partit-groc': { nom: 'Groc', color: '#eab308' }
};

/**
 * 🎨 MOTOR DE CHROMATISME REGIONAL (A TOTA HORA):
 * Agrupa sectors per la seua comarca mare usant un ton base compartit,
 * però desvia els graus HSL segons el sector local perquè no siguen iguals.
 */
/**
 * 🎨 MOTOR DE CHROMATISME REGIONAL D'ALT CONTORN (SENSE XOCS CHROMÀTICS)
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
    tId.innerText = `Tier ${activeTier}`;
    const g = dbSel[activeTier];
    const targetaEditor = document.getElementById('targeta-editor-municipi');
    const contenidorInputsVots = document.getElementById('contenidor-inputs-vots-locals');
    
    if (g !== null) {
        if (activeTier !== 4) {
            tDetall.innerHTML = activeTier === 0 ? `<strong>Jurisdicció:</strong> Tot el territori foral.` : `<strong>Demarcació Històrica:</strong> Nivell ${activeTier}, ID: ${g}.`;
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
                <strong>Vila / Universitat Reial:</strong> ${nomFinal}<br>
                <strong>Codi Local:</strong> T4_M${g + 1}<br>
                <strong>Població Històrica (Ref):</strong> ${habFixes}<br>
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
        btn.innerText = mostrarEtiquetesActiu ? "ON (Visibles)" : "OFF (Ocults)";
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
 * 5. MOTORS DE SCROLL DIRECTE I ZOOM VECTORIAL MATRICIAL DE CONTORN (VIEWBOX + MÒBIL)
 * ==========================================================================
 */
let isMouseDown = false;
let startX, startY, scrollLeft, scrollTop;
let isStaticClick = true;

// 🚀 Memòria de punters per a pantalles tàctils i gestos de zoom mòbil
let puntersActiusAlMapa = new Map();
let distanciaInicialDits = 0;

// Mides base del fitxer que defineixen la relació d'aspecte original
const viewBoxOriginal = { x: 0, y: 0, w: 1296, h: 1760 }; 
let currentViewBox = { ...viewBoxOriginal };

// --- 5.1 GESTIÓ DEL DESPLAÇAMENT (DRAG / PAN) ---
v.addEventListener(startEvent, (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    
    puntersActiusAlMapa.set(e.pointerId, e);
    
    // Si fan el gest de dos dits (zoom), desactivem el desplaçament d'un sol dit
    if (puntersActiusAlMapa.size > 1) {
        isMouseDown = false;
        return;
    }

    isMouseDown = true;
    isStaticClick = true;
    
    startX = e.clientX;
    startY = e.clientY;
    scrollLeft = v.scrollLeft;
    scrollTop = v.scrollTop;
    
    if (v.setPointerCapture) {
        v.setPointerCapture(e.pointerId);
    }
});

window.addEventListener(moveEvent, (e) => {
    if (puntersActiusAlMapa.has(e.pointerId)) {
        puntersActiusAlMapa.set(e.pointerId, e);
    }

    if (!isMouseDown || puntersActiusAlMapa.size > 1) return;

    const x = e.clientX;
    const y = e.clientY;
    const walkX = (x - startX) * 1.5; 
    const walkY = (y - startY) * 1.5;
    
    if (Math.abs(walkX) > 3 || Math.abs(walkY) > 3) {
        isStaticClick = false; 
    }
    v.scrollLeft = scrollLeft - walkX;
    v.scrollTop = scrollTop - walkY;
    refrescarEtiquetesSobreMapa();
});

const finalitzarInteraccioPunter = (e) => {
    puntersActiusAlMapa.delete(e.pointerId);
    if (puntersActiusAlMapa.size === 0) {
        isMouseDown = false;
    }
};

window.addEventListener(endEvent, finalitzarInteraccioPunter);
window.addEventListener('pointercancel', finalitzarInteraccioPunter);


// --- 5.2 FUNCIÓ INTERNA CENTRAL DE ZOOM (CORREGIDA SENSE DESPLAÇAMENT DE COIXÍ) ---
function executarZoomViewBox(factor, focusClientX, focusClientY) {
    const svgEl = document.querySelector('svg');
    if (!svgEl) return;
    
    const rect = svgEl.getBoundingClientRect();
    const rectV = v.getBoundingClientRect();
    
    // 1. Guardem on està el focus del cursor actual respecte a la finestra '#v'
    const cursorEnFinestraX = focusClientX - rectV.left;
    const cursorEnFinestraY = focusClientY - rectV.top;

    // 2. Trobem on ha caigut el focus del zoom dins de la malla virtual de coordenades de l'SVG
    const mouseX = (focusClientX - rect.left) * (currentViewBox.w / rect.width) + currentViewBox.x;
    const mouseY = (focusClientY - rect.top) * (currentViewBox.h / rect.height) + currentViewBox.y;

    // 3. Calculem les noves dimensions virtuals de la lent del visor
    let nouW = currentViewBox.w * factor;
    let nouH = currentViewBox.h * factor;
    const nivellZoomCalculat = viewBoxOriginal.w / nouW;

    // 4. Apliquem els teus límits originals (0.4x a 40x)
    if (nivellZoomCalculat >= 0.4 && nivellZoomCalculat <= 40) {
        
        // Guardem les mides i posicions físiques de desplaçament ABANS de canviar el zoom
        const scrollAnteriorX = v.scrollLeft;
        const scrollAnteriorY = v.scrollTop;
        
        // Calculem quina posició exacta del mapa real estava mirant l'usuari
        const puntAbsolutMapaX = cursorEnFinestraX + scrollAnteriorX;
        const puntAbsolutMapaY = cursorEnFinestraY + scrollAnteriorY;

        // Actualitzem la caixa virtual del viewBox
        currentViewBox.x = mouseX - (mouseX - currentViewBox.x) * factor;
        currentViewBox.y = mouseY - (mouseY - currentViewBox.y) * factor;
        currentViewBox.w = nouW;
        currentViewBox.h = nouH;
        
        svgEl.setAttribute('viewBox', `${currentViewBox.x} ${currentViewBox.y} ${currentViewBox.w} ${currentViewBox.h}`);
        
        // Ajustem la mida física de l'HTML (el mapa es fa gran o menut realment)
        svgEl.style.width = `${viewBoxOriginal.w * nivellZoomCalculat}px`;
        svgEl.style.height = `${viewBoxOriginal.h * nivellZoomCalculat}px`;
        
        // 🚀 LA SOLUCIÓ AL TEU ERROR: 
        // Calculem on hauria de caure el desplaçament (scroll) de la finestra amb la nova mida
        // perquè el punt que miraves es quede immòbil a la pantalla.
        const nouScrollX = (puntAbsolutMapaX * (1 / factor)) - cursorEnFinestraX;
        const nouScrollY = (puntAbsolutMapaY * (1 / factor)) - cursorEnFinestraY;
        
        // Apliquem el desplaçament corregit immediatament
        v.scrollLeft = nouScrollX;
        v.scrollTop = nouScrollY;
        
        // 🛡️ SEGURETAT EXTRAPROTECTORA: Si en fer-se xicotet, el scroll de la finestra s'ha quedat
        // desajustat fora dels marges reals de l'SVG, forcem el navegador aネットejar valors negatius.
        if (v.scrollLeft < 0) v.scrollLeft = 0;
        if (v.scrollTop < 0) v.scrollTop = 0;
        
        refrescarEtiquetesSobreMapa();
    }
}



// --- 5.3 ZOOM PER A ESCRIPTORI (RODA DEL RATOLÍ) ---
v.addEventListener('wheel', (e) => {
    e.preventDefault();
    let factor = (e.deltaY < 0) ? 0.9 : 1.1;
    executarZoomViewBox(factor, e.clientX, e.clientY);
}, { passive: false });


// --- 5.4 ZOOM PER A MÒBIL (PESSIGAR AMB DOS DITS) ---
v.addEventListener('pointerdown', (e) => {
    if (puntersActiusAlMapa.size === 2) {
        const llistaDits = Array.from(puntersActiusAlMapa.values());
        const dx = llistaDits[0].clientX - llistaDits[1].clientX;
        const dy = llistaDits[0].clientY - llistaDits[1].clientY;
        distanciaInicialDits = Math.sqrt(dx * dx + dy * dy);
    }
});

v.addEventListener('pointermove', (e) => {
    if (puntersActiusAlMapa.size !== 2) return;

    const llistaDits = Array.from(puntersActiusAlMapa.values());
    const dx = llistaDits[0].clientX - llistaDits[1].clientX;
    const dy = llistaDits[0].clientY - llistaDits[1].clientY;
    const distanciaActualDits = Math.sqrt(dx * dx + dy * dy);

    if (distanciaInicialDits > 0) {
        // Trobem el centre del gest dels dos dits a la pantalla per fer-lo servir de focus
        const centreMobilX = (llistaDits[0].clientX + llistaDits[1].clientX) / 2;
        const centreMobilY = (llistaDits[0].clientY + llistaDits[1].clientY) / 2;

        const ratioMobil = distanciaActualDits / distanciaInicialDits;
        
        // Invertim la ràtio per correspondre amb la reducció/ampliació de la caixa de visió
        let factor = 1 + (1 / ratioMobil - 1) * 0.25; 

        executarZoomViewBox(factor, centreMobilX, centreMobilY);
    }
    
    distanciaInicialDits = distanciaActualDits;
});

window.addEventListener(endEvent, (e) => {
    if (puntersActiusAlMapa.size < 2) {
        distanciaInicialDits = 0;
    }
});



v.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    isMouseDown = true;
    isStaticClick = true;
    startX = e.pageX - v.offsetLeft;
    startY = e.pageY - v.offsetTop;
    scrollLeft = v.scrollLeft;
    scrollTop = v.scrollTop;
});

/**window.addEventListener('mousemove', (e) => {
    if (!isMouseDown) return;
    const x = e.pageX - v.offsetLeft;
    const y = e.pageY - v.offsetTop;
    const walkX = (x - startX) * 1.5; 
    const walkY = (y - startY) * 1.5;
    
    if (Math.abs(walkX) > 3 || Math.abs(walkY) > 3) {
        isStaticClick = false; 
    }
    v.scrollLeft = scrollLeft - walkX;
    v.scrollTop = scrollTop - walkY;
    refrescarEtiquetesSobreMapa();
});*/

window.addEventListener('mouseup', () => { isMouseDown = false; });

/*const viewBoxOriginal = { x: 0, y: 0, w: 1296, h: 1760 }; 
let currentViewBox = { ...viewBoxOriginal };

v.addEventListener('wheel', (e) => {
    e.preventDefault();
    const svgEl = document.querySelector('svg');
    if (!svgEl) return;
    
    const rect = svgEl.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) * (currentViewBox.w / rect.width) + currentViewBox.x;
    const mouseY = (e.clientY - rect.top) * (currentViewBox.h / rect.height) + currentViewBox.y;

    let factor = (e.deltaY < 0) ? 0.9 : 1.1;
    let nouW = currentViewBox.w * factor;
    let nouH = currentViewBox.h * factor;
    const nivellZoomCalculat = viewBoxOriginal.w / nouW;

    if (nivellZoomCalculat >= 0.4 && nivellZoomCalculat <= 40) {
        currentViewBox.x = mouseX - (mouseX - currentViewBox.x) * factor;
        currentViewBox.y = mouseY - (mouseY - currentViewBox.y) * factor;
        currentViewBox.w = nouW;
        currentViewBox.h = nouH;
        svgEl.setAttribute('viewBox', `${currentViewBox.x} ${currentViewBox.y} ${currentViewBox.w} ${currentViewBox.h}`);
        refrescarEtiquetesSobreMapa();
    }
}, { passive: false });*/

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
 * calcularEscrutiniGlobal - MOTOR TOPOLÒGIC MULTI-CIRCUMSCRIPCIÓ DESDOBLAT
 * ==========================================================================
 */
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
        svgEl.setAttribute('viewBox', `${currentViewBox.x} ${currentViewBox.y} ${currentViewBox.w} ${currentViewBox.h}`);
        
        svgEl.querySelectorAll('.frag').forEach(el => {
            el.addEventListener('click', (e) => {
                if (isMouseDown) return;
                if (isStaticClick) {
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
                        up(el); // 🌌 SEMPRE OPERATIU: Obre la targeta de dades del lloc a tota hora!
                    }
                    
                    // Actualitzem les il·luminacions i rètols
                    renderSelectionColors();
                }
            });
        });


        const puntSVG = svgEl.createSVGPoint();
        let visorCoordenades = document.getElementById('coordenades-visor');
        if (!visorCoordenades) {
            visorCoordenades = document.createElement('div');
            visorCoordenades.id = 'coordenades-visor';
            Object.assign(visorCoordenades.style, {
                position: 'fixed', bottom: '20px', left: '20px', backgroundColor: 'rgba(15, 23, 42, 0.95)',
                color: '#f8fafc', padding: '8px 16px', borderRadius: '6px', fontFamily: 'monospace',
                fontSize: '13px', zIndex: '999999', pointerEvents: 'none', border: '1px solid #334155', boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
            });
            document.body.appendChild(visorCoordenades);
        }
        svgEl.addEventListener('mousemove', (e) => {
            const matriuPantalla = svgEl.getScreenCTM();
            if (matriuPantalla) {
                puntSVG.x = e.clientX; puntSVG.y = e.clientY;
                const puntRealSVG = puntSVG.matrixTransform(matriuPantalla.inverse());
                visorCoordenades.innerText = `X: ${puntRealSVG.x.toFixed(1)} | Y: ${puntRealSVG.y.toFixed(1)}`;
            }
        });
        svgEl.addEventListener('mouseleave', () => { visorCoordenades.innerText = "X: ---.- | Y: ---.-"; });
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

    actualitzarInterficiePartits();
    renderSelectionColors();
    up();
});

