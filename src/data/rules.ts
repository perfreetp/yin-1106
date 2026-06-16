import { RuleCategory, Rule } from '../types';

export const ruleCategories: { id: RuleCategory; name: string; icon: string; description: string }[] = [
  {
    id: 'acceptance_condition',
    name: '受理条件编制',
    icon: 'FileCheck',
    description: '学习如何规范编写事项受理条件，明确申请主体资格、前置条件等要求'
  },
  {
    id: 'application_material',
    name: '申请材料编制',
    icon: 'FileText',
    description: '掌握申请材料的规范表述，包括材料名称、来源、形式、份数等要素'
  },
  {
    id: 'legal_basis',
    name: '法定依据引用',
    icon: 'Scale',
    description: '正确引用法律法规规章，确保依据条款与事项要素对应'
  },
  {
    id: 'time_limit',
    name: '办理时限设置',
    icon: 'Clock',
    description: '合理设置法定时限和承诺时限，符合优化营商环境要求'
  },
  {
    id: 'reduction',
    name: '材料减免情形',
    icon: 'FileMinus',
    description: '规范编写免予提交、容缺受理、告知承诺等减免情形'
  },
  {
    id: 'general',
    name: '通用规范',
    icon: 'BookOpen',
    description: '事项编制的通用规范、术语使用、格式要求等基础规则'
  }
];

export const rules: Rule[] = [
  {
    id: 'rule-1',
    categoryId: 'acceptance_condition',
    category: 'acceptance_condition',
    title: '受理条件应当明确申请主体资格',
    content: '受理条件必须明确规定申请主体的资格要求，包括身份条件、资质条件、能力条件等。对于法人和其他组织，应当明确其组织形式、业务范围等要求；对于自然人，应当明确其身份、职业、技能等要求。',
    description: '本规则主要规范受理条件中申请主体资格的表述，确保条件明确、具体、可操作。',
    keyPoints: [
      '明确区分法人、自然人、其他组织等申请主体类型',
      '资格条件应当有明确的判断标准',
      '避免使用"相应能力"等模糊表述',
      '不得将后置审批条件作为受理条件'
    ],
    commonMistakes: [
      {
        description: '未明确申请主体类型，如"申请人"未区分法人/自然人',
        example: '申请人应当具有相应能力',
        correction: '申请人为在本市行政区域内注册的企业法人，且注册资本不低于100万元'
      },
      {
        description: '资格条件表述模糊，如"具有相应能力"未说明具体标准',
        example: '具有相应的专业能力',
        correction: '具有中级以上专业技术职称资格证书'
      },
      {
        description: '使用"有关规定"等模糊表述，未明确具体条件',
        example: '符合有关规定的其他条件',
        correction: '近3年内无重大违法违规记录'
      },
      {
        description: '将后置审批条件作为受理条件',
        example: '应当取得XX部门的批准文件',
        correction: '该条件属于后置审批，不得作为受理条件'
      }
    ],
    correctExamples: [
      '申请主体为在本市行政区域内注册的企业法人，且注册资本不低于100万元',
      '申请人为具有完全民事行为能力的本市户籍居民，且取得相应职业资格证书',
      '申请单位应当具备独立法人资格，且近3年内无重大违法记录'
    ],
    correctExample: '申请主体为在本市行政区域内注册的企业法人，且注册资本不低于100万元',
    explanation: '明确申请主体资格是保障事项办理准确性的基础。模糊的主体资格要求会导致受理标准不统一，影响政务服务质量。',
    relatedExerciseIds: ['ex-1', 'ex-2'],
    relatedExercises: ['ex-1', 'ex-2'],
    difficulty: 2,
    knowledgePoint: '受理条件编制'
  },
  {
    id: 'rule-2',
    categoryId: 'acceptance_condition',
    category: 'acceptance_condition',
    title: '受理条件应当符合法律法规规定',
    content: '受理条件必须有明确的法律法规依据，不得擅自增加或变相增加许可条件。对于法律、法规、规章未明确规定的条件，不得作为受理条件。',
    description: '本规则强调受理条件的合法性，防止随意增设门槛。',
    keyPoints: [
      '所有受理条件必须有明确的法律法规依据',
      '不得擅自增加或变相增加许可条件',
      '不得以"其他必要条件"兜底为由扩大条件范围',
      '不得设置歧视性条件'
    ],
    commonMistakes: [
      {
        description: '自行增设无依据的受理条件',
        example: '要求申请人提供单位介绍信（无法律依据）',
        correction: '取消无依据的介绍信要求'
      },
      {
        description: '将日常监管要求作为受理条件',
        example: '申请人上年度考核合格',
        correction: '考核属于日常监管，不得作为受理条件'
      },
      {
        description: '以"其他必要条件"兜底为由扩大条件范围',
        example: '满足审批机关认为必要的其他条件',
        correction: '删除兜底条款，明确全部受理条件'
      },
      {
        description: '违反公平竞争原则设置歧视性条件',
        example: '仅限本地企业申请',
        correction: '取消地域限制，面向全国符合条件的主体开放'
      }
    ],
    correctExamples: [
      '根据《XX法》第十条规定，申请人应当取得XX部门颁发的资质证书',
      '按照《XX条例》第五条要求，申请人应当具有与其经营活动相适应的经营场所'
    ],
    correctExample: '根据《XX法》第十条规定，申请人应当取得XX部门颁发的资质证书',
    explanation: '依法设定受理条件是法治政府建设的基本要求。擅自增设条件会增加市场主体负担，破坏营商环境。',
    relatedExerciseIds: ['ex-3'],
    relatedExercises: ['ex-3'],
    difficulty: 3,
    knowledgePoint: '受理条件编制'
  },
  {
    id: 'rule-3',
    categoryId: 'application_material',
    category: 'application_material',
    title: '申请材料名称应当规范准确',
    content: '申请材料名称应当具体、明确，不得使用"相关材料"、"有关证明"等模糊表述。材料名称应当与法定依据中规定的名称保持一致。',
    description: '本规则规范申请材料名称的表述，确保申请人清楚需要提交的材料。',
    keyPoints: [
      '材料名称应当具体、明确，避免模糊表述',
      '与法定依据中规定的名称保持一致',
      '明确原件/复印件要求',
      '注明份数、规格等具体要求'
    ],
    commonMistakes: [
      {
        description: '材料名称过于笼统，如"相关证明材料"',
        example: '相关证明材料',
        correction: '居民身份证原件及复印件'
      },
      {
        description: '使用不规范简称，如"营业执照"简称为"执照"',
        example: '执照复印件',
        correction: '营业执照（副本）复印件（加盖公章）'
      },
      {
        description: '材料名称与法定依据表述不一致',
        example: '资质文件',
        correction: '《XX资质证书》正、副本原件'
      },
      {
        description: '未区分原件和复印件要求',
        example: '身份证明',
        correction: '居民身份证原件（核验后退回）及复印件1份'
      }
    ],
    correctExamples: [
      '营业执照副本复印件（加盖单位公章）',
      '居民身份证原件（核验后退回）及复印件',
      '《XX许可证》正、副本原件',
      '近期1寸免冠彩色照片2张'
    ],
    correctExample: '营业执照副本复印件（加盖单位公章）',
    explanation: '规范的材料名称可以减少申请人的疑问，提高申请材料的合格率，减少补正次数。',
    relatedExerciseIds: ['ex-4', 'ex-5'],
    relatedExercises: ['ex-4', 'ex-5'],
    difficulty: 2,
    knowledgePoint: '申请材料编制'
  },
  {
    id: 'rule-4',
    categoryId: 'application_material',
    category: 'application_material',
    title: '申请材料应当列明来源渠道',
    content: '申请材料应当明确材料的出具单位或来源渠道，对于政府部门核发的材料，应当注明可以通过数据共享获取的情形。',
    description: '本规则规范申请材料的来源说明，方便申请人获取和提交材料。',
    keyPoints: [
      '明确材料的出具单位或来源渠道',
      '注明可通过数据共享获取的材料',
      '区分申请人自制材料和第三方出具材料',
      '说明电子证照的使用方式'
    ],
    commonMistakes: [
      {
        description: '未说明材料来源，申请人不知从何处获取',
        example: '社保证明',
        correction: '社保证明（社保经办机构出具，可通过数据共享核验）'
      },
      {
        description: '对于可共享获取的材料，仍要求申请人提交',
        example: '提交营业执照复印件',
        correction: '营业执照（可通过电子证照共享获取，免于提交纸质材料）'
      },
      {
        description: '未区分申请人自制材料和第三方出具材料',
        example: '申请书',
        correction: '申请书（申请人自备，需法定代表人签字并加盖单位公章）'
      }
    ],
    correctExamples: [
      '身份证明（公安机关核发，可通过电子证照共享获取）',
      '社保证明（社保经办机构出具，可通过数据共享核验）',
      '申请书（申请人自备，需签字/盖章）',
      '验资报告（会计师事务所出具）'
    ],
    correctExample: '身份证明（公安机关核发，可通过电子证照共享获取）',
    explanation: '明确材料来源可以减少申请人跑腿，充分发挥数据共享的作用，提升"一网通办"水平。',
    relatedExerciseIds: ['ex-6'],
    relatedExercises: ['ex-6'],
    difficulty: 2,
    knowledgePoint: '申请材料编制'
  },
  {
    id: 'rule-5',
    categoryId: 'legal_basis',
    category: 'legal_basis',
    title: '法定依据应当引用到具体条款',
    content: '引用法定依据时，应当明确到具体的法律、法规、规章名称及其条款项。引用顺序应当遵循上位法优于下位法、特别法优于一般法的原则。',
    description: '本规则规范法定依据的引用格式，确保依据准确、完整。',
    keyPoints: [
      '引用到具体的条款项',
      '遵循上位法优于下位法的顺序',
      '注明发文字号或修订年份',
      '不得引用已废止或失效的法律法规'
    ],
    commonMistakes: [
      {
        description: '只引用法律名称，未引用具体条款',
        example: '依据《行政许可法》',
        correction: '依据《中华人民共和国行政许可法》第十二条第（三）项'
      },
      {
        description: '引用已废止或失效的法律法规',
        example: '依据《XX暂行办法》（已废止）',
        correction: '依据《XX办法》（2020年修订）'
      },
      {
        description: '引用顺序错误，下位法列在上位法之前',
        example: '1. 《XX市办法》；2. 《XX省条例》；3. 《XX法》',
        correction: '1. 《中华人民共和国XX法》；2. 《XX省XX条例》；3. 《XX市XX办法》'
      },
      {
        description: '使用简称不规范',
        example: '依据《XX法》',
        correction: '依据《中华人民共和国XX法》（以下简称《XX法》）'
      }
    ],
    correctExamples: [
      '《中华人民共和国行政许可法》第十二条第（三）项',
      '《XX省XX条例》（2020年修订）第二十三条第一款',
      '《XX市XX办法》（市政府令第123号）第十五条'
    ],
    correctExample: '《中华人民共和国行政许可法》第十二条第（三）项',
    explanation: '准确引用法定依据是依法行政的体现，便于申请人查阅相关法律条文，也便于内部监督检查。',
    relatedExerciseIds: ['ex-7', 'ex-8'],
    relatedExercises: ['ex-7', 'ex-8'],
    difficulty: 3,
    knowledgePoint: '法定依据引用'
  },
  {
    id: 'rule-6',
    categoryId: 'legal_basis',
    category: 'legal_basis',
    title: '法定依据应当与事项要素相对应',
    content: '引用的法定依据应当与事项的受理条件、申请材料、办理流程等要素相对应，确保每一项要素都有相应的依据支撑。',
    description: '本规则确保法定依据能够支撑事项的各个要素，避免依据与事项脱节。',
    keyPoints: [
      '依据应当与受理条件相对应',
      '依据应当与申请材料相对应',
      '依据应当与办理流程相对应',
      '不得扩大或缩小依据条款的适用范围'
    ],
    commonMistakes: [
      {
        description: '依据与事项要素不相关，如引用的条款不涉及该事项',
        example: '受理条件：注册资金不低于100万。依据：《XX法》关于公司设立的规定',
        correction: '受理条件：注册资金不低于100万。依据：《XX法》第二十三条"设立股份有限公司注册资本最低限额为500万元"'
      },
      {
        description: '依据不能支撑设定的受理条件或申请材料',
        example: '要求提供房产证。依据：《XX条例》关于经营场所的规定',
        correction: '要求提供经营场所证明。依据：《XX条例》第十五条"申请应当提供经营场所证明文件"'
      },
      {
        description: '遗漏重要的法定依据',
        example: '仅引用部门规章，未引用上位法',
        correction: '同时引用上位法和部门规章'
      },
      {
        description: '扩大或缩小依据条款的适用范围',
        example: '依据《XX法》关于企业的规定，要求个体工商户也提交材料',
        correction: '依据《XX法》第二条"本法适用于企业法人"，个体工商户不适用'
      }
    ],
    correctExamples: [
      '受理条件：申请人应当具有XX资格。依据：《XX法》第十条规定"从事XX活动应当取得XX资格"',
      '申请材料：提交身份证明。依据：《XX条例》第二十五条规定"申请办理XX事项应当提供申请人身份证明"'
    ],
    correctExample: '受理条件：申请人应当具有XX资格。依据：《XX法》第十条规定"从事XX活动应当取得XX资格"',
    explanation: '依据与要素对应是确保事项合法合规的关键。每一项受理条件和申请材料都应当有对应的法律依据。',
    relatedExerciseIds: ['ex-9'],
    relatedExercises: ['ex-9'],
    difficulty: 4,
    knowledgePoint: '法定依据引用'
  },
  {
    id: 'rule-7',
    categoryId: 'time_limit',
    category: 'time_limit',
    title: '承诺时限不得超过法定时限',
    content: '承诺时限应当在法定时限的基础上进行合理压缩，不得超过法定时限。鼓励最大限度压缩办理时限，提升政务服务效率。',
    description: '本规则规范办理时限的设置，确保承诺时限合法合理。',
    keyPoints: [
      '承诺时限不得超过法定时限',
      '鼓励在法定时限基础上压缩',
      '明确工作日与自然日的区别',
      '时限表述应当具体明确'
    ],
    commonMistakes: [
      {
        description: '承诺时限长于法定时限',
        example: '法定时限20个工作日，承诺时限30个工作日',
        correction: '法定时限20个工作日，承诺时限10个工作日'
      },
      {
        description: '未明确工作日与自然日的区别',
        example: '办理时限5天',
        correction: '办理时限5个工作日'
      },
      {
        description: '办理时限表述模糊',
        example: '尽快办理',
        correction: '自受理之日起5个工作日内作出决定'
      }
    ],
    correctExamples: [
      '法定时限：20个工作日；承诺时限：10个工作日',
      '法定时限：即办；承诺时限：即办',
      '法定时限：30个工作日；承诺时限：15个工作日（其中初审5个工作日，复审10个工作日）'
    ],
    correctExample: '法定时限：20个工作日；承诺时限：10个工作日',
    explanation: '合理压缩办理时限是优化营商环境的重要举措。承诺时限的设置应当兼顾效率和质量，既要方便群众，又要确保办理质量。',
    relatedExerciseIds: ['ex-10', 'ex-11'],
    relatedExercises: ['ex-10', 'ex-11'],
    difficulty: 2,
    knowledgePoint: '办理时限设置'
  },
  {
    id: 'rule-8',
    categoryId: 'time_limit',
    category: 'time_limit',
    title: '办理时限应当明确计算方式',
    content: '办理时限应当明确工作日计算方式，说明不含节假日、不含专家评审、不含现场核查等特殊环节时间。',
    description: '本规则规范办理时限的计算方式，避免产生歧义。',
    keyPoints: [
      '明确是否包含节假日',
      '明确特殊环节的时间扣除',
      '明确时限起算点和终止点',
      '区分一般环节和特殊环节'
    ],
    commonMistakes: [
      {
        description: '未说明时限是否包含节假日',
        example: '办理时限7天',
        correction: '办理时限7个工作日（不含法定节假日）'
      },
      {
        description: '将特殊环节时间计入一般办理时限',
        example: '办理时限20个工作日（含专家评审10天）',
        correction: '办理时限10个工作日（不含专家评审、现场核查时间，专家评审原则上不超过15个工作日）'
      },
      {
        description: '未明确时限起算点',
        example: '办理时限5个工作日',
        correction: '自受理之日起5个工作日内作出决定'
      },
      {
        description: '使用"X天"未区分工作日与自然日',
        example: '公示期7天',
        correction: '公示期7个自然日'
      }
    ],
    correctExamples: [
      '承诺时限：5个工作日（不含现场核查、专家评审时间）',
      '办理时限：自受理之日起10个工作日内作出决定',
      '法定时限：30个工作日，承诺时限：15个工作日（不含公示7天）'
    ],
    correctExample: '承诺时限：5个工作日（不含现场核查、专家评审时间）',
    explanation: '明确时限计算方式可以避免申请人与审批机关之间的理解歧义，保障申请人的知情权和监督权。',
    relatedExerciseIds: ['ex-12'],
    relatedExercises: ['ex-12'],
    difficulty: 2,
    knowledgePoint: '办理时限设置'
  },
  {
    id: 'rule-9',
    categoryId: 'reduction',
    category: 'reduction',
    title: '材料减免应当有明确政策依据',
    content: '实施材料减免（免予提交、容缺受理、告知承诺等）应当有明确的政策依据，不得随意减免法定申请材料。',
    description: '本规则规范材料减免的适用，确保减免有据可依。',
    keyPoints: [
      '材料减免应当有明确的政策依据',
      '不得随意减免法定申请材料',
      '明确减免的适用范围和条件',
      '减免后应当有相应的监管措施'
    ],
    commonMistakes: [
      {
        description: '无依据减免法定材料',
        example: '免于提交身份证明（无依据）',
        correction: '根据《XX市证明事项告知承诺制目录》，申请人可选择以告知承诺方式替代身份证明'
      },
      {
        description: '将"容缺受理"扩大适用范围',
        example: '所有材料均可容缺',
        correction: '容缺受理仅限于次要材料，主要申请材料必须齐全'
      },
      {
        description: '告知承诺事项未在目录范围内',
        example: '实行告知承诺（未列入目录）',
        correction: '该事项未列入告知承诺目录，不得实行告知承诺'
      },
      {
        description: '减免后未明确后续监管措施',
        example: '免于提交资质证明',
        correction: '免于提交资质证明，审批部门通过数据共享核验，核验不通过的撤销审批决定'
      }
    ],
    correctExamples: [
      '根据《XX市证明事项告知承诺制目录》，申请人可选择以告知承诺方式替代"无犯罪记录证明"',
      '按照"一网通办"改革要求，营业执照、身份证明等电子证照可免予提交纸质材料',
      '容缺受理：缺"近期照片"可先受理，申请人承诺5个工作日内补交'
    ],
    correctExample: '根据《XX市证明事项告知承诺制目录》，申请人可选择以告知承诺方式替代"无犯罪记录证明"',
    explanation: '材料减免是"放管服"改革的重要内容，但必须依法依规进行，确保减免有依据、监管有措施。',
    relatedExerciseIds: ['ex-13', 'ex-14'],
    relatedExercises: ['ex-13', 'ex-14'],
    difficulty: 3,
    knowledgePoint: '材料减免情形'
  },
  {
    id: 'rule-10',
    categoryId: 'reduction',
    category: 'reduction',
    title: '告知承诺应当明确承诺内容和违约责任',
    content: '实行告知承诺制的事项，应当明确承诺的具体内容、不实承诺的违约责任以及监管措施。',
    description: '本规则规范告知承诺制的实施，确保承诺可核查、违约可追责。',
    keyPoints: [
      '承诺内容应当具体可核查',
      '明确不实承诺的违约责任',
      '约定后续监管措施',
      '告知申请人享有陈述申辩权利'
    ],
    commonMistakes: [
      {
        description: '承诺内容不具体，无法核查',
        example: '承诺符合相关规定',
        correction: '承诺已取得《XX资格证书》，证书编号XXX，有效期至XXXX年XX月XX日'
      },
      {
        description: '未明确不实承诺的法律后果',
        example: '不实承诺将承担责任',
        correction: '经查实承诺不实的，撤销本次申请，纳入信用记录，1年内不得再次申请该事项，涉嫌犯罪的移送司法机关'
      },
      {
        description: '缺少后续监管措施约定',
        example: '实行告知承诺制',
        correction: '实行告知承诺制，审批后1个月内进行现场核查'
      },
      {
        description: '未告知申请人享有陈述申辩权利',
        example: '直接作出撤销决定',
        correction: '拟作出撤销决定前，应当告知申请人享有陈述、申辩和申请听证的权利'
      }
    ],
    correctExamples: [
      '申请人承诺：已取得相应资格证书，证书真实有效。违约责任：经查实承诺不实的，撤销本次申请，纳入信用记录，1年内不得再次申请该事项。',
      '承诺内容：经营场所符合消防安全要求。监管措施：审批后1个月内进行现场核查，发现不符合要求的，依法撤销许可。'
    ],
    correctExample: '申请人承诺：已取得相应资格证书，证书真实有效。违约责任：经查实承诺不实的，撤销本次申请，纳入信用记录，1年内不得再次申请该事项。',
    explanation: '完善的告知承诺制度可以降低制度性交易成本，同时通过信用监管和事后核查确保风险可控。',
    relatedExerciseIds: ['ex-15'],
    relatedExercises: ['ex-15'],
    difficulty: 4,
    knowledgePoint: '材料减免情形'
  },
  {
    id: 'rule-11',
    categoryId: 'general',
    category: 'general',
    title: '事项名称应当统一规范',
    content: '事项名称应当符合国家和本市政务服务事项名称规范，采用"行政许可/行政给付/行政确认等+具体事项"的结构，不得使用简称或不规范表述。',
    description: '本规则规范事项名称的表述，确保事项名称统一、规范、易懂。',
    keyPoints: [
      '事项类型+具体事项的结构',
      '与国家目录事项名称保持一致',
      '不得使用简称或不规范表述',
      '不得在名称中包含办理流程'
    ],
    commonMistakes: [
      {
        description: '事项名称使用简称',
        example: '营业执照办理',
        correction: '企业设立登记（行政许可）'
      },
      {
        description: '事项类型表述错误',
        example: '行政许可：不动产权属登记',
        correction: '行政确认：不动产权属登记'
      },
      {
        description: '名称中包含办理流程',
        example: '申请-审核-发证',
        correction: '行政许可：XX许可证核发'
      },
      {
        description: '与国家目录事项名称不一致',
        example: '开店审批',
        correction: '行政许可：食品经营许可证核发'
      }
    ],
    correctExamples: [
      '行政许可：危险化学品经营许可证核发',
      '行政给付：最低生活保障金给付',
      '行政确认：不动产权属登记',
      '公共服务：社会保障卡申领'
    ],
    correctExample: '行政许可：危险化学品经营许可证核发',
    explanation: '规范的事项名称是政务服务标准化的基础，有利于事项的统一管理和群众的准确识别。',
    relatedExerciseIds: ['ex-16'],
    relatedExercises: ['ex-16'],
    difficulty: 1,
    knowledgePoint: '通用规范'
  },
  {
    id: 'rule-12',
    categoryId: 'general',
    category: 'general',
    title: '办理流程应当清晰可操作',
    content: '办理流程应当明确各环节的办理主体、办理内容、办理时限、输出结果等要素，流程图与文字描述应当保持一致。',
    description: '本规则规范办理流程的描述，确保流程清晰、透明、可操作。',
    keyPoints: [
      '明确各环节的办理主体',
      '明确各环节的办理内容',
      '明确各环节的办理时限',
      '明确各环节的输出结果',
      '流程图与文字描述保持一致'
    ],
    commonMistakes: [
      {
        description: '流程环节过于简化',
        example: '申请-办理-发证',
        correction: '1. 申请与受理（1个工作日）；2. 审查与决定（5个工作日）；3. 颁证与送达（1个工作日）'
      },
      {
        description: '流程图与文字描述不一致',
        example: '流程图有3个环节，文字描述有5个环节',
        correction: '流程图与文字描述保持一致，均为3个环节'
      },
      {
        description: '未明确各环节的衔接关系',
        example: '受理、审查、决定',
        correction: '受理合格后进入审查环节，审查通过后作出决定'
      },
      {
        description: '缺少特殊环节的说明',
        example: '直接办理',
        correction: '一般程序：申请-受理-审查-决定；特殊程序：需要听证、招标、拍卖的，按照有关规定执行'
      }
    ],
    correctExamples: [
      '1. 申请与受理（1个工作日）：申请人提交申请材料，窗口对材料进行形式审查，出具受理通知书或补正通知书；2. 审查与决定（5个工作日）：业务科室对申请材料进行实质审查，必要时组织现场核查，作出准予或不予许可决定；3. 颁证与送达（1个工作日）：制作许可证件，通过EMS邮寄或窗口发放给申请人。'
    ],
    correctExample: '1. 申请与受理（1个工作日）：申请人提交申请材料，窗口对材料进行形式审查，出具受理通知书或补正通知书；2. 审查与决定（5个工作日）：业务科室对申请材料进行实质审查，必要时组织现场核查，作出准予或不予许可决定；3. 颁证与送达（1个工作日）：制作许可证件，通过EMS邮寄或窗口发放给申请人。',
    explanation: '清晰的办理流程可以让申请人了解办事环节和预期时间，也便于内部管理和绩效考核。',
    relatedExerciseIds: ['ex-17'],
    relatedExercises: ['ex-17'],
    difficulty: 2,
    knowledgePoint: '通用规范'
  }
];
