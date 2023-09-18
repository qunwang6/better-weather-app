import {apiKey} from './script.js';
import * as L from "../../node_modules/leaflet/dist/leaflet-src.esm.js";

const zoomLvl = 9;

export function setMap(Id, lat, lon, type) {
    // Define Esri Layer
    let esri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Powered by Esri.',
        maxZoom: zoomLvl,
        className: 'esri-layer'
    });

    type === true ? type = 'precipitation_new' : type = 'clouds_new';

    // Define Open Weather Map Layer (precipitation)
    let owm = L.tileLayer(`https://tile.openweathermap.org/map/${type}/{z}/{x}/{y}.png?appid=${apiKey}`, {
        maxZoom: zoomLvl,
        className: 'owm-layer'
    });

    // Render Map
    let map = L.map(Id, {
        center: [lat, lon],
        zoom: zoomLvl,
        minZoom: zoomLvl,
        maxZoom: zoomLvl,
        zoomControl: false,
        scrollWheelZoom: false,
        dragging: false,
        boxZoom: false,
        interactive: false,
        layers: [esri, owm]
    });

    // Define map marker icon
    var markerIcon = L.icon({
        iconUrl: 'images/icons/map-marker-alt.svg',
        iconSize: [40, 40],
        iconAnchor: [20, 40]
    });

    // Add marker to map
    L.marker([lat, lon], { icon: markerIcon }).addTo(map);
}