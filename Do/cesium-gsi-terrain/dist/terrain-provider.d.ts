import { Ellipsoid, TerrainProvider, Event as CEvent, QuantizedMeshTerrainData, HeightmapTerrainData, Credit } from 'cesium';
import ndarray from 'ndarray';
interface GsiTerrainOpts {
    ellipsoid?: Ellipsoid;
}
declare class GsiTerrainProvider {
    martini: any;
    hasWaterMask: boolean;
    hasVertexNormals: boolean;
    credit: Credit;
    ready: boolean;
    readyPromise: Promise<boolean>;
    availability: null;
    errorEvent: CEvent;
    tilingScheme: TerrainProvider['tilingScheme'];
    ellipsoid: Ellipsoid;
    format: string;
    tileSize: number;
    constructor(opts: GsiTerrainOpts);
    getPixels(url: string, type?: string): Promise<ndarray<number>>;
    requestMapboxTile(x: number, y: number, z: number): Promise<HeightmapTerrainData | QuantizedMeshTerrainData>;
    emptyHeightmap(samples: any): HeightmapTerrainData;
    createQuantizedMeshData(x: number, y: number, z: number, tile: any, mesh: any): Promise<HeightmapTerrainData | QuantizedMeshTerrainData>;
    requestTileGeometry(x: number, y: number, z: number): Promise<HeightmapTerrainData | QuantizedMeshTerrainData | undefined>;
    getLevelMaximumGeometricError(level: any): number;
    getTileDataAvailable(x: number, y: number, z: number): boolean;
}
export default GsiTerrainProvider;
