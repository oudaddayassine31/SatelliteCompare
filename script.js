let map, currentVillage;
let layer1, layer2, layer3, layer4, layer5, layer6;
let sideBySideControl;

const baseMap = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.carto.com/attributions">CARTO</a>'
});

function initMap() {
    map = L.map('map', {
        center: [31.0245, -8.1356],
        zoom: 10,
        layers: [baseMap]
    });
    showFirstLayerSet();
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function ensureLayersRendered() {
    await delay(700);
}

function loadGeoRaster(url) {
    return fetch(url)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => parseGeoraster(arrayBuffer))
        .then(georaster => new GeoRasterLayer({
            georaster: georaster,
            resolution: 256
        }));
}

function updateActiveButton(villageNumber) {
    document.querySelectorAll('.village-controls button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.village-controls button')[villageNumber - 1].classList.add('active');
}

function clearLayers() {
    [layer1, layer2, layer3, layer4, layer5, layer6].forEach(layer => {
        if (layer && map.hasLayer(layer)) {
            map.removeLayer(layer);
        }
    });
}

function updateSideBySideControl(leftLayer, rightLayer) {
    if (sideBySideControl) {
        map.removeControl(sideBySideControl);
    }
    sideBySideControl = L.control.sideBySide(leftLayer, rightLayer).addTo(map);
    map.fitBounds(leftLayer.getBounds());
}

function showFirstLayerSet() {
    updateActiveButton(1);
    Promise.all([
        loadGeoRaster('10300500E4F91800visual11.tif'),
        loadGeoRaster('103001008244DA00-visual21.tif')
    ]).then(async ([layerA, layerB]) => {
        clearLayers();
        layer1 = layerA;
        layer2 = layerB;
        currentVillage = layer1;
        layer1.addTo(map);
        layer2.addTo(map);
        updateSideBySideControl(layer1, layer2);
        await ensureLayersRendered();
    });
}

function showSecondLayerSet() {
    updateActiveButton(2);
    Promise.all([
        loadGeoRaster('10300500E4F91800visual12.tif'),
        loadGeoRaster('103001008244DA00-visual22.tif')
    ]).then(async ([layerC, layerD]) => {
        clearLayers();
        layer3 = layerC;
        layer4 = layerD;
        currentVillage = layer3;
        layer3.addTo(map);
        layer4.addTo(map);
        updateSideBySideControl(layer3, layer4);
        await ensureLayersRendered();
    });
}

function showThirdLayerSet() {
    updateActiveButton(3);
    Promise.all([
        loadGeoRaster('cog_10300500E4F91800visual13.tif'),
        loadGeoRaster('cog_103001008244DA00-visual23.tif')
    ]).then(async ([layerC, layerD]) => {
        clearLayers();
        layer5 = layerC;
        layer6 = layerD;
        currentVillage = layer5;
        layer5.addTo(map);
        layer6.addTo(map);
        updateSideBySideControl(layer5, layer6);
        await ensureLayersRendered();
    });
}

window.onload = initMap;