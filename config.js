exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                       (process.env.NODE_ENV === 'production' ?
                            'mongodb://caulds989:Seoul989@ds019976.mlab.com:19976/gameswap' :
                            'mongodb://localhost/gameswap');
exports.PORT = process.env.PORT || 8080;
