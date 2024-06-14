import { getBaseUrl } from './base-url';

export async function getServerHealth(
    apiUrl: string = getBaseUrl() + '/health',
    signal: AbortSignal | undefined = undefined
): Promise<ServerHealth> {
    const res = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache',
        },
        signal
    });
    return await res.json() as ServerHealth;
}

export interface ServerHealth {
    status: string;
    slots_idle: number;
    slots_processing: number;
}
