import { Prompt, fetchPrompt } from 'llama-cpp';

export async function loadPrompt<TPrompt extends Prompt>(
    prompt: string
): Promise<TPrompt> {
    const url = `/assets/prompts/${prompt}.json`;
    return await fetchPrompt<TPrompt>(url);
}
