
import { GoogleGenAI } from "@google/genai";
import { TrigFunction } from "../types";

// 安全地获取 API Key。
const getApiKey = () => {
  try {
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (e) {
    // 忽略错误
  }
  return '';
};

export const getMathExplanation = async (
  func: TrigFunction,
  angleRad: number
): Promise<string> => {
  const apiKey = getApiKey();

  // 如果没有密钥，返回特定标识，以便 UI 层处理（例如触发选择器或显示提示）
  if (!apiKey || apiKey === 'MISSING_KEY') {
    return "API_KEY_MISSING";
  }

  const degrees = Math.round(angleRad * (180 / Math.PI));
  
  const prompt = `
    你是一位友好且世界一流的数学导师。
    用户正在观看一个关于单位圆和 ${func} 函数的交互式可视化演示。
    
    当前状态:
    - 函数: ${func}
    - 角度: ${degrees} 度 (${angleRad.toFixed(2)} 弧度)
    - 数值: ${func === TrigFunction.SIN ? Math.sin(angleRad).toFixed(2) : func === TrigFunction.COS ? Math.cos(angleRad).toFixed(2) : Math.tan(angleRad).toFixed(2)}

    请用**中文**提供一段简短且有见地的解释（最多 2-3 句话），说明在此特定角度下该函数在视觉上发生了什么。
    解释单位圆坐标与波形图数值之间的关系。
    不要使用复杂的 LaTeX 格式，使用标准文本或简单的 Markdown。
  `;

  try {
    // 每次请求时创建实例，以确保使用最新的 API Key (如果环境发生了变化)
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });

    return response.text || "暂时无法生成解释。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "抱歉，数学导师暂时掉线了。请检查您的 API 密钥和网络连接。";
  }
};
