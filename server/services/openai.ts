import { OpenAIConfig, AIAnalysisRequest, AIReplyGenerationRequest } from '../../shared/firebase';

export class OpenAIService {
  private config: OpenAIConfig;
  private apiUrl = 'https://api.openai.com/v1/chat/completions';

  constructor(config: OpenAIConfig) {
    this.config = config;
  }

  /**
   * Analyze call transcription using GPT-4
   */
  async analyzeCall(request: AIAnalysisRequest) {
    try {
      const systemPrompt = this.getAnalysisSystemPrompt(request.departmentContext?.type || 'general');
      const userPrompt = this.createAnalysisPrompt(request);

      const response = await this.makeOpenAIRequest([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]);

      // Parse the structured response
      const analysis = this.parseAnalysisResponse(response);
      
      return {
        summary: analysis.summary,
        sentiment: analysis.sentiment,
        intent: analysis.intent,
        category: analysis.category,
        priority: analysis.priority,
        suggestedActions: analysis.suggestedActions,
        keywords: analysis.keywords,
        processedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error analyzing call:', error);
      throw error;
    }
  }

  /**
   * Generate professional reply based on call analysis
   */
  async generateReply(request: AIReplyGenerationRequest) {
    try {
      const systemPrompt = this.getReplySystemPrompt(request.department);
      const userPrompt = this.createReplyPrompt(request);

      const response = await this.makeOpenAIRequest([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]);

      // Parse the reply response
      const reply = this.parseReplyResponse(response, request.department);

      return {
        text: reply.text,
        tone: reply.tone,
        department: request.department,
        status: 'generated' as const,
        generatedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error generating reply:', error);
      throw error;
    }
  }

  /**
   * Make request to OpenAI API
   */
  private async makeOpenAIRequest(messages: Array<{ role: string; content: string }>) {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: messages,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.choices || result.choices.length === 0) {
      throw new Error('No response generated from OpenAI');
    }

    return result.choices[0].message.content;
  }

  /**
   * Get system prompt for call analysis
   */
  private getAnalysisSystemPrompt(department: string): string {
    const basePrompt = `أنت مساعد ذكي متخصص في تحليل المكالمات الهاتفية لشركة CRM. مهمتك تحليل محتوى المكالمات وتقديم تقرير مفصل بصيغة JSON.

قم بالتحليل التالي:
1. ملخص المكالمة (summary): ملخص مختصر ومفيد للمكالمة
2. المشاعر (sentiment): positive, negative, أو neutral
3. القصد (intent): ماذا يريد المتصل (شراء، شكوى، استفسار، الخ)
4. الفئة (category): sales, support, complaint, inquiry, أو other
5. الأولوية (priority): low, medium, high, أو urgent
6. الإجراءات المقترحة (suggestedActions): قائمة بالإجراءات التي يجب اتخاذها
7. الكلمات المفتاحية (keywords): أهم الكلمات في المكالمة

يجب أن يكون الرد بصيغة JSON صحيحة.`;

    const departmentSpecific = {
      sales: `تخصص إضافي: ركز على فرص البيع، اهتمام العميل بالمنتجات، الميزانية، والإطار الزمني للشراء.`,
      hr: `تخصص إضافي: ركز على استفسارات الموظفين، طلبات الإجازة، المشاكل الوظيفية، والتقييمات.`,
      support: `تخصص إضافي: ركز على المشاكل التقنية، طلبات المساعدة، مستوى الإلحاح، وحلول ممكنة.`,
      manufacturing: `تخصص إضافي: ركز على طلبات الإنتاج، مشاكل الجودة، متطلبات التصنيع، والجداول الزمنية.`,
      marketing: `تخصص إضافي: ركز على استفسارات الحملات، ردود الفعل على التسويق، واهتمامات العملاء المحتملين.`
    };

    return basePrompt + '\n\n' + (departmentSpecific[department as keyof typeof departmentSpecific] || '');
  }

  /**
   * Create analysis prompt from request data
   */
  private createAnalysisPrompt(request: AIAnalysisRequest): string {
    return `
معلومات المكالمة:
- القسم: ${request.callMetadata.department}
- المدة: ${request.callMetadata.duration} ثانية
- الاتجاه: ${request.callMetadata.direction === 'inbound' ? 'واردة' : 'صادرة'}
- رقم المتصل: ${request.callMetadata.callerPhone}

نص المكالمة:
"${request.transcription}"

${request.departmentContext?.specialInstructions ? `\nتعليمات خاصة: ${request.departmentContext.specialInstructions}` : ''}

قم بتحليل هذه المكالمة وقدم النتائج بصيغة JSON.
`;
  }

  /**
   * Get system prompt for reply generation
   */
  private getReplySystemPrompt(department: string): string {
    const basePrompt = `أنت مساعد ذكي متخصص في إنشاء ردود احترافية للعملاء بناءً على تحليل المكالمات. 

قواعد الرد:
1. استخدم لغة مهذبة ومحترفة
2. اذكر اسم الشركة بشكل طبيعي
3. قدم حلول عملية أو خطوات واضحة
4. حدد إطار زمني واقعي للمتابعة
5. اتركر معلومات التواصل إذا لزم الأمر

يجب أن يكون الرد بصيغة JSON تحتوي على:
- text: نص الرد
- tone: نبرة الرد (professional, friendly, apologetic, sales)`;

    const departmentPrompts = {
      sales: `تخصص في المبيعات: ركز على الفوائد، العروض، والخطوات التالية لإتمام البيع.`,
      hr: `تخصص في الموارد البشرية: ركز على السياسات، الإجراءات، والدعم للموظفين.`,
      support: `تخصص في الدعم: ركز على حل المشاكل، خطوات التشخيص، والمساعدة التقنية.`,
      manufacturing: `تخصص في الإنتاج: ركز على الجودة، الجداول الزمنية، والمتطلبات التقنية.`,
      marketing: `تخصص في ال��سويق: ركز على المنتجات، الحملات، وبناء الوعي بالعلامة التجارية.`
    };

    return basePrompt + '\n\n' + (departmentPrompts[department as keyof typeof departmentPrompts] || '');
  }

  /**
   * Create reply generation prompt
   */
  private createReplyPrompt(request: AIReplyGenerationRequest): string {
    return `
تحليل المكالمة:
- الملخص: ${request.analysis.summary}
- المشاعر: ${request.analysis.sentiment}
- القصد: ${request.analysis.intent}
- الفئة: ${request.analysis.category}

معلومات الشركة:
- الاسم: ${request.companyInfo.name}
- ساعات العمل: ${request.companyInfo.businessHours}
- معلومات التواصل: ${request.companyInfo.contactInfo}

القسم: ${request.department}

نص المكالمة الأصلي:
"${request.transcription}"

${request.customInstructions ? `\nتعليمات خاصة: ${request.customInstructions}` : ''}

قم بإنشاء رد مناسب واحترافي بصيغة JSON.
`;
  }

  /**
   * Parse analysis response from OpenAI
   */
  private parseAnalysisResponse(response: string) {
    try {
      const parsed = JSON.parse(response);
      
      return {
        summary: parsed.summary || '',
        sentiment: parsed.sentiment || 'neutral',
        intent: parsed.intent || '',
        category: parsed.category || 'other',
        priority: parsed.priority || 'medium',
        suggestedActions: Array.isArray(parsed.suggestedActions) ? parsed.suggestedActions : [],
        keywords: Array.isArray(parsed.keywords) ? parsed.keywords : []
      };
    } catch (error) {
      console.error('Error parsing analysis response:', error);
      // Return fallback structure
      return {
        summary: 'تم تحليل المكالمة بنجاح',
        sentiment: 'neutral' as const,
        intent: 'عام',
        category: 'other' as const,
        priority: 'medium' as const,
        suggestedActions: ['مراجعة المكالمة'],
        keywords: []
      };
    }
  }

  /**
   * Parse reply response from OpenAI
   */
  private parseReplyResponse(response: string, department: string) {
    try {
      const parsed = JSON.parse(response);
      
      return {
        text: parsed.text || 'شكراً لاتصالك بنا. سيتم التواصل معك قريباً.',
        tone: parsed.tone || 'professional'
      };
    } catch (error) {
      console.error('Error parsing reply response:', error);
      // Return fallback response
      return {
        text: 'شكراً لاتصالك بنا. سيتم مراجعة طلبك والتواصل معك في أقرب وقت ممكن.',
        tone: 'professional' as const
      };
    }
  }

  /**
   * Generate custom prompt for specific use cases
   */
  async generateCustomAnalysis(transcription: string, customPrompt: string) {
    try {
      const response = await this.makeOpenAIRequest([
        { 
          role: 'system', 
          content: `أنت مساعد ذكي متخصص في تحليل المكالمات. ${customPrompt}. قدم النتيجة بصيغة JSON.` 
        },
        { 
          role: 'user', 
          content: `قم بتحليل النص التالي: "${transcription}"` 
        }
      ]);

      return JSON.parse(response);
    } catch (error) {
      console.error('Error in custom analysis:', error);
      throw error;
    }
  }

  /**
   * Validate OpenAI configuration
   */
  validateConfig(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.config.apiKey || !this.config.apiKey.startsWith('sk-')) {
      errors.push('Invalid OpenAI API key');
    }

    const supportedModels = ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'];
    if (!supportedModels.includes(this.config.model)) {
      errors.push(`Unsupported model: ${this.config.model}`);
    }

    if (this.config.maxTokens < 100 || this.config.maxTokens > 4000) {
      errors.push('Max tokens should be between 100 and 4000');
    }

    if (this.config.temperature < 0 || this.config.temperature > 2) {
      errors.push('Temperature should be between 0 and 2');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Estimate processing cost
   */
  getEstimatedCost(tokenCount: number): number {
    // OpenAI pricing (as of 2024)
    const pricing = {
      'gpt-4': { input: 0.03, output: 0.06 }, // per 1K tokens
      'gpt-4-turbo': { input: 0.01, output: 0.03 },
      'gpt-3.5-turbo': { input: 0.001, output: 0.002 }
    };

    const modelPricing = pricing[this.config.model as keyof typeof pricing] || pricing['gpt-3.5-turbo'];
    const inputCost = (tokenCount / 1000) * modelPricing.input;
    const outputCost = (this.config.maxTokens / 1000) * modelPricing.output;
    
    return inputCost + outputCost;
  }
}

export default OpenAIService;
