import {IconInfo, IconPathInfo} from "./types";

export function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function iconPathInfoToPath(iconPathInfo: IconPathInfo): string {
    if(iconPathInfo.fillRule)
        return `<path d="${iconPathInfo.path}" fill-rule="${iconPathInfo.fillRule}" />`;
    else
        return `<path d="${iconPathInfo.path}" />`;
}

export function iconInfoToSvg(iconInfo: IconInfo): string {
    const pathString = iconInfo.pathList.map(pathInfo => iconPathInfoToPath(pathInfo));
    return `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="1em" height="1em" viewBox="0 0 16 16">${pathString}</svg>`;
}