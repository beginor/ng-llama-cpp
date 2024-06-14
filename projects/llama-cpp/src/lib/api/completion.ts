import { getBaseUrl } from './base-url';

export function createCompletionOptions(
    params: Partial<CompletionOptions>
): CompletionOptions {
    const defaultOptions = createDefaultOptions();
    Object.assign(defaultOptions, params);
    return defaultOptions;
}

export async function* streamCompletion(
    options: CompletionOptions,
    apiUrl: string = getBaseUrl() + '/completions',
    signal: AbortSignal | undefined = undefined
): AsyncIterable<string> {
    const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(options),
        signal
    });
    if (!options.stream) {
        const json = await res.json() as CompletionFinalResponse;
        yield Promise.resolve(json.content);
    }
    else {
        const reader = res.body!.getReader();
        let done = false;
        let value: Uint8Array | undefined;
        const decoder = new TextDecoder();
        while (!done) {
            ({done, value} = await reader.read());
            const line = decoder.decode(value);
            const prefix = 'data:';
            if (line.startsWith(prefix)) {
                const text = line.substring(prefix.length + 1).trim();
                if (text) {
                    try {
                        const json = JSON.parse(text) as CompletionResponseBase;
                        const content = json.content;
                        yield Promise.resolve(content);
                    }
                    catch (ex) {
                        yield Promise.resolve('');
                        console.error(text);
                        console.error(ex);
                    }
                }
            }
        }
    }
}

function createDefaultOptions(): CompletionOptions {
    return {
        prompt: 'You are a helpful assistant',
        temperature: 0.8,
        dynatemp_range: 0.0,
        dynatemp_exponent: 1.0,
        top_k: 40,
        top_p: 0.95,
        min_p: 0.05,
        n_predict: -1,
        n_keep: 0,
        stream: true,
        stop: [],
        tfs_z: 1.0,
        typical_p: 1.0,
        repeat_penalty: 1.1,
        repeat_last_n: 64,
        penalize_nl: true,
        presence_penalty: 0.0,
        frequency_penalty: 0.0,
        penalty_prompt: null,
        mirostat: 0,
        mirostat_tau: 5.0,
        mirostat_eta: 0.1,
        grammar: undefined,
        json_schema: undefined,
        seed: -1,
        ignore_eos: false,
        logit_bias: [],
        n_probs: 0,
        min_keep: 0,
        image_data: [],
        id_slot: -1,
        cache_prompt: false,
        system_prompt: undefined,
        samplers: [
            'top_k', 'tfs_z', 'typical_p', 'top_p', 'min_p', 'temperature'
        ],
        api_key: undefined,
    };
}

export interface CompletionOptions {
    stream: boolean;
    dynatemp_range: number;
    dynatemp_exponent: number;
    n_predict: number;
    temperature: number;
    stop: string[];
    n_keep: number;
    repeat_last_n: number;
    repeat_penalty: number;
    penalize_nl: boolean;
    top_k: number;
    top_p: number;
    min_p: number;
    tfs_z: number;
    typical_p: number;
    presence_penalty: number;
    frequency_penalty: number;
    penalty_prompt: null | string | number[];
    mirostat: number;
    mirostat_tau: number;
    mirostat_eta: number;
    grammar: string | undefined;
    json_schema: Object | undefined;
    seed: number;
    ignore_eos: boolean;
    logit_bias: [string | number, number][];
    n_probs: number;
    min_keep: number;
    image_data: any[];
    cache_prompt: boolean;
    api_key: string | undefined;
    prompt: string;
    system_prompt: string | undefined;
    id_slot: number;
    samplers: string[];
}

export interface CompletionResponseBase {
    content: string;
    stop: boolean;
    id_slot: number;
}

export interface CompletionProgressResponse extends CompletionResponseBase {
    multimodal: boolean;
}

export interface CompletionFinalResponse extends CompletionResponseBase {
    model: string;
    tokens_predicted: number;
    tokens_evaluated: number;
    generation_settings: GenerationSettings;
    prompt: string;
    truncated: boolean;
    stopped_eos: boolean;
    stopped_word: boolean;
    stopped_limit: boolean;
    stopping_word: string;
    tokens_cached: number;
    timings: Timings;
}

export interface GenerationSettings {
    n_ctx: number;
    n_predict: number;
    model: string;
    seed: number;
    temperature: number;
    dynatemp_range: number;
    dynatemp_exponent: number;
    top_k: number;
    top_p: number;
    min_p: number;
    tfs_z: number;
    typical_p: number;
    repeat_last_n: number;
    repeat_penalty: number;
    presence_penalty: number;
    frequency_penalty: number;
    penalty_prompt_tokens: string[];
    use_penalty_prompt_tokens: boolean;
    mirostat: number;
    mirostat_tau: number;
    mirostat_eta: number;
    penalize_nl: boolean;
    stop: string[];
    n_keep: number;
    n_discard: number;
    ignore_eos: boolean;
    stream: boolean;
    logit_bias: string[],
    n_probs: number;
    min_keep: number;
    grammar: string;
    samplers: string[];
}

export interface Timings {
    prompt_n: number;
    prompt_ms: number;
    prompt_per_token_ms: number;
    prompt_per_second: number;
    predicted_n: number;
    predicted_ms: number;
    predicted_per_token_ms: number;
    predicted_per_second: number;
}
