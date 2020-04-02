interface ReqObj {
    url: string
    method?: 'GET' | 'POST',
    data?: any
    headers?: { [key: string]: string }
    json?: boolean
    timeout?: number
}

namespace Utils {

    export const REQHOST = 'http://10.102.140.38:3101';
    // export const REQHOST = 'https://m.t.ly.com';
    export let Version = ''; // apk 直接赋值
    export let Channel = ''; // iqy tt apk 直接赋值
    export let isTest = typeof jsb == 'undefined';

    /**
     * HTTP类接口请求，默认走get请求，如果需要其他请求类型，通过options对象传值
     * @param {object} obj
     */
    export async function fetchHTTP(obj: ReqObj): Promise<any> {

        let { url,method = 'GET',headers = {},data = {},json = true,timeout = 10000 } = obj;

        if (method == 'POST') {
            if (!headers['Content-Type']) {
                headers['Content-Type'] = 'application/json';
                data = JSON.stringify(data);
            }
        } else {
            url = url + (/\?/.test(url) ? '&' : '?') + Date.now();
        }

        let xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.timeout = timeout;
        xhr.responseType = json ? 'json' : 'text';
        headers['game-token'] = Date.now() + '';
        for (let k in headers) {
            xhr.setRequestHeader(k, headers[k]);
        }
        xhr.send();

        return new Promise(res =>{
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                    let response = xhr.responseType == 'json' ? xhr.response : xhr.responseText;
                    res(response);
                }
            };
        });
    }

    // 获取统一配置
    export async function tcconfig() {
        let re = await fetchHTTP({
            // url: `${REQHOST}/lvyou/common/tcConfig?key=game_idiom_config`
            url: `http://10.102.140.38:4600/lvyou/common/tcConfig?key=game_idiom_config`
        });
        if (re && re.result) return re.result;
        return 'fetch config err';
    }

    export function localStorage(key): any // get
    export function localStorage(key, value): 'ok' // set
    export function localStorage(key: string, value?: any) {
        if (value !== undefined) {

            if (typeof value == 'object') value = JSON.stringify(value);

            cc.sys.localStorage.setItem(key, value);
            return 'ok';
        } else {
            let result = cc.sys.localStorage.getItem(key);
            try {
                result = JSON.parse(result);
            } catch (error) { }
            return result;
        }
    }

    export function cleanLocalStorage(key: string, all?: boolean) : 'ok'
    export function cleanLocalStorage(key: string, all?: boolean) {

        if (all) {
            cc.sys.localStorage.clear();
        } else {
            cc.sys.localStorage.removeItem(key);
        }

        return 'ok'
    }

    /**
     * es6 padLeft
     * @param  {number} length
     * @param  {} char=''
     * @param  {string} result
     */
    export function padStar(length: number, char = ' ', result: string): string {
        while (result.length < length) {
            result = char + result;
        }

        return result;
    }

    /**
     * 向安卓原生发送消息
     * @param  {number} fnName
     * @param  {any} args
     * @param  {boolean} needCB 是否需要promise回来
     */
    export function send2Android(nativefnName, args, needCB = false): Promise<any> {

        if(!Array.isArray(args)) args = [args];

        return new Promise(function (res, rej) {

            if (isTest) {
                return res('');
            }

            if (needCB) {
                let fnName = 'accept_native' + '_' +(new Date().getTime()) + '_' + nativefnName;
                args.push(fnName);
                window[fnName] = (msg) => {
                    res(msg);
                    delete window[fnName];
                };
            }

            let sign = args.map(v => {
                if (typeof v == 'number') {
                    return /\d\.\d/.test(v.toString()) ? 'I' : 'F';
                } else if (typeof v == 'string') {
                    return 'Ljava/lang/String;';
                } else if (typeof v == 'boolean') {
                    return 'Z';
                }
            });

            // 向原生发送请求
            jsb.reflection.callStaticMethod('com/delicacy/puzzle/NativeAndroid', nativefnName, `(${sign.join('')})V`, ...args);
        });
    }

    /**
     * express 状态下必传 expressOpt.width & (expressOpt.top | expressOpt.bottom)
     * expressOpt.width 为 0 时 宽度为整个屏幕
     *
     * video | fullscreen 时 expressOpt.loadingWrapper 为父框架
     *
     */
    export function showAdv(type: 'express', expressOpt: { width: number, top: number, height?: number }): Promise<string>
    export function showAdv(type: 'video' | 'fullscreen', expressOpt?): Promise<string>
    export function showAdv(type, expressOpt?) {
        if ((type == 'video' || type == 'fullscreen') && expressOpt && expressOpt.loadingWrapper) {
            // let advLoading = new AdvLoading();
            // let wrapper = expressOpt.loadingWrapper;
            // let count = 0;

            // while (wrapper.parent != null || count > 50) {
            //     count++;
            //     wrapper = wrapper.parent;
            // }

            // wrapper.addChild(advLoading);

            // delete expressOpt.loadingWrapper;
        }

        if (expressOpt && !expressOpt.height) expressOpt.height = 0;
         // expressOpt.advType = toggleAdv(type);
        return send2Android('showAdv', JSON.stringify(Object.assign({ type }, expressOpt)), true);
    }
    export function closeAdv(type: 'express') {
        send2Android('closeAdv', JSON.stringify({ type }));
        return 'ok';
    }

    // 提示版本更新
    export async function checkUpdate() {

        let _conf = await tcconfig();

        if (Version != _conf.version) {
            send2Android('updateAPK', JSON.stringify({
                packageName: 'gameidiom.apk',
                packagePath: 'https://m.ly.com/vanke/gameidiom.apk'
            }));
        }
    }

    /**
     * 加载图片资源，可以是远程的可以是本地resources文件夹中的，依靠 filePath 是否 http 开头判断
     * load resource
     *
     * @export
     * @param {*} filePath 资源地址
     * @param {*} [type] 资源类型
     * @returns {Promise<any>}
     */
    export function ccLoaderRes(filePath, type?): Promise<any> {
        return new Promise(res => {

            let cb = (err, asset) => res(asset);

            if (/^http/.test(filePath)) {
                cc.loader.load({url: filePath}, cb);
            } else {
                if (type) {
                    cc.loader.loadRes(filePath, type, cb);
                } else {
                    cc.loader.loadRes(filePath, cb);
                }
            }
        });
    }

    /**
     * load resource
     *
     * @export
     * @param {*} imgUrl 图片资源url
     * @returns {Promise<cc.SpriteFrame>}
     */
    export async function ccLoaderImg(imgUrl): Promise<cc.SpriteFrame> {
        let texture = await ccLoaderRes(imgUrl);
        return new cc.SpriteFrame(texture);
    }

    /**
     * 加载圆形头像
     *
     * @export
     * @param {*} pNode 父级定位元素（最好是空的）
     * @param {*} url 图片url
     */
    export async function renderPhoto(pNode, url) {

        let imgNode = new cc.Node();
        let sp = imgNode.addComponent(cc.Sprite);
        sp.spriteFrame = await ccLoaderImg(url);
        sp.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        imgNode.width = pNode.width;
        imgNode.height = pNode.height;
        pNode.addChild(imgNode);

        let mask = new cc.Node();
        let mask_node = mask.addComponent(cc.Mask);
        mask.parent = pNode;
        imgNode.parent = mask;
        mask.x = 0;
        mask.y = 0;
        mask.width = pNode.width;
        mask.height = pNode.height;
        mask_node.type = cc.Mask.Type.ELLIPSE;
    }

    // rgb to hex
    function rgbToHex(r, g, b){
        var hex = ((r<<16) | (g<<8) | b).toString(16);
        return "#" + new Array(Math.abs(hex.length-7)).join("0") + hex;
    }

    // hex to rgb
    function hexToRgb(hex){
        var rgb = [];
        for(var i=1; i<7; i+=2){
            rgb.push(parseInt("0x" + hex.slice(i,i+2)));
        }
        return rgb;
    }

    // 计算渐变过渡色
    export function gradient(startColor,endColor,step){
        // 将 hex 转换为rgb
        let sColor = hexToRgb(startColor);
        let eColor = hexToRgb(endColor);

        // 计算R\G\B每一步的差值
        let rStep = (eColor[0] - sColor[0]) / step;
        let gStep = (eColor[1] - sColor[1]) / step;
        let bStep = (eColor[2] - sColor[2]) / step;

        let gradientColorArr = [];
        for(let i = 0; i < step; i++){
            // 计算每一步的hex值
            gradientColorArr.push(rgbToHex(parseInt(rStep*i+sColor[0]),parseInt(gStep*i+sColor[1]),parseInt(bStep*i+sColor[2])));
        }
        return gradientColorArr;
    }

    export function random(num: number) {
        return Math.floor((Math.random() * num));
    }

    export function getPosMinMax(node: cc.Node) {
        return {
            xMin: node.x - node.width / 2,
            xMax: node.x + node.width / 2,
            yMin: node.y - node.height / 2,
            yMax: node.y + node.height / 2,
        }
    }
}

export default Utils;

