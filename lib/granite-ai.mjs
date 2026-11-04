/**
 * IBM watsonx.ai Granite Integration Module
 * Handles authentication, requests, and response parsing for IBM Granite models
 * 
 * @module lib/granite-ai
 * @requires node-fetch
 */

// Configuration from environment variables
const WATSONX_API_KEY = process.env.WATSONX_API_KEY;
const WATSONX_PROJECT_ID = process.env.WATSONX_PROJECT_ID;
const WATSONX_REGION = process.env.WATSONX_REGION || 'us-south';
const WATSONX_MODEL = process.env.WATSONX_MODEL || 'ibm/granite-13b-instruct-v2';

// API endpoints
const IAM_TOKEN_URL = 'https://iam.cloud.ibm.com/identity/token';
const WATSONX_BASE_URL = `https://${WATSONX_REGION}.ml.cloud.ibm.com/ml/v1`;

// Token cache
let cachedToken = null;
let tokenExpiry = null;

/**
 * Check if Granite is configured
 * @returns {boolean} True if all required environment variables are set
 */
export function isGraniteConfigured() {
  return !!(WATSONX_API_KEY && WATSONX_PROJECT_ID);
}

/**
 * Get IBM Cloud IAM access token
 * Caches token for 50 minutes (expires in 60 minutes)
 * 
 * @returns {Promise<string>} Access token
 * @throws {Error} If authentication fails
 */
async function getAccessToken() {
  // Return cached token if still valid
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  if (!WATSONX_API_KEY) {
    throw new Error('WATSONX_API_KEY environment variable is not set');
  }

  try {
    const response = await fetch(IAM_TOKEN_URL, {
      method: 'POST',
      signal: AbortSignal.timeout(15000),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${WATSONX_API_KEY}`,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get access token: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    cachedToken = data.access_token;
    
    // Token expires in 1 hour, cache for 50 minutes
    tokenExpiry = Date.now() + (50 * 60 * 1000);
    
    console.log('✅ IBM watsonx.ai access token obtained');
    return cachedToken;
  } catch (error) {
    console.error('❌ Error getting IBM watsonx.ai access token:', error.message);
    throw error;
  }
}

/**
 * Generate text using IBM Granite model
 * 
 * @param {string} prompt - The input prompt
 * @param {object} options - Generation options
 * @param {number} [options.maxTokens=500] - Maximum tokens to generate
 * @param {number} [options.temperature=0.7] - Sampling temperature (0-1)
 * @param {number} [options.topP=1] - Nucleus sampling parameter
 * @param {number} [options.topK=50] - Top-k sampling parameter
 * @param {number} [options.repetitionPenalty=1.0] - Repetition penalty
 * @returns {Promise<object>} Generated text and metadata
 * @throws {Error} If generation fails
 */
export async function generateText(prompt, options = {}) {
  if (!isGraniteConfigured()) {
    throw new Error('IBM Granite is not configured. Set WATSONX_API_KEY and WATSONX_PROJECT_ID environment variables.');
  }

  const {
    maxTokens = 500,
    temperature = 0.7,
    topP = 1,
    topK = 50,
    repetitionPenalty = 1.0,
  } = options;

  try {
    // Get access token
    const accessToken = await getAccessToken();

    // Build request
    const requestBody = {
      model_id: WATSONX_MODEL,
      input: prompt,
      parameters: {
        decoding_method: 'greedy',
        max_new_tokens: maxTokens,
        min_new_tokens: 1,
        temperature,
        top_k: topK,
        top_p: topP,
        repetition_penalty: repetitionPenalty,
      },
      project_id: WATSONX_PROJECT_ID,
    };

    console.log(`🤖 Generating text with ${WATSONX_MODEL}...`);

    // Make request
    const response = await fetch(`${WATSONX_BASE_URL}/text/generation`, {
      method: 'POST',
      signal: AbortSignal.timeout(15000),
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Granite API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // Extract result
    const result = data.results[0];
    
    console.log(`✅ Generated ${result.generated_token_count} tokens`);
    
    return {
      text: result.generated_text,
      inputTokens: result.input_token_count,
      outputTokens: result.generated_token_count,
      stopReason: result.stop_reason,
      model: data.model_id,
      timestamp: data.created_at,
    };
  } catch (error) {
    console.error('❌ Error generating text with Granite:', error.message);
    throw error;
  }
}

/**
 * Build prompt for content suggestions
 * 
 * @param {Array} competitorContent - Array of competitor content objects
 * @param {Array} ourContent - Array of our content objects
 * @param {Array} signals - Array of market signal objects
 * @returns {string} Formatted prompt
 */
export function buildContentSuggestionsPrompt(competitorContent, ourContent, signals) {
  return `You are a Product Marketing Manager analyzing competitive content.

COMPETITOR CONTENT:
${competitorContent.map((c, i) => `${i + 1}. ${c.competitor}: "${c.title}" - ${c.summary}`).join('\n')}

OUR CONTENT:
${ourContent.map((c, i) => `${i + 1}. "${c.title}" - ${c.summary}`).join('\n')}

MARKET SIGNALS:
${signals.map((s, i) => `${i + 1}. ${s.source}: ${s.summary}`).join('\n')}

TASK:
Identify 5 specific content gaps we should fill to compete effectively.

For each gap, provide:
1. Content Topic (specific and actionable)
2. Target Audience (who needs this content)
3. Key Differentiators (what makes our angle unique)
4. Recommended Format (blog, whitepaper, video, etc.)
5. Priority Level (High/Medium/Low)
6. Rationale (why this content matters now)

Format your response as JSON:
{
  "suggestions": [
    {
      "topic": "...",
      "audience": "...",
      "differentiators": ["...", "..."],
      "format": "...",
      "priority": "High|Medium|Low",
      "rationale": "..."
    }
  ]
}`;
}

/**
 * Build prompt for PMM action recommendations
 * 
 * @param {Array} signals - Array of market signal objects
 * @param {object} productInfo - Product information object
 * @param {Array} competitorActivities - Array of competitor activity objects
 * @returns {string} Formatted prompt
 */
export function buildPMMActionsPrompt(signals, productInfo, competitorActivities) {
  return `You are a Product Marketing Manager analyzing market signals.

PRODUCT INFORMATION:
- Product: ${productInfo.name}
- Category: ${productInfo.category}
- Key Strengths: ${productInfo.strengths.join(', ')}
- Target Audience: ${productInfo.audience}

MARKET SIGNALS:
${signals.map((s, i) => `${i + 1}. ${s.source}: ${s.summary} (Sentiment: ${s.sentiment})`).join('\n')}

COMPETITOR ACTIVITIES:
${competitorActivities.map((a, i) => `${i + 1}. ${a.competitor}: ${a.activity}`).join('\n')}

TASK:
Recommend the top 5 PMM actions we should take based on these signals.

For each action, provide:
1. Action (specific and actionable, e.g., "Create comparison guide")
2. Rationale (why this action matters)
3. Target Audience (who benefits)
4. Expected Impact (High/Medium/Low)
5. Effort Required (High/Medium/Low)
6. Priority Score (1-10)
7. Recommended Assets (what to create)

Format your response as JSON:
{
  "actions": [
    {
      "action": "...",
      "rationale": "...",
      "audience": "...",
      "impact": "High|Medium|Low",
      "effort": "High|Medium|Low",
      "priority": 9,
      "assets": ["...", "..."]
    }
  ]
}`;
}

/**
 * Parse JSON response from Granite
 * Handles markdown code blocks and extracts JSON
 * 
 * @param {string} text - Response text from Granite
 * @returns {object} Parsed JSON object
 * @throws {Error} If JSON parsing fails
 */
export function parseGraniteJSON(text) {
  try {
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || 
                     text.match(/```\n([\s\S]*?)\n```/) ||
                     [null, text];
    
    const jsonText = jsonMatch[1] || text;
    return JSON.parse(jsonText.trim());
  } catch (error) {
    console.error('❌ Error parsing Granite JSON response:', error.message);
    console.error('Response text:', text);
    throw new Error('Failed to parse Granite response as JSON');
  }
}

/**
 * Calculate cost of API call
 * 
 * @param {number} inputTokens - Number of input tokens
 * @param {number} outputTokens - Number of output tokens
 * @returns {object} Cost breakdown
 */
export function calculateCost(inputTokens, outputTokens) {
  const INPUT_COST_PER_1K = 0.0005;  // $0.0005 per 1K input tokens
  const OUTPUT_COST_PER_1K = 0.0015; // $0.0015 per 1K output tokens
  
  const inputCost = (inputTokens / 1000) * INPUT_COST_PER_1K;
  const outputCost = (outputTokens / 1000) * OUTPUT_COST_PER_1K;
  
  return {
    inputCost,
    outputCost,
    totalCost: inputCost + outputCost,
    inputTokens,
    outputTokens,
  };
}

/**
 * Test Granite connection
 * Used for diagnostics and setup verification
 * 
 * @returns {Promise<object>} Test results
 */
export async function testConnection() {
  try {
    console.log('🧪 Testing IBM Granite connection...');
    
    if (!isGraniteConfigured()) {
      return {
        success: false,
        error: 'Granite is not configured. Set WATSONX_API_KEY and WATSONX_PROJECT_ID.',
      };
    }

    const result = await generateText('What is IBM Db2 Warehouse?', {
      maxTokens: 50,
    });

    const cost = calculateCost(result.inputTokens, result.outputTokens);

    console.log('✅ Granite connection test successful');
    
    return {
      success: true,
      model: result.model,
      inputTokens: result.inputTokens,
      outputTokens: result.outputTokens,
      cost: cost.totalCost,
      response: result.text.substring(0, 100) + '...',
    };
  } catch (error) {
    console.error('❌ Granite connection test failed:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Made with Bob
