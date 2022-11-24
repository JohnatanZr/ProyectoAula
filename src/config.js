const config={
    user: 'johnatan',
    password: '123123',
    server: 'localhost',
    database: 'DesWeb',
    options:{
        trustedConnection: true,
        encrypt: true,
        trustServerCertificate: true,
    },
    port: 1433,
};

module.exports = config;