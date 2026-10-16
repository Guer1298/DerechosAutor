import { spawn } from 'node:child_process';
import path from 'node:path';
import { buildSite, projectRoot } from '../tooling/build.mjs';
import { createStaticServer, listen } from '../tooling/server.mjs';
import { siteConfig } from '../src/config/site.js';
let server;
try {
  await buildSite({ config: { ...siteConfig, origin: process.env.SITE_ORIGIN ?? siteConfig.origin } });
  server=await createStaticServer({root:path.join(projectRoot,'dist')});
  const address=await listen(server,0);
  const child=spawn(process.execPath,['tests/e2e/browser.mjs'],{
    cwd:projectRoot,stdio:'inherit',env:{...process.env,QA_ORIGIN:`http://127.0.0.1:${address.port}`}
  });
  const code=await new Promise((resolve,reject)=>{child.once('error',reject);child.once('exit',resolve);});
  if(code!==0)process.exitCode=1;
} catch(error){console.error(error.message);process.exitCode=1;}
finally {if(server){server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}}
