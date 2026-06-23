import https from 'node:https';

const CF_API_TOKEN = process.env.CF_API_TOKEN;
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || 'ee05f70c889cb6f876b9925257e3a2fa';

const PROJECTS = [
  { project: 'delta-ignition', domain: 'delta-ignition.p31ca.org' },
  { project: 'trim-sequence', domain: 'trim-sequence.p31ca.org' },
  { project: 'fleet-status', domain: 'fleet-status.p31ca.org' },
  { project: 'bonding-meatspace', domain: 'bonding.p31ca.org' },
  { project: 'bonding-meatspace', domain: 'www.bonding.p31ca.org' },
  { project: 'bonding-meatspace', domain: 'meatspace.bonding.p31ca.org' },
  { project: 'onboarding-module', domain: 'onboarding-module.p31ca.org' },
  { project: 'storybook', domain: 'storybook.p31ca.org' },
  { project: 'architecture-map', domain: 'architecture-map.p31ca.org' },
];

function cfRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`https://api.cloudflare.com/client/v4${path}`);
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method,
      headers: {
        'Authorization': `Bearer ${CF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    };
    if (data) options.headers['Content-Length'] = Buffer.byteLength(data);

    const req = https.request(options, (res) => {
      let raw = '';
      res.on('data', (chunk) => raw += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(raw));
        } catch (e) {
          resolve(raw);
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function main() {
  if (!CF_API_TOKEN) {
    console.error('CF_API_TOKEN env var is required');
    process.exit(1);
  }

  for (const { project, domain } of PROJECTS) {
    // Try to attach domain
    const res = await cfRequest('POST', `/accounts/${ACCOUNT_ID}/pages/projects/${project}/domains`, { name: domain });
    
    if (res.success) {
      console.log(`✅ ${domain} → ${project} (${res.result.status})`);
    } else if (res.errors?.[0]?.code === 8000018) {
      // Domain already attached somewhere — delete and retry
      console.log(`🔄 ${domain} already attached, clearing and retrying...`);
      const delRes = await cfRequest('DELETE', `/accounts/${ACCOUNT_ID}/pages/projects/${project}/domains/${domain}`);
      if (delRes.success) {
        const retry = await cfRequest('POST', `/accounts/${ACCOUNT_ID}/pages/projects/${project}/domains`, { name: domain });
        if (retry.success) {
          console.log(`✅ ${domain} → ${project} (${retry.result.status})`);
        } else {
          console.error(`❌ ${domain} retry failed:`, retry.errors?.[0]?.message);
        }
      } else {
        console.error(`❌ ${domain} delete failed:`, delRes.errors?.[0]?.message);
      }
    } else if (res.errors?.[0]?.code === 81057) {
      console.log(`🔄 ${domain} already attached`);
    } else {
      console.error(`❌ ${domain} → ${project}:`, res.errors?.[0]?.message || JSON.stringify(res.errors));
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
