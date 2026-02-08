import Taro from '@tarojs/taro';
import { 
  SendMessageRequest, 
  AIServiceResponse, 
  ChatMessage,
  ConsultationResult,
  EmergencyData 
} from '../types/consultation';
import { localSkillService } from './localSkillService';

class AIService {
  private apiUrl: string;
  private useLocalSkill: boolean;
  
  constructor() {
    // Taro中环境变量通过 process.env 访问
    this.apiUrl = process.env.TARO_APP_AI_API_URL || '/api/ai';
    this.useLocalSkill = process.env.TARO_APP_USE_LOCAL_SKILL === 'true' || !this.apiUrl.includes('http');
  }

  async sendMessage(request: SendMessageRequest): Promise<AIServiceResponse> {
    try {
      if (this.useLocalSkill) {
        console.log('Using local skill service');
        return await localSkillService.processMessage(request);
      }

      // 使用 Taro.request 替代 fetch
      const response = await Taro.request({
        url: `${this.apiUrl}/consult`,
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
        },
        data: request,
      });

      if (response.statusCode !== 200) {
        throw new Error('AI service request failed');
      }

      return response.data as AIServiceResponse;
    } catch (error) {
      console.error('AI Service Error:', error);
      
      console.log('Falling back to local skill service');
      return await localSkillService.processMessage(request);
    }
  }

  checkEmergencySymptoms(text: string): EmergencyData | null {
    const emergencyPatterns = [
      {
        pattern: /(胸痛.*大汗|大汗.*胸痛|压榨.*胸|撕裂.*胸)/,
        symptom: '剧烈胸痛伴大汗',
        actions: ['立即停止活动', '拨打120', '保持坐位休息', '含服硝酸甘油(如血压不低)'],
        severity: 'critical' as const,
      },
      {
        pattern: /(不能.*平卧|端坐.*呼吸|粉红.*泡沫|泡沫.*痰)/,
        symptom: '急性左心衰（端坐呼吸、粉红色泡沫痰）',
        actions: ['立即拨打120', '保持坐位双腿下垂', '高流量吸氧(如有)', '不要平躺'],
        severity: 'critical' as const,
      },
      {
        pattern: /(意识.*丧失|昏迷|叫不醒)/,
        symptom: '意识丧失或昏迷',
        actions: ['立即拨打120', '检查呼吸心跳', '侧卧位', '不要喂水喂药'],
        severity: 'critical' as const,
      },
      {
        pattern: /(大量.*血|吐血.*大|咯血.*100)/,
        symptom: '大咯血或大呕血',
        actions: ['立即拨打120', '侧卧防止窒息', '禁食禁水', '记录出血量'],
        severity: 'critical' as const,
      },
      {
        pattern: /(剧烈.*腹痛.*硬|板状腹)/,
        symptom: '剧烈腹痛伴腹肌强直（板状腹）',
        actions: ['立即拨打120', '禁食禁水', '不要按压腹部', '保持屈膝卧位'],
        severity: 'critical' as const,
      },
      {
        pattern: /(发紫.*呼吸|紫.*喘|呼吸困难.*紫)/,
        symptom: '严重呼吸困难伴口唇发紫',
        actions: ['立即拨打120', '保持坐位', '高流量吸氧', '保持通风'],
        severity: 'critical' as const,
      },
      {
        pattern: /(一生.*剧烈.*头|头.*一生.*剧|剧烈.*头.*颈)/,
        symptom: '突发剧烈头痛（一生中最痛）',
        actions: ['立即拨打120', '保持安静', '避免活动', '记录发病时间'],
        severity: 'critical' as const,
      },
    ];

    for (const item of emergencyPatterns) {
      if (item.pattern.test(text)) {
        return {
          triggerSymptom: item.symptom,
          description: `检测到${item.symptom},可能危及生命`,
          immediateActions: item.actions,
          severity: item.severity,
        };
      }
    }

    return null;
  }

  generateMockResponse(request: SendMessageRequest): AIServiceResponse {
    const { currentRound, userInput } = request;
    
    switch (currentRound) {
      case 'registration':
        return {
          success: true,
          message: {
            id: Date.now().toString(),
            role: 'assistant',
            content: '您好,我是您的智能导诊助手。请问疼痛具体在哪个位置?',
            timestamp: Date.now(),
            type: 'structured',
            structuredData: {
              round: 'presentIllness',
              questionType: 'location',
              question: '疼痛具体位置',
              description: '请描述疼痛的具体部位',
            },
          },
        };
        
      default:
        return {
          success: true,
          message: {
            id: Date.now().toString(),
            role: 'assistant',
            content: '我理解您的症状。请问还有其他不舒服吗?',
            timestamp: Date.now(),
            type: 'text',
          },
        };
    }
  }
}

export const aiService = new AIService();
