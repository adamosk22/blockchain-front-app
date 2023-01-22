var defaultTarget = 'https://api.football-data.org/';
module.exports = [
{
   context: ['/v1/**'],
   target: defaultTarget,
   changeOrigin: true,
}
];