const { generateApi } = require('swagger-typescript-api');
const fs = require('fs');

// example with url
generateApi({
  url: 'http://localhost:3333/explore-json', // url where located swagger schema
})
  .then((sourceFile) => fs.writeFileSync('./src/app/api/Api.ts', sourceFile))
  .catch((e) => console.error(e));
