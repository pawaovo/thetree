import { UserProfile, AIAnalysisResult } from "../types";

export const generateSelectionAdvice = async (userProfile: UserProfile): Promise<AIAnalysisResult> => {
  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  // Prepare prompt context
  const examSummary = userProfile.exams.map(e => 
    `${e.examName}: Rank ${e.rank}/${e.totalStudents}, Grade Level: ${e.assignedGrade || 'N/A'}. Scores: ${JSON.stringify(e.scores)}`
  ).join('\n');

  const interestStr = userProfile.interestedSubjects.join(', ');
  const majorsStr = userProfile.interestedMajors || "Not specified";
  const careersStr = userProfile.interestedCareers || "Not specified";

  // System Prompt: Define the persona and output format
  const systemPrompt = `
    You are a senior high school career planning mentor in China ("新高考" system).
    Your goal is to analyze student data and provide 5 subject selection combinations.
    
    IMPORTANT OUTPUT RULE:
    - You must output strictly valid JSON.
    - No markdown formatting (no \`\`\`json wrappers).
    - ALL CONTENT MUST BE IN SIMPLIFIED CHINESE (简体中文).
    - SUBJECT NAMES MUST BE IN CHINESE (e.g., 物理, 化学, 生物, 历史, 地理, 政治).
  `;

  // User Prompt: Provide data and specific task
  const userPrompt = `
    Student Profile:
    - Name: ${userProfile.name}
    - Gender: ${userProfile.gender}
    - Holland Code: ${userProfile.hollandCode} (${JSON.stringify(userProfile.hollandScores)})
    - Interests (Subjects): ${interestStr}
    - Interested Majors: ${majorsStr}
    - Interested Careers: ${careersStr}
    - Talents/Self-Description: ${userProfile.specialTalents}
    
    Academic Record:
    ${examSummary}

    Task:
    1. Analyze the fit between personality (Holland), interests, and grades.
    2. Suggest 5 distinctive combinations (focusing on Physics/History split, e.g., 3+1+2 or 3+3).
    3. For each combination, provide:
       - "subjects": A list of 3 elective subjects strictly in Chinese (e.g., ["物理", "化学", "生物"]).
       - "score": A match score (0-100).
       - "reason": A detailed, persuasive analysis in Simplified Chinese (approx. 100-120 words). Explain WHY this fits the student's grades and personality.
       - "path": Possible majors and careers in Simplified Chinese.
    4. Provide a studentSummary in Simplified Chinese.

    Required JSON Structure:
    {
      "studentSummary": "Brief analysis string...",
      "recommendations": [
        {
          "subjects": ["物理", "化学", "生物"],
          "score": 85,
          "reason": "Detailed reason string in Chinese (~100 words)...",
          "path": {
            "majors": {
              "highProb": ["Major1", "Major2"],
              "medProb": ["Major3"]
            },
            "careers": {
              "highRel": ["Career1", "Career2"],
              "potential": ["Career3"]
            }
          }
        }
      ]
    }
  `;

  try {
    // DeepSeek API Call (OpenAI-compatible)
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat", // DeepSeek-V3
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" }, // Enforce JSON output
        temperature: 1.1, // Slightly creative but structured
        max_tokens: 4096,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMsg = `DeepSeek API Error: ${response.status}`;
      try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.error && errorJson.error.message) {
              errorMsg += ` - ${errorJson.error.message}`;
          }
      } catch (e) {
          errorMsg += ` - ${errorText}`;
      }
      throw new Error(errorMsg);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Empty response from DeepSeek AI");
    }

    // Advanced JSON Parsing:
    // Sometimes models add text before the JSON even with json_object mode.
    // We try to extract the JSON object by finding the first '{' and last '}'.
    let jsonString = content.trim();
    
    // Remove Markdown wrappers if present
    jsonString = jsonString.replace(/```json/g, '').replace(/```/g, '');

    // Attempt to find the JSON structure specifically
    const firstBrace = jsonString.indexOf('{');
    const lastBrace = jsonString.lastIndexOf('}');

    if (firstBrace !== -1 && lastBrace !== -1) {
        jsonString = jsonString.substring(firstBrace, lastBrace + 1);
    }

    try {
        return JSON.parse(jsonString) as AIAnalysisResult;
    } catch (parseError) {
        console.error("JSON Parse Error. Raw Content:", content);
        throw new Error("Failed to parse AI response. Please try again.");
    }

  } catch (error) {
    console.error("AI Service Error:", error);
    throw error;
  }
};