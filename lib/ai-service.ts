// AI Service for PoetryWorld
// Integrates with Google Gemini API for advanced AI features

export interface PoemGenerationParams {
  topic: string;
  mood?: string;
  style?: 'romantic' | 'classical' | 'modern' | 'tragic' | 'humorous';
  form?: 'free-verse' | 'sonnet' | 'haiku' | 'rhyme-based' | 'limerick';
  length?: 'short' | 'medium' | 'long';
}

export interface PoemComparison {
  poem1: string;
  poem2: string;
  styleDifferences: string;
  themeDifferences: string;
  literaryTechniques: string[];
  analysisScores: {
    depth: number;
    emotion: number;
    clarity: number;
    rhyme: number;
    structure: number;
  };
  similarityScore: number;
  summary: string;
}

export interface WordMeaning {
  word: string;
  definition: string;
  synonyms: string[];
  usage: string[];
  origin: string;
}

export interface ThemeInterpretation {
  mainTheme: string;
  poetPOV: string;
  symbolism: string[];
  emotionalExpression: string;
  importantLines: Array<{
    line: string;
    explanation: string;
  }>;
  simpleSummary: string;
}

class AIService {
  private apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  // Generate a poem based on parameters
  async generatePoem(params: PoemGenerationParams): Promise<string> {
    const prompt = this.buildPoemPrompt(params);
    
    try {
      const response = await this.callGeminiAPI(prompt);
      return response;
    } catch (error) {
      console.error('Error generating poem:', error);
      throw new Error('Failed to generate poem');
    }
  }

  // Compare two poems
  async comparePoems(poem1: string, poem2: string): Promise<PoemComparison> {
    const prompt = `Compare these two poems in detail:

POEM 1:
${poem1}

POEM 2:
${poem2}

Provide a comprehensive comparison including:
1. Style differences
2. Theme differences
3. Literary techniques used in each
4. Analysis scores (0-100) for: depth, emotion, clarity, rhyme, structure
5. Similarity percentage (0-100)
6. Summary of comparative strengths

Format your response as JSON.`;

    try {
      const response = await this.callGeminiAPI(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error comparing poems:', error);
      throw new Error('Failed to compare poems');
    }
  }

  // Get word meaning
  async getWordMeaning(word: string): Promise<WordMeaning> {
    const prompt = `Provide detailed information about the word "${word}":
1. Definition
2. Synonyms (at least 5)
3. Usage examples (at least 3 sentences)
4. Etymology/origin

Format as JSON with keys: word, definition, synonyms, usage, origin`;

    try {
      const response = await this.callGeminiAPI(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error getting word meaning:', error);
      throw new Error('Failed to get word meaning');
    }
  }

  // Interpret poem theme
  async interpretTheme(poem: string): Promise<ThemeInterpretation> {
    const prompt = `Analyze this poem and provide a comprehensive interpretation:

${poem}

Provide:
1. Main theme
2. Poet's point of view
3. Symbolism and hidden meanings (list)
4. Emotional expression
5. Important lines with explanations (at least 3)
6. Simple summary for students

Format as JSON.`;

    try {
      const response = await this.callGeminiAPI(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error interpreting theme:', error);
      throw new Error('Failed to interpret theme');
    }
  }

  // Rewrite poem in different style
  async rewritePoem(poem: string, targetStyle: string): Promise<string> {
    const prompt = `Rewrite this poem in ${targetStyle} style while maintaining its core message:

${poem}

Only return the rewritten poem, nothing else.`;

    try {
      const response = await this.callGeminiAPI(prompt);
      return response;
    } catch (error) {
      console.error('Error rewriting poem:', error);
      throw new Error('Failed to rewrite poem');
    }
  }

  // Detect mood of poem
  async detectMood(poem: string): Promise<string> {
    const prompt = `Analyze the emotional mood/tone of this poem. Provide a single word or short phrase describing the dominant emotion:

${poem}`;

    try {
      const response = await this.callGeminiAPI(prompt);
      return response.trim();
    } catch (error) {
      console.error('Error detecting mood:', error);
      throw new Error('Failed to detect mood');
    }
  }

  // Generate title for poem
  async generateTitle(poem: string): Promise<string[]> {
    const prompt = `Generate 5 perfect, creative titles for this poem:

${poem}

Return only the titles, one per line.`;

    try {
      const response = await this.callGeminiAPI(prompt);
      return response.split('\n').filter(t => t.trim());
    } catch (error) {
      console.error('Error generating titles:', error);
      throw new Error('Failed to generate titles');
    }
  }

  // Enhance vocabulary
  async enhanceVocabulary(word: string): Promise<string[]> {
    const prompt = `Suggest 10 advanced poetic alternatives for the word "${word}" that would work well in poetry. Return only the words, one per line.`;

    try {
      const response = await this.callGeminiAPI(prompt);
      return response.split('\n').filter(w => w.trim());
    } catch (error) {
      console.error('Error enhancing vocabulary:', error);
      throw new Error('Failed to enhance vocabulary');
    }
  }

  // Private helper methods
  private buildPoemPrompt(params: PoemGenerationParams): string {
    let prompt = `Write a beautiful ${params.form || 'free-verse'} poem`;
    
    if (params.topic) prompt += ` about ${params.topic}`;
    if (params.mood) prompt += ` with a ${params.mood} mood`;
    if (params.style) prompt += ` in ${params.style} style`;
    if (params.length) prompt += ` (${params.length} length)`;
    
    prompt += '. Make it emotionally resonant and use vivid imagery. Return only the poem, no explanations.';
    
    return prompt;
  }

  private async callGeminiAPI(prompt: string): Promise<string> {
    // This is a placeholder - you'll need to implement actual API call
    // For now, returning mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('Mock AI response');
      }, 1000);
    });
  }
}

export const aiService = new AIService();
