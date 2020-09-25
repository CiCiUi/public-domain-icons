"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var svgson_1 = require("svgson");
var svgpath_1 = __importDefault(require("svgpath"));
var rimraf_1 = __importDefault(require("rimraf"));
var utils_1 = require("./utils");
var svgDir = __dirname + '/../svg';
var svgFiles = fs_1.default.readdirSync(svgDir);
var iconInfoList = svgFiles.reduce(function (acc, filename) {
    var fullSvgPath = svgDir + "/" + filename;
    var svgContent = fs_1.default.readFileSync(fullSvgPath, { encoding: 'utf-8' });
    var svgJson = svgson_1.parseSync(svgContent);
    var viewBox = svgJson.attributes['viewBox'].split(' '), width = parseInt(viewBox[2], 10), height = parseInt(viewBox[3], 10);
    var ratio = 1, transX = 0, transY = 0;
    if (Math.max(width, height) !== 16) { // need scale
        ratio = 16 / Math.max(width, height);
    }
    var diffWidth = 16 - width * ratio;
    var diffHeight = 16 - height * ratio;
    if (diffWidth > 1)
        transX = diffWidth / 2;
    if (diffHeight > 1)
        transY = diffHeight / 2;
    var iconPathList = svgJson.children.reduce(function (acc, svgTag) {
        if (svgTag.name === 'title')
            return acc;
        if (svgTag.name === 'path') {
            var pathData = svgTag.attributes['d'];
            var svgPathObject = svgpath_1.default(pathData);
            if (ratio !== 1)
                svgPathObject = svgPathObject.scale(ratio);
            pathData = svgPathObject.translate(transX, transY).round(3).toString();
            acc.push({
                path: pathData,
                fillRule: svgTag.attributes['fill-rule']
            });
        }
        return acc;
    }, []);
    var bareFileName = filename.substr(0, filename.length - 4);
    var bareFileNameArray = bareFileName.split(' ');
    var bareNewFileName = bareFileNameArray.map(function (v) { return utils_1.capitalizeFirstLetter(v); }).join('');
    acc.push({
        pathList: iconPathList,
        fullBaseName: bareNewFileName,
        rawName: bareFileName
    });
    return acc;
}, []);
var svgDistDir = __dirname + '/../svgdist';
if (fs_1.default.existsSync(svgDistDir))
    rimraf_1.default.sync(svgDistDir);
fs_1.default.mkdirSync(svgDistDir);
iconInfoList.forEach(function (iconInfo) {
    var targetSvgContent = utils_1.iconInfoToSvg(iconInfo);
    fs_1.default.writeFileSync(svgDistDir + '/' + iconInfo.fullBaseName + '.svg', targetSvgContent);
});
var iconNameMap = iconInfoList.reduce(function (acc, iconInfo) {
    acc[iconInfo.fullBaseName] = iconInfo;
    return acc;
}, {});
fs_1.default.writeFileSync(svgDistDir + '/public-icons.ts.template', "const iconMap: Record<string, IconInfo> = " + JSON.stringify(iconNameMap, null, 4) + ";\nexport {\n    iconMap\n};\n");
