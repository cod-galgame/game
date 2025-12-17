// ===================== 核心配置：全局游戏状态（新增username） =====================
const gameState = {
    username: "", // 玩家自定义用户名
    favorability: { ghost: 0, konig: 0 },
    reputation: 0,
    choiceRecords: {}, // 存储格式：{ "day1_morning_clinic": "day1_morning_clinic_A", ... }
    currentNodeId: "day1_morning_clinic"
};

// ===================== 角色对话模板（集成{$username}占位符） =====================
const characterDialogs = {
    ghost: {
        initial: [
            { min: 0, max: 4, text: "Doctor，我需要缝针。" },
            { min: 5, max: 100, text: "Morning {$username}，帮我看看伤口恢复情况。" }
        ],
        responseToCheap: [
            { min: 0, max: 4, text: "很合理的解决方案，谢谢{$username}。" },
            { min: 5, max: 100, text: "你总能给出最划算的方案（眼尾微扬），{$username}。" }
        ],
        responseToPrice: [
            { min: 0, max: 4, text: "比基地还贵？{$username}？" },
            { min: 5, max: 100, text: "（轻笑）你的技术值这个价，{$username}。" }
        ],
        nightCrisis: [
            { min: 0, max: 4, text: "{$username}，能借用你的车吗？（语气冰冷）" },
            { min: 5, max: 100, text: "{$username}，能借用你的车吗？（语气比上次柔和）" }
        ],
        carResponseA: [
            { min: 10, max: 100, text: "当然，我也是要去那里。我来帮你打火，{$username}。" }
        ],
        carResponseB: [
            { min: 5, max: 9, text: "疏于养护，但能开。我先去排查危险，{$username}你跟紧。" },
            { min: 0, max: 4, text: "疏于养护，但能开。我先去，出了事别找我，{$username}。" }
        ],
        medicalCheck: [
            { min: 10, max: 100, text: "我来教你拆，别慌，{$username}。" },
            { min: 5, max: 9, text: "小心点，那是炸弹！{$username}！" },
            { min: 0, max: 4, text: "别乱碰，自己找死别连累别人，{$username}。" }
        ],
        bombCrisis: [
            { min: 10, max: 100, text: "剪黑色电容！相信我！{$username}！" },
            { min: 5, max: 9, text: "别碰红色电容！一碰就炸！{$username}！" },
            { min: 0, max: 4, text: "别碰红色电容，我可不想收你的尸，{$username}。" }
        ],
        crisisEnd: [
            { min: 13, max: 100, text: "下次别这么慌，我在，{$username}。" },
            { min: 7, max: 12, text: "算你运气好，{$username}。" },
            { min: 1, max: 6, text: "下次注意点，别添乱，{$username}。" }
        ],
        aftermathCarA: [
            { min: 10, max: 100, text: "车修好了，打火线圈换了新的，{$username}。" }
        ],
        unlockMemory: [
            { min: 14, max: 100, text: "第一次拆弹时我剪错了线，队长替我挡了碎片。从那以后就记住了——电源永远是优先项，{$username}。" }
        ],
        midnightVisit: [
            { min: 0, max: 100, text: "能处理一下吗？别让基地知道，{$username}。" }
        ],
        revealTruth: [
            { min: 0, max: 100, text: "我在查Hawk在地下钱庄的交易，他和敌对势力有武器交易。这道伤，是他派来的人划的，{$username}。" }
        ],
        criticalInjury: [
            { min: 0, max: 100, text: "基地…强制派我去拆弹…防护装备有问题…别让他们知道…只有你能救我…{$username}…" }
        ],
        successRescue: [
            { min: 0, max: 100, text: "谢谢…我第一次，敢把后背交给别人，{$username}。" }
        ]
    },
    konig: {
        evening: [
            { min: 0, max: 4, text: "晚上好，{$username}，我的大腿韧带似乎拉伤了..." },
            { min: 5, max: 100, text: "晚上好，{$username}～ 又来麻烦你了（电流声带笑意）" }
        ],
        injuryResponse: [
            { min: 0, max: 4, text: "只是任务中紧急规避时拉伤的，{$username}。" },
            { min: 5, max: 100, text: "非常感谢，{$username}。" }
        ],
        nightReminder: [
            { min: 5, max: 100, text: "晚上有情况，基地会有信号，{$username}。" }
        ],
        sceneGreeting: [
            { min: 0, max: 4, text: "面色紧绷地接管局势，看向{$username}。" },
            { min: 5, max: 100, text: "看到{$username}后立刻迎上来：{$username}，你来了就好。" }
        ],
        nightVisit: [
            { min: 5, max: 100, text: "那孩子的脑震荡没事了，基地的人已经送他回家。关于Ghost…基地三年前指控他‘私藏爆炸装置核心部件’，其实是任务失败后，高层要找替罪羊，{$username}。" },
            { min: 0, max: 4, text: "关于Ghost…基地三年前有过对他的指控，{$username}。" }
        ],
        revealClue: [
            { min: 8, max: 100, text: "你说得对。当时伤亡的平民是线人，Ghost为了保护她的家人不被报复，才选择沉默。这是她的代号，我们都欠她的，{$username}。" },
            { min: 3, max: 7, text: "你说得对。当时伤亡的平民是线人，Ghost为了保护她的家人不被报复，才选择沉默，{$username}。" }
        ],
        revealDetail: [
            { min: 6, max: 100, text: "证据是篡改的任务报告，签名是Hawk少校。真正的报告早就被销毁了，{$username}。" },
            { min: 1, max: 5, text: "证据是篡改的任务报告，签名是Hawk少校，{$username}。" }
        ],
        rehabNextDay: [
            { min: 0, max: 100, text: "小时候因为长得高，被同学锁在仓库里，那里有老鼠…我怕了很多年。上次误伤平民，我又想起了那个仓库，所有人都骂我‘巨人废物’，{$username}。" }
        ],
        teachSelfDefense: [
            { min: 0, max: 100, text: "我教你几个基础动作吧，{$username}，遇到危险时能用得上。这样能挣脱大多数束缚，记住要用巧劲。" }
        ]
    },
    npc: {
        boyPain: [
            { min: 0, max: 100, text: "{$username}，我的头好疼，像有虫子在咬..." },
            { min: 0, max: 100, text: "这里好痒，有东西硌着...{$username}..." }
        ],
        bombTimer: [
            { min: 0, max: 100, text: "【倒计时：03:00】{$username}，快想想办法！" }
        ],
        leoWarning: [
            { min: 0, max: 100, text: "我在基地的老战友说，Hawk少校在查你，{$username}，说你‘包庇叛徒’。最近会有人来诊所监视，尤其是Ghost的行踪。" }
        ],
        hawkVisit: [
            { min: 0, max: 100, text: "{$username}，我知道你在包庇Ghost。给你个机会，说出他的下落，我可以不追究你‘通敌’的责任。" }
        ],
        leoEvidence: [
            { min: 0, max: 100, text: "找到了！{$username}，这是三年前任务的原始报告，上面写着‘平民伤亡由基地线人失误导致’，还有Hawk少校的亲笔签名——是篡改前的版本！" }
        ],
        finalEpilogue: [
            { min: 0, max: 100, text: "141特遣队的体检安排在每周三，{$username}。" },
            { min: 0, max: 100, text: "骷髅团的康复训练定在周五如何？{$username}。" },
            { min: 0, max: 100, text: "按先来后到，{$username}。" }
        ]
    }
};

// ===================== 剧情模板库（时间节点+选项record） =====================
const storyTemplates = {
    // ========== 第一天 ==========
    "day1_morning_clinic": {
        id: "day1_morning_clinic",
        text: "清晨的诊所刚开门，Ghost就推门进来了。<br>他腰腹部缠着渗血的纱布，语气简洁：<div class='story-dialog'>\"{{ghost.initial.0}}\"</div>你凑近查看，伤口仅3cm长，是流弹擦伤的轻微伤。",
        options: [
            {
                id: "optionA",
                text: "A：你这看起来只有3cm，减张带贴一下就行了。",
                effect: { ghost: 5 },
                record: "day1_morning_clinic_A",
                nextNode: "day1_morning_clinic_ghost_response_cheap"
            },
            {
                id: "optionB",
                text: "B：缝针50磅。",
                effect: {},
                record: "day1_morning_clinic_B",
                nextNode: "day1_morning_clinic_ghost_response_price"
            }
        ]
    },
    "day1_morning_clinic_ghost_response_cheap": {
        id: "day1_morning_clinic_ghost_response_cheap",
        text: "Ghost看着你递来的减张带，眼神微顿（你能看到面罩下的眼尾松了一瞬）：<div class='story-dialog'>\"{{ghost.responseToCheap.0}}\"</div>他接过工具自行处理，临走时丢下一句：<div class='story-dialog'>\"明天训练后来复查，{$username}。\"</div>",
        options: [
            {
                id: "nextA",
                text: "点头回应：\"好，明天见。\"",
                effect: {},
                record: "day1_morning_clinic_ghost_response_cheap_A",
                nextNode: "day1_evening_clinic_konig_visit"
            }
        ]
    },
    "day1_morning_clinic_ghost_response_price": {
        id: "day1_morning_clinic_ghost_response_price",
        text: "Ghost面具下的下颌线紧绷了一下，挑眉道：<div class='story-dialog'>\"{{ghost.responseToPrice.0}}\"</div>但他没多争执，掏出钱放在桌上：<div class='story-dialog'>\"处理好，别感染，{$username}。\"</div>",
        options: [
            {
                id: "nextB",
                text: "接过钱：\"放心，比基地的手艺好。\"",
                effect: {},
                record: "day1_morning_clinic_ghost_response_price_A",
                nextNode: "day1_evening_clinic_konig_visit"
            }
        ]
    },
    "day1_evening_clinic_konig_visit": {
        id: "day1_evening_clinic_konig_visit",
        text: "夜幕降临，诊所快关门时，König推门进来。<br>他头盔压得很低，声音带着电流声：<div class='story-dialog'>\"{{konig.evening.0}}\"</div>",
        options: [
            {
                id: "konigA",
                text: "A：你平时壮的像牛，怎么还会拉伤？",
                effect: {},
                record: "day1_evening_clinic_konig_visit_A",
                nextNode: "day1_evening_clinic_konig_injury_response_a"
            },
            {
                id: "konigB",
                text: "B：找我就对了，我专精运动损伤修复！",
                effect: { konig: 5 },
                record: "day1_evening_clinic_konig_visit_B",
                nextNode: "day1_evening_clinic_konig_injury_response_b"
            }
        ]
    },
    "day1_evening_clinic_konig_injury_response_a": {
        id: "day1_evening_clinic_konig_injury_response_a",
        text: "König身体僵硬了一下，低声说：<div class='story-dialog'>\"{{konig.injuryResponse.0}}\"</div>你为他涂抹了镇痛药膏，他道谢后匆匆离开。<div class='story-dialog'>（提示：{$username}错过末班车，被迫睡在诊所）</div>",
        options: [
            {
                id: "nightA",
                text: "收拾休息，准备过夜",
                effect: {},
                record: "day1_evening_clinic_konig_injury_response_a_A",
                nextNode: "day1_midnight_clinic_crisis_alert"
            }
        ]
    },
    "day1_evening_clinic_konig_injury_response_b": {
        id: "day1_evening_clinic_konig_injury_response_b",
        text: "头盔里传来轻笑，电流声都柔和了：<div class='story-dialog'>\"{{konig.injuryResponse.1}}\"</div>他主动说明是任务拉伤，治疗后提醒：<div class='story-dialog'>\"{{konig.nightReminder.0}}\"</div>",
        options: [
            {
                id: "nightB",
                text: "笑着回应：\"多谢提醒，晚安。\"",
                effect: {},
                record: "day1_evening_clinic_konig_injury_response_b_A",
                nextNode: "day1_midnight_clinic_crisis_alert"
            }
        ]
    },
    "day1_midnight_clinic_crisis_alert": {
        id: "day1_midnight_clinic_crisis_alert",
        text: "深夜的尖叫声划破夜空，{$username}惊醒后抓起医疗箱冲出门。<br>东南方向火光冲天，老爷车打不着火时，Ghost跑来（语气比上次柔和）：<div class='story-dialog'>\"{{ghost.nightCrisis.1}}\"</div>",
        options: [
            {
                id: "carA",
                text: "A：我要去救人，开到现场再借你",
                effect: { ghost: 5, reputation: 5 },
                record: "day1_midnight_clinic_crisis_alert_A",
                nextNode: "day1_midnight_clinic_ghost_car_response_a"
            },
            {
                id: "carB",
                text: "B：打不着火，你能开就借你",
                effect: {},
                record: "day1_midnight_clinic_crisis_alert_B",
                nextNode: "day1_midnight_clinic_ghost_car_response_b"
            }
        ]
    },
    // ========== 第一天（低好感分支） ==========
    "day1_midnight_clinic_crisis_alert_low": {
        id: "day1_midnight_clinic_crisis_alert_low",
        text: "深夜的尖叫声划破夜空，{$username}惊醒后抓起医疗箱冲出门。<br>东南方向火光冲天，老爷车打不着火时，Ghost跑来（语气冰冷）：<div class='story-dialog'>\"{{ghost.nightCrisis.0}}\"</div>",
        options: [
            {
                id: "carA",
                text: "A：我要去救人，开到现场再借你",
                effect: { ghost: 5, reputation: 5 },
                record: "day1_midnight_clinic_crisis_alert_low_A",
                nextNode: "day1_midnight_clinic_ghost_car_response_a"
            },
            {
                id: "carB",
                text: "B：打不着火，你能开就借你",
                effect: {},
                record: "day1_midnight_clinic_crisis_alert_low_B",
                nextNode: "day1_midnight_clinic_ghost_car_response_b_low"
            }
        ]
    },
    "day1_midnight_clinic_ghost_car_response_a": {
        id: "day1_midnight_clinic_ghost_car_response_a",
        text: `Ghost看着你的医疗箱，点头道（语气带了点温度）：<div class='story-dialog'>\"{{ghost.carResponseA.0}}\"</div>`,
        options: [
            {
                id: "goSceneA",
                text: "一起出发前往现场",
                effect: {},
                record: "day1_midnight_clinic_ghost_car_response_a_A",
                nextNode: "day1_midnight_scene_konig_arrive"
            }
        ]
    },
    "day1_midnight_clinic_ghost_car_response_b": {
        id: "day1_midnight_clinic_ghost_car_response_b",
        text: "Ghost绕车检查一圈：<div class='story-dialog'>\"{{ghost.carResponseB.0}}\"</div>",
        options: [
            {
                id: "goSceneB",
                text: "递过钥匙：\"路上小心，我随后就到\"",
                effect: {},
                record: "day1_midnight_clinic_ghost_car_response_b_A",
                nextNode: "day1_midnight_scene_konig_arrive"
            }
        ]
    },
    "day1_midnight_clinic_ghost_car_response_b_low": {
        id: "day1_midnight_clinic_ghost_car_response_b_low",
        text: "Ghost绕车检查一圈，冷冷道：<div class='story-dialog'>\"{{ghost.carResponseB.1}}\"</div>",
        options: [
            {
                id: "goSceneB",
                text: "递过钥匙：\"路上小心，我随后就到\"",
                effect: {},
                record: "day1_midnight_clinic_ghost_car_response_b_low_A",
                nextNode: "day1_midnight_scene_konig_arrive_low"
            }
        ]
    },
    // ========== 现场场景 ==========
    "day1_midnight_scene_konig_arrive": {
        id: "day1_midnight_scene_konig_arrive",
        text: "你们抵达现场，König{{konig.sceneGreeting.1}}<br>一个光脚小男孩跑过来哭着说：<div class='story-dialog'>\"{{npc.boyPain.0}}\"</div>",
        options: [
            {
                id: "checkBoy",
                text: "立刻蹲下为他检查",
                effect: {},
                record: "day1_midnight_scene_konig_arrive_A",
                nextNode: "day1_midnight_scene_ghost_medical_check_high"
            }
        ]
    },
    "day1_midnight_scene_konig_arrive_low": {
        id: "day1_midnight_scene_konig_arrive_low",
        text: "你们抵达现场，König{{konig.sceneGreeting.0}}<br>一个光脚小男孩跑过来哭着说：<div class='story-dialog'>\"{{npc.boyPain.0}}\"</div>",
        options: [
            {
                id: "checkBoy",
                text: "立刻蹲下为他检查",
                effect: {},
                record: "day1_midnight_scene_konig_arrive_low_A",
                nextNode: "day1_midnight_scene_ghost_medical_check_low"
            }
        ]
    },
    // ========== 医疗检查 ==========
    "day1_midnight_scene_ghost_medical_check_high": {
        id: "day1_midnight_scene_ghost_medical_check_high",
        text: "你检查后排除颅内损伤，男孩挠着后腰说：<div class='story-dialog'>\"{{npc.boyPain.1}}\"</div>你撩起睡衣，看到贴卡通贴纸的黑色装置：<div class='story-dialog'>{{npc.bombTimer.0}}</div>Ghost立刻靠过来：<div class='story-dialog'>\"{{ghost.medicalCheck.0}}\"</div>",
        options: [
            {
                id: "calmDown",
                text: "保持冷静，准备应对危机",
                effect: {},
                record: "day1_midnight_scene_ghost_medical_check_high_A",
                nextNode: "day1_midnight_scene_ghost_bomb_crisis_high"
            }
        ]
    },
    "day1_midnight_scene_ghost_medical_check_mid": {
        id: "day1_midnight_scene_ghost_medical_check_mid",
        text: "你检查后排除颅内损伤，男孩挠着后腰说：<div class='story-dialog'>\"{{npc.boyPain.1}}\"</div>你撩起睡衣，看到贴卡通贴纸的黑色装置：<div class='story-dialog'>{{npc.bombTimer.0}}</div>Ghost在不远处喊：<div class='story-dialog'>\"{{ghost.medicalCheck.1}}\"</div>",
        options: [
            {
                id: "calmDown",
                text: "保持冷静，准备应对危机",
                effect: {},
                record: "day1_midnight_scene_ghost_medical_check_mid_A",
                nextNode: "day1_midnight_scene_ghost_bomb_crisis_mid"
            }
        ]
    },
    "day1_midnight_scene_ghost_medical_check_low": {
        id: "day1_midnight_scene_ghost_medical_check_low",
        text: "你检查后排除颅内损伤，男孩挠着后腰说：<div class='story-dialog'>\"{{npc.boyPain.1}}\"</div>你撩起睡衣，看到贴卡通贴纸的黑色装置：<div class='story-dialog'>{{npc.bombTimer.0}}</div>Ghost皱眉：<div class='story-dialog'>\"{{ghost.medicalCheck.2}}\"</div>",
        options: [
            {
                id: "calmDown",
                text: "保持冷静，准备应对危机",
                effect: {},
                record: "day1_midnight_scene_ghost_medical_check_low_A",
                nextNode: "day1_midnight_scene_ghost_bomb_crisis_low"
            }
        ]
    },
    // ========== 炸弹危机 ==========
    "day1_midnight_scene_ghost_bomb_crisis_high": {
        id: "day1_midnight_scene_ghost_bomb_crisis_high",
        text: "König将你护在身后，倒计时加速到00:05！<br>你翻出工具喊：<div class='story-dialog'>\"König，固定他的身体！{$username}能处理！\"</div>Ghost立刻冲过来指导：<div class='story-dialog'>\"{{ghost.bombCrisis.0}}\"</div>",
        options: [
            {
                id: "trustGhost",
                text: "信任Ghost，剪黑色电源接口",
                effect: { reputation: 10, konig: 5, ghost: 3 },
                record: "day1_midnight_scene_ghost_bomb_crisis_high_A",
                nextNode: "day1_midnight_scene_ghost_crisis_end_high"
            },
            {
                id: "wrongChoice",
                text: "慌乱中误触红色电容（坏结局）",
                effect: { ghost: 0, konig: 0, reputation: 0 },
                record: "day1_midnight_scene_ghost_bomb_crisis_high_B",
                nextNode: "day1_midnight_scene_ghost_bad_ending"
            }
        ]
    },
    "day1_midnight_scene_ghost_bomb_crisis_mid": {
        id: "day1_midnight_scene_ghost_bomb_crisis_mid",
        text: "König将你护在身后，倒计时加速到00:05！<br>你翻出工具喊：<div class='story-dialog'>\"König，固定他的身体！{$username}能处理！\"</div>Ghost大喊：<div class='story-dialog'>\"{{ghost.bombCrisis.1}}\"</div>",
        options: [
            {
                id: "trustGhost",
                text: "信任Ghost，剪黑色电源接口",
                effect: { reputation: 10, konig: 5, ghost: 2 },
                record: "day1_midnight_scene_ghost_bomb_crisis_mid_A",
                nextNode: "day1_midnight_scene_ghost_crisis_end_mid"
            },
            {
                id: "wrongChoice",
                text: "慌乱中误触红色电容（坏结局）",
                effect: { ghost: 0, konig: 0, reputation: 0 },
                record: "day1_midnight_scene_ghost_bomb_crisis_mid_B",
                nextNode: "day1_midnight_scene_ghost_bad_ending"
            }
        ]
    },
    "day1_midnight_scene_ghost_bomb_crisis_low": {
        id: "day1_midnight_scene_ghost_bomb_crisis_low",
        text: "König将你护在身后，倒计时加速到00:05！<br>你翻出工具喊：<div class='story-dialog'>\"König，固定他的身体！{$username}能处理！\"</div>Ghost冷漠提醒：<div class='story-dialog'>\"{{ghost.bombCrisis.2}}\"</div>",
        options: [
            {
                id: "trustGhost",
                text: "信任Ghost，剪黑色电源接口",
                effect: { reputation: 10, konig: 5, ghost: 1 },
                record: "day1_midnight_scene_ghost_bomb_crisis_low_A",
                nextNode: "day1_midnight_scene_ghost_crisis_end_low"
            },
            {
                id: "wrongChoice",
                text: "慌乱中误触红色电容（坏结局）",
                effect: { ghost: 0, konig: 0, reputation: 0 },
                record: "day1_midnight_scene_ghost_bomb_crisis_low_B",
                nextNode: "day1_midnight_scene_ghost_bad_ending"
            }
        ]
    },
    // ========== 危机结束 ==========
    "day1_midnight_scene_ghost_crisis_end_high": {
        id: "day1_midnight_scene_ghost_crisis_end_high",
        text: "倒计时停在00:02！危机解除。<br>König拍着你的后背说：<div class='story-dialog'>\"干得好，{$username}。\"</div>Ghost走到你身边，递来一瓶水：<div class='story-dialog'>\"{{ghost.crisisEnd.0}}\"</div>",
        options: [
            {
                id: "backClinic",
                text: "和König返回诊所",
                effect: {},
                record: "day1_midnight_scene_ghost_crisis_end_high_A",
                nextNode: "day2_morning_clinic_ghost_aftermath_car_a"
            }
        ]
    },
    "day1_midnight_scene_ghost_crisis_end_mid": {
        id: "day1_midnight_scene_ghost_crisis_end_mid",
        text: "倒计时停在00:02！危机解除。<br>König拍着你的后背说：<div class='story-dialog'>\"干得好，{$username}。\"</div>Ghost在不远处看着你，微微点头：<div class='story-dialog'>\"{{ghost.crisisEnd.1}}\"</div>",
        options: [
            {
                id: "backClinic",
                text: "和König返回诊所",
                effect: {},
                record: "day1_midnight_scene_ghost_crisis_end_mid_A",
                nextNode: "day2_morning_clinic_ghost_aftermath_car_a"
            }
        ]
    },
    "day1_midnight_scene_ghost_crisis_end_low": {
        id: "day1_midnight_scene_ghost_crisis_end_low",
        text: "倒计时停在00:02！危机解除。<br>König拍着你的后背说：<div class='story-dialog'>\"干得好，{$username}。\"</div>Ghost转身准备离开：<div class='story-dialog'>\"{{ghost.crisisEnd.2}}\"</div>",
        options: [
            {
                id: "backClinic",
                text: "和König返回诊所",
                effect: {},
                record: "day1_midnight_scene_ghost_crisis_end_low_A",
                nextNode: "day2_morning_clinic_ghost_aftermath_car_a"
            }
        ]
    },
    // ========== 坏结局 ==========
    "day1_midnight_scene_ghost_bad_ending": {
        id: "day1_midnight_scene_ghost_bad_ending",
        text: "你触到红色电容，装置爆炸！<br>模糊中看到König扑过来护住你，Ghost也冲了过来...<div class='story-dialog'>（坏结局：{$username}一切回到原点）</div>",
        options: [
            {
                id: "restart",
                text: "重新开始游戏",
                effect: { ghost: 0, konig: 0, reputation: 0 },
                record: "day1_midnight_scene_ghost_bad_ending_A",
                nextNode: "day1_morning_clinic"
            }
        ]
    },
    // ========== 第二天 ==========
    "day2_morning_clinic_ghost_aftermath_car_a": {
        id: "day2_morning_clinic_ghost_aftermath_car_a",
        text: "清晨诊所开门，你的老爷车停在门口，引擎盖还带着余温。Ghost靠在车门上，兜帽遮住半张脸，手里捏着一张便签。他主动上前，声音比平时柔和：<div class='story-dialog'>\"{{ghost.aftermathCarA.0}}\"</div>他递过便签，上面是潦草的字迹：<div class='story-dialog'>\"三年前拆弹小组的制式装置，电源接口都在右侧，{$username}。\"</div>",
        options: [
            {
                id: "A1认可专业",
                text: "A1：\"你当时的判断是对的，这种装置确实该优先剪电源\"",
                effect: { ghost: 1, reputation: 5 },
                record: "day2_morning_clinic_ghost_aftermath_car_a_A",
                nextNode: "day2_morning_clinic_ghost_unlock_memory"
            },
            {
                id: "A2普通回应",
                text: "A2：\"多谢修车，这便签我收下了\"",
                effect: {},
                record: "day2_morning_clinic_ghost_aftermath_car_a_B",
                nextNode: "day2_evening_clinic_konig_night_visit_high"
            }
        ]
    },
    "day2_morning_clinic_ghost_aftermath_car_b": {
        id: "day2_morning_clinic_ghost_aftermath_car_b",
        text: "清晨诊所开门，你的老爷车停在门口，引擎盖还带着余温。Ghost放下工具包就准备走，车窗夹着便签：<div class='story-dialog'>\"下次别让车在紧急时掉链子，{$username}。\"</div>你打开工具包，发现里面多了几包战地止血棉。",
        options: [
            {
                id: "B1轻松调侃",
                text: "B1：\"工具我用完还你，下次修车记得收费\"",
                effect: { ghost: 1, reputation: 3 },
                record: "day2_morning_clinic_ghost_aftermath_car_b_A",
                nextNode: "day2_evening_clinic_konig_night_visit_low"
            },
            {
                id: "B2正式感谢",
                text: "B2：\"多谢，车修得很利索\"",
                effect: {},
                record: "day2_morning_clinic_ghost_aftermath_car_b_B",
                nextNode: "day2_evening_clinic_konig_night_visit_low"
            }
        ]
    },
    "day2_morning_clinic_ghost_unlock_memory": {
        id: "day2_morning_clinic_ghost_unlock_memory",
        text: "Ghost喉结动了动，突然说：<div class='story-dialog'>\"{{ghost.unlockMemory.0}}\"</div>",
        options: [
            {
                id: "追问往事",
                text: "轻声问：\"后来呢？\"",
                effect: { ghost: 2 },
                record: "day2_morning_clinic_ghost_unlock_memory_A",
                nextNode: "day2_evening_clinic_konig_night_visit_high"
            }
        ]
    },
    // ========== 第二天晚间 - König复诊 ==========
    "day2_evening_clinic_konig_night_visit_high": {
        id: "day2_evening_clinic_konig_night_visit_high",
        text: "当晚König来诊所复诊，卸下头盔——他坐在诊疗椅上，手指无意识摩挲着护臂：<div class='story-dialog'>\"{{konig.nightVisit.0}}\"</div>",
        options: [
            {
                id: "A共情中立",
                text: "A：\"他看起来不像会拿平民生命冒险的人\"",
                effect: { konig: 3, reputation: 5 },
                record: "day2_evening_clinic_konig_night_visit_high_A",
                nextNode: "day2_evening_clinic_konig_reveal_clue_high"
            },
            {
                id: "B理性求证",
                text: "B：\"基地的指控有证据吗？\"",
                effect: { konig: 1, reputation: 3 },
                record: "day2_evening_clinic_konig_night_visit_high_B",
                nextNode: "day2_evening_clinic_konig_reveal_detail_high"
            },
            {
                id: "C回避",
                text: "C：\"这和我没关系，我只负责治伤\"",
                effect: { konig: -2, reputation: -5 },
                record: "day2_evening_clinic_konig_night_visit_high_C",
                nextNode: "day2_night_clinic_leo_warning"
            }
        ]
    },
    "day2_evening_clinic_konig_night_visit_low": {
        id: "day2_evening_clinic_konig_night_visit_low",
        text: "当晚König来诊所复诊，卸下头盔后沉默地坐在诊疗椅上。你为他检查韧带时，他突然开口：<div class='story-dialog'>\"{{konig.nightVisit.1}}\"</div>",
        options: [
            {
                id: "A共情中立",
                text: "A：\"他看起来不像会拿平民生命冒险的人\"",
                effect: { konig: 3, reputation: 5 },
                record: "day2_evening_clinic_konig_night_visit_low_A",
                nextNode: "day2_evening_clinic_konig_reveal_clue_low"
            },
            {
                id: "B理性求证",
                text: "B：\"基地的指控有证据吗？\"",
                effect: { konig: 1, reputation: 3 },
                record: "day2_evening_clinic_konig_night_visit_low_B",
                nextNode: "day2_evening_clinic_konig_reveal_detail_low"
            },
            {
                id: "C回避",
                text: "C：\"这和我没关系，我只负责治伤\"",
                effect: { konig: -2, reputation: -5 },
                record: "day2_evening_clinic_konig_night_visit_low_C",
                nextNode: "day2_night_clinic_leo_warning"
            }
        ]
    },
    "day2_evening_clinic_konig_reveal_clue_high": {
        id: "day2_evening_clinic_konig_reveal_clue_high",
        text: "König抬头看你，眼神柔和了些：<div class='story-dialog'>\"{{konig.revealClue.0}}\"</div>",
        options: [
            {
                id: "记下线索",
                text: "点头：\"我明白了\"",
                effect: {},
                record: "day2_evening_clinic_konig_reveal_clue_high_A",
                nextNode: "day2_night_clinic_leo_warning"
            }
        ]
    },
    "day2_evening_clinic_konig_reveal_clue_low": {
        id: "day2_evening_clinic_konig_reveal_clue_low",
        text: "König抬头看你，眼神柔和了些：<div class='story-dialog'>\"{{konig.revealClue.1}}\"</div>",
        options: [
            {
                id: "记下线索",
                text: "点头：\"我明白了\"",
                effect: {},
                record: "day2_evening_clinic_konig_reveal_clue_low_A",
                nextNode: "day2_night_clinic_leo_warning"
            }
        ]
    },
    "day2_evening_clinic_konig_reveal_detail_high": {
        id: "day2_evening_clinic_konig_reveal_detail_high",
        text: "König从口袋里掏出一张折叠的纸：<div class='story-dialog'>\"{{konig.revealDetail.0}}\"</div>",
        options: [
            {
                id: "收起报告",
                text: "接过纸：\"我会收好的\"",
                effect: {},
                record: "day2_evening_clinic_konig_reveal_detail_high_A",
                nextNode: "day2_night_clinic_leo_warning"
            }
        ]
    },
    "day2_evening_clinic_konig_reveal_detail_low": {
        id: "day2_evening_clinic_konig_reveal_detail_low",
        text: "König从口袋里掏出一张折叠的纸：<div class='story-dialog'>\"{{konig.revealDetail.1}}\"</div>",
        options: [
            {
                id: "收起报告",
                text: "接过纸：\"我会收好的\"",
                effect: {},
                record: "day2_evening_clinic_konig_reveal_detail_low_A",
                nextNode: "day2_night_clinic_leo_warning"
            }
        ]
    },
    // ========== Leo警告 ==========
    "day2_night_clinic_leo_warning": {
        id: "day2_night_clinic_leo_warning",
        text: "König离开后，Leo端着两杯咖啡走进来，神色凝重：<div class='story-dialog'>\"{{npc.leoWarning.0}}\"</div>",
        options: [
            {
                id: "A保护患者",
                text: "A：\"我不在乎基地怎么说...凌晨我留着诊所门，他要是来躲，我能掩护他\"",
                effect: { ghost: 2, reputation: 10 },
                record: "day2_night_clinic_leo_warning_A",
                nextNode: "day3_midnight_clinic_ghost_visit"
            },
            {
                id: "B消极回避",
                text: "B：\"多一事不如少一事，他来我也假装没看见\"",
                effect: { ghost: -2, reputation: -5 },
                record: "day2_night_clinic_leo_warning_B",
                nextNode: "day3_morning_clinic_ghost_avoid"
            },
            {
                id: "C折中",
                text: "C：\"下次见面我会提醒他小心的，但诊所不能留他\"",
                effect: {},
                record: "day2_night_clinic_leo_warning_C",
                nextNode: "day3_morning_clinic_konig_rehab"
            }
        ]
    },
    // ========== 第三天 ==========
    "day3_midnight_clinic_ghost_visit": {
        id: "day3_midnight_clinic_ghost_visit",
        text: "凌晨三点，诊所后门被轻轻敲响。Ghost浑身是汗，左臂有一道深可见骨的划伤——是被刀划的，应该是躲避监视时与人冲突。他靠在门框上，面具沾染着灰尘：<div class='story-dialog'>\"{{ghost.midnightVisit.0}}\"</div>你立刻拉他进屋，打开应急灯：<div class='story-dialog'>\"伤口很深，需要清创缝合，可能会留疤，{$username}。\"</div>",
        options: [
            {
                id: "A保护隐私",
                text: "A：\"你跟我来...我不会告诉基地的\"",
                effect: { ghost: 5, reputation: 15 },
                record: "day3_midnight_clinic_ghost_visit_A",
                nextNode: "day3_midnight_clinic_ghost_reveal_truth"
            },
            {
                id: "B专业协助",
                text: "B：\"我帮你找Leo，他有渠道弄到基地的武器采购记录\"",
                effect: { ghost: 4, reputation: 15 },
                record: "day3_midnight_clinic_ghost_visit_B",
                nextNode: "day3_morning_clinic_leo_provide_clue"
            },
            {
                id: "C施压",
                text: "C：\"你该和基地说清楚，躲着不是办法\"",
                effect: { ghost: 1, reputation: -5 },
                record: "day3_midnight_clinic_ghost_visit_C",
                nextNode: "day3_morning_clinic_ghost_silent_leave"
            }
        ]
    },
    "day3_midnight_clinic_ghost_reveal_truth": {
        id: "day3_midnight_clinic_ghost_reveal_truth",
        text: "你带他走进夜班休息室，关上门时，他突然摘下面具——左脸有一道从眉骨延伸到下颌的疤痕。<div class='story-dialog'>\"{{ghost.revealTruth.0}}\"</div>",
        options: [
            {
                id: "承诺保密",
                text: "认真处理伤口：\"我会帮你保密\"",
                effect: {},
                record: "day3_midnight_clinic_ghost_reveal_truth_A",
                nextNode: "day3_morning_clinic_konig_rehab"
            }
        ]
    },
    "day3_morning_clinic_konig_rehab": {
        id: "day3_morning_clinic_konig_rehab",
        text: "次日König来做康复训练，你帮他拉伸韧带时，他突然闷哼一声——旧伤牵扯到了童年的疤痕。<div class='story-dialog'>\"{{konig.rehabNextDay.0}}\"</div>",
        options: [
            {
                id: "A共情肯定",
                text: "A：\"你的反应很正常...而且你现在保护了那个小男孩，你做到了\"",
                effect: { konig: 5, reputation: 5 },
                record: "day3_morning_clinic_konig_rehab_A",
                nextNode: "day3_morning_clinic_konig_teach_selfdefense"
            },
            {
                id: "B肯定成长",
                text: "B：\"你现在的冷静和责任感，已经比过去的自己强太多了\"",
                effect: { konig: 4, reputation: 3 },
                record: "day3_morning_clinic_konig_rehab_B",
                nextNode: "day3_morning_clinic_konig_share_memory"
            },
            {
                id: "C回避情绪",
                text: "C：\"别想太多，专注康复就好\"",
                effect: {},
                record: "day3_morning_clinic_konig_rehab_C",
                nextNode: "day3_noon_clinic_hawk_visit"
            }
        ]
    },
    "day3_morning_clinic_konig_teach_selfdefense": {
        id: "day3_morning_clinic_konig_teach_selfdefense",
        text: "König眼睛亮了起来，突然站起身：<div class='story-dialog'>\"{{konig.teachSelfdefense.0}}\"</div>",
        options: [
            {
                id: "学习技巧",
                text: "认真模仿：\"谢谢，很实用\"",
                effect: {},
                record: "day3_morning_clinic_konig_teach_selfdefense_A",
                nextNode: "day3_noon_clinic_hawk_visit"
            }
        ]
    },
    // ========== Hawk施压 ==========
    "day3_noon_clinic_hawk_visit": {
        id: "day3_noon_clinic_hawk_visit",
        text: "中午，Hawk少校带着两名士兵走进诊所，双手背在身后，眼神轻蔑：<div class='story-dialog'>\"{{npc.hawkVisit.0}}\"</div>",
        options: [
            {
                id: "A强硬维护",
                text: "A：\"我是医生，只看伤，不问身份。我的患者隐私，不会向任何人透露\"",
                effect: { ghost: 2, konig: 2, reputation: 10 },
                record: "day3_noon_clinic_hawk_visit_A",
                nextNode: "day4_morning_clinic_base_harass"
            },
            {
                id: "B专业角度",
                text: "B：\"保护患者隐私是我的职业义务，你没有证据，不能随便指控我通敌\"",
                effect: { ghost: 3, konig: 1, reputation: 8 },
                record: "day3_noon_clinic_hawk_visit_B",
                nextNode: "day4_morning_clinic_konig_warn_base"
            },
            {
                id: "C妥协",
                text: "C：\"我确实不知道他在哪，你们别来找我麻烦\"",
                effect: { ghost: -3, konig: -3, reputation: -10 },
                record: "day3_noon_clinic_hawk_visit_C",
                nextNode: "day4_morning_clinic_reputation_drop"
            }
        ]
    },
    // ========== 第四天 ==========
    "day4_morning_clinic_leo_provide_evidence": {
        id: "day4_morning_clinic_leo_provide_evidence",
        text: "Leo拿着一份文件冲进诊所，脸色兴奋：<div class='story-dialog'>\"{{npc.leoEvidence.0}}\"</div>",
        options: [
            {
                id: "A合规途径",
                text: "A：\"交给König，他在基地有信任的同僚，能帮着提交给上层\"",
                effect: { konig: 5, reputation: 5 },
                record: "day4_morning_clinic_leo_provide_evidence_A",
                nextNode: "day4_morning_clinic_konig_convince_colleague"
            },
            {
                id: "B尊重患者",
                text: "B：\"给Ghost自己决定，这是他的事，我不能替他做选择\"",
                effect: { ghost: 5, reputation: 5 },
                record: "day4_morning_clinic_leo_provide_evidence_B",
                nextNode: "day4_morning_clinic_ghost_confront_hawk"
            },
            {
                id: "C观望",
                text: "C：\"先留在我这，等合适的时机再出手\"",
                effect: {},
                record: "day4_morning_clinic_leo_provide_evidence_C",
                nextNode: "day4_afternoon_clinic_health_inspection"
            }
        ]
    },
    // ========== 第十一天 ==========
    "day11_midnight_clinic_ghost_critical_injury": {
        id: "day11_midnight_clinic_ghost_critical_injury",
        text: "凌晨两点，诊所大门被猛地撞开。Ghost踉跄着冲进来，腹部鲜血淋漓——是贯穿伤，伤口还在冒着血泡，右手无力地垂着，神经明显受损。<div class='story-dialog'>\"{{ghost.criticalInjury.0}}\"</div>",
        options: [
            {
                id: "check_reputation",
                text: "立即准备手术",
                effect: {},
                record: "day11_midnight_clinic_ghost_critical_injury_A",
                nextNode: "dynamic_jump_reputation"
            }
        ]
    },
    "day11_midnight_clinic_success_rescue": {
        id: "day11_midnight_clinic_success_rescue",
        text: "你立刻启动应急手术：<div class='story-dialog'>\"Leo，我去拿止血棉和麻醉剂！你来帮我固定他的身体！{$username}能行！\"</div>你熟练地清创、缝合血管，用绝缘钳处理受损神经——之前König教你的防身术让你手部稳定性更强，Ghost透露的拆弹知识帮你避开了伤口附近的关键神经。手术进行了两个小时，黎明时分，Ghost的呼吸终于平稳。他醒来时，看着你布满血丝的眼睛，轻声说：<div class='story-dialog'>\"{{ghost.successRescue.0}}\"</div>",
        options: [
            {
                id: "end_crisis",
                text: "守在床边：\"好好休息\"",
                effect: { ghost: 20, reputation: 100 },
                record: "day11_midnight_clinic_success_rescue_A",
                nextNode: "day15_afternoon_clinic_final_epilogue"
            }
        ]
    },
    // ========== 最终结局 ==========
    "day15_afternoon_clinic_final_epilogue": {
        id: "day15_afternoon_clinic_final_epilogue",
        text: "两周后，诊所门口挂起了新的牌匾——「基地外指定医疗点」。Ghost康复后带着证据公开对峙Hawk，基地高层正式道歉。这天下午，Ghost和König同时走进诊所，手里分别拿着锦旗和家乡零食。<div class='story-dialog'>\"{{npc.finalEpilogue.0}}\"</div><div class='story-dialog'>\"{{npc.finalEpilogue.1}}\"</div>你笑着合上病历本：<div class='story-dialog'>\"{{npc.finalEpilogue.2}}\"</div>",
        options: [
            {
                id: "perfect_end",
                text: "查看结局详情",
                effect: {},
                record: "day15_afternoon_clinic_final_epilogue_A",
                nextNode: "dynamic_jump_ending"
            }
        ]
    },
    // ========== 补充缺失节点 ==========
    "day3_morning_clinic_ghost_avoid": { id: "day3_morning_clinic_ghost_avoid", text: "Ghost避开了你的诊所，再也没有出现过，{$username}。", options: [{ id: "next", text: "继续", effect: {}, record: "day3_morning_clinic_ghost_avoid_A", nextNode: "day3_morning_clinic_konig_rehab" }] },
    "day3_morning_clinic_leo_provide_clue": { id: "day3_morning_clinic_leo_provide_clue", text: "Leo找到了Hawk的武器采购记录，交给了你，{$username}。", options: [{ id: "next", text: "收下记录", effect: {}, record: "day3_morning_clinic_leo_provide_clue_A", nextNode: "day4_morning_clinic_leo_provide_evidence" }] },
    "day3_morning_clinic_ghost_silent_leave": { id: "day3_morning_clinic_ghost_silent_leave", text: "Ghost沉默地离开，再也没有提起这件事，{$username}。", options: [{ id: "next", text: "继续", effect: {}, record: "day3_morning_clinic_ghost_silent_leave_A", nextNode: "day3_morning_clinic_konig_rehab" }] },
    "day3_morning_clinic_konig_share_memory": { id: "day3_morning_clinic_konig_share_memory", text: "König分享了更多童年回忆，你们的关系更近了一步，{$username}。", options: [{ id: "next", text: "倾听", effect: {}, record: "day3_morning_clinic_konig_share_memory_A", nextNode: "day3_noon_clinic_hawk_visit" }] },
    "day4_morning_clinic_base_harass": { id: "day4_morning_clinic_base_harass", text: "基地开始频繁骚扰诊所，但你始终坚守立场，{$username}。", options: [{ id: "next", text: "坚持", effect: {}, record: "day4_morning_clinic_base_harass_A", nextNode: "day4_morning_clinic_leo_provide_evidence" }] },
    "day4_morning_clinic_konig_warn_base": { id: "day4_morning_clinic_konig_warn_base", text: "König向基地高层警告了Hawk的行为，暂时缓解了压力，{$username}。", options: [{ id: "next", text: "等待", effect: {}, record: "day4_morning_clinic_konig_warn_base_A", nextNode: "day4_morning_clinic_leo_provide_evidence" }] },
    "day4_morning_clinic_reputation_drop": { id: "day4_morning_clinic_reputation_drop", text: "诊所声誉下降，患者越来越少，{$username}。", options: [{ id: "next", text: "挽回声誉", effect: {}, record: "day4_morning_clinic_reputation_drop_A", nextNode: "day11_midnight_clinic_ghost_critical_injury" }] },
    "day4_morning_clinic_konig_convince_colleague": { id: "day4_morning_clinic_konig_convince_colleague", text: "König说服了基地同僚，准备提交证据，{$username}。", options: [{ id: "next", text: "等待结果", effect: {}, record: "day4_morning_clinic_konig_convince_colleague_A", nextNode: "day11_midnight_clinic_ghost_critical_injury" }] },
    "day4_morning_clinic_ghost_confront_hawk": { id: "day4_morning_clinic_ghost_confront_hawk", text: "Ghost拿着证据对峙Hawk，双方冲突升级，{$username}。", options: [{ id: "next", text: "支援Ghost", effect: {}, record: "day4_morning_clinic_ghost_confront_hawk_A", nextNode: "day11_midnight_clinic_ghost_critical_injury" }] },
    "day4_afternoon_clinic_health_inspection": { id: "day4_afternoon_clinic_health_inspection", text: "诊所迎来卫生检查，暂时搁置了证据的事，{$username}。", options: [{ id: "next", text: "配合检查", effect: {}, record: "day4_afternoon_clinic_health_inspection_A", nextNode: "day11_midnight_clinic_ghost_critical_injury" }] },
    "day11_midnight_clinic_rescue_with_sequela": { id: "day11_midnight_clinic_rescue_with_sequela", text: "手术成功，但Ghost留下了神经损伤的后遗症，{$username}。", options: [{ id: "next", text: "继续治疗", effect: {}, record: "day11_midnight_clinic_rescue_with_sequela_A", nextNode: "day15_afternoon_clinic_final_epilogue" }] },
    "day11_midnight_clinic_rescue_failure": { id: "day11_midnight_clinic_rescue_failure", text: "手术失败，Ghost重伤昏迷（普通结局），{$username}。", options: [{ id: "next", text: "等待苏醒", effect: {}, record: "day11_midnight_clinic_rescue_failure_A", nextNode: "day15_afternoon_clinic_final_epilogue" }] },
    "day15_afternoon_clinic_perfect_ending": { id: "day15_afternoon_clinic_perfect_ending", text: "完美结局：Ghost洗清冤屈，König解开心结，你的诊所成为基地指定医疗点，{$username}！", options: [{ id: "end", text: "结束游戏", effect: {}, record: "day15_afternoon_clinic_perfect_ending_A", nextNode: "day1_morning_clinic" }] },
    "day15_afternoon_clinic_normal_ending": { id: "day15_afternoon_clinic_normal_ending", text: "普通结局：Ghost康复但选择离开，König继续留在基地，你仍在诊所行医，{$username}。", options: [{ id: "end", text: "结束游戏", effect: {}, record: "day15_afternoon_clinic_normal_ending_A", nextNode: "day1_morning_clinic" }] },
    "day15_afternoon_clinic_regret_ending": { id: "day15_afternoon_clinic_regret_ending", text: "遗憾结局：Ghost远走他乡，König被调往其他基地，你失去了两位重要的朋友，{$username}。", options: [{ id: "end", text: "结束游戏", effect: {}, record: "day15_afternoon_clinic_regret_ending_A", nextNode: "day1_morning_clinic" }] }
};

// ===================== 核心渲染引擎（支持{$username}占位符） =====================
function renderTemplate(templateId, gameState) {
    const template = storyTemplates[templateId];
    if (!template) return null;

    // 深拷贝避免修改源模板
    const rendered = JSON.parse(JSON.stringify(template));
    const username = gameState.username || "Doctor"; // 兜底默认值

    // 1. 替换角色对话变量 + 用户名占位符
    rendered.text = rendered.text.replace(/{{([^}]+)}}/g, (_, key) => {
        const [char, type, idx] = key.split('.');
        let dialogText = characterDialogs[char]?.[type]?.[idx]?.text || key;
        // 替换对话中的{$username}
        return dialogText.replace(/\{\$username}/g, username);
    });

    // 2. 替换剧情文本中的{$username}
    rendered.text = rendered.text.replace(/\{\$username}/g, username);

    // 3. 处理动态跳转逻辑
    if (templateId === "day11_midnight_clinic_ghost_critical_injury") {
        const rep = gameState.reputation;
        rendered.options[0].nextNode = rep >= 70 ? "day11_midnight_clinic_success_rescue" : rep >= 50 ? "day11_midnight_clinic_rescue_with_sequela" : "day11_midnight_clinic_rescue_failure";
    }

    if (templateId === "day15_afternoon_clinic_final_epilogue") {
        const { ghost, konig } = gameState.favorability;
        rendered.options[0].nextNode = ghost >= 40 && konig >= 25 ? "day15_afternoon_clinic_perfect_ending" : ghost >= 30 || konig >= 20 ? "day15_afternoon_clinic_normal_ending" : "day15_afternoon_clinic_regret_ending";
    }

    // 4. 处理record记录和数值变化
    rendered.options.forEach(opt => {
        // 替换选项文本中的{$username}
        opt.text = opt.text.replace(/\{\$username}/g, username);

        opt.action = () => {
            // 记录选择（节点名称_A/B/C）
            if (opt.record) {
                gameState.choiceRecords[opt.record.split('_')[0]] = opt.record;
            }
            // 应用数值变化
            Object.keys(opt.effect || {}).forEach(key => {
                if (key === "ghost" || key === "konig") {
                    gameState.favorability[key] += opt.effect[key];
                } else if (key === "reputation") {
                    gameState.reputation += opt.effect[key];
                } else {
                    gameState[key] = opt.effect[key];
                }
            });
            // 更新UI和跳转
            updateStatusUI();
            updateStory(opt.nextNode);
        };
    });

    return rendered;
}

// ===================== 游戏初始化函数（获取用户名） =====================
function initGame() {
    // 弹出用户名输入框
    const username = prompt("请输入你的游戏昵称（诊所医生）：", "Doctor");
    if (username && username.trim()) {
        gameState.username = username.trim();
    } else {
        gameState.username = "Doctor"; // 默认值
    }

    // 初始化UI
    document.getElementById("username-display").textContent = gameState.username;
    updateStatusUI();

    // 加载第一个剧情节点
    updateStory(gameState.currentNodeId);
}

// ===================== 辅助函数 =====================
function updateStatusUI() {
    // 更新状态面板：用户名、好感度、声誉
    document.getElementById("ghost-favor").textContent = gameState.favorability.ghost;
    document.getElementById("konig-favor").textContent = gameState.favorability.konig;
    document.getElementById("reputation-val").textContent = gameState.reputation;
}

function updateStory(nodeId) {
    const renderedNode = renderTemplate(nodeId, gameState);
    if (!renderedNode) return;

    // 更新当前节点ID
    gameState.currentNodeId = nodeId;

    // 渲染剧情文本
    const storyContainer = document.getElementById("story-container");
    storyContainer.innerHTML = renderedNode.text;

    // 渲染选项按钮
    const optionsContainer = document.getElementById("options-container");
    optionsContainer.innerHTML = "";

    renderedNode.options.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "story-option-btn";
        btn.textContent = opt.text;
        btn.onclick = opt.action;
        optionsContainer.appendChild(btn);
    });
}


// 修改story-templates.js中的渲染函数
window.renderTemplate = function(nodeId, gameGlobal) {
  const node = storyTemplates[nodeId];
  if (!node) {
    console.error(`找不到剧情节点: ${nodeId}`);
    return null; // 明确返回null便于调试
  }

  // 替换用户名占位符
  let renderedText = node.text.replace(/{\$username}/g, gameGlobal.currentUsername);
  
  // 处理角色对话模板
  renderedText = renderedText.replace(/{{(.*?)}}/g, (match, expr) => {
    const [char, type, index] = expr.split('.');
    return getCharacterDialog(char, type, parseInt(index));
  });

  return {
    text: renderedText,
    options: node.options.map(opt => ({
      ...opt,
      action: opt.action || (() => {
        // 统一处理选项跳转逻辑
        if (opt.effect) {
          Object.entries(opt.effect).forEach(([key, val]) => {
            gameGlobal.gameState.favorability[key] += val;
          });
        }
        if (opt.record) {
          gameGlobal.gameState.choiceRecords[opt.record] = true;
        }
        gameGlobal.gameState.currentNodeId = opt.nextNode;
        updateStatusUI();
        renderCurrentNode();
      })
    }))
  };
};

// 新增：解析角色对话的工具函数
function getCharacterDialog(character, dialogKey, favorability) {
    // 获取对应角色的对话集合（如 ghost、konig、npc）
    const dialogs = characterDialogs[character]?.[dialogKey];
    if (!dialogs) return "";

    // 根据好感度查找匹配的对话（min ≤ 好感度 ≤ max）
    const matched = dialogs.find(d => 
        favorability >= d.min && favorability <= d.max
    );

    // 若未找到匹配项，返回第一个默认对话
    return matched ? matched.text : dialogs[0]?.text || "";
}