// OSS() 函数来自于 ali-oss-sdk:https://help.aliyun.com/document_detail/94440.html?spm=a2c4g.125572.0.0.6c92147esJHa9X
class VeUpload {
    static createOSSClient(options) {
        let setting = {
            // yourRegion填写Bucket所在地域。以华东1（杭州）为例，yourRegion填写为oss-cn-hangzhou。
            region: options.region,
            // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
            accessKeyId: options.access_key_id,
            accessKeySecret: options.access_key_secret,
            // 从STS服务获取的安全令牌（SecurityToken）。
            stsToken: options.security_token,
            // 填写Bucket名称。
            bucket: options.bucket,

            timeout: 1000 * 60 * 10,
        };

        if (options.refresh_sts_token) {
            (setting.refreshSTSToken = options.refresh_sts_token),
                (setting.refreshSTSTokenInterval = options.refresh_sts_token_interval ? options.refresh_sts_token_interval : 30000);
        }

        return new OSS(setting);
    }

    // 分片上传
    static async multipartUploadToAliyunOss(client, fileName, data, options) {
        try {
            const result = await client.multipartUpload(fileName, data, options);
            return {
                status: true,
                file_name: fileName,
                result: result,
            };
        } catch (err) {
            console.log(err);
            return {
                status: false,
                file_name: fileName,
            };
        }
    }
}
