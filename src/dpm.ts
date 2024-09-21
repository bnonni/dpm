import { Logger } from './utils/logger.js';
import { Resolution, ResolveContext } from './utils/types.js';
import { fetchResource } from './utils/utils.js';

/**
 * resolve is a built-in hook that allows you to intercept and modify the resolution of a module specifier.
 * Function that takes in a  (i.e. an import path) and detects a DMI, converts to a DRL and fetches the resource.
 * @param specifier either normal code import or DMI (e.g. did:dht:web5/api/0.0.1)
 * @param context pre-defined argument required for the resolve hook
 * @param defaultResolve pre-defined argument required for the resolve hook
 * @returns a promise that resolves to a Resolution object
 */
export async function resolve(
  specifier: string,
  context: ResolveContext,
  defaultResolve: Function
): Promise<Resolution> {
  if (specifier && specifier.startsWith('@did:dht:')) {
    Logger.log('DMI detected! Resolving', specifier);
    const [did, name, version] = specifier.split('/') ?? [];
    Logger.log('DMI: did', did);
    Logger.log('DMI: name', name);
    Logger.log('DMI: version', version);
    if(!(did && name && version)) {
      throw new Error('DMI resolution failed: invalid DMI format' + specifier);
    }
    Logger.log('did, name, version', did, name, version);
    await fetchResource(did.replace('@', ''), name, version);
    Logger.log('DPM resolved DMI => specifier', specifier);
    // index.js
  }
  console.log('resolve => specifier, context, defaultResolve', specifier, context, defaultResolve);
  return defaultResolve(specifier, context, defaultResolve);
}

export async function load(url: string, context: any, defaultLoad: Function) {
  if (url.includes('did:dht')) {
    Logger.log('DMI detected! Loading', url);
  }
  return defaultLoad(url, context, defaultLoad);
}