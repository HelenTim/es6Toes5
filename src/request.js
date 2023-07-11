const TOKEN_NAME = "user_token";
const request = (options) => {
    let { url, method = "get", data, requestType = 1, alreadyFullUrl, notUseToken } = options,
        jwt = Cookie.get(TOKEN_NAME) || "",
        origin = sessionStorage.getItem("origin") || "",
        fullUrl;

    if ((method === "GET" || method === "get") && Object.keys(data).length > 0) url += "?" + qs.stringify(data);

    switch (requestType) {
        case 1:
            fullUrl = `${env.apiHost}${url}`;
            break;

        default:
            fullUrl = `${env.apiHost}${url}`;
            break;
    }

    if (alreadyFullUrl) {
        fullUrl = url;
    }

    if (jwt && !notUseToken) {
        data.token = jwt;
    }
    if (origin) {
        data.origin = origin;
    }

    const requestOptions = {
        method: method,
        url: fullUrl,
        data: data,
    };
    axios.defaults.headers.common[TOKEN_NAME] = Cookies.get(TOKEN_NAME);

    return axios(requestOptions)
        .then((response) => {
            let { status, statusText, data } = response,
                result = {
                    success: true,
                    message: statusText,
                    statusCode: status,
                    ...data,
                };

            if (response.data?.errno == 40068 || response.data?.errno == 40015 || response.data?.errno == 40035) {
                cocoMessage.error("登录过期,请重新登录");

                if (response.data?.errno == 40035) {
                    cocoMessage.info(response.data.errormsg);
                }
                return Promise.resolve({
                    success: false,
                });
            }
            if (status >= 200 && status <= 304 && data.errno <= 0) {
                return Promise.resolve(result);
            } else {
                result.success = false;
                result.message = "";
                return Promise.resolve(result);
            }
        })
        .catch((error) => {
            //错误处理
            cocoMessage.error("网络错误！", 3000);
            return Promise.resolve({
                success: false,
            });
        });
};
