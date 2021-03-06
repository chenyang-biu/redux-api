export default class ApiClient {
  constructor(baseConfig) {
    this.baseConfig = baseConfig
    this.withBodyMethods.forEach(this.initMethod)
    this.withoutBodyMethods.forEach(this.initMethod)
  }

  baseConfig = {}
  withBodyMethods = ['post', 'patch', 'put']
  withoutBodyMethods = ['get', 'head', 'delete', 'options']

  getReqUrl = urlPath => {
    if (urlPath.startsWith('http')) {
      return urlPath
    }

    return this.baseConfig.baseURL.endsWith('/') && urlPath.startsWith('/')
      ? this.baseConfig.baseURL + urlPath
      : `${this.baseConfig.baseURL}/${urlPath}`
  }

  getReqConfig = (data, type, config) => {
    const reqConfig = {
      method: type,
      ...this.baseConfig,
      ...config,
    }

    if (this.withBodyMethods.includes(type)) {
      reqConfig.body = data
    }

    if (this.baseConfig.headers && config.headers) {
      Object.assign(reqConfig, {
        ...this.baseConfig.headers,
        ...config.headers,
      })
    }

    return reqConfig
  }

  initMethod = type => {
    this[type] = (urlPath, data, config = {}) =>
      fetch(this.getReqUrl(urlPath), this.getReqConfig(data, type, config))
  }
}
