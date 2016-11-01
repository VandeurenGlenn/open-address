import tunnel from 'tunnel';

export default class TunnelController {
  constructor() {
    var tunnelingAgent = tunnel.httpOverHttp({
      maxSockets: poolSize, // Defaults to 5

      proxy: { // Proxy settings
        host: proxyHost, // Defaults to 'localhost'
        port: proxyPort, // Defaults to 80
        localAddress: localAddress, // Local interface if necessary

        // Basic authorization for proxy server if necessary
        proxyAuth: 'user:password',

        // Header fields for proxy server if necessary
        headers: {
          'User-Agent': 'Node'
        }
      }
    });

    var req = http.request({
      host: 'example.com',
      port: 80,
      agent: tunnelingAgent
    });

  }
}
