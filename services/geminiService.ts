
import { GoogleGenAI } from "@google/genai";
import { GenerationParams } from "../types";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateFloralCelebrationImages = async (
  base64Image: string,
  mimeType: string,
  params: GenerationParams
): Promise<string[]> => {
  // 修复 RPC 500 错误：确保使用系统支持的确切模型名称
  // 'gemini-2.5-flash-image-artistic' 是 UI 上的逻辑标识，但在 API 调用时应映射为有效模型
  const activeModel = 'gemini-2.5-flash-image';
  const isArtisticMode = (params.model as string) === 'gemini-2.5-flash-image-artistic';

  const sizeValue = params.size;
  const isNoModel = params.composition === 'none';
  
  // 针对尺寸的逻辑修正
  let sizeRelativeDesc = "";
  if (sizeValue <= 30) {
    sizeRelativeDesc = isNoModel 
      ? "a small, dainty arrangement (approx 25cm in diameter), acting as a delicate centerpiece, placed gracefully on a surface, in scale with small items like keys or a cup"
      : "small and dainty (approx 25cm), held delicately with one or two hands, looking compact, precious, and easily portable";
  } else if (sizeValue <= 45) {
    sizeRelativeDesc = "medium-sized, a balanced and standard celebratory floral arrangement";
  } else if (sizeValue <= 60) {
    sizeRelativeDesc = "large, luxurious and voluminous floral statement, capturing attention";
  } else {
    sizeRelativeDesc = "spectacular giant bouquet, massive in scale, nearly covering the surface it is on or the person holding it";
  }

  const sizePromptPart = `SIZE ACCURACY: The bouquet size must be ${sizeRelativeDesc}. Maintain realistic proportions relative to the surrounding environment and objects.`;

  const primaryInstruction = "PRIMARY MANDATE: The floral arrangement in this photo MUST be a 100% VISUAL REPLICA of the uploaded image. Replicate the EXACT flower species, color tones, and wrapping style. Do not invent new flower types.";
  const artisticInstruction = isArtisticMode ? "STYLE UPGRADE: Enhance artistic composition, cinematic lighting, and rich professional color grading. Soft film-like textures." : "";

  const sceneDescriptions: Record<string, string> = {
    'cafe': "a trendy aesthetic cafe, sunlit wooden tables, minimalist coffee shop vibe.",
    'dessert_shop': "a boutique dessert shop with pastel colors, glass displays of cute cakes.",
    'restaurant': "a luxury western restaurant, warm romantic ambient lighting, white tablecloth.",
    'bar': "a chic modern lounge bar with artistic cocktails and sophisticated urban nightlife lighting.",
    'chinese_vip': "a luxurious private VIP room in a high-end Chinese restaurant, large round table with lazy susan, elegant traditional decor.",
    'western_vip': "an exclusive private room in a fine-dining Western restaurant, long candlelit table, premium crystal glasses and silverware.",
    'ktv_vip': "a high-end luxury KTV private suite, stylish modern sofa, ambient LED decorative lighting, sleek marble table.",
    'bar_vip': "a premium private booth of a luxury bar, dim sophisticated lighting, marble tabletop, high-end spirit bottles in background.",
    'flower_shop_zone': "a beautifully curated photo zone inside a boutique flower shop, surrounded by buckets of fresh blooms and artistic floral displays.",
    'car_interior': "inside a high-end small family car, soft leather seats, looking out of the window with warm natural light, the flowers are on the seat or held by the model.",
    'southeast_asian': "a tropical-themed restaurant with lush greenery and warm exotic wood decor.",
    'fusion': "a refined minimalist fusion restaurant with modern artistic decor.",
    'garden': "an outdoor luxury garden terrace, natural daylight, soft bokeh of blooming plants.",
    'school': "a beautiful modern university campus with clean architectural backgrounds.",
    'qilou': "historic Qilou street, vintage Lingnan architecture, nostalgic southern Chinese urban vibe."
  };

  const styleDescriptions: Record<string, string> = {
    'balletcore': "wearing a ballet-inspired outfit, soft pink ribbon, tulle skirt, graceful youthful look.",
    'coquette': "wearing a coquette style dress with bows and lace, ultra-feminine 18-year-old girl aesthetic.",
    'varsity': "wearing a vintage American varsity jacket and a mini pleated skirt.",
    'tech_girl': "wearing a cool tech-chic minimalist outfit, silver accessories.",
    'cottagecore': "wearing a vintage floral milkmaid dress, romantic countryside aesthetic.",
    'pure_minimalist': "pure 'Plain Water' look, clean white aesthetic, natural youthful skin.",
    'preppy': "preppy academy style, blazer and school-girl skirt.",
    'dopamine': "bright dopamine color outfit, vibrant tones.",
    'mori_girl': "Mori Girl style, earth-toned linen fabrics, soft ethereal look.",
    'relaxed': "effortless relaxed chic, oversized knitwear, cozy vibe.",
    'y2k': "trendy Y2K aesthetic, Gen Z energy.",
    'soft_girl': "sweet soft girl look, pastel colors.",
    'elegant': "a sophisticated silk slip dress or elegant evening gown.",
    'vintage': "90s vintage film aesthetic, retro color grading.",
    'amateur': "authentic daily photo look, natural pose, simple casual clothing."
  };

  const compositionDescriptions: Record<string, string> = {
    'single': "One stunningly beautiful 16-18 year old Chinese girl with a radiant youthful smile and flawless skin.",
    'double_bff': "Two beautiful 17-year-old Chinese girls, best friends, celebrating together.",
    'couple': "A handsome young man and a stunning 18-year-old Chinese girl as a happy couple.",
    'multiple_bff': "A lively group of 3-4 beautiful 16-18 year old Chinese girls celebrating.",
    'none': "NO PEOPLE. PROFESSIONAL STILL LIFE PHOTOGRAPHY. The focus is entirely on the flowers."
  };

  const sceneDesc = sceneDescriptions[params.scene] || sceneDescriptions['cafe'];
  const compositionDesc = compositionDescriptions[params.composition] || compositionDescriptions['single'];
  
  let prompts: string[] = [];

  if (isNoModel) {
    const baseStillLife = `${primaryInstruction} ${artisticInstruction} STILL LIFE COMMERCIAL PHOTOGRAPHY. The exact flowers from the reference are placed elegantly on the table/surface of ${sceneDesc}. ${sizePromptPart} Beautiful camera angle, perfect lighting, cinematic depth of field. High-end aesthetic, sharp focus on floral textures. No people in frame.`;
    prompts = [
      `${baseStillLife} Elegant top-down flat-lay style.`,
      `${baseStillLife} 45-degree professional product shot with soft bokeh background.`,
      `${baseStillLife} Close-up macro shot showing dew on petals and exquisite wrapping detail.`,
      `${baseStillLife} Cinematic wide shot showing the luxurious environment of ${sceneDesc}.`
    ];
  } else {
    const outfitDesc = styleDescriptions[params.style] || styleDescriptions['balletcore'];
    const giftDesc = params.giftType === 'bouquet' 
      ? "holding the exact bouquet from reference" 
      : `posing with the exact flowers in a ${params.giftType}`;

    prompts = [
      `${primaryInstruction} ${artisticInstruction} Professional lifestyle portrait of ${compositionDesc}. Scene: ${sceneDesc}. Outfit: ${outfitDesc}. Activity: ${giftDesc}. ${sizePromptPart} Cinematic lighting, extremely detailed skin and floral textures.`,
      `${primaryInstruction} ${artisticInstruction} Aesthetic Xiaohongshu style photo. ${compositionDesc} at ${sceneDesc}. Wearing ${outfitDesc}. ${giftDesc}. ${sizePromptPart} Soft natural light, 4k.`,
      `${primaryInstruction} ${artisticInstruction} Close-up portrait. ${compositionDesc} posing with ${giftDesc}. Background: ${sceneDesc}. ${sizePromptPart} Realistic textures, joyful expression.`,
      `${primaryInstruction} ${artisticInstruction} Candid celebration. ${compositionDesc} in ${sceneDesc}, ${giftDesc}. Outfit: ${outfitDesc}. ${sizePromptPart} Vibrant colors, high fashion atmosphere.`
    ];
  }

  const generateWithRetry = async (prompt: string, retries = 5): Promise<string> => {
    // 每次生成创建新实例以确保 API Key 状态最新
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    for (let i = 0; i < retries; i++) {
      try {
        const response = await ai.models.generateContent({
          model: activeModel,
          contents: {
            parts: [
              {
                inlineData: {
                  data: base64Image.split(',')[1] || base64Image,
                  mimeType: mimeType,
                },
              },
              { text: prompt },
            ],
          },
          config: {
            imageConfig: { aspectRatio: "3:4" }
          }
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
        }
        throw new Error("No image data");
      } catch (error: any) {
        // 错误码 6 或 RPC 失败通常是过载或模型名称不匹配
        if ((JSON.stringify(error).includes("429") || JSON.stringify(error).includes("500")) && i < retries - 1) {
          await sleep(Math.pow(2, i) * 3000);
          continue;
        }
        throw error;
      }
    }
    throw new Error("Failed");
  };

  const results: string[] = [];
  for (const prompt of prompts) {
    try {
      const img = await generateWithRetry(prompt);
      results.push(img);
      // 避免并发限制
      if (results.length < prompts.length) await sleep(2000);
    } catch (e) {
      if (results.length > 0) return results;
      throw e;
    }
  }
  return results;
};
