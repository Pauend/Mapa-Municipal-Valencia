/**
 * ==========================================================================
 * CONFIGURACIÓ DE MEMÒRIA I HISTORIAL GENERAL
 * ==========================================================================
 */
const totalUnitatsPerTier = { 0: 1, 1: 5, 2: 42, 3: 86, 4: 542 };
const baseDadesSeleccions = { 0: null, 1: null, 2: null, 3: null, 4: null };

let activeTierId = 0; 
let zoomLevel = 1;

const visorFons = document.getElementById('v');
const infoTierId = document.getElementById('t-id');
const caixaDetallsText = document.getElementById('t-detall');

const llistaNomsMunicipis = [
    "Vila de Morella", "Vila de Vinaròs", "Vila de Catí", "Vila de Benicarló",
    "Vila d'Albocàsser", "Castell i Vila de Peníscola", "Vila d'Alcalà de Xivert", "Vila de Torreblanca"
];

function actualitzarPanellDades() {
    infoTierId.innerText = `Tier ${activeTierId}`;
    const grupId = baseDadesSeleccions[activeTierId];
    
    if (grupId !== null) {
        if (activeTierId === 0) {
            caixaDetallsText.innerHTML = `<strong>Jurisdicció:</strong> Tot el Regne Foral unitari sencer.<br><strong>Estatus del vot:</strong> Enfosquits els 542 municipis alhora.`;
        } else if (activeTierId === 1) {
            caixaDetallsText.innerHTML = `<strong>Governació General Històrica:</strong> ID_G${grupId}<br><strong>Estat:</strong> S'ha marcat 1 de les 5 governacions del Regne, fusionant els seus municipis.`;
        } else if (activeTierId === 2) {
            caixaDetallsText.innerHTML = `<strong>Demarcació Comarcal:</strong> ID_C${grupId}<br><strong>Estat:</strong> S'ha marcat 1 de les 42 comarques, agrupant els seus municipis natius.`;
        } else if (activeTierId === 3) {
            caixaDetallsText.innerHTML = `<strong>Subcomarca / Sector:</strong> ID_S${grupId}<br><strong>Estat:</strong> S'ha marcat 1 de les 86 subdivisions de detall de la imatge.`;
        } else if (activeTierId === 4) {
            caixaDetallsText.innerHTML = `<strong>Vila / Universitat Reial:</strong> ${llistaNomsMunicipis[grupId] || "Municipi Real Nº " + (grupId + 1)}<br><strong>Jurisdicció Local:</strong> T4_M${grupId + 1}<br><strong>Estat:</strong> 1 municipi independent de la vida real seleccionat de forma unívoca.`;
        }
    } else {
        caixaDetallsText.innerText = "Cap element o demarcació seleccionada en aquest nivell de mapa.";
    }
}

function aplicarColorsSeleccio() {
    const mapSvg = document.getElementById('election-svg');
    mapSvg.querySelectorAll('.frag').forEach(path => path.classList.remove('sel'));
    
    const grupId = baseDadesSeleccions[activeTierId];
    if (grupId === null) return;

    mapSvg.querySelectorAll('.frag').forEach(path => {
        let esUnElementDelGrup = false;
        if (activeTierId === 0) esUnElementDelGrup = true;
        else if (activeTierId === 1) esUnElementDelGrup = (parseInt(path.getAttribute('data-g'), 10) === grupId);
        else if (activeTierId === 2) esUnElementDelGrup = (parseInt(path.getAttribute('data-c'), 10) === grupId);
        else if (activeTierId === 3) esUnElementDelGrup = (parseInt(path.getAttribute('data-s'), 10) === grupId);
        else if (activeTierId === 4) esUnElementDelGrup = (parseInt(path.getAttribute('data-m'), 10) === grupId);

        if (esUnElementDelGrup) path.classList.add('sel');
    });
}

function chg(valorTierSeleccionat) { 
    activeTierId = parseInt(valorTierSeleccionat, 10); 
    aplicarColorsSeleccio(); 
    actualitzarPanellDades(); 
}

/**
 * ==========================================================================
 * GESTIÓ DE LA VIEWBOX NATIVA (SENSE CONFLICTES DE SCROLL CSS)
 * ==========================================================================
 */
const viewBoxOriginal = { x: 0, y: 0, w: 1296, h: 1760 }; 
let currentViewBox = { ...viewBoxOriginal };

const mapSvg = document.getElementById('election-svg');
if (mapSvg) {
    mapSvg.setAttribute('viewBox', `${currentViewBox.x} ${currentViewBox.y} ${currentViewBox.w} ${currentViewBox.h}`);
}

/**
 * ==========================================================================
 * MOTOR ARROSSEGAMENT (PANNING FLUID DIRECTE SOBRE LA VIEWBOX)
 * ==========================================================================
 */
let isMouseDown = false;
let startMouseX, startMouseY, startViewBoxX, startViewBoxY;
let isStaticClick = true; 

visorFons.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    const svgEl = document.getElementById('election-svg');
    if (!svgEl) return;

    isMouseDown = true;
    isStaticClick = true;
    
    startMouseX = e.clientX;
    startMouseY = e.clientY;
    startViewBoxX = currentViewBox.x;
    startViewBoxY = currentViewBox.y;
});

window.addEventListener('mousemove', (e) => {
    if (!isMouseDown) return;
    const svgEl = document.getElementById('election-svg');
    if (!svgEl) return;
    
    const rect = svgEl.getBoundingClientRect();
    const deltaX = (e.clientX - startMouseX) * (currentViewBox.w / rect.width);
    const deltaY = (e.clientY - startMouseY) * (currentViewBox.h / rect.height);
    
    if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
        isStaticClick = false; 
    }
    
    currentViewBox.x = startViewBoxX - deltaX;
    currentViewBox.y = startViewBoxY - deltaY;
    svgEl.setAttribute('viewBox', `${currentViewBox.x} ${currentViewBox.y} ${currentViewBox.w} ${currentViewBox.h}`);
});

window.addEventListener('mouseup', () => { isMouseDown = false; });

/**
 * ==========================================================================
 * MOTOR DE ZOOM VECTORIAL INTEL·LIGENT (FINS A SCALE 40 SENSE RESTRICCIONS)
 * ==========================================================================
 */
visorFons.addEventListener('wheel', (e) => {
    e.preventDefault();
    const svgEl = document.getElementById('election-svg');
    if (!svgEl) return;
    
    const rect = svgEl.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) * (currentViewBox.w / rect.width) + currentViewBox.x;
    const mouseY = (e.clientY - rect.top) * (currentViewBox.h / rect.height) + currentViewBox.y;

    let factor = (e.deltaY < 0) ? 0.9 : 1.1; 
    let nouW = currentViewBox.w * factor;
    let nouH = currentViewBox.h * factor;

    zoomLevel = viewBoxOriginal.w / nouW;

    // LÍMIT REAL DE ZOOM: Permet acostar-se fins a un 4.000% reals
    if (zoomLevel >= 0.4 && zoomLevel <= 40) {
        currentViewBox.x = mouseX - (mouseX - currentViewBox.x) * factor;
        currentViewBox.y = mouseY - (mouseY - currentViewBox.y) * factor;
        currentViewBox.w = nouW;
        currentViewBox.h = nouH;

        svgEl.setAttribute('viewBox', `${currentViewBox.x} ${currentViewBox.y} ${currentViewBox.w} ${currentViewBox.h}`);
    }
}, { passive: false });

/**
 * ==========================================================================
 * CAPTURA DE CLIC ELECTORAL
 * ==========================================================================
 */
if (mapSvg) {
    mapSvg.querySelectorAll('.frag').forEach(pathElement => {
        pathElement.addEventListener('click', (e) => {
            if (isMouseDown) return; 
            if (isStaticClick) {
                e.stopPropagation();
                
                const valM = parseInt(pathElement.getAttribute('data-m'), 10);
                const valS = parseInt(pathElement.getAttribute('data-s'), 10);
                const valC = parseInt(pathElement.getAttribute('data-c'), 10);
                const valG = parseInt(pathElement.getAttribute('data-g'), 10);
                
                let grupClicatId = 0;
                if (activeTierId === 0) grupClicatId = 0;
                else if (activeTierId === 1) grupClicatId = valG;
                else if (activeTierId === 2) grupClicatId = valC;
                else if (activeTierId === 3) grupClicatId = valS;
                else if (activeTierId === 4) grupClicatId = valM;

                if (baseDadesSeleccions[activeTierId] === grupClicatId) {
                    baseDadesSeleccions[activeTierId] = null;
                } else {
                    baseDadesSeleccions[activeTierId] = grupClicatId;
                }

                aplicarColorsSeleccio();
                actualitzarPanellDades();
            }
        });
    });
}

actualitzarPanellDades();
