// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require('@nrwl/next/plugins/with-nx');

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  env: {
    SERVER_URL: process.env.SERVER_URL,
    SERVER_PORT: process.env.SERVER_PORT,
    MAPBOX_TOKEN: process.env.MAPBOX_TOKEN 
  }
};

module.exports = withNx(nextConfig);
