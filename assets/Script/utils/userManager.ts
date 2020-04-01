import Utils from './index';

export interface WXMEMINFO {
    city: string
    country: string
    headimgurl: string
    language: string
    nickname: string
    openid: string
    privilege: string[]
    province: string
    sex: number // 1 男
    unionid: string
}

namespace UserManager {

    export let WXMemInfo: WXMEMINFO;
    export let DeviceId: string = ''; // 设备id Utils中拿
    export let UserId: string = ''; // 用户id
    export let NickName: string = ''; // 昵称
    export let HeadImg: string = ''; // 头像
    export let HighestLevel: number = 0; // 关卡
    export let UserGrade: number = 0; // 排名
    export let UserGradeName: string = ''; // 更新时间
    export let HouseGrade: number = 1; // 房屋等级
    export let HouseGradeName: number = 0; // 房屋等级排名
    export let TotalGold: number = 0; // 金币数
    export let Power: number = 0; // 体力
    export let AnswerQuantity: number = 0; //剩余提示数
    export let IsBindingWeChatGold: number = 0; // 是否绑定过微信

    export async function initUserInfo() {
        let result = await Utils.fetchHTTP({ url: `${Utils.REQHOST}/vanke/gameidiom/toService?fn=GetIdiomUserInfo&userId=${UserId}` });
        this.NickName = result.NickName; // 昵称
        this.HeadImg = result.HeadImg; // 头像
        this.HighestLevel = result.HighestLevel; // 关卡
        this.UserGrade = result.UserGrade; // 排名
        this.UserGradeName = result.UserGradeName; // 更新时间
        this.HouseGrade = result.HouseGrade; // 房屋等级
        this.HouseGradeName = result.HouseGradeName; // 房屋等级排名
        this.TotalGold = result.TotalGold; // 金币数
        this.Power = result.Power; // 体力
        this.AnswerQuantity = result.AnswerQuantity; // 剩余提示数
        this.IsBindingWeChatGold = result.IsBindingWeChatGold; // 是否绑定过微信

        // 先设置一下等级
        Utils.localStorage('current_level', this.UserGrade || 1);

        if (result.OpenId) {
            WXMemInfo = {
                city: '',
                country: '',
                province: '',
                language: '',
                privilege: [],
                headimgurl: result.HeadImg,
                nickname: result.NickName,
                openid: result.OpenId,
                sex: result.Sex,
                unionid: result.UnionId
            };
            Utils.localStorage('wxMemInfoSync', true);
        }
    }

    export async function regDeviceId() {

        let localDeviceId = Utils.localStorage('DeviceId');
        let localUserId = Utils.localStorage('UserId');

        if (localDeviceId && localDeviceId == DeviceId && localUserId) { // 已注册用户
            UserId = localUserId;

        } else { // 未注册游客
            Utils.localStorage('DeviceId', DeviceId);

            let re = await Utils.fetchHTTP({
                url: `${Utils.REQHOST}/vanke/gameidiom/toService?fn=TouristsLogin&deviceId=${DeviceId}`
            });

            if (re.IsSuccess && re.UserId) {
                Utils.localStorage('UserId', re.UserId);
                UserId = re.UserId;
            }
        }

        initUserInfo();

        // 检测微信状态
        WXMemInfo = Utils.localStorage('WXMemInfo');
        if (DeviceId && WXMemInfo && !Utils.localStorage('wxMemInfoSync')) {
            wxMemInfoSync();
        }
    }

    export function loginWX(): Promise<WXMEMINFO> {

        if (Utils.isTest) {

            WXMemInfo = {
                city: "Suzhou"
                , country: "CN"
                , headimgurl: "http://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83erUN2gWl3HFkqeGC8cWXr5srjqn164lTboX1dfxhSfeB0pibW1K9USQCOM4jrIZKqjicR714WLY2FhQ/132"
                , language: "zh_CN"
                , nickname: "min伦子"
                , openid: "osoh9wC7gOmPEyBV2u8gyL-I1zvo"
                , privilege: []
                , province: "Jiangsu"
                , sex: 1
                , unionid: "o00oO6Iz7ic6GUg9H9LPYL_SNnwI"
            };

            return wxMemInfoSync().then(re => {
                if (!re.IsSuccess) {
                    WXMemInfo = null;
                }
                return WXMemInfo;
            });
        } else {
            return Utils.send2Android('loginWX', '', true).then(async (code) => { // 接下来的请求交给plus站点

                let result = await Utils.fetchHTTP({
                    url: `${Utils.REQHOST}/vanke/gameidiom/oauth?code=${code}&deviceId=${DeviceId}&userId=${UserId}`
                });

                if (result && result.nickname) {
                    WXMemInfo = result;
                    let bindStatus = await wxMemInfoSync();
                    if (!bindStatus.IsSuccess) {
                        WXMemInfo = null;
                    }
                }

                return WXMemInfo;
            });
        }
    }

    async function wxMemInfoSync() {

        let bindStatus = await Utils.fetchHTTP({
            url: `${Utils.REQHOST}/vanke/gameidiom/toService?fn=UserLogin`,
            method: 'POST',
            data: Object.assign({ deviceId: DeviceId }, WXMemInfo)
        });

        if (bindStatus && bindStatus.IsSuccess) {
            Utils.localStorage('wxMemInfoSync', true);
            Utils.localStorage('WXMemInfo', WXMemInfo);
        } else {
            Utils.localStorage('wxMemInfoSync', false);
            Utils.closeAdv('express');
            // game.utils.GameUtils.popTips(bindStatus.Message);
        }

        return bindStatus;
    }


    // 分享到微信、朋友圈
	export function share2WX(targetScene: 1 | 2) {
		if (!WXMemInfo) {
			loginWX();
		} else {
			// let renderTexture: egret.RenderTexture = new egret.RenderTexture();
			// renderTexture.drawToTexture(this.PosterGroup);
            // let base64Str = renderTexture.toDataURL('image/png', new egret.Rectangle(0, 0, 750, 1334));
            let base64Str = '';
            Utils.send2Android('share2WX', JSON.stringify({
				base64Str: base64Str.replace('data:image/png;base64,', ''),
				targetScene
			}))
		}
	}


    // public get TipNum(): number {
    //     let tipNum = Utils.localStorage('TipNum');
    //     if (tipNum === "" || tipNum === null) {
    //         if (this.HighestLevel == 0) {
    //             tipNum = "5";
    //         } else {
    //             tipNum = "0";
    //         }
    //     }
    //     return parseInt(tipNum);
    // }

    // public set TipNum(value: number) {
    //     Utils.localStorage('TipNum', value.toString());
    // }
}

export default UserManager;
