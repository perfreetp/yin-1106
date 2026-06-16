import { ChallengeLevel, ChallengeQuestion } from '../types';

export const challengeQuestions: ChallengeQuestion[] = [
  {
    id: 'q-1',
    content: '以下哪个事项名称表述是规范的？',
    type: 'single_choice',
    options: [
      'A. 营业执照办理',
      'B. 行政许可：企业设立登记',
      'C. 申请→审核→发证',
      'D. 企业登记'
    ],
    correctAnswer: 'B',
    score: 10,
    knowledgePoint: '事项名称规范',
    explanation: '事项名称应当采用"行政许可/行政给付/行政确认等+具体事项"的结构，不得使用简称或包含办理流程。'
  },
  {
    id: 'q-2',
    content: '受理条件中出现以下哪种表述属于不规范？（多选）',
    type: 'multiple_choice',
    options: [
      'A. "具有相应的经济实力"',
      'B. "符合有关规定"',
      'C. "申请人为具有独立法人资格的企业"',
      'D. "申请人为本地企业"'
    ],
    correctAnswer: ['A', 'B', 'D'],
    score: 15,
    knowledgePoint: '受理条件规范',
    explanation: 'A属于模糊表述，无可量化标准；B属于兜底性模糊表述；D涉嫌地域歧视，违反公平竞争原则。'
  },
  {
    id: 'q-3',
    content: '判断：承诺时限可以根据实际情况适当超过法定时限，只要能说明理由即可。',
    type: 'judgment',
    options: ['正确', '错误'],
    correctAnswer: '错误',
    score: 10,
    knowledgePoint: '办理时限设置',
    explanation: '承诺时限不得超过法定时限，必须在法定时限基础上进行压缩。'
  },
  {
    id: 'q-4',
    content: '申请材料清单中应当包含以下哪些要素？',
    type: 'multiple_choice',
    options: [
      'A. 材料名称',
      'B. 材料来源',
      'C. 材料形式（原件/复印件）',
      'D. 份数'
    ],
    correctAnswer: ['A', 'B', 'C', 'D'],
    score: 15,
    knowledgePoint: '申请材料编制',
    explanation: '申请材料应当明确材料名称、来源、形式、份数、出具单位、签章要求等要素。'
  },
  {
    id: 'q-5',
    content: '以下哪种材料可以通过数据共享免予提交纸质材料？',
    type: 'single_choice',
    options: [
      'A. 申请人自备的申请书',
      'B. 双方签订的合同',
      'C. 居民身份证',
      'D. 项目可行性研究报告'
    ],
    correctAnswer: 'C',
    score: 10,
    knowledgePoint: '材料减免情形',
    explanation: '居民身份证是公安机关核发的证件，可以通过电子证照共享获取，免予提交纸质复印件。'
  },
  {
    id: 'q-6',
    content: '引用法定依据时，以下哪种表述是规范的？',
    type: 'single_choice',
    options: [
      'A. 根据《XX法》有关规定',
      'B. 《中华人民共和国行政许可法》第十二条第（三）项',
      'C. 按照上级规定',
      'D. 根据XX法'
    ],
    correctAnswer: 'B',
    score: 10,
    knowledgePoint: '法定依据引用',
    explanation: '引用法定依据应当明确到具体的法律名称及其条款项，必要时注明修订年份和发文字号。'
  },
  {
    id: 'q-7',
    content: '判断：容缺受理可以允许申请人在补交材料前就领取审批结果。',
    type: 'judgment',
    options: ['正确', '错误'],
    correctAnswer: '错误',
    score: 10,
    knowledgePoint: '容缺受理',
    explanation: '容缺受理是先受理、后补材料，但必须在申请人补正全部材料后才能作出审批决定和发放审批结果。'
  },
  {
    id: 'q-8',
    content: '以下关于告知承诺制的说法，哪些是正确的？',
    type: 'multiple_choice',
    options: [
      'A. 应当明确告知承诺内容和法律责任',
      'B. 所有证明事项都可以实行告知承诺制',
      'C. 应当建立事中事后核查机制',
      'D. 应当明确不实承诺的惩戒措施'
    ],
    correctAnswer: ['A', 'C', 'D'],
    score: 15,
    knowledgePoint: '告知承诺制',
    explanation: '告知承诺制有明确的适用范围，必须在目录范围内实施，并非所有证明事项都可以实行。'
  },
  {
    id: 'q-9',
    content: '办理时限应当以______为单位计算。',
    type: 'fill_blank',
    correctAnswer: '工作日',
    score: 10,
    knowledgePoint: '办理时限设置',
    explanation: '办理时限应当以工作日为单位，避免使用"天"等模糊表述，节假日不计入办理时限。'
  },
  {
    id: 'q-10',
    content: '以下哪种情况属于法定依据与事项要素不匹配？',
    type: 'single_choice',
    options: [
      'A. 依据条款明确提到了受理条件中的具体要求',
      'B. 依据条款是关于其他事项的一般性规定',
      'C. 依据条款明确规定了需要提交的材料',
      'D. 依据条款明确了办理时限'
    ],
    correctAnswer: 'B',
    score: 10,
    knowledgePoint: '法定依据匹配',
    explanation: '法定依据应当与事项的具体要素相对应，如果只是其他事项的一般性规定，则不能支撑本事项的要素设置。'
  },
  {
    id: 'q-11',
    content: '判断：为了方便群众，可以根据实际需要自行增设一些便民的受理条件。',
    type: 'judgment',
    options: ['正确', '错误'],
    correctAnswer: '错误',
    score: 10,
    knowledgePoint: '受理条件规范',
    explanation: '受理条件必须有明确的法律法规依据，不得自行增设或变相增加许可条件。'
  },
  {
    id: 'q-12',
    content: '申请材料中使用"相关证明材料"这种表述，属于什么错误？',
    type: 'single_choice',
    options: [
      'A. 格式错误',
      'B. 模糊表述',
      'C. 缺少签章要求',
      'D. 缺少份数'
    ],
    correctAnswer: 'B',
    score: 10,
    knowledgePoint: '申请材料编制',
    explanation: '"相关证明材料"属于模糊表述，申请人无法明确知道需要提交什么材料，应当具体明确。'
  },
  {
    id: 'q-13',
    content: '以下哪些属于不计入办理时限的特殊环节？',
    type: 'multiple_choice',
    options: [
      'A. 专家评审',
      'B. 现场核查',
      'C. 窗口受理',
      'D. 公示公告'
    ],
    correctAnswer: ['A', 'B', 'D'],
    score: 15,
    knowledgePoint: '办理时限设置',
    explanation: '专家评审、现场核查、公示公告、听证等特殊环节时间应当单独计算，不计入一般办理时限。'
  },
  {
    id: 'q-14',
    content: '以下哪部法规的引用需要注明发文字号？',
    type: 'single_choice',
    options: [
      'A. 法律',
      'B. 行政法规',
      'C. 地方性法规',
      'D. 部门规章'
    ],
    correctAnswer: 'D',
    score: 10,
    knowledgePoint: '法定依据引用',
    explanation: '引用部门规章和地方政府规章时，应当注明发文字号，如"人力资源和社会保障部令第19号"。'
  },
  {
    id: 'q-15',
    content: '判断：对于可通过数据共享获取的材料，仍然应当要求申请人提交纸质材料以备查。',
    type: 'judgment',
    options: ['正确', '错误'],
    correctAnswer: '错误',
    score: 10,
    knowledgePoint: '材料减免情形',
    explanation: '凡能通过网络共享复用的材料，不得要求企业和群众重复提交，这是"互联网+政务服务"的基本要求。'
  },
  {
    id: 'q-16',
    content: '容缺受理中，以下哪种材料属于不可容缺的核心材料？',
    type: 'single_choice',
    options: [
      'A. 法定代表人身份证明复印件',
      'B. 授权委托书',
      'C. 行政许可证件原件',
      'D. 经营场所平面图'
    ],
    correctAnswer: 'C',
    score: 10,
    knowledgePoint: '容缺受理',
    explanation: '行政许可证件原件是核心材料，必须在受理时提交，不能容缺后补。'
  },
  {
    id: 'q-17',
    content: '以下关于承诺时限的说法，正确的是：',
    type: 'multiple_choice',
    options: [
      'A. 承诺时限不得超过法定时限',
      'B. 即办件的承诺时限为即办',
      'C. 承诺时限应当明确到具体工作日',
      'D. 特殊环节时间应当包含在承诺时限内'
    ],
    correctAnswer: ['A', 'B', 'C'],
    score: 15,
    knowledgePoint: '办理时限设置',
    explanation: '特殊环节时间应当单独计算，不计入承诺时限。'
  },
  {
    id: 'q-18',
    content: '《XX省暂住人口管理条例》（1995年）作为依据引用时，应当：',
    type: 'single_choice',
    options: [
      'A. 直接引用',
      'B. 核实是否仍有效，"暂住"相关规定可能已被"居住"制度取代',
      'C. 注明是旧条例',
      'D. 与新条例一起引用'
    ],
    correctAnswer: 'B',
    score: 10,
    knowledgePoint: '法定依据引用',
    explanation: '引用依据时必须确保现行有效，注意法律法规的"立改废释"情况，特别是涉及制度变革的内容。'
  },
  {
    id: 'q-19',
    content: '判断：办理流程只需要用文字描述清楚即可，不需要绘制流程图。',
    type: 'judgment',
    options: ['正确', '错误'],
    correctAnswer: '错误',
    score: 10,
    knowledgePoint: '办理流程规范',
    explanation: '办理流程应当既有文字描述，又有流程图，且二者应当保持一致，便于申请人理解。'
  },
  {
    id: 'q-20',
    content: '以下关于材料减免的说法，正确的是：',
    type: 'multiple_choice',
    options: [
      'A. 材料减免必须有政策依据',
      'B. 电子证照与纸质证照具有同等法律效力',
      'C. 数据共享无法获取时，应当允许提交纸质材料',
      'D. 所有材料都可以随意减免'
    ],
    correctAnswer: ['A', 'B', 'C'],
    score: 15,
    knowledgePoint: '材料减免情形',
    explanation: '材料减免必须依法依规进行，不得随意减免法定申请材料，同时要设置纸质材料兜底机制。'
  },
  {
    id: 'q-21',
    content: '受理条件中"申请人应当具有良好的信用记录"，这一表述存在什么问题？',
    type: 'single_choice',
    options: [
      'A. 表述完整规范',
      'B. "良好"缺乏具体判断标准',
      'C. 不应当作为受理条件',
      'D. 应当写入申请材料而不是受理条件'
    ],
    correctAnswer: 'B',
    score: 10,
    knowledgePoint: '受理条件规范',
    explanation: '"良好的信用记录"缺乏具体的判断标准，应当明确"无失信被执行人记录"、"无重大行政处罚记录"等可验证的标准。'
  },
  {
    id: 'q-22',
    content: '申请材料清单中"1. 身份证"这一表述缺少哪些要素？',
    type: 'multiple_choice',
    options: [
      'A. 材料来源',
      'B. 材料形式（原件/复印件）',
      'C. 份数',
      'D. 签章要求'
    ],
    correctAnswer: ['A', 'B', 'C', 'D'],
    score: 15,
    knowledgePoint: '申请材料编制',
    explanation: '完整的材料表述应当包含：材料名称、来源、形式、份数、签章要求等。规范表述如"居民身份证：公安机关核发，原件核验后退回，复印件1份"。'
  },
  {
    id: 'q-23',
    content: '判断：同一事项在不同地区可以根据本地实际设置不同的受理条件。',
    type: 'judgment',
    options: ['正确', '错误'],
    correctAnswer: '错误',
    score: 10,
    knowledgePoint: '事项标准化',
    explanation: '政务服务事项应当实行全国或全省统一标准，不得随意增设条件或降低标准，确保同一事项无差别受理、同标准办理。'
  },
  {
    id: 'q-24',
    content: '以下哪项是告知承诺制中必须明确的内容？',
    type: 'single_choice',
    options: [
      'A. 不实承诺的法律责任',
      'B. 事项办理的咨询电话',
      'C. 工作人员姓名',
      'D. 窗口位置'
    ],
    correctAnswer: 'A',
    score: 10,
    knowledgePoint: '告知承诺制',
    explanation: '告知承诺制必须明确告知内容、承诺内容、核查方式和不实承诺的法律责任。'
  },
  {
    id: 'q-25',
    content: '某事项法定时限为20个工作日，以下承诺时限设置哪项是不规范的？',
    type: 'single_choice',
    options: [
      'A. 承诺时限：10个工作日',
      'B. 承诺时限：20个工作日（法定时限）',
      'C. 承诺时限：25个工作日（考虑实际工作量）',
      'D. 承诺时限：即办'
    ],
    correctAnswer: 'C',
    score: 10,
    knowledgePoint: '办理时限设置',
    explanation: '承诺时限不得超过法定时限，25个工作日超过了法定的20个工作日，不符合规范要求。'
  }
];

export const challengeLevels: ChallengeLevel[] = [
  {
    id: 'level-1',
    name: '第一关：基础规范入门',
    description: '考察事项名称、受理条件、申请材料的基础规范',
    unlockRequirement: 0,
    timeLimit: 600,
    passingScore: 60,
    questionIds: ['q-1', 'q-2', 'q-4', 'q-5', 'q-6', 'q-10', 'q-12', 'q-16', 'q-21', 'q-22']
  },
  {
    id: 'level-2',
    name: '第二关：法定依据准确引用',
    description: '考察法定依据的规范引用、依据与要素的匹配性判断',
    unlockRequirement: 3,
    timeLimit: 600,
    passingScore: 70,
    questionIds: ['q-6', 'q-10', 'q-14', 'q-18', 'q-2', 'q-11', 'q-23', 'q-2', 'q-10', 'q-14']
  },
  {
    id: 'level-3',
    name: '第三关：办理时限合理设置',
    description: '考察法定时限与承诺时限的关系、特殊环节时间的处理',
    unlockRequirement: 6,
    timeLimit: 480,
    passingScore: 70,
    questionIds: ['q-3', 'q-9', 'q-13', 'q-17', 'q-25', 'q-3', 'q-9', 'q-13', 'q-17', 'q-25']
  },
  {
    id: 'level-4',
    name: '第四关：材料减免情形编写',
    description: '考察免予提交、容缺受理、告知承诺等材料减免情形的规范编写',
    unlockRequirement: 9,
    timeLimit: 600,
    passingScore: 75,
    questionIds: ['q-5', 'q-7', 'q-8', 'q-15', 'q-16', 'q-20', 'q-24', 'q-5', 'q-7', 'q-8']
  },
  {
    id: 'level-5',
    name: '第五关：综合能力考核',
    description: '综合考察各方面编制规范，随机抽取15道题目',
    unlockRequirement: 12,
    timeLimit: 900,
    passingScore: 80,
    questionIds: ['q-1', 'q-3', 'q-4', 'q-6', 'q-8', 'q-10', 'q-12', 'q-14', 'q-16', 'q-18', 'q-20', 'q-22', 'q-23', 'q-24', 'q-25']
  }
];
