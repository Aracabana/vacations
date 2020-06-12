// 'https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=bedcbe351dba38c968e2b2e42d5d3040'
import L from '../helpers/leaflet';

export default class Map {
    constructor(latlng, countryCode) {
        this.countryCode = countryCode;
        this.latlng = latlng;
        this.map = '';
        this.styles = {
            fillColor: '#FD8D3C',
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
        this.options = {
            tilesUrls: [
                'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            ],
            init: {
                maxZoom: 18
            }
        }
    }
    async load(mapWrapper) {
        try {
            mapWrapper.hidden = false;
            this.map = L.map(mapWrapper).setView(this.latlng, 6);
            this.options.tilesUrls.forEach(tile => {
                L.tileLayer(tile, this.options.init).addTo(this.map);
            });
            const url = `/api/getGeoJSON?countryCode=${this.countryCode.toUpperCase()}`;
            const responsePolygon = await fetch(url);
            if (responsePolygon.status === 500) {
                throw new Error('Границы для данной страны не найдены');
            }
            const geoJson = await responsePolygon.json();
            const f = L.geoJson(geoJson, {style: this.styles}).addTo(this.map);
            this.map.fitBounds(f.getBounds());
        } catch (err) {
            throw err;
        }
    }
}
