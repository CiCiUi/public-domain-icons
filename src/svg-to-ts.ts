import fs from 'fs';
import { parseSync } from 'svgson';
import svgPath from 'svgpath';
import rimraf from 'rimraf';
import {capitalizeFirstLetter, iconInfoToSvg} from "./utils";
import {IconInfo, IconPathInfo} from "./types";

const svgDir = __dirname + '/../svg';

const svgFiles = fs.readdirSync(svgDir);

const iconInfoList = svgFiles.reduce<IconInfo[]>((acc, filename)=>{
    const fullSvgPath = `${svgDir}/${filename}`;
    const svgContent = fs.readFileSync(fullSvgPath, {encoding: 'utf-8'});

    const svgJson = parseSync(svgContent);
    const viewBox = svgJson.attributes['viewBox'].split(' '),
        width = parseInt(viewBox[2], 10),
        height = parseInt(viewBox[3], 10);

    let ratio = 1, transX = 0, transY = 0;
    if(Math.max(width, height) !== 16) { // need scale
        ratio = 16 / Math.max(width, height);
    }

    const diffWidth = 16 - width * ratio;
    const diffHeight = 16 - height * ratio;
    if(diffWidth > 1)
        transX = diffWidth / 2;
    if(diffHeight > 1)
        transY = diffHeight / 2;

    const iconPathList = svgJson.children.reduce<IconPathInfo[]>((acc, svgTag)=>{
        if(svgTag.name === 'title')
            return acc;

        if(svgTag.name === 'path') {
            let pathData = svgTag.attributes['d'];
            let svgPathObject = svgPath(pathData);
            if(ratio !== 1)
                svgPathObject = svgPathObject.scale(ratio);
            pathData = svgPathObject.translate(transX, transY).round(3).toString();
            acc.push({
                path: pathData,
                fillRule: svgTag.attributes['fill-rule']
            })
        }

        return acc;
    }, []);

    const bareFileName = filename.substr(0, filename.length-4);
    const bareFileNameArray = bareFileName.split(' ');
    const bareNewFileName = bareFileNameArray.map(v=>capitalizeFirstLetter(v)).join('');

    acc.push({
        pathList: iconPathList,
        fillBaseName: bareNewFileName
    });

    return acc;
}, []);

const svgDistDir = __dirname + '/../svgdist';
if(fs.existsSync(svgDistDir))
    rimraf.sync(svgDistDir);
fs.mkdirSync(svgDistDir);

iconInfoList.forEach(iconInfo=>{
    const targetSvgContent = iconInfoToSvg(iconInfo);
    fs.writeFileSync(svgDistDir + '/' + iconInfo.fillBaseName + '.svg', targetSvgContent);
});
