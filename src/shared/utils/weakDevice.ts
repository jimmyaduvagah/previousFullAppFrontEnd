export function weakDeviceCheck(device){
    let check = false;

    if (device.platform == "Android") {
        if (device.version == "4.4.2") {
            check = true;
        }

    } else if (device.platform == "iOS") {
        if (device.model == "iPhone3,1" || device.model == "iPhone3,2" || device.model == "iPhone3,3" || device.model == "iPhone4,1") {
            check = true;
        }
    }

    return check;
}