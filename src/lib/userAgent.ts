import { UAParser } from 'ua-parser-js';

export function getUserAgentDetails(userAgent: string) {
    const parser = new UAParser(userAgent);
    const device = parser.getDevice();
    const os = parser.getOS();
    const browser = parser.getBrowser();

    let deviceType = 'Unknown Device';
    if (device.model) {
        deviceType = `${device.vendor || ''} ${device.model}`.trim();
    } else if (device.type === 'mobile') {
        deviceType = 'Mobile Device';
    } else if (device.type === 'tablet') {
        deviceType = 'Tablet';
    } else if (device.type === 'smarttv') {
        deviceType = 'Smart TV';
    } else if (!device.type && !device.model) {
        deviceType = os.name || 'Desktop';
    }

    return {
        device: deviceType,
        platform: `${os.name} ${os.version}` || 'Unknown Platform',
        browser: `${browser.name} ${browser.version}` || 'Unknown Browser',
    };
}
