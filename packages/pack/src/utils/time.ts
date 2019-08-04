/**
 * 获取当前时间 hh:mm:ss
 */
const getTime = (): string => {
    const now = new Date();
    let hour: number | string = now.getHours(),
        minute: number | string = now.getMinutes(),
        second: number | string = now.getSeconds();

    if (hour < 10) {
        hour = '0' + '' + hour;
    }
    if (minute < 10) {
        minute = '0' + '' + minute;
    }
    if (second < 10) {
        second = '0' + '' + second;
    }
    return `${hour}:${minute}:${second}`;
};

export default getTime;
