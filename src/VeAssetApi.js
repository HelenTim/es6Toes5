function getFileExtension(filename) {
    const patternFileExtension = /\.([0-9a-z]+)(?:[\?#]|$)/i;
    const match = filename.match(patternFileExtension);
    if (match) {
        return {
            extension: "." + match[1],
            match,
        };
    } else {
        return undefined;
    }
}

class VeAssetApi {
    static TOKEN = undefined;
    static API_DOMAIN = "http://mbjia-local.atvideo.cc";

    // 获取 sts token （保留）
    static API_GET_STS_TOKEN = () => {
        return this.API_DOMAIN + "/veasset/asset/get-sts-token";
    };

    // 创建 asset
    static API_USER_ASSET_CREATE = () => {
        return this.API_DOMAIN + "/veasset/user-asset/create";
    };

    // 更新用户素材
    static API_USER_ASSET_UPDATE = () => {
        return this.API_DOMAIN + "/veasset/user-asset/update";
    };

    // 素材详情
    static API_ASSET_DETAIL = () => {
        return this.API_DOMAIN + "/veasset/asset/detail";
    };

    // 素材详情
    static API_TEMPLATE_ASSET_DETAIL = () => {
        return this.API_DOMAIN + "/veasset/template-asset/detail";
    };

    // 素材列表
    static API_ASSET_LIST = () => {
        return this.API_DOMAIN + "/veasset/asset/list";
    };
    // 素材分类列表
    static API_ASSET_GROUP_LIST = () => {
        return this.API_DOMAIN + "/veasset/asset/group-list";
    };

    // 文字列表
    static API_ASSET_FONT_LIST = () => {
        return this.API_DOMAIN + "/veasset/asset/font-list";
    };

    // 文字列表
    static API_GET_FONT_LIST = () => {
        return this.API_DOMAIN + "/veasset/asset/get-fonts";
    };

    // 素材详情列表
    static API_ASSET_LIST_BY_IDS = () => {
        return this.API_DOMAIN + "/veasset/asset/batch-detail";
    };

    // 获取收藏 getAllCollections

    static API_EGT_ALL_COLLECTIONS = () => {
        return this.API_DOMAIN + "/user/collection/list";
    };

    // 设置素材来源

    static getFileSource() {
        if (window.location.href.indexOf("origin=1") > -1) {
            return 1; // 1688
        }
        if (window.location.href.indexOf("/taobao") > -1 || window.location.href.indexOf("taobao_product_id") > -1) {
            return 4; // 淘宝幕市场
        }
        return undefined;
    }

    /**
     * 设置 api 域名
     *
     *
     */
    static setAPIDomain(url) {
        this.API_DOMAIN = url;
    }

    /**
     * 设置token
     */
    static setToken(token) {
        this.TOKEN = token;
    }

    /**
     * 获取token
     */
    static GET_TOKEN = () => {
        return this.TOKEN;
    };

    // 创建远程素材 （保留）
    static async createRemoteAsset(obj) {
        const api = this.API_USER_ASSET_CREATE();
        const fileSource = this.getFileSource();
        if (typeof fileSource != "undefined") {
            obj.file_source = fileSource;
        }
        let rst = await VeAssetApi.fetch("POST", api, obj);
        if (rst.errno == 0) {
            return rst.data;
        }
        return null;
    }

    /* 上传本地素材    （保留）
     * 上传本地素材
     * 单文件上传时，必须传入前两个参数
     * */
    static async uploadAsset(
        obj,
        file,
        progressCb,
        upLoadName,
        sameOptions // this.getUploadToken的返回值。 批量上传文件时只需要调用一次this.getUploadToken方法即可。
    ) {
        let options = sameOptions ?? (await this.getUploadToken(obj)); // 多文件上传时可以传入sameOptions

        if (!upLoadName) {
            // 单文件上传
            upLoadName = options.file_names[0] + getFileExtension(file.name)?.extension;
        }

        options.refresh_sts_token = this.getUploadToken;
        options.refresh_sts_token_interval = 300000;

        let client = VeUpload.createOSSClient(options);

        let uploadOptions = {
            progress: (progress, cpt, res) => {
                progressCb?.(progress, cpt, res);
            }, // 进度回调， 当前只有分片上传有
            parallel: 2,
            partSize: 1024 * 1024,
            meta: {},
            mime: file.type,
            callback: {
                url: options.callback.callback_url,
                body: options.callback.callback_body,
                contentType: options.callback.content_type,
                customValue: options.callback.custom_value,
            },
        };

        let result = await VeUpload.multipartUploadToAliyunOss(client, options.path_prefix + upLoadName, file, uploadOptions);

        if (result?.status) {
            result.url = options.domain + options.path_prefix + upLoadName;
            return result;
        } else {
            return null;
        }
    }

    static async getDefaultUploadToken() {
        let token = await this.getUploadToken("mbjia_user_file");
        return token;
    }

    // 获取上传 token(保留)
    // uploadtype: mbjia_user_file
    static async getUploadToken(uploadType, fileNumber = 1) {
        const stsUrl = this.API_GET_STS_TOKEN();
        const params = {
            upload_type: uploadType,
            file_num: fileNumber,
        };
        let stsOptions = await VeAssetApi.fetch("POST", stsUrl, params);

        if (stsOptions.errno == 0) {
            return stsOptions.data.token;
        }

        return null;
    }

    /**
     * 获取素材详情（保留）
     *
     * @param options { id : "素材id" }
     *
     */
    static async getAssetDetail(options) {
        const api = this.API_ASSET_DETAIL();
        let ret = await VeAssetApi.fetch("POST", api, options);

        if (ret.errno == 0) {
            return ret.data.asset;
        }

        return null;
    }

    // 保留
    static async fetch(method, url, data) {
        let rsp = await request({ url, method, data, alreadyFullUrl: true, requestType: 1, notUseToken: true });
        return rsp;
    }
}
