import type {
  SendMessageRequest,
  AIServiceResponse,
  ChatMessage,
  ConsultationResult,
  EmergencyData,
  ConsultationRound,
  SymptomType,
  StructuredQuestion,
  PatientInfo,
  ChiefComplaint,
} from '../types/consultation';

// 症状关键词映射
const symptomKeywords: Record<SymptomType, string[]> = {
  fever: ['发烧', '发热', '体温高', '忽冷忽热', '烧', '发热了', '低烧', '高烧'],
  chestPain: ['胸痛', '胸口疼', '心口痛', '胸闷', '胸部不适', '胸骨后疼', '心前区疼'],
  abdominalPain: ['腹痛', '肚子疼', '胃疼', '腹部疼', '下腹疼', '上腹疼', '肚子痛', '胃痛'],
  headache: ['头痛', '头疼', '头昏', '头晕', '眩晕', '头胀', '偏头痛', '太阳穴疼'],
  cough: ['咳嗽', '咳痰', '干咳', '嗓子痒', '想咳嗽', '咳嗽有痰', '呛咳'],
  dyspnea: ['呼吸困难', '喘不上气', '气短', '气促', '喘息', '呼吸费力', '憋气', '胸闷气短'],
  hemoptysis: ['咯血', '咳血', '痰里有血', '吐血', '血痰'],
  cyanosis: ['发绀', '嘴唇发紫', '手脚发紫', '紫绀', '皮肤发紫', '指甲发紫'],
  palpitation: ['心悸', '心慌', '心跳快', '心跳加速', '心律不齐', '心乱跳'],
  jaundice: ['黄疸', '皮肤黄', '眼睛黄', '巩膜黄', '尿黄', '发黄'],
  hematemesis: ['呕血', '吐血', '大便黑', '黑便', '便血', '血便', '柏油样便'],
  nausea: ['恶心', '想吐', '呕吐', '反胃', '干呕'],
  diarrhea: ['腹泻', '拉肚子', '拉稀', '水样便', '大便次数多', '腹泻不止'],
  dysuria: ['尿频', '尿急', '尿痛', '排尿困难', '小便次数多', '尿不尽', '尿意频繁'],
  hematuria: ['血尿', '尿血', '小便红', '尿中有血', '洗肉水样尿'],
  oliguria: ['少尿', '无尿', '尿少', '尿量减少', '排尿少', '一天没尿'],
  edema: ['水肿', '腿肿', '脚肿', '脸肿', '肿胀', '浮肿', '按下去有坑'],
  consciousness: ['意识障碍', '昏迷', '叫不醒', '意识不清', '神志不清', '嗜睡', '昏睡'],
  febrileSeizure: ['惊厥', '抽搐', '抽筋', '热性惊厥', '发烧抽筋', '抽搐发作'],
};

// 急诊指征检测规则
interface EmergencyRule {
  symptomTypes: SymptomType[];
  patterns: RegExp[];
  description: string;
  actions: string[];
  severity: 'critical' | 'urgent';
}

const emergencyRules: EmergencyRule[] = [
  {
    symptomTypes: ['chestPain'],
    patterns: [
      /胸痛.*大汗|大汗.*胸痛/,
      /压榨.*胸|胸.*压榨/,
      /撕裂.*胸|胸.*撕裂/,
      /胸痛.*持续.*[1-9].*分钟|胸痛.*超过.*15/,
    ],
    description: '剧烈胸痛伴大汗，持续超过15分钟，高度怀疑急性心肌梗死或主动脉夹层',
    actions: [
      '立即停止一切活动，保持安静',
      '拨打120急救电话',
      '不要自行驾车前往医院',
      '坐位或半卧位休息',
      '如有硝酸甘油可舌下含服（如果血压不低）',
      '记录症状开始时间',
    ],
    severity: 'critical',
  },
  {
    symptomTypes: ['dyspnea'],
    patterns: [
      /不能.*平卧|端坐.*呼吸/,
      /粉红.*泡沫|泡沫.*痰/,
      /呼吸困难.*紫|紫.*呼吸/,
      /严重.*喘|喘.*严重/,
    ],
    description: '严重呼吸困难（端坐呼吸、口唇发紫、粉红色泡沫痰），高度怀疑急性左心衰',
    actions: [
      '立即拨打120急救电话',
      '保持坐位，双腿下垂',
      '高流量吸氧（如有设备）',
      '不要平躺',
      '保持通风',
    ],
    severity: 'critical',
  },
  {
    symptomTypes: ['consciousness'],
    patterns: [
      /意识.*丧失|昏迷|叫不醒/,
      /意识.*不清|神志.*不清/,
    ],
    description: '意识丧失或昏迷',
    actions: [
      '立即拨打120急救电话',
      '检查呼吸和心跳',
      '将患者侧卧，防止呕吐物窒息',
      '不要喂水喂药',
      '记录发病时间',
    ],
    severity: 'critical',
  },
  {
    symptomTypes: ['hemoptysis'],
    patterns: [
      /大量.*血|大.*咯血|咯血.*100/,
      /吐血.*不止|血.*不止/,
    ],
    description: '大咯血（>100ml）或持续咯血不止',
    actions: [
      '立即拨打120急救电话',
      '侧卧位，防止血液流入气道窒息',
      '禁食禁水',
      '记录出血量',
    ],
    severity: 'critical',
  },
  {
    symptomTypes: ['hematemesis'],
    patterns: [
      /大量.*呕血|呕血.*不止/,
      /黑便.*休克|便血.*休克/,
      /头晕.*冷汗.*脉快/,
    ],
    description: '大量呕血或便血伴休克征象（头晕、冷汗、脉速）',
    actions: [
      '立即拨打120急救电话',
      '禁食禁水',
      '侧卧位防止窒息',
      '记录出血量',
    ],
    severity: 'critical',
  },
  {
    symptomTypes: ['abdominalPain'],
    patterns: [
      /剧烈.*腹痛.*硬|板状腹/,
      /腹痛.*休克|全腹.*痛.*硬/,
    ],
    description: '剧烈腹痛伴腹肌强直（板状腹），提示消化道穿孔或弥漫性腹膜炎',
    actions: [
      '立即拨打120急救电话',
      '禁食禁水',
      '不要按压腹部',
      '屈膝卧位减轻疼痛',
    ],
    severity: 'critical',
  },
  {
    symptomTypes: ['headache'],
    patterns: [
      /一生.*剧烈.*头|头.*一生.*剧/,
      /剧烈.*头.*颈|颈.*强直/,
      /突然.*剧.*头.*呕吐/,
    ],
    description: '突发剧烈头痛（一生中最痛），伴颈强直或呕吐，高度怀疑蛛网膜下腔出血',
    actions: [
      '立即拨打120急救电话',
      '保持安静，绝对卧床',
      '避免活动和情绪激动',
      '记录发病时间',
    ],
    severity: 'critical',
  },
  {
    symptomTypes: ['fever'],
    patterns: [
      /高热.*意识|发烧.*意识不清/,
      /体温.*39.*意识|39度.*神志/,
    ],
    description: '高热（>39°C）伴意识障碍或精神恍惚',
    actions: [
      '立即拨打120急救电话',
      '物理降温（温水擦拭）',
      '侧卧位防止误吸',
      '保持通风',
    ],
    severity: 'critical',
  },
];

// 科室映射配置
interface DepartmentConfig {
  department: string;
  code: string;
  icon: string;
  commonConditions: string[];
  emergencySymptoms: string[];
}

const symptomToDepartment: Record<SymptomType, DepartmentConfig> = {
  fever: {
    department: '发热门诊/感染科',
    code: 'fever_clinic',
    icon: 'thermometer',
    commonConditions: ['上呼吸道感染', '流感', '肺炎', '尿路感染'],
    emergencySymptoms: ['高热>39°C伴意识障碍', '高热伴皮疹', '持续高热>3天'],
  },
  chestPain: {
    department: '心内科/胸外科',
    code: 'cardiology',
    icon: 'favorite',
    commonConditions: ['心绞痛', '心肌梗死', '胸膜炎', '肋软骨炎'],
    emergencySymptoms: ['压榨性胸痛>15分钟', '胸痛伴大汗', '胸痛伴呼吸困难'],
  },
  abdominalPain: {
    department: '消化内科/普外科',
    code: 'gastroenterology',
    icon: 'local_hospital',
    commonConditions: ['急性胃肠炎', '消化性溃疡', '急性阑尾炎', '肠梗阻'],
    emergencySymptoms: ['板状腹', '剧烈腹痛伴休克', '腹痛伴呕血便血'],
  },
  headache: {
    department: '神经内科',
    code: 'neurology',
    icon: 'psychology',
    commonConditions: ['偏头痛', '紧张性头痛', '颅内感染', '高血压脑病'],
    emergencySymptoms: ['突发剧烈头痛', '头痛伴意识障碍', '头痛伴颈强直'],
  },
  cough: {
    department: '呼吸内科',
    code: 'pulmonology',
    icon: 'air',
    commonConditions: ['急性支气管炎', '肺炎', '支气管哮喘', 'COPD'],
    emergencySymptoms: ['咳血量大', '呼吸困难伴发绀', '意识障碍'],
  },
  dyspnea: {
    department: '呼吸内科/心内科',
    code: 'respiratory_cardiology',
    icon: 'air',
    commonConditions: ['支气管哮喘', '心力衰竭', '肺栓塞', 'COPD'],
    emergencySymptoms: ['端坐呼吸', '粉红色泡沫痰', '口唇发紫'],
  },
  hemoptysis: {
    department: '呼吸内科/胸外科',
    code: 'pulmonology_surgery',
    icon: 'bloodtype',
    commonConditions: ['支气管扩张', '肺结核', '肺癌', '肺炎'],
    emergencySymptoms: ['大咯血(>100ml)', '持续咯血', '咯血伴呼吸困难'],
  },
  cyanosis: {
    department: '心内科/呼吸内科',
    code: 'cardiology_pulmonology',
    icon: 'palette',
    commonConditions: ['先天性心脏病', '呼吸衰竭', '肺心病'],
    emergencySymptoms: ['严重发绀伴呼吸困难', '意识障碍'],
  },
  palpitation: {
    department: '心内科',
    code: 'cardiology',
    icon: 'favorite',
    commonConditions: ['心律失常', '甲状腺功能亢进', '焦虑症', '冠心病'],
    emergencySymptoms: ['心悸伴胸痛', '心悸伴晕厥', '心率>150次/分'],
  },
  jaundice: {
    department: '消化内科/肝胆外科',
    code: 'hepatobiliary',
    icon: 'colorize',
    commonConditions: ['病毒性肝炎', '胆石症', '胆管癌', '溶血性疾病'],
    emergencySymptoms: ['黄疸伴高热', '黄疸伴腹痛', '黄疸伴意识障碍'],
  },
  hematemesis: {
    department: '消化内科',
    code: 'gastroenterology',
    icon: 'bloodtype',
    commonConditions: ['消化性溃疡', '食管胃底静脉曲张', '急性胃黏膜病变'],
    emergencySymptoms: ['大量呕血', '黑便伴休克', '血便伴头晕'],
  },
  nausea: {
    department: '消化内科',
    code: 'gastroenterology',
    icon: 'sick',
    commonConditions: ['急性胃肠炎', '消化不良', '肠梗阻', '颅内病变'],
    emergencySymptoms: ['喷射性呕吐', '呕吐伴剧烈头痛', '呕吐伴意识障碍'],
  },
  diarrhea: {
    department: '消化内科/肠道门诊',
    code: 'gastroenterology',
    icon: 'water_drop',
    commonConditions: ['急性胃肠炎', '细菌性痢疾', '肠易激综合征', '炎症性肠病'],
    emergencySymptoms: ['严重脱水', '血便', '高热伴意识障碍'],
  },
  dysuria: {
    department: '泌尿外科/肾内科',
    code: 'urology',
    icon: 'water_drop',
    commonConditions: ['尿路感染', '泌尿系结石', '前列腺炎', '膀胱炎'],
    emergencySymptoms: ['尿闭', '高热寒战', '腰痛伴发热'],
  },
  hematuria: {
    department: '泌尿外科/肾内科',
    code: 'urology',
    icon: 'bloodtype',
    commonConditions: ['泌尿系结石', '泌尿系感染', '肾炎', '泌尿系肿瘤'],
    emergencySymptoms: ['大量血尿', '血尿伴血块', '血尿伴腰痛'],
  },
  oliguria: {
    department: '肾内科/泌尿外科',
    code: 'nephrology',
    icon: 'water_drop',
    commonConditions: ['急性肾损伤', '慢性肾功能不全', '尿路梗阻'],
    emergencySymptoms: ['24小时尿量<100ml', '少尿伴水肿', '少尿伴呼吸困难'],
  },
  edema: {
    department: '肾内科/心内科',
    code: 'nephrology_cardiology',
    icon: 'water',
    commonConditions: ['肾病综合征', '心力衰竭', '肝硬化', '甲状腺功能减退'],
    emergencySymptoms: ['水肿伴呼吸困难', '水肿伴少尿', '全身水肿'],
  },
  consciousness: {
    department: '急诊科/神经内科',
    code: 'emergency_neurology',
    icon: 'psychology',
    commonConditions: ['脑血管意外', '颅内感染', '中毒', '代谢性脑病'],
    emergencySymptoms: ['意识丧失', '昏迷', '嗜睡伴高热'],
  },
  febrileSeizure: {
    department: '儿科/急诊科',
    code: 'pediatrics_emergency',
    icon: 'child_care',
    commonConditions: ['单纯性热性惊厥', '复杂性热性惊厥', '颅内感染'],
    emergencySymptoms: ['惊厥持续>5分钟', '24小时内多次发作', '惊厥后意识不恢复'],
  },
};

// 问诊问题模板
interface InquiryTemplate {
  round: ConsultationRound;
  questions: string[];
  options?: Array<{ label: string; value: string }>;
}

const inquiryTemplates: Record<SymptomType, InquiryTemplate[]> = {
  abdominalPain: [
    {
      round: 'presentIllness',
      questions: ['疼痛具体位置（上左/上中/上右/中左/中中/中右/下左/下中/下右）？', '疼痛性质（隐痛/胀痛/绞痛/刺痛/烧灼感）？', '疼痛程度（轻微/中等/剧烈）？', '持续还是阵发？'],
      options: [
        { label: '上左', value: 'upper_left' },
        { label: '上中', value: 'upper_center' },
        { label: '上右', value: 'upper_right' },
        { label: '中左', value: 'middle_left' },
        { label: '中中', value: 'middle_center' },
        { label: '中右', value: 'middle_right' },
        { label: '下左', value: 'lower_left' },
        { label: '下中', value: 'lower_center' },
        { label: '下右', value: 'lower_right' },
      ],
    },
    {
      round: 'aggravation',
      questions: ['进食后是否加重或缓解（空腹/餐后）？', '什么体位最难受？', '按压时疼痛如何？', '排便后是否缓解？'],
    },
    {
      round: 'accompanying',
      questions: ['有无发热？', '有无恶心呕吐？', '有无腹泻或便秘？', '大便颜色是否正常？'],
    },
    {
      round: 'supplementary',
      questions: ['以前有无类似发作？', '最近饮食情况？', '有无腹部手术史？'],
    },
  ],
  chestPain: [
    {
      round: 'presentIllness',
      questions: ['疼痛位置（胸骨后/左侧/右侧/心前区）？', '疼痛性质（压榨感/刺痛/烧灼感/撕裂感）？', '每次持续多久？', '有无放射痛（左肩/左臂/后背/下颌）？'],
    },
    {
      round: 'aggravation',
      questions: ['与活动或情绪是否相关？', '深呼吸或咳嗽时是否加重？', '含服硝酸甘油是否缓解？'],
    },
    {
      round: 'accompanying',
      questions: ['有无出汗？', '有无呼吸困难？', '有无恶心呕吐？', '有无心悸心慌？'],
    },
    {
      round: 'supplementary',
      questions: ['有无高血压、糖尿病、高血脂？', '有无吸烟史？', '家族中有无早发心脏病史？'],
    },
  ],
  headache: [
    {
      round: 'presentIllness',
      questions: ['头痛部位（额头/太阳穴/后脑勺/全头）？', '单侧还是双侧？', '疼痛性质（搏动痛/紧箍样/电击样）？', '程度如何？'],
    },
    {
      round: 'aggravation',
      questions: ['活动或咳嗽时是否加重？', '光线或声音是否加重？', '休息或睡眠是否缓解？'],
    },
    {
      round: 'accompanying',
      questions: ['有无恶心呕吐？', '有无畏光畏声？', '有无视力改变？', '有无发热？'],
    },
    {
      round: 'supplementary',
      questions: ['既往有无类似发作？', '睡眠情况如何？', '近期有无压力或紧张？'],
    },
  ],
  fever: [
    {
      round: 'presentIllness',
      questions: ['最高体温多少度？', '发热规律（持续/间歇/弛张）？', '有无畏寒或寒战？', '发热前有无受凉或感冒接触史？'],
    },
    {
      round: 'aggravation',
      questions: ['什么时候体温最高（上午/下午/晚上）？', '服用退热药后体温能否下降？'],
    },
    {
      round: 'accompanying',
      questions: ['有无咳嗽咳痰？', '有无咽痛？', '有无皮疹？', '有无头痛？', '有无尿频尿急？'],
    },
    {
      round: 'supplementary',
      questions: ['近期有无外出旅行？', '有无接触传染病患者？', '既往有无类似发热史？'],
    },
  ],
  cough: [
    {
      round: 'presentIllness',
      questions: ['咳嗽性质（干咳/有痰）？', '咳嗽时间（白天/夜间/晨起）？', '咳嗽音色（清脆/嘶哑/金属音）？', '有无诱发因素？'],
    },
    {
      round: 'aggravation',
      questions: ['冷空气或刺激性气味是否加重？', '平躺时是否加重？', '说话多时是否加重？'],
    },
    {
      round: 'accompanying',
      questions: ['有无咳痰（颜色、量）？', '有无胸痛？', '有无呼吸困难？', '有无发热？'],
    },
    {
      round: 'supplementary',
      questions: ['有无吸烟史？', '有无哮喘或过敏史？', '近期有无感冒？'],
    },
  ],
  dyspnea: [
    {
      round: 'presentIllness',
      questions: ['呼吸困难类型（吸气/呼气/混合）？', '严重程度（活动后/安静时/端坐呼吸）？', '能否平躺睡觉？', '起病急缓？'],
    },
    {
      round: 'aggravation',
      questions: ['活动后是否加重？', '夜间是否加重（阵发性夜间呼吸困难）？', '坐位是否缓解？'],
    },
    {
      round: 'accompanying',
      questions: ['有无咳嗽咳痰？', '有无胸痛？', '有无心悸？', '有无下肢水肿？', '口唇有无发紫？'],
    },
    {
      round: 'supplementary',
      questions: ['有无心脏病或肺病史？', '有无吸烟史？', '近期有无感冒？'],
    },
  ],
  hemoptysis: [
    {
      round: 'presentIllness',
      questions: ['咯血量（痰中带血/满口血/大量）？', '颜色（鲜红/暗红/铁锈色）？', '是否与痰混合？'],
    },
    {
      round: 'aggravation',
      questions: ['咳嗽剧烈时是否加重？', '特定体位是否加重？'],
    },
    {
      round: 'accompanying',
      questions: ['有无胸痛？', '有无发热？', '有无呼吸困难？', '有无消瘦？'],
    },
    {
      round: 'supplementary',
      questions: ['有无肺结核病史？', '有无吸烟史？', '近期有无外伤？'],
    },
  ],
  diarrhea: [
    {
      round: 'presentIllness',
      questions: ['大便次数？', '大便性状（水样/糊状/黏液/脓血）？', '有无里急后重？'],
    },
    {
      round: 'aggravation',
      questions: ['进食后是否加重？', '特定食物是否诱发？'],
    },
    {
      round: 'accompanying',
      questions: ['有无腹痛？', '有无发热？', '有无恶心呕吐？', '有无脱水表现（口干、尿少）？'],
    },
    {
      round: 'supplementary',
      questions: ['近期有无不洁饮食史？', '有无类似发作史？', '近期有无使用抗生素？'],
    },
  ],
  nausea: [
    {
      round: 'presentIllness',
      questions: ['恶心还是呕吐？', '呕吐物性状（食物/胃液/胆汁/血）？', '与进食关系？', '是否喷射性？'],
    },
    {
      round: 'aggravation',
      questions: ['进食后是否加重？', '特定食物是否诱发？'],
    },
    {
      round: 'accompanying',
      questions: ['有无腹痛？', '有无头痛？', '有无眩晕？', '有无发热？'],
    },
    {
      round: 'supplementary',
      questions: ['有无怀孕可能（女性）？', '既往有无胃病？', '近期有无头部外伤？'],
    },
  ],
  dysuria: [
    {
      round: 'presentIllness',
      questions: ['尿频（次数增加）/尿急（憋不住）/尿痛（烧灼感）？', '排尿次数（白天/夜间）？', '每次尿量多少？'],
    },
    {
      round: 'aggravation',
      questions: ['饮水后是否加重？', '特定时间是否加重？'],
    },
    {
      round: 'accompanying',
      questions: ['有无腰痛？', '有无发热？', '有无血尿？', '尿道口有无分泌物？'],
    },
    {
      round: 'supplementary',
      questions: ['既往有无尿路感染史？', '有无泌尿系结石史？', '近期有无性生活？'],
    },
  ],
  hematuria: [
    {
      round: 'presentIllness',
      questions: ['血尿程度（镜下/肉眼）？', '颜色（鲜红/暗红/洗肉水样）？', '全程血尿还是初始/终末血尿？'],
    },
    {
      round: 'aggravation',
      questions: ['活动后是否加重？', '排尿时是否疼痛？'],
    },
    {
      round: 'accompanying',
      questions: ['有无腰痛？', '有无尿频尿急？', '有无水肿？', '有无血块？'],
    },
    {
      round: 'supplementary',
      questions: ['既往有无结石史？', '有无肾病史？', '近期有无剧烈运动？'],
    },
  ],
  palpitation: [
    {
      round: 'presentIllness',
      questions: ['心悸感觉（心跳快/心跳重/心跳乱/心跳停）？', '发作频率？', '每次持续多久？', '能否自行缓解？'],
    },
    {
      round: 'aggravation',
      questions: ['情绪紧张是否诱发？', '劳累是否诱发？', '咖啡或茶是否诱发？'],
    },
    {
      round: 'accompanying',
      questions: ['有无胸痛？', '有无头晕或晕厥？', '有无呼吸困难？', '有无出汗？'],
    },
    {
      round: 'supplementary',
      questions: ['有无心脏病史？', '有无甲亢？', '近期有无感冒（心肌炎）？'],
    },
  ],
  jaundice: [
    {
      round: 'presentIllness',
      questions: ['黄疸程度（皮肤/眼睛）？', '起病急缓？', '尿色（深黄/茶色）？', '大便颜色（正常/陶土色）？'],
    },
    {
      round: 'aggravation',
      questions: ['进食油腻是否加重？', '有无瘙痒？'],
    },
    {
      round: 'accompanying',
      questions: ['有无发热？', '有无腹痛？', '有无恶心呕吐？', '有无乏力纳差？'],
    },
    {
      round: 'supplementary',
      questions: ['有无肝炎史？', '有无饮酒史？', '近期有无特殊药物使用？'],
    },
  ],
  edema: [
    {
      round: 'presentIllness',
      questions: ['水肿部位（眼睑/下肢/全身）？', '凹陷性还是非凹陷性？', '晨起还是下午加重？'],
    },
    {
      round: 'aggravation',
      questions: ['久站是否加重？', '休息是否缓解？'],
    },
    {
      round: 'accompanying',
      questions: ['有无尿量减少？', '有无呼吸困难？', '有无腹胀？', '有无高血压？'],
    },
    {
      round: 'supplementary',
      questions: ['既往有无肾病/心脏病/肝病？', '近期有无用药（降压药、激素）？'],
    },
  ],
  cyanosis: [
    {
      round: 'presentIllness',
      questions: ['发绀部位（口唇/指端/全身）？', '中心性还是周围性？', '按摩或保暖后是否消退？'],
    },
    {
      round: 'aggravation',
      questions: ['寒冷是否加重？', '活动是否加重？'],
    },
    {
      round: 'accompanying',
      questions: ['有无呼吸困难？', '有无杵状指？', '有无意识障碍？', '有无心悸？'],
    },
    {
      round: 'supplementary',
      questions: ['有无先天性心脏病？', '有无肺部疾病？', '有无长期吸烟史？'],
    },
  ],
  hematemesis: [
    {
      round: 'presentIllness',
      questions: ['呕血还是黑便？', '出血量估计？', '颜色（鲜红/咖啡样/柏油样）？'],
    },
    {
      round: 'aggravation',
      questions: ['进食是否诱发？', '饮酒是否诱发？'],
    },
    {
      round: 'accompanying',
      questions: ['有无头晕乏力？', '有无腹痛？', '有无冷汗心悸？'],
    },
    {
      round: 'supplementary',
      questions: ['既往有无溃疡病史？', '近期有无服用阿司匹林或止痛药？', '有无肝病史？'],
    },
  ],
  oliguria: [
    {
      round: 'presentIllness',
      questions: ['24小时尿量大概多少？', '起病急缓？', '有无排尿困难？'],
    },
    {
      round: 'aggravation',
      questions: ['饮水少是否加重？', '特定时间是否明显？'],
    },
    {
      round: 'accompanying',
      questions: ['有无水肿？', '有无呼吸困难？', '有无恶心呕吐？', '有无腰痛？'],
    },
    {
      round: 'supplementary',
      questions: ['既往有无肾病？', '近期有无使用肾毒性药物？', '有无前列腺问题（男性）？'],
    },
  ],
  consciousness: [
    {
      round: 'presentIllness',
      questions: ['意识障碍程度（嗜睡/昏睡/昏迷）？', '起病急缓？', '有无抽搐？'],
    },
    {
      round: 'aggravation',
      questions: ['刺激后能否唤醒？', '有无昼夜节律变化？'],
    },
    {
      round: 'accompanying',
      questions: ['有无发热？', '有无头痛呕吐？', '有无肢体活动障碍？', '瞳孔是否等大？'],
    },
    {
      round: 'supplementary',
      questions: ['既往有无糖尿病（低血糖）？', '有无高血压（脑出血）？', '有无头部外伤？'],
    },
  ],
  febrileSeizure: [
    {
      round: 'presentIllness',
      questions: ['发作形式（全身强直阵挛/局部）？', '持续时间？', '24小时内发作次数？'],
    },
    {
      round: 'aggravation',
      questions: ['发热多少度时出现？', '退热后是否再发？'],
    },
    {
      round: 'accompanying',
      questions: ['发作后意识能否恢复？', '有无呕吐？', '有无颈强直？', '有无皮疹？'],
    },
    {
      round: 'supplementary',
      questions: ['既往有无类似发作？', '家族中有无惊厥史？', '发育是否正常？'],
    },
  ],
};

// 会话状态管理
interface SessionState {
  sessionId: string;
  currentRound: ConsultationRound;
  patientInfo?: PatientInfo;
  chiefComplaint?: ChiefComplaint;
  matchedSymptom?: SymptomType;
  collectedData: {
    presentIllness?: Record<string, any>;
    aggravation?: Record<string, any>;
    accompanying?: Record<string, any>;
    supplementary?: Record<string, any>;
  };
  messages: ChatMessage[];
  isEmergency: boolean;
  isComplete: boolean;
}

class LocalSkillService {
  private sessions: Map<string, SessionState> = new Map();

  // 创建新会话
  public createSession(): string {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.sessions.set(sessionId, {
      sessionId,
      currentRound: 'registration',
      collectedData: {},
      messages: [],
      isEmergency: false,
      isComplete: false,
    });
    return sessionId;
  }

  // 获取会话状态
  getSession(sessionId: string): SessionState | undefined {
    return this.sessions.get(sessionId);
  }

  // 处理消息
  async processMessage(request: SendMessageRequest): Promise<AIServiceResponse> {
    const { sessionId, currentRound, userInput, previousMessages } = request;
    
    let session = this.sessions.get(sessionId);
    if (!session) {
      // 如果没有sessionId，创建新会话
      const newSessionId = this.createSession();
      session = this.sessions.get(newSessionId)!;
      request.sessionId = newSessionId;
    }

    // 添加用户消息到历史
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: userInput,
      timestamp: Date.now(),
      type: 'text',
    };
    session.messages.push(userMessage);

    // 根据当前轮次处理
    switch (session.currentRound) {
      case 'registration':
        return this.handleRegistration(session, userInput);
      case 'presentIllness':
        return this.handlePresentIllness(session, userInput);
      case 'aggravation':
        return this.handleAggravation(session, userInput);
      case 'accompanying':
        return this.handleAccompanying(session, userInput);
      case 'supplementary':
        return this.handleSupplementary(session, userInput);
      case 'result':
        return this.handleResult(session);
      default:
        return this.createErrorResponse('未知的问诊轮次');
    }
  }

  // 第1轮：患者登记与主诉确认
  private handleRegistration(session: SessionState, userInput: string): AIServiceResponse {
    // 解析患者信息
    const extractedInfo = this.extractPatientInfo(userInput);
    
    // 合并或初始化患者信息
    if (!session.patientInfo) {
      session.patientInfo = extractedInfo;
    } else {
      session.patientInfo = { ...session.patientInfo, ...extractedInfo };
    }

    // 匹配主诉症状
    const matchedSymptom = this.matchSymptom(userInput);
    
    // 如果识别到症状，更新主诉信息
    if (matchedSymptom) {
      session.matchedSymptom = matchedSymptom;
      const duration = this.extractDuration(userInput);
      session.chiefComplaint = {
        symptom: this.getSymptomName(matchedSymptom),
        duration: duration,
        matchedSymptom,
      };
    }

    // 检查患者信息是否完整
    const missingInfo: string[] = [];
    
    if (!session.patientInfo?.name) {
      missingInfo.push('姓名');
    }
    
    if (!session.matchedSymptom) {
      missingInfo.push('主要症状（如肚子疼、头疼、发烧等）');
    }
    
    // 如果信息不完整，要求补充
    if (missingInfo.length > 0) {
      let responseContent = '';
      
      if (!session.patientInfo?.name && !session.matchedSymptom) {
        // 首次对话，完全没有信息
        responseContent = '您好，我是您的智能导诊助手。为了给您提供准确的导诊建议，我需要了解一些基本信息：\n\n1. 您的姓名和手机号\n2. 您今天最主要的不舒服是什么？（如肚子疼、胸口疼、头疼、发烧、咳嗽等）\n3. 大概持续多久了？\n4. 您的年龄和性别？\n\n请尽可能完整地描述。';
      } else {
        // 有部分信息，要求补充缺失的
        responseContent = `好的，我记下了${session.chiefComplaint ? '您是' + session.chiefComplaint.symptom : ''}。\n\n为了继续，我还需要您补充以下信息：\n${missingInfo.map((info, idx) => `${idx + 1}. ${info}`).join('\n')}\n\n请提供这些信息。`;
      }
      
      return {
        success: true,
        message: {
          id: `msg_${Date.now()}`,
          role: 'assistant',
          content: responseContent,
          timestamp: Date.now(),
          type: 'structured',
          structuredData: {
            round: 'registration',
            questionType: 'text',
            question: '患者登记与主诉',
            description: `需要补充：${missingInfo.join('、')}`,
          },
        },
      };
    }

    // 信息完整，检查是否触发急诊
    if (session.matchedSymptom) {
      const emergencyCheck = this.checkEmergency(userInput, session.matchedSymptom);
      if (emergencyCheck) {
        session.isEmergency = true;
        session.currentRound = 'result';
        return this.createEmergencyResponse(emergencyCheck, session);
      }
    }

    // 进入下一轮：现病史
    session.currentRound = 'presentIllness';
    
    const templates = session.matchedSymptom ? inquiryTemplates[session.matchedSymptom] : [];
    const presentIllnessTemplate = templates.find(t => t.round === 'presentIllness');
    
    let responseContent = `${session.patientInfo?.name || '您好'}，我已经记录了您的基本信息。\n\n主诉：${session.chiefComplaint?.symptom}，持续${session.chiefComplaint?.duration}。\n\n为了更准确地判断，请回答以下问题：`;
    
    if (presentIllnessTemplate) {
      responseContent += '\n\n' + presentIllnessTemplate.questions.join('\n');
    }

    return {
      success: true,
      message: {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: responseContent,
        timestamp: Date.now(),
        type: 'structured',
        structuredData: {
          round: 'presentIllness',
          questionType: 'text',
          question: '现病史核心要素',
          description: presentIllnessTemplate?.questions.join('；') || '请详细描述您的症状',
        },
      },
    };
  }

  // 第2轮：现病史核心要素
  private handlePresentIllness(session: SessionState, userInput: string): AIServiceResponse {
    // 保存现病史数据
    session.collectedData.presentIllness = {
      ...session.collectedData.presentIllness,
      rawInput: userInput,
      timestamp: Date.now(),
    };

    // 检查急诊
    if (session.matchedSymptom) {
      const emergencyCheck = this.checkEmergency(userInput, session.matchedSymptom);
      if (emergencyCheck) {
        session.isEmergency = true;
        session.currentRound = 'result';
        return this.createEmergencyResponse(emergencyCheck, session);
      }
    }

    // 进入下一轮：加重/缓解因素
    session.currentRound = 'aggravation';

    const templates = session.matchedSymptom ? inquiryTemplates[session.matchedSymptom] : [];
    const aggravationTemplate = templates.find(t => t.round === 'aggravation');

    let responseContent = '明白了。接下来了解症状的演变情况：';
    
    if (aggravationTemplate) {
      responseContent += '\n\n' + aggravationTemplate.questions.join('\n');
    } else {
      responseContent += '\n\n- 什么情况下症状会加重或缓解？\n- 从发病到现在是逐渐加重、差不多还是在好转？\n- 有没有出现新的症状？';
    }

    return {
      success: true,
      message: {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: responseContent,
        timestamp: Date.now(),
        type: 'structured',
        structuredData: {
          round: 'aggravation',
          questionType: 'text',
          question: '加重/缓解因素与演变',
          description: aggravationTemplate?.questions.join('；') || '请描述症状的变化情况',
        },
      },
    };
  }

  // 第3轮：加重/缓解因素
  private handleAggravation(session: SessionState, userInput: string): AIServiceResponse {
    session.collectedData.aggravation = {
      ...session.collectedData.aggravation,
      rawInput: userInput,
      timestamp: Date.now(),
    };

    // 检查急诊
    if (session.matchedSymptom) {
      const emergencyCheck = this.checkEmergency(userInput, session.matchedSymptom);
      if (emergencyCheck) {
        session.isEmergency = true;
        session.currentRound = 'result';
        return this.createEmergencyResponse(emergencyCheck, session);
      }
    }

    // 进入下一轮：伴随症状
    session.currentRound = 'accompanying';

    const templates = session.matchedSymptom ? inquiryTemplates[session.matchedSymptom] : [];
    const accompanyingTemplate = templates.find(t => t.round === 'accompanying');

    let responseContent = '了解。请问有没有以下伴随症状：';
    
    if (accompanyingTemplate) {
      responseContent += '\n\n' + accompanyingTemplate.questions.join('\n');
    } else {
      responseContent += '\n\n- 有无发热？\n- 有无其他不适？\n- 饮食、睡眠、大小便是否正常？';
    }

    return {
      success: true,
      message: {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: responseContent,
        timestamp: Date.now(),
        type: 'structured',
        structuredData: {
          round: 'accompanying',
          questionType: 'text',
          question: '伴随症状',
          description: accompanyingTemplate?.questions.join('；') || '请描述伴随症状',
        },
      },
    };
  }

  // 第4轮：伴随症状
  private handleAccompanying(session: SessionState, userInput: string): AIServiceResponse {
    session.collectedData.accompanying = {
      ...session.collectedData.accompanying,
      rawInput: userInput,
      timestamp: Date.now(),
    };

    // 检查急诊
    if (session.matchedSymptom) {
      const emergencyCheck = this.checkEmergency(userInput, session.matchedSymptom);
      if (emergencyCheck) {
        session.isEmergency = true;
        session.currentRound = 'result';
        return this.createEmergencyResponse(emergencyCheck, session);
      }
    }

    // 判断是否需要第5轮（根据已有信息是否足够）
    // 为简化流程，这里直接进入第5轮补充信息
    session.currentRound = 'supplementary';

    const templates = session.matchedSymptom ? inquiryTemplates[session.matchedSymptom] : [];
    const supplementaryTemplate = templates.find(t => t.round === 'supplementary');

    let responseContent = '最后确认一些补充信息：';
    
    if (supplementaryTemplate) {
      responseContent += '\n\n' + supplementaryTemplate.questions.join('\n');
    } else {
      responseContent += '\n\n- 以前有没有类似的发作？\n- 有没有正在服用的药物？\n- 有没有其他疾病史（如高血压、糖尿病等）？';
    }

    return {
      success: true,
      message: {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: responseContent,
        timestamp: Date.now(),
        type: 'structured',
        structuredData: {
          round: 'supplementary',
          questionType: 'text',
          question: '补充与鉴别信息',
          description: supplementaryTemplate?.questions.join('；') || '请提供补充信息',
        },
      },
    };
  }

  // 第5轮：补充信息
  private handleSupplementary(session: SessionState, userInput: string): AIServiceResponse {
    session.collectedData.supplementary = {
      ...session.collectedData.supplementary,
      rawInput: userInput,
      timestamp: Date.now(),
    };

    // 检查急诊
    if (session.matchedSymptom) {
      const emergencyCheck = this.checkEmergency(userInput, session.matchedSymptom);
      if (emergencyCheck) {
        session.isEmergency = true;
        session.currentRound = 'result';
        return this.createEmergencyResponse(emergencyCheck, session);
      }
    }

    // 进入结果轮
    session.currentRound = 'result';
    session.isComplete = true;

    return this.handleResult(session);
  }

  // 第6步：诊断思路分析与科室推荐
  private handleResult(session: SessionState): AIServiceResponse {
    if (!session.matchedSymptom || !session.patientInfo) {
      return this.createErrorResponse('缺少必要信息');
    }

    const result = this.generateConsultationResult(session);

    const responseContent = this.formatResultOutput(result);

    const assistantMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'assistant',
      content: responseContent,
      timestamp: Date.now(),
      type: 'result',
      resultData: result,
    };

    session.messages.push(assistantMessage);

    return {
      success: true,
      message: assistantMessage,
      result,
    };
  }

  // 生成导诊结果
  private generateConsultationResult(session: SessionState): ConsultationResult {
    const { patientInfo, chiefComplaint, matchedSymptom, collectedData, messages } = session;
    
    if (!patientInfo || !chiefComplaint || !matchedSymptom) {
      throw new Error('缺少必要信息');
    }

    const deptConfig = symptomToDepartment[matchedSymptom];
    
    // 生成可能疾病方向（基于症状的简单匹配）
    const possibleConditions = this.generatePossibleConditions(matchedSymptom, collectedData);
    
    // 生成分鉴要点
    const differentialPoints = this.generateDifferentialPoints(matchedSymptom, collectedData);

    // 判断紧急程度
    const urgency = this.determineUrgency(matchedSymptom, collectedData);

    const result: ConsultationResult = {
      patientInfo,
      chiefComplaint,
      summary: {
        mainPoints: [
          `主诉：${chiefComplaint.symptom}，持续${chiefComplaint.duration}`,
          `现病史：${collectedData.presentIllness?.rawInput || '未详细描述'}`,
          `伴随症状：${collectedData.accompanying?.rawInput || '无特殊'}`,
        ],
        keyFindings: this.extractKeyFindings(collectedData),
      },
      diagnosisThinking: {
        possibleConditions,
        differentialPoints,
      },
      departmentRecommendation: {
        department: deptConfig.department,
        departmentCode: deptConfig.code,
        reason: `根据您${chiefComplaint.symptom}的症状，结合问诊信息，推荐就诊${deptConfig.department}`,
        urgency: urgency.level,
        urgencyLabel: urgency.label,
        suggestedChecks: this.generateSuggestedChecks(matchedSymptom),
        precautions: this.generatePrecautions(matchedSymptom, urgency.level),
        warningSigns: deptConfig.emergencySymptoms,
        icon: deptConfig.icon,
      },
      conversationLog: messages,
      createdAt: Date.now(),
    };

    return result;
  }

  // 格式化结果输出
  private formatResultOutput(result: ConsultationResult): string {
    const { summary, diagnosisThinking, departmentRecommendation } = result;
    
    let output = '## 导诊结果\n\n';
    
    // 信息小结
    output += '### 一、信息小结\n';
    output += summary.mainPoints.map(p => `- ${p}`).join('\n');
    output += '\n\n';
    
    // 诊断思路分析
    output += '### 二、诊断思路分析\n\n';
    output += '**可能疾病方向：**\n';
    diagnosisThinking.possibleConditions.forEach((condition, index) => {
      const priorityIcon = condition.priority === 'high' ? '🟡' : condition.priority === 'medium' ? '🟢' : '⚪';
      output += `${index + 1}. ${priorityIcon} **${condition.name}**：${condition.evidence.join('；')}\n`;
    });
    output += '\n';
    
    if (diagnosisThinking.differentialPoints.length > 0) {
      output += '**鉴别要点：**\n';
      diagnosisThinking.differentialPoints.forEach(point => {
        output += `- ${point}\n`;
      });
      output += '\n';
    }
    
    // 科室推荐
    output += '### 三、科室推荐\n\n';
    output += `**推荐科室**：${departmentRecommendation.department}\n\n`;
    output += `**推荐原因**：${departmentRecommendation.reason}\n\n`;
    output += `**紧急程度**：${departmentRecommendation.urgencyLabel}\n\n`;
    
    output += '**建议检查**：\n';
    departmentRecommendation.suggestedChecks.forEach(check => {
      output += `- ${check}\n`;
    });
    output += '\n';
    
    output += '**就诊前注意事项**：\n';
    departmentRecommendation.precautions.forEach(precaution => {
      output += `- ${precaution}\n`;
    });
    output += '\n';
    
    output += '⚠️ **需立即就医的情况**：\n';
    departmentRecommendation.warningSigns.forEach(warning => {
      output += `- ${warning}\n`;
    });
    output += '\n';
    
    output += '---\n';
    output += '**声明**：以上仅为基于问诊信息的导诊建议与诊断思路分析，**不构成临床诊断**。请务必在医疗机构由医生完成病史采集、体格检查及辅助检查后做出诊断与治疗。如有紧急情况，请立即拨打120。';
    
    return output;
  }

  // 生成急诊响应
  private createEmergencyResponse(emergencyData: EmergencyData, session: SessionState): AIServiceResponse {
    const assistantMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'assistant',
      content: `## 🚨 急诊建议\n\n**检测到急诊指征**：${emergencyData.description}\n\n**请立即拨打 120 或前往最近医院急诊科！**\n\n**等待期间注意事项**：\n${emergencyData.immediateActions.map(action => `- ${action}`).join('\n')}\n\n**声明**：本系统检测到可能危及生命的紧急情况，请立即寻求专业医疗救助。`,
      timestamp: Date.now(),
      type: 'emergency',
      emergencyData,
    };

    session.messages.push(assistantMessage);

    return {
      success: true,
      message: assistantMessage,
    };
  }

  // 检查是否触发急诊
  private checkEmergency(userInput: string, symptomType: SymptomType): EmergencyData | null {
    const relevantRules = emergencyRules.filter(rule => 
      rule.symptomTypes.includes(symptomType)
    );

    for (const rule of relevantRules) {
      for (const pattern of rule.patterns) {
        if (pattern.test(userInput)) {
          return {
            triggerSymptom: symptomType,
            description: rule.description,
            immediateActions: rule.actions,
            severity: rule.severity,
          };
        }
      }
    }

    return null;
  }

  // 匹配症状类型
  private matchSymptom(userInput: string): SymptomType | null {
    const input = userInput.toLowerCase();
    
    for (const [symptom, keywords] of Object.entries(symptomKeywords)) {
      for (const keyword of keywords) {
        if (input.includes(keyword.toLowerCase())) {
          return symptom as SymptomType;
        }
      }
    }
    
    return null;
  }

  // 获取症状中文名
  private getSymptomName(symptomType: SymptomType): string {
    const names: Record<SymptomType, string> = {
      fever: '发热',
      chestPain: '胸痛',
      abdominalPain: '腹痛',
      headache: '头痛',
      cough: '咳嗽',
      dyspnea: '呼吸困难',
      hemoptysis: '咯血',
      cyanosis: '发绀',
      palpitation: '心悸',
      jaundice: '黄疸',
      hematemesis: '呕血与便血',
      nausea: '恶心呕吐',
      diarrhea: '腹泻',
      dysuria: '尿频尿急尿痛',
      hematuria: '血尿',
      oliguria: '少尿无尿',
      edema: '水肿',
      consciousness: '意识障碍',
      febrileSeizure: '热性惊厥',
    };
    return names[symptomType] || symptomType;
  }

  // 提取患者信息
  private extractPatientInfo(userInput: string): Partial<PatientInfo> {
    const info: Partial<PatientInfo> = {};
    
    // 提取手机号
    const phoneMatch = userInput.match(/1[3-9]\d{9}/);
    if (phoneMatch) {
      info.phone = phoneMatch[0];
    }
    
    // 提取年龄
    const ageMatch = userInput.match(/(\d{1,3})\s*[岁周]/);
    if (ageMatch) {
      info.age = parseInt(ageMatch[1]);
    }
    
    // 提取性别
    if (userInput.includes('男')) {
      info.gender = 'male';
    } else if (userInput.includes('女')) {
      info.gender = 'female';
    }
    
    // 提取姓名 - 支持多种格式
    // 格式1: "我叫XXX"、"姓名XXX"、"我是XXX"
    const nameMatchWithPrefix = userInput.match(/(?:我叫|姓名|我是)\s*([^，,。\s]{1,6})/);
    if (nameMatchWithPrefix) {
      info.name = nameMatchWithPrefix[1];
    } else {
      // 格式2: 直接提取2-4个汉字的姓名（排除已知的手机号、年龄、症状等）
      // 移除手机号、数字、年龄单位、标点符号
      let cleanedInput = userInput
        .replace(/1[3-9]\d{9}/g, '') // 移除手机号
        .replace(/\d+\s*[岁周天时月年]/g, '') // 移除年龄
        .replace(/[，,。！？；：""''（）()【】\[\]]/g, '') // 移除标点
        .replace(/[男女性]/g, '') // 移除性别字
        .trim();
      
      // 尝试匹配2-4个连续的汉字（常见姓名长度）
      const nameMatchDirect = cleanedInput.match(/([\u4e00-\u9fa5]{2,4})/);
      if (nameMatchDirect) {
        const potentialName = nameMatchDirect[1];
        // 排除常见的非姓名字（如症状词）
        const nonNameWords = ['恶心', '呕吐', '头疼', '头痛', '发烧', '发热', '咳嗽', '腹泻', '腹痛', '胸痛', '呼吸困难', '心慌', '头晕', '腹胀', '胃痛', '肚子疼', '不舒服', '很难受', '有点疼'];
        if (!nonNameWords.some(word => potentialName.includes(word))) {
          info.name = potentialName;
        }
      }
    }
    
    return info;
  }

  // 提取持续时间
  private extractDuration(userInput: string): string {
    const patterns = [
      /(\d+)\s*天/,
      /(\d+)\s*小时/,
      /(\d+)\s*周/,
      /(\d+)\s*月/,
      /(\d+)\s*年/,
      /(今天|昨天|前天)/,
      /(刚刚|刚才|一会儿)/,
    ];
    
    for (const pattern of patterns) {
      const match = userInput.match(pattern);
      if (match) {
        return match[0];
      }
    }
    
    return '未明确';
  }

  // 生成可能的疾病方向
  private generatePossibleConditions(
    symptomType: SymptomType,
    collectedData: SessionState['collectedData']
  ) {
    const conditions: Array<{ name: string; priority: 'high' | 'medium' | 'low'; evidence: string[] }> = [];
    
    const rawInput = [
      collectedData.presentIllness?.rawInput || '',
      collectedData.accompanying?.rawInput || '',
    ].join(' ');
    
    // 根据症状类型和输入内容生成可能的疾病
    switch (symptomType) {
      case 'abdominalPain':
        if (rawInput.includes('右下腹') || rawInput.includes('转移')) {
          conditions.push({
            name: '急性阑尾炎',
            priority: 'high',
            evidence: ['转移性右下腹痛', '右下腹压痛'],
          });
        }
        if (rawInput.includes('上腹') || rawInput.includes('胃')) {
          conditions.push({
            name: '急性胃肠炎/消化性溃疡',
            priority: 'medium',
            evidence: ['上腹部疼痛', '与饮食相关'],
          });
        }
        conditions.push({
          name: '功能性消化不良',
          priority: 'low',
          evidence: ['症状不典型', '需排除器质性疾病'],
        });
        break;
        
      case 'chestPain':
        if (rawInput.includes('压榨') || rawInput.includes('大汗') || rawInput.includes('放射')) {
          conditions.push({
            name: '急性冠脉综合征',
            priority: 'high',
            evidence: ['压榨性胸痛', '伴大汗或放射痛'],
          });
        }
        conditions.push({
          name: '胸膜炎/肋软骨炎',
          priority: 'medium',
          evidence: ['胸痛与呼吸相关'],
        });
        break;
        
      case 'fever':
        if (rawInput.includes('咳嗽') || rawInput.includes('咽痛')) {
          conditions.push({
            name: '上呼吸道感染',
            priority: 'medium',
            evidence: ['发热伴呼吸道症状'],
          });
        }
        conditions.push({
          name: '感染性发热',
          priority: 'medium',
          evidence: ['急性发热'],
        });
        break;
        
      case 'headache':
        if (rawInput.includes('搏动') || rawInput.includes('跳')) {
          conditions.push({
            name: '偏头痛',
            priority: 'medium',
            evidence: ['搏动性头痛'],
          });
        }
        conditions.push({
          name: '紧张性头痛',
          priority: 'medium',
          evidence: ['头痛'],
        });
        break;
        
      default:
        conditions.push({
          name: `${this.getSymptomName(symptomType)}待查`,
          priority: 'medium',
          evidence: ['症状典型', '需进一步检查明确'],
        });
    }
    
    return conditions;
  }

  // 生成分鉴要点
  private generateDifferentialPoints(
    symptomType: SymptomType,
    collectedData: SessionState['collectedData']
  ): string[] {
    const points: string[] = [];
    const rawInput = [
      collectedData.presentIllness?.rawInput || '',
      collectedData.accompanying?.rawInput || '',
    ].join(' ');
    
    // 根据症状类型生成鉴别要点
    switch (symptomType) {
      case 'abdominalPain':
        if (rawInput.includes('转移')) {
          points.push('转移性右下腹痛高度提示阑尾炎');
        }
        if (rawInput.includes('反跳痛') || rawInput.includes('压痛')) {
          points.push('腹膜刺激征提示炎症已累及腹膜');
        }
        break;
        
      case 'chestPain':
        if (rawInput.includes('压榨') || rawInput.includes('紧缩')) {
          points.push('压榨性胸痛需警惕心源性疼痛');
        }
        if (rawInput.includes('呼吸') || rawInput.includes('咳嗽')) {
          points.push('胸痛与呼吸相关提示胸膜性疼痛');
        }
        break;
        
      case 'fever':
        if (rawInput.includes('寒战')) {
          points.push('寒战提示可能有菌血症');
        }
        break;
    }
    
    return points;
  }

  // 判断紧急程度
  private determineUrgency(
    symptomType: SymptomType,
    collectedData: SessionState['collectedData']
  ): { level: 'emergency' | 'urgent' | 'routine'; label: string } {
    const rawInput = [
      collectedData.presentIllness?.rawInput || '',
      collectedData.accompanying?.rawInput || '',
      collectedData.aggravation?.rawInput || '',
    ].join(' ');
    
    // 急诊关键词
    const emergencyKeywords = ['剧烈', '严重', '不能', '昏迷', '大量', '休克'];
    for (const keyword of emergencyKeywords) {
      if (rawInput.includes(keyword)) {
        return { level: 'emergency', label: '🔴 立即急诊' };
      }
    }
    
    // 紧急关键词
    const urgentKeywords = ['加重', '发热', '呕吐', '持续'];
    for (const keyword of urgentKeywords) {
      if (rawInput.includes(keyword)) {
        return { level: 'urgent', label: '🟡 尽快就诊（24小时内）' };
      }
    }
    
    return { level: 'routine', label: '🟢 普通门诊' };
  }

  // 生成建议检查
  private generateSuggestedChecks(symptomType: SymptomType): string[] {
    const checks: Record<SymptomType, string[]> = {
      fever: ['血常规', 'C反应蛋白', '必要时胸片'],
      chestPain: ['心电图', '心肌酶', '胸片或CT'],
      abdominalPain: ['血常规', '腹部超声', '必要时CT'],
      headache: ['头颅CT或MRI', '血压监测'],
      cough: ['胸片', '血常规'],
      dyspnea: ['血气分析', '胸片', '心电图', 'BNP'],
      hemoptysis: ['胸部CT', '血常规', '凝血功能'],
      cyanosis: ['血气分析', '心脏超声', '胸片'],
      palpitation: ['心电图', '24小时动态心电图', '甲状腺功能'],
      jaundice: ['肝功能', '腹部超声', '肝炎病毒标志物'],
      hematemesis: ['血常规', '凝血功能', '胃镜'],
      nausea: ['血常规', '电解质', '必要时胃镜'],
      diarrhea: ['大便常规+培养', '血常规'],
      dysuria: ['尿常规+培养', '泌尿系超声'],
      hematuria: ['尿常规', '泌尿系超声', 'CT'],
      oliguria: ['肾功能', '泌尿系超声', '电解质'],
      edema: ['肾功能', '尿蛋白', '心功能检查'],
      consciousness: ['头颅CT', '血糖', '电解质'],
      febrileSeizure: ['血常规', '脑电图', '必要时腰穿'],
    };
    
    return checks[symptomType] || ['血常规', '根据具体情况选择检查'];
  }

  // 生成就诊前注意事项
  private generatePrecautions(symptomType: SymptomType, urgency: string): string[] {
    const basePrecautions = [
      '携带身份证、医保卡',
      '记录症状发生时间',
    ];
    
    const specificPrecautions: Record<SymptomType, string[]> = {
      fever: ['测量并记录体温变化'],
      chestPain: ['避免剧烈活动', '如有既往心电图请携带'],
      abdominalPain: ['暂禁食禁水（可能需要检查或手术）', '避免自行服用止痛药'],
      headache: ['避免强光刺激', '记录头痛发作频率'],
      cough: ['避免吸烟及刺激性气味'],
      dyspnea: ['保持坐位或半卧位', '避免平躺'],
      hemoptysis: ['侧卧位', '记录出血量'],
      cyanosis: ['保持温暖', '避免剧烈活动'],
      palpitation: ['避免咖啡、浓茶', '记录发作时间'],
      jaundice: ['清淡饮食', '避免油腻食物'],
      hematemesis: ['禁食禁水', '记录出血情况'],
      nausea: ['清淡饮食', '少量多餐'],
      diarrhea: ['多饮水防脱水', '避免油腻食物'],
      dysuria: ['多饮水'],
      hematuria: ['多饮水', '避免剧烈运动'],
      oliguria: ['记录尿量'],
      edema: ['限盐饮食', '记录体重变化'],
      consciousness: ['家属陪同', '携带既往病历'],
      febrileSeizure: ['侧卧位防误吸', '记录发作时间'],
    };
    
    return [...basePrecautions, ...(specificPrecautions[symptomType] || [])];
  }

  // 提取关键发现
  private extractKeyFindings(collectedData: SessionState['collectedData']): string[] {
    const findings: string[] = [];
    
    if (collectedData.presentIllness?.rawInput) {
      findings.push(`现病史：${collectedData.presentIllness.rawInput}`);
    }
    if (collectedData.accompanying?.rawInput) {
      findings.push(`伴随症状：${collectedData.accompanying.rawInput}`);
    }
    if (collectedData.aggravation?.rawInput) {
      findings.push(`加重缓解因素：${collectedData.aggravation.rawInput}`);
    }
    
    return findings;
  }

  // 创建错误响应
  private createErrorResponse(error: string): AIServiceResponse {
    return {
      success: false,
      error,
    };
  }
}

// 导出单例实例
export const localSkillService = new LocalSkillService();
