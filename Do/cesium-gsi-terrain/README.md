<img src='./img/mtfuji.png'>

# GsiTerrainProvider

Arranged [https://github.com/davenquinn/cesium-martini](davenquinn/cesium-martini) for GSI-terrain.

Cesium で国土地理院の標高タイルを用いた地形表現を行うためのモジュール

## usage

```sh
npm install cesium-gsi-terrain
```

```javascript
import GsiTerrainProvider from 'cesium-gsi-terrain';

const viewer = new Viewer(canvas.value!, {
    terrainProvider: new GsiTerrainProvider({}),
});
```
