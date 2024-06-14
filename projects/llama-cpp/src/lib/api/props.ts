import { getBaseUrl } from './base-url';
import { GenerationSettings } from './completion';

export async function getServerProps(
    apiUrl: string = getBaseUrl() + '/props',
    signal: AbortSignal | undefined = undefined
): Promise<ServerProps> {
    const res = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache',
        },
        signal
    });
    return await res.json() as ServerProps;
}

export interface ServerProps {
    user_name: string;
    assistant_name: string;
    default_generation_settings: GenerationSettings;
    total_slots: number;
}
