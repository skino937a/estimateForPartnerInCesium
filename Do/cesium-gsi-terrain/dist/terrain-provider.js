"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cesium_1 = require("cesium");
// @ts-ignore
var get_pixels_1 = __importDefault(require("get-pixels"));
// @ts-ignore
var martini_1 = __importDefault(require("@mapbox/martini"));
function gsiTerrainToGrid(png) {
    var gridSize = png.shape[0] + 1;
    var terrain = new Float32Array(gridSize * gridSize);
    var tileSize = png.shape[0];
    // decode terrain values
    for (var y = 0; y < tileSize; y++) {
        for (var x = 0; x < tileSize; x++) {
            var yc = y;
            var r = png.get(x, yc, 0);
            var g = png.get(x, yc, 1);
            var b = png.get(x, yc, 2);
            if (r === 128 && g === 0 && b === 0) {
                terrain[y * gridSize + x] = 0;
            }
            else {
                terrain[y * gridSize + x] =
                    r >= 128
                        ? r * 655.36 + g * 2.56 + b * 0.01 + -167772.16
                        : r * 655.36 + g * 2.56 + b * 0.01;
            }
        }
    }
    // backfill right and bottom borders
    for (var x = 0; x < gridSize - 1; x++) {
        terrain[gridSize * (gridSize - 1) + x] =
            terrain[gridSize * (gridSize - 2) + x];
    }
    for (var y = 0; y < gridSize; y++) {
        terrain[gridSize * y + gridSize - 1] =
            terrain[gridSize * y + gridSize - 2];
    }
    return terrain;
}
var GsiTerrainProvider = /** @class */ (function () {
    // @ts-ignore
    function GsiTerrainProvider(opts) {
        var _a;
        this.hasWaterMask = false;
        this.hasVertexNormals = false;
        this.credit = new cesium_1.Credit('地理院タイル');
        this.availability = null;
        this.errorEvent = new cesium_1.Event();
        this.tileSize = 256;
        this.martini = new martini_1.default(this.tileSize + 1);
        this.ready = true;
        this.readyPromise = Promise.resolve(true);
        this.errorEvent.addEventListener(console.log, this);
        this.ellipsoid = (_a = opts.ellipsoid) !== null && _a !== void 0 ? _a : cesium_1.Ellipsoid.WGS84;
        this.format = 'png';
        this.tilingScheme = new cesium_1.WebMercatorTilingScheme({
            numberOfLevelZeroTilesX: 1,
            numberOfLevelZeroTilesY: 1,
            ellipsoid: this.ellipsoid,
        });
    }
    GsiTerrainProvider.prototype.getPixels = function (url, type) {
        if (type === void 0) { type = ''; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        get_pixels_1.default(url, type, function (err, array) {
                            if (err != null)
                                reject(err);
                            resolve(array);
                        });
                    })];
            });
        });
    };
    GsiTerrainProvider.prototype.requestMapboxTile = function (x, y, z) {
        return __awaiter(this, void 0, void 0, function () {
            var mx, err, url, pxArray, terrain, tile, mesh, err_1, v;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mx = this.tilingScheme.getNumberOfYTilesAtLevel(z);
                        err = this.getLevelMaximumGeometricError(z);
                        url = "https://cyberjapandata.gsi.go.jp/xyz/dem_png/" + z + "/" + x + "/" + y + ".png";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.getPixels(url)];
                    case 2:
                        pxArray = _a.sent();
                        terrain = gsiTerrainToGrid(pxArray);
                        tile = this.martini.createTile(terrain);
                        // get a mesh (vertices and triangles indices) for a 10m error
                        console.log("Error level: " + err);
                        mesh = tile.getMesh(err);
                        return [4 /*yield*/, this.createQuantizedMeshData(x, y, z, tile, mesh)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        err_1 = _a.sent();
                        v = Math.max(32 - 4 * z, 4);
                        return [2 /*return*/, this.emptyHeightmap(v)];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    GsiTerrainProvider.prototype.emptyHeightmap = function (samples) {
        return new cesium_1.HeightmapTerrainData({
            buffer: new Uint8Array(Array(samples * samples).fill(0)),
            width: samples,
            height: samples,
        });
    };
    GsiTerrainProvider.prototype.createQuantizedMeshData = function (x, y, z, tile, mesh) {
        return __awaiter(this, void 0, void 0, function () {
            var err, skirtHeight, xvals, yvals, heightMeters, northIndices, southIndices, eastIndices, westIndices, ix, vertexIx, px, py, scalar, xv, yv, maxHeight, minHeight, heights, tileRect, tileCenter, cosWidth, ellipsoidHeight, occlusionHeight, scaledCenter, horizonOcclusionPoint, orientedBoundingBox, boundingSphere, triangles, quantizedVertices;
            return __generator(this, function (_a) {
                err = this.getLevelMaximumGeometricError(z);
                skirtHeight = err * 5;
                xvals = [];
                yvals = [];
                heightMeters = [];
                northIndices = [];
                southIndices = [];
                eastIndices = [];
                westIndices = [];
                for (ix = 0; ix < mesh.vertices.length / 2; ix++) {
                    vertexIx = ix;
                    px = mesh.vertices[ix * 2];
                    py = mesh.vertices[ix * 2 + 1];
                    heightMeters.push(tile.terrain[py * (this.tileSize + 1) + px]);
                    if (py == 0)
                        northIndices.push(vertexIx);
                    if (py == this.tileSize)
                        southIndices.push(vertexIx);
                    if (px == 0)
                        westIndices.push(vertexIx);
                    if (px == this.tileSize)
                        eastIndices.push(vertexIx);
                    scalar = 32768 / this.tileSize;
                    xv = px * scalar;
                    yv = (this.tileSize - py) * scalar;
                    xvals.push(xv);
                    yvals.push(yv);
                }
                maxHeight = Math.max.apply(this, heightMeters);
                minHeight = Math.min.apply(this, heightMeters);
                heights = heightMeters.map(function (d) {
                    if (maxHeight - minHeight < 1)
                        return 0;
                    return (d - minHeight) * (32767 / (maxHeight - minHeight));
                });
                tileRect = this.tilingScheme.tileXYToRectangle(x, y, z);
                tileCenter = cesium_1.Cartographic.toCartesian(cesium_1.Rectangle.center(tileRect));
                cosWidth = Math.cos(tileRect.width / 2);
                ellipsoidHeight = maxHeight / this.ellipsoid.maximumRadius;
                occlusionHeight = (1 + ellipsoidHeight) / cosWidth;
                scaledCenter = cesium_1.Ellipsoid.WGS84.transformPositionToScaledSpace(tileCenter);
                horizonOcclusionPoint = new cesium_1.Cartesian3(scaledCenter.x, scaledCenter.y, occlusionHeight);
                orientedBoundingBox = null;
                if (tileRect.width < cesium_1.Math.PI_OVER_TWO + cesium_1.Math.EPSILON5) {
                    // @ts-ignore
                    orientedBoundingBox = cesium_1.OrientedBoundingBox.fromRectangle(tileRect, minHeight, maxHeight);
                    // @ts-ignore
                    boundingSphere = cesium_1.BoundingSphere.fromOrientedBoundingBox(orientedBoundingBox);
                }
                else {
                    // If our bounding rectangle spans >= 90º, we should use the entire globe as a bounding sphere.
                    boundingSphere = new cesium_1.BoundingSphere(cesium_1.Cartesian3.ZERO, 
                    // radius (seems to be max height of Earth terrain?)
                    6379792.481506292);
                }
                triangles = new Uint16Array(mesh.triangles);
                // @ts-ignore
                // If our tile has greater than ~1º size
                if (tileRect.width > 0.02) {
                    // We need to be able to specify a minimum number of triangles...
                    return [2 /*return*/, this.emptyHeightmap(64)];
                }
                quantizedVertices = new Uint16Array(__spreadArrays(xvals, yvals, heights));
                // SE NW NE
                // NE NW SE
                return [2 /*return*/, new cesium_1.QuantizedMeshTerrainData({
                        minimumHeight: minHeight,
                        maximumHeight: maxHeight,
                        quantizedVertices: quantizedVertices,
                        indices: triangles,
                        // @ts-ignore
                        boundingSphere: boundingSphere,
                        // @ts-ignore
                        orientedBoundingBox: orientedBoundingBox,
                        // @ts-ignore
                        horizonOcclusionPoint: horizonOcclusionPoint,
                        westIndices: westIndices,
                        southIndices: southIndices,
                        eastIndices: eastIndices,
                        northIndices: northIndices,
                        westSkirtHeight: skirtHeight,
                        southSkirtHeight: skirtHeight,
                        eastSkirtHeight: skirtHeight,
                        northSkirtHeight: skirtHeight,
                        childTileMask: 14,
                    })];
            });
        });
    };
    GsiTerrainProvider.prototype.requestTileGeometry = function (x, y, z) {
        return __awaiter(this, void 0, void 0, function () {
            var mapboxTile, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.requestMapboxTile(x, y, z)];
                    case 1:
                        mapboxTile = _a.sent();
                        return [2 /*return*/, mapboxTile];
                    case 2:
                        err_2 = _a.sent();
                        console.log(err_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    GsiTerrainProvider.prototype.getLevelMaximumGeometricError = function (level) {
        var levelZeroMaximumGeometricError = cesium_1.TerrainProvider.getEstimatedLevelZeroGeometricErrorForAHeightmap(this.tilingScheme.ellipsoid, 65, this.tilingScheme.getNumberOfXTilesAtLevel(0));
        // Scalar to control overzooming
        // also seems to control zooming for imagery layers
        var scalar = 4;
        return levelZeroMaximumGeometricError / (1 << level);
    };
    GsiTerrainProvider.prototype.getTileDataAvailable = function (x, y, z) {
        return z <= 14;
    };
    return GsiTerrainProvider;
}());
exports.default = GsiTerrainProvider;
