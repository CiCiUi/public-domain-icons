"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iconInfoToSvg = exports.iconPathInfoToPath = exports.capitalizeFirstLetter = void 0;
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
exports.capitalizeFirstLetter = capitalizeFirstLetter;
function iconPathInfoToPath(iconPathInfo) {
    if (iconPathInfo.fillRule)
        return "<path d=\"" + iconPathInfo.path + "\" fill-rule=\"" + iconPathInfo.fillRule + "\" />";
    else
        return "<path d=\"" + iconPathInfo.path + "\" />";
}
exports.iconPathInfoToPath = iconPathInfoToPath;
function iconInfoToSvg(iconInfo) {
    var pathString = iconInfo.pathList.map(function (pathInfo) { return iconPathInfoToPath(pathInfo); });
    return "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"currentColor\" width=\"1em\" height=\"1em\" viewBox=\"0 0 16 16\">" + pathString + "</svg>";
}
exports.iconInfoToSvg = iconInfoToSvg;
