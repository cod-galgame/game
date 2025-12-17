// 剧情节点库（按角色_好感度_分支命名，新增声誉值关联）
const storyNodes = {
  "ghost_0_start": {
    id: "ghost_0_start",
    text: "清晨的诊所刚开门，Ghost就推门进来了。<br>他腰腹部缠着渗血的纱布，语气简洁：<div class='story-dialog'>\"Doctor，我需要缝针。\"</div>你凑近查看，伤口仅3cm长，是流弹擦伤的轻微伤。",
    options: [
      {
        id: "optionA",
        text: "A：你这看起来只有3cm，减张带贴一下就行了。",
        action: () => {
          gameState.favorability.ghost += 5;
          gameState.choiceRecords.ghostMorning = "optionA";
          gameState.currentNodeId = `ghost_${gameState.favorability.ghost}_a`;
          updateStatusUI();
          updateStory(gameState.currentNodeId);
        }
      },
      {
        id: "optionB",
        text: "B：缝针50磅。",
        action: () => {
          gameState.choiceRecords.ghostMorning = "optionB";
          gameState.currentNodeId = `ghost_${gameState.favorability.ghost}_b`;
          updateStatusUI();
          updateStory(gameState.currentNodeId);
        }
      }
    ]
  },
  "ghost_5_a": {
    id: "ghost_5_a",
    text: "Ghost看着你递来的减张带，眼神微顿（你能看到面罩下的眼尾松了一瞬）：<div class='story-dialog'>\"很合理的解决方案，谢谢。\"</div>他接过工具自行处理，临走时丢下一句：<div class='story-dialog'>\"明天训练后来复查。\"</div>",
    options: [
      {
        id: "nextA",
        text: "点头回应：\"好，明天见。\"",
        action: () => {
          gameState.currentNodeId = `konig_${gameState.favorability.konig}_evening`;
          updateStory(gameState.currentNodeId);
        }
      }
    ]
  },
  "ghost_0_b": {
    id: "ghost_0_b",
    text: "Ghost面具下的下颌线紧绷了一下，挑眉道：<div class='story-dialog'>\"比基地还贵？\"</div>但他没多争执，掏出钱放在桌上：<div class='story-dialog'>\"处理好，别感染。\"</div>",
    options: [
      {
        id: "nextB",
        text: "接过钱：\"放心，比基地的手艺好。\"",
        action: () => {
          gameState.currentNodeId = `konig_${gameState.favorability.konig}_evening`;
          updateStory(gameState.currentNodeId);
        }
      }
    ]
  },
  "konig_0_evening": {
    id: "konig_0_evening",
    text: "夜幕降临，诊所快关门时，König推门进来。<br>他头盔压得很低，声音带着电流声：<div class='story-dialog'>\"晚上好，doctor，我的大腿韧带似乎拉伤了...\"</div>",
    options: [
      {
        id: "konigA",
        text: "A：你平时壮的像牛，怎么还会拉伤？",
        action: () => {
          gameState.currentNodeId = `konig_${gameState.favorability.konig}_a`;
          updateStory(gameState.currentNodeId);
        }
      },
      {
        id: "konigB",
        text: "B：找我就对了，我专精运动损伤修复！",
        action: () => {
          gameState.favorability.konig += 5;
          gameState.currentNodeId = `konig_${gameState.favorability.konig}_b`;
          updateStatusUI();
          updateStory(gameState.currentNodeId);
        }
      }
    ]
  },
  "konig_0_a": {
    id: "konig_0_a",
    text: "König身体僵硬了一下，低声说：<div class='story-dialog'>\"只是任务中紧急规避时拉伤的。\"</div>你为他涂抹了镇痛药膏，他道谢后匆匆离开。<div class='story-dialog'>（提示：错过末班车，被迫睡在诊所）</div>",
    options: [
      {
        id: "nightA",
        text: "收拾休息，准备过夜",
        action: () => {
          gameState.currentNodeId = `ghost_${gameState.favorability.ghost}_night_crisis`;
          updateStory(gameState.currentNodeId);
        }
      }
    ]
  },
  "konig_5_b": {
    id: "konig_5_b",
    text: "头盔里传来轻笑，电流声都柔和了：<div class='story-dialog'>\"非常感谢。\"</div>他主动说明是任务拉伤，治疗后提醒：<div class='story-dialog'>\"晚上有情况，基地会有信号。\"</div>",
    options: [
      {
        id: "nightB",
        text: "笑着回应：\"多谢提醒，晚安。\"",
        action: () => {
          gameState.currentNodeId = `ghost_${gameState.favorability.ghost}_night_crisis`;
          updateStory(gameState.currentNodeId);
        }
      }
    ]
  },
  "ghost_5_night_crisis": {
    id: "ghost_5_night_crisis",
    text: "深夜的尖叫声划破夜空，你惊醒后抓起医疗箱冲出门。<br>东南方向火光冲天，老爷车打不着火时，Ghost跑来（语气比上次柔和）：<div class='story-dialog'>\"Doctor，能借用你的车吗？\"</div>",
    options: [
      {
        id: "carA",
        text: "A：我要去救人，开到现场再借你",
        action: () => {
          gameState.favorability.ghost += 5;
          gameState.reputation += 5; // 新增：增加声誉值
          gameState.choiceRecords.ghostCar = "optionA";
          gameState.currentNodeId = `ghost_${gameState.favorability.ghost}_car_a`;
          updateStatusUI();
          updateStory(gameState.currentNodeId);
        }
      },
      {
        id: "carB",
        text: "B：打不着火，你能开就借你",
        action: () => {
          gameState.choiceRecords.ghostTrust = true;
          gameState.choiceRecords.ghostCar = "optionB";
          gameState.currentNodeId = `ghost_${gameState.favorability.ghost}_car_b`;
          updateStatusUI();
          updateStory(gameState.currentNodeId);
        }
      }
    ]
  },
  "ghost_0_night_crisis": {
    id: "ghost_0_night_crisis",
    text: "深夜的尖叫声划破夜空，你惊醒后抓起医疗箱冲出门。<br>东南方向火光冲天，老爷车打不着火时，Ghost跑来（语气冰冷）：<div class='story-dialog'>\"Doctor，能借用你的车吗？\"</div>",
    options: [
      {
        id: "carA",
        text: "A：我要去救人，开到现场再借你",
        action: () => {
          gameState.favorability.ghost += 5;
          gameState.reputation += 5; // 新增：增加声誉值
          gameState.choiceRecords.ghostCar = "optionA";
          gameState.currentNodeId = `ghost_${gameState.favorability.ghost}_car_a`;
          updateStatusUI();
          updateStory(gameState.currentNodeId);
        }
      },
      {
        id: "carB",
        text: "B：打不着火，你能开就借你",
        action: () => {
          gameState.choiceRecords.ghostTrust = true;
          gameState.choiceRecords.ghostCar = "optionB";
          gameState.currentNodeId = `ghost_${gameState.favorability.ghost}_car_b`;
          updateStatusUI();
          updateStory(gameState.currentNodeId);
        }
      }
    ]
  },
  "ghost_10_car_a": {
    id: "ghost_10_car_a",
    text: `Ghost看着你的医疗箱，点头道（语气带了点温度）：<div class='story-dialog'>\"当然，我也是要去那里。我来帮你打火。\"</div>`,
    options: [
      {
        id: "goSceneA",
        text: "一起出发前往现场",
        action: () => {
          gameState.currentNodeId = `konig_${gameState.favorability.konig}_arrive_scene`;
          updateStory(gameState.currentNodeId);
        }
      }
    ]
  },
  "ghost_5_car_b": {
    id: "ghost_5_car_b",
    text: "Ghost绕车检查一圈：<div class='story-dialog'>\"疏于养护，但能开。我先去排查危险，你跟紧。\"</div>",
    options: [
      {
        id: "goSceneB",
        text: "递过钥匙：\"路上小心，我随后就到\"",
        action: () => {
          gameState.currentNodeId = `konig_${gameState.favorability.konig}_arrive_scene`;
          updateStory(gameState.currentNodeId);
        }
      }
    ]
  },
  "ghost_0_car_b": {
    id: "ghost_0_car_b",
    text: "Ghost绕车检查一圈，冷冷道：<div class='story-dialog'>\"疏于养护，但能开。我先去，出了事别找我。\"</div>",
    options: [
      {
        id: "goSceneB",
        text: "递过钥匙：\"路上小心，我随后就到\"",
        action: () => {
          gameState.currentNodeId = `konig_${gameState.favorability.konig}_arrive_scene`;
          updateStory(gameState.currentNodeId);
        }
      }
    ]
  },
  "konig_0_arrive_scene": {
    id: "konig_0_arrive_scene",
    text: "你们抵达现场，König面色紧绷地接管局势。<br>一个光脚小男孩跑过来哭着说：<div class='story-dialog'>\"Doctor，我的头好疼，像有虫子在咬...\"</div>",
    options: [
      {
        id: "checkBoy",
        text: "立刻蹲下为他检查",
        action: () => {
          gameState.currentNodeId = `ghost_${gameState.favorability.ghost}_medical_check`;
          updateStory(gameState.currentNodeId);
        }
      }
    ]
  },
  "konig_5_arrive_scene": {
    id: "konig_5_arrive_scene",
    text: "你们抵达现场，König看到你后立刻迎上来：<div class='story-dialog'>\"Doctor，你来了就好。\"</div>一个光脚小男孩跑过来哭着说：<div class='story-dialog'>\"Doctor，我的头好疼，像有虫子在咬...\"</div>",
    options: [
      {
        id: "checkBoy",
        text: "立刻蹲下为他检查",
        action: () => {
          gameState.currentNodeId = `ghost_${gameState.favorability.ghost}_medical_check`;
          updateStory(gameState.currentNodeId);
        }
      }
    ]
  },
  "ghost_10_medical_check": {
    id: "ghost_10_medical_check",
    text: "你检查后排除颅内损伤，男孩挠着后腰说：<div class='story-dialog'>\"这里好痒，有东西硌着...\"</div>你撩起睡衣，看到贴卡通贴纸的黑色装置：<div class='story-dialog'>【倒计时：03:00】</div>Ghost立刻靠过来：<div class='story-dialog'>\"我来教你拆，别慌。\"</div>",
    options: [
      {
        id: "calmDown",
        text: "保持冷静，准备应对危机",
        action: () => {
          gameState.currentNodeId = `ghost_${gameState.favorability.ghost}_bomb_crisis`;
          updateStory(gameState.currentNodeId);
        }
      }
    ]
  },
  "ghost_5_medical_check": {
    id: "ghost_5_medical_check",
    text: "你检查后排除颅内损伤，男孩挠着后腰说：<div class='story-dialog'>\"这里好痒，有东西硌着...\"</div>你撩起睡衣，看到贴卡通贴纸的黑色装置：<div class='story-dialog'>【倒计时：03:00】</div>Ghost在不远处喊：<div class='story-dialog'>\"小心点，那是炸弹！\"</div>",
    options: [
      {
        id: "calmDown",
        text: "保持冷静，准备应对危机",
        action: () => {
          gameState.currentNodeId = `ghost_${gameState.favorability.ghost}_bomb_crisis`;
          updateStory(gameState.currentNodeId);
        }
      }
    ]
  },
  "ghost_0_medical_check": {
    id: "ghost_0_medical_check",
    text: "你检查后排除颅内损伤，男孩挠着后腰说：<div class='story-dialog'>\"这里好痒，有东西硌着...\"</div>你撩起睡衣，看到贴卡通贴纸的黑色装置：<div class='story-dialog'>【倒计时：03:00】</div>Ghost皱眉：<div class='story-dialog'>\"别乱碰，自己找死别连累别人。\"</div>",
    options: [
      {
        id: "calmDown",
        text: "保持冷静，准备应对危机",
        action: () => {
          gameState.currentNodeId = `ghost_13_crisis_end`;
          updateStory(gameState.currentNodeId);
        }
      }
    ]
  },
  "ghost_10_bomb_crisis": {
    id: "ghost_10_bomb_crisis",
    text: "König将你护在身后，倒计时加速到00:05！<br>你翻出工具喊：<div class='story-dialog'>\"König，固定他的身体！\"</div>Ghost立刻冲过来指导：<div class='story-dialog'>\"剪黑色电容！相信我！\"</div>",
    options: [
      {
        id: "trustGhost",
        text: "信任Ghost，剪黑色电源接口",
        action: () => {
          gameState.reputation += 10; // 新增：增加声誉值
          gameState.favorability.konig += 5;
          gameState.favorability.ghost += 3;
          gameState.currentNodeId = `ghost_13_crisis_end`;
          updateStatusUI();
          updateStory(gameState.currentNodeId);
        }
      },
      {
        id: "wrongChoice",
        text: "慌乱中误触红色电容（坏结局）",
        action: () => {
          gameState.favorability.ghost = 0;
          gameState.favorability.konig = 0;
          gameState.reputation = 0; // 重置声誉值
          gameState.currentNodeId = `ghost_${gameState.favorability.ghost}_bad_ending`;
          updateStatusUI();
          updateStory(gameState.currentNodeId);
        }
      }
    ]
  },
  "ghost_5_bomb_crisis": {
    id: "ghost_5_bomb_crisis",
    text: "König将你护在身后，倒计时加速到00:05！<br>你翻出工具喊：<div class='story-dialog'>\"König，固定他的身体！\"</div>Ghost大喊：<div class='story-dialog'>\"别碰红色电容！一碰就炸！\"</div>",
    options: [
      {
        id: "trustGhost",
        text: "信任Ghost，剪黑色电源接口",
        action: () => {
          gameState.reputation += 10; // 新增：增加声誉值
          gameState.favorability.konig += 5;
          gameState.favorability.ghost += 2;
          gameState.currentNodeId = `ghost_10_car_a_aftermath`;
          updateStatusUI();
          updateStory(gameState.currentNodeId);
        }
      },
      {
        id: "wrongChoice",
        text: "慌乱中误触红色电容（坏结局）",
        action: () => {
          gameState.favorability.ghost = 0;
          gameState.favorability.konig = 0;
          gameState.reputation = 0; // 重置声誉值
          gameState.currentNodeId = `ghost_${gameState.favorability.ghost}_bad_ending`;
          updateStatusUI();
          updateStory(gameState.currentNodeId);
        }
      }
    ]
  },
  "ghost_0_bomb_crisis": {
    id: "ghost_0_bomb_crisis",
    text: "König将你护在身后，倒计时加速到00:05！<br>你翻出工具喊：<div class='story-dialog'>\"König，固定他的身体！\"</div>Ghost冷漠提醒：<div class='story-dialog'>\"别碰红色电容，我可不想收你的尸。\"</div>",
    options: [
      {
        id: "trustGhost",
        text: "信任Ghost，剪黑色电源接口",
        action: () => {
          gameState.reputation += 10; // 新增：增加声誉值
          gameState.favorability.konig += 5;
          gameState.favorability.ghost += 1;
          gameState.currentNodeId = `ghost_10_car_a_aftermath`;
          updateStatusUI();
          updateStory(gameState.currentNodeId);
        }
      },
      {
        id: "wrongChoice",
        text: "慌乱中误触红色电容（坏结局）",
        action: () => {
          gameState.favorability.ghost = 0;
          gameState.favorability.konig = 0;
          gameState.reputation = 0; // 重置声誉值
          gameState.currentNodeId = `ghost_${gameState.favorability.ghost}_bad_ending`;
          updateStatusUI();
          updateStory(gameState.currentNodeId);
        }
      }
    ]
  },
  "ghost_13_crisis_end": {
    id: "ghost_13_crisis_end",
    text: "倒计时停在00:02！危机解除。<br>König拍着你的后背说：<div class='story-dialog'>\"干得好，Doctor。\"</div>Ghost走到你身边，递来一瓶水：<div class='story-dialog'>\"下次别这么慌，我在。\"</div>",
    options: [
      {
        id: "backClinic",
        text: "和König返回诊所",
        action: () => {
          gameState.currentNodeId = `ghost_10_car_a_aftermath`;
          updateStory(gameState.currentNodeId);
        }
      }
    ]
  },
  "ghost_7_crisis_end": {
    id: "ghost_7_crisis_end",
    text: "倒计时停在00:02！危机解除。<br>König拍着你的后背说：<div class='story-dialog'>\"干得好，Doctor。\"</div>Ghost在不远处看着你，微微点头：<div class='story-dialog'>\"算你运气好。\"</div>",
    options: [
      {
        id: "backClinic",
        text: "和König返回诊所",
        action: () => {
          gameState.currentNodeId = `ghost_10_car_a_aftermath`;
          updateStory(gameState.currentNodeId);
        }
      },
    ]
  },
  "ghost_1_crisis_end": {
    id: "ghost_1_crisis_end",
    text: "倒计时停在00:02！危机解除。<br>König拍着你的后背说：<div class='story-dialog'>\"干得好，Doctor。\"</div>Ghost转身准备离开：<div class='story-dialog'>\"下次注意点，别添乱。\"</div>",
    options: [
      {
        id: "backClinic",
        text: "和König返回诊所",
        action: () => {
          gameState.currentNodeId = `ghost_10_car_a_aftermath`;
          updateStory(gameState.currentNodeId);
        }
      }
    ]
  },
  "ghost_0_bad_ending": {
    id: "ghost_0_bad_ending",
    text: "你触到红色电容，装置爆炸！<br>模糊中看到König扑过来护住你，Ghost也冲了过来...<div class='story-dialog'>（坏结局：一切回到原点）</div>",
    options: [
      {
        id: "restart",
        text: "重新开始游戏",
        action: () => {
          gameState.favorability.ghost = 0;
          gameState.favorability.konig = 0;
          gameState.reputation = 0; // 重置声誉值
          gameState.currentNodeId = "ghost_0_start";
          gameState.choiceRecords = {};
          updateStatusUI();
          updateStory(gameState.currentNodeId);
        }
      }
    ]
  },
  // 第四幕：危机余波・信任破冰（Day2~Day3）
  "ghost_10_car_a_aftermath": {
    id: "ghost_10_car_a_aftermath",
    text: "清晨诊所开门，你的老爷车停在门口，引擎盖还带着余温。Ghost靠在车门上，兜帽遮住半张脸，手里捏着一张便签。他主动上前，声音比平时柔和：<div class='story-dialog'>\"车修好了，打火线圈换了新的。\"</div>他递过便签，上面是潦草的字迹：<div class='story-dialog'>\"三年前拆弹小组的制式装置，电源接口都在右侧。\"</div>",
    options: [
      {
        id: "A1认可专业",
        text: "A1：\"你当时的判断是对的，这种装置确实该优先剪电源\"",
        action: () => {
          gameState.favorability.ghost += 1;
          gameState.reputation += 5;
          gameState.currentNodeId = "ghost_14_unlock_memory";
          updateStatusUI();
          updateStory(gameState.currentNodeId);
        }
      },
      {
        id: "A2普通回应",
        text: "A2：\"多谢修车，这便签我收下了\"",
        action: () => {
          gameState.currentNodeId = "konig_5_night_visit";
          updateStory(gameState.currentNodeId);
        }
      }
    ]
  },
  "ghost_14_unlock_memory": {
    id: "ghost_14_unlock_memory",
    text: "Ghost喉结动了动，突然说：<div class='story-dialog'>\"第一次拆弹时我剪错了线，队长替我挡了碎片。\"</div>他抬头看向远处的基地：<div class='story-dialog'>\"从那以后就记住了——电源永远是优先项。\"</div>",
    options: [
      {
        id: "追问往事",
        text: "轻声问：\"后来呢？\"",
        action: () => {
          gameState.favorability.ghost += 2;
          gameState.currentNodeId = "konig_5_night_visit";
          updateStatusUI();
          updateStory(gameState.currentNodeId);
        }
      }
    ]
  },
  "ghost_5_car_b_aftermath": {
    id: "ghost_5_car_b_aftermath",
    text: "清晨诊所开门，你的老爷车停在门口，引擎盖还带着余温。Ghost放下工具包就准备走，车窗夹着便签：<div class='story-dialog'>\"下次别让车在紧急时掉链子。\"</div>你打开工具包，发现里面多了几包战地止血棉。",
    options: [
      {
        id: "B1轻松调侃",
        text: "B1：\"工具我用完还你，下次修车记得收费\"",
        action: () => {
          gameState.favorability.ghost += 1;
          gameState.reputation += 3;
          gameState.currentNodeId = "konig_0_night_visit";
          updateStatusUI();
          updateStory(gameState.currentNodeId);
        }
      },
      {
        id: "B2正式感谢",
        text: "B2：\"多谢，车修得很利索\"",
        action: () => {
          gameState.currentNodeId = "konig_0_night_visit";
          updateStory(gameState.currentNodeId);
        }
      }
    ]
  },

  // 场景五：König 复诊・基地秘闻与信誉分
  "konig_5_night_visit": {
    id: "konig_5_night_visit",
    text: "当晚König来诊所复诊，卸下头盔——他坐在诊疗椅上，手指无意识摩挲着护臂：<div class='story-dialog'>\"那孩子的脑震荡没事了，基地的人已经送他回家。\"</div>他顿了顿，声音压低：<div class='story-dialog'>\"关于Ghost…基地三年前指控他‘私藏爆炸装置核心部件’，其实是任务失败后，高层要找替罪羊。\"</div>",
    options: [
      {
        id: "A共情中立",
        text: "A：\"他看起来不像会拿平民生命冒险的人\"",
        action: () => {
          gameState.favorability.konig += 3;
          gameState.reputation += 5;
          gameState.currentNodeId = "konig_8_reveal_clue";
          updateStatusUI();
          updateStory(gameState.currentNodeId);
        }
      },
      {
        id: "B理性求证",
        text: "B：\"基地的指控有证据吗？\"",
        action: () => {
          gameState.favorability.konig += 1;
          gameState.reputation += 3;
          gameState.currentNodeId = "konig_6_reveal_detail";
          updateStatusUI();
          updateStory(gameState.currentNodeId);
        }
      },
      {
        id: "C回避",
        text: "C：\"这和我没关系，我只负责治伤\"",
        action: () => {
          gameState.favorability.konig -= 2;
          gameState.reputation -= 5;
          gameState.currentNodeId = "leo_warning";
          updateStatusUI();
          updateStory(gameState.currentNodeId);
        }
      }
    ]
  },
  "konig_8_reveal_clue": {
    id: "konig_8_reveal_clue",
    text: "König抬头看你，眼神柔和了些：<div class='story-dialog'>\"你说得对。当时伤亡的平民是线人，Ghost为了保护她的家人不被报复，才选择沉默。\"</div>他取下护臂，露出内侧的刻字：<div class='story-dialog'>\"这是她的代号，我们都欠她的。\"</div>",
    options: [
      {
        id: "记下线索",
        text: "点头：\"我明白了\"",
        action: () => {
          gameState.currentNodeId = "leo_warning";
          updateStory(gameState.currentNodeId);
        }
      }
    ]
  },
  "konig_6_reveal_detail": {
    id: "konig_6_reveal_detail",
    text: "König从口袋里掏出一张折叠的纸：<div class='story-dialog'>\"证据是篡改的任务报告，签名是Hawk少校。\"</div>他展开纸张，上面有明显的涂改痕迹：<div class='story-dialog'>\"真正的报告早就被销毁了。\"</div>",
    options: [
      {
        id: "收起报告",
        text: "接过纸：\"我会收好的\"",
        action: () => {
          gameState.currentNodeId = "leo_warning";
          updateStory(gameState.currentNodeId);
        }
      }
    ]
  },
  "konig_0_night_visit": {
    id: "konig_0_night_visit",
    text: "当晚König来诊所复诊，卸下头盔后沉默地坐在诊疗椅上。你为他检查韧带时，他突然开口：<div class='story-dialog'>\"关于Ghost…基地三年前有过对他的指控。\"</div>他停顿片刻，似乎在犹豫是否继续。",
    options: [
      {
        id: "A共情中立",
        text: "A：\"他看起来不像会拿平民生命冒险的人\"",
        action: () => {
          gameState.favorability.konig += 3;
          gameState.reputation += 5;
          gameState.currentNodeId = "konig_3_reveal_clue";
          updateStatusUI();
          updateStory(gameState.currentNodeId);
        }
      },
      {
        id: "B理性求证",
        text: "B：\"基地的指控有证据吗？\"",
        action: () => {
          gameState.favorability.konig += 1;
          gameState.reputation += 3;
          gameState.currentNodeId = "konig_1_reveal_detail";
          updateStatusUI();
          updateStory(gameState.currentNodeId);
        }
      },
      {
        id: "C回避",
        text: "C：\"这和我没关系，我只负责治伤\"",
        action: () => {
          gameState.favorability.konig -= 2;
          gameState.reputation -= 5;
          gameState.currentNodeId = "leo_warning";
          updateStatusUI();
          updateStory(gameState.currentNodeId);
        }
      }
    ]
  },

  // 场景六：Leo 的警告・患者保护与信誉分
  "leo_warning": {
    id: "leo_warning",
    text: "König离开后，Leo端着两杯咖啡走进来，神色凝重：<div class='story-dialog'>\"我在基地的老战友说，Hawk少校在查你，说你‘包庇叛徒’。\"</div>他放下咖啡杯：<div class='story-dialog'>\"最近会有人来诊所监视，尤其是Ghost的行踪。\"</div>",
    options: [
      {
        id: "A保护患者",
        text: "A：\"我不在乎基地怎么说...凌晨我留着诊所门，他要是来躲，我能掩护他\"",
        action: () => {
          gameState.favorability.ghost += 2;
          gameState.reputation += 10;
          gameState.currentNodeId = "ghost_midnight_visit";
          updateStatusUI();
          updateStory(gameState.currentNodeId);
        }
      },
      {
        id: "B消极回避",
        text: "B：\"多一事不如少一事，他来我也假装没看见\"",
        action: () => {
          gameState.favorability.ghost -= 2;
          gameState.reputation -= 5;
          gameState.currentNodeId = "ghost_avoid_clinic";
          updateStatusUI();
          updateStory(gameState.currentNodeId);
        }
      },
      {
        id: "C折中",
        text: "C：\"下次见面我会提醒他小心的，但诊所不能留他\"",
        action: () => {
          gameState.currentNodeId = "konig_rehab_next_day";
          updateStory(gameState.currentNodeId);
        }
      }
    ]
  },

  // 第五幕：信任深挖・危机升级（Day4~Day7）
  "ghost_midnight_visit": {
    id: "ghost_midnight_visit",
    text: "凌晨三点，诊所后门被轻轻敲响。Ghost浑身是汗，左臂有一道深可见骨的划伤——是被刀划的，应该是躲避监视时与人冲突。他靠在门框上，面具沾染着灰尘：<div class='story-dialog'>\"能处理一下吗？别让基地知道。\"</div>你立刻拉他进屋，打开应急灯：<div class='story-dialog'>\"伤口很深，需要清创缝合，可能会留疤。\"</div>",
    options: [
      {
        id: "A保护隐私",
        text: "A：\"你跟我来...我不会告诉基地的\"",
        action: () => {
          gameState.favorability.ghost += 5;
          gameState.reputation += 15;
          gameState.currentNodeId = "ghost_reveal_truth";
          updateStatusUI();
          updateStory(gameState.currentNodeId);
        }
      },
      {
        id: "B专业协助",
        text: "B：\"我帮你找Leo，他有渠道弄到基地的武器采购记录\"",
        action: () => {
          gameState.favorability.ghost += 4;
          gameState.reputation += 15;
          gameState.currentNodeId = "leo_provide_clue";
          updateStatusUI();
          updateStory(gameState.currentNodeId);
        }
      },
      {
        id: "C施压",
        text: "C：\"你该和基地说清楚，躲着不是办法\"",
        action: () => {
          gameState.favorability.ghost += 1;
          gameState.reputation -= 5;
          gameState.currentNodeId = "ghost_silent_leave";
          updateStatusUI();
          updateStory(gameState.currentNodeId);
        }
      }
    ]
  },
  "ghost_reveal_truth": {
    id: "ghost_reveal_truth",
    text: "你带他走进夜班休息室，关上门时，他突然摘下面具——左脸有一道从眉骨延伸到下颌的疤痕。<div class='story-dialog'>\"我在查Hawk在地下钱庄的交易，他和敌对势力有武器交易。\"</div>他苦笑一声：<div class='story-dialog'>\"这道伤，是他派来的人划的。\"</div>",
    options: [
      {
        id: "承诺保密",
        text: "认真处理伤口：\"我会帮你保密\"",
        action: () => {
          gameState.currentNodeId = "konig_rehab_next_day";
          updateStory(gameState.currentNodeId);
        }
      }
    ]
  },

  // 场景八：König 的童年・共情与自我和解
  "konig_rehab_next_day": {
    id: "konig_rehab_next_day",
    text: "次日König来做康复训练，你帮他拉伸韧带时，他突然闷哼一声——旧伤牵扯到了童年的疤痕。<div class='story-dialog'>\"小时候因为长得高，被同学锁在仓库里，那里有老鼠…我怕了很多年。\"</div>他声音发颤：<div class='story-dialog'>\"上次误伤平民，我又想起了那个仓库，所有人都骂我‘巨人废物’。\"</div>",
    options: [
      {
        id: "A共情肯定",
        text: "A：\"你的反应很正常...而且你现在保护了那个小男孩，你做到了\"",
        action: () => {
          gameState.favorability.konig += 5;
          gameState.reputation += 5;
          gameState.currentNodeId = "konig_teach_selfdefense";
          updateStatusUI();
          updateStory(gameState.currentNodeId);
        }
      },
      {
        id: "B肯定成长",
        text: "B：\"你现在的冷静和责任感，已经比过去的自己强太多了\"",
        action: () => {
          gameState.favorability.konig += 4;
          gameState.reputation += 3;
          gameState.currentNodeId = "konig_share_memory";
          updateStatusUI();
          updateStory(gameState.currentNodeId);
        }
      },
      {
        id: "C回避情绪",
        text: "C：\"别想太多，专注康复就好\"",
        action: () => {
          gameState.currentNodeId = "hawk_visit_clinic";
          updateStory(gameState.currentNodeId);
        }
      }
    ]
  },
  "konig_teach_selfdefense": {
    id: "konig_teach_selfdefense",
    text: "König眼睛亮了起来，突然站起身：<div class='story-dialog'>\"我教你几个基础动作吧，遇到危险时能用得上。\"</div>他耐心示范着关节技：<div class='story-dialog'>\"这样能挣脱大多数束缚，记住要用巧劲。\"</div>",
    options: [
      {
        id: "学习技巧",
        text: "认真模仿：\"谢谢，很实用\"",
        action: () => {
          gameState.currentNodeId = "hawk_visit_clinic";
          updateStory(gameState.currentNodeId);
        }
      }
    ]
  },

  // 场景九：基地施压・坚守立场与信誉分
  "hawk_visit_clinic": {
    id: "hawk_visit_clinic",
    text: "中午，Hawk少校带着两名士兵走进诊所，双手背在身后，眼神轻蔑：<div class='story-dialog'>\"Doctor，我知道你在包庇Ghost。\"</div>他向前一步：<div class='story-dialog'>\"给你个机会，说出他的下落，我可以不追究你‘通敌’的责任。\"</div>",
    options: [
      {
        id: "A强硬维护",
        text: "A：\"我是医生，只看伤，不问身份。我的患者隐私，不会向任何人透露\"",
        action: () => {
          gameState.favorability.ghost += 2;
          gameState.favorability.konig += 2;
          gameState.reputation += 10;
          gameState.currentNodeId = "base_harass_clinic";
          updateStatusUI();
          updateStory(gameState.currentNodeId);
        }
      },
      {
        id: "B专业角度",
        text: "B：\"保护患者隐私是我的职业义务，你没有证据，不能随便指控我通敌\"",
        action: () => {
          gameState.favorability.ghost += 3;
          gameState.favorability.konig += 1;
          gameState.reputation += 8;
          gameState.currentNodeId = "konig_warn_base";
          updateStatusUI();
          updateStory(gameState.currentNodeId);
        }
      },
      {
        id: "C妥协",
        text: "C：\"我确实不知道他在哪，你们别来找我麻烦\"",
        action: () => {
          gameState.favorability.ghost -= 3;
          gameState.favorability.konig -= 3;
          gameState.reputation -= 10;
          gameState.currentNodeId = "clinic_reputation_drop";
          updateStatusUI();
          updateStory(gameState.currentNodeId);
        }
      }
    ]
  },

  // 第六幕：证据收集・信誉达标（Day8~Day10）
  "leo_provide_evidence": {
    id: "leo_provide_evidence",
    text: "Leo拿着一份文件冲进诊所，脸色兴奋：<div class='story-dialog'>\"找到了！这是三年前任务的原始报告，上面写着‘平民伤亡由基地线人失误导致’，还有Hawk少校的亲笔签名——是篡改前的版本！\"</div>",
    options: [
      {
        id: "A合规途径",
        text: "A：\"交给König，他在基地有信任的同僚，能帮着提交给上层\"",
        action: () => {
          gameState.favorability.konig += 5;
          gameState.reputation += 5;
          gameState.currentNodeId = "konig_convince_colleague";
          updateStatusUI();
          updateStory(gameState.currentNodeId);
        }
      },
      {
        id: "B尊重患者",
        text: "B：\"给Ghost自己决定，这是他的事，我不能替他做选择\"",
        action: () => {
          gameState.favorability.ghost += 5;
          gameState.reputation += 5;
          gameState.currentNodeId = "ghost_confront_hawk";
          updateStatusUI();
          updateStory(gameState.currentNodeId);
        }
      },
      {
        id: "C观望",
        text: "C：\"先留在我这，等合适的时机再出手\"",
        action: () => {
          gameState.currentNodeId = "health_inspection";
          updateStory(gameState.currentNodeId);
        }
      }
    ]
  },

  // 第七幕：生死救援・信誉分终极验证（Day11）
  "ghost_critical_injury": {
    id: "ghost_critical_injury",
    text: "凌晨两点，诊所大门被猛地撞开。Ghost踉跄着冲进来，腹部鲜血淋漓——是贯穿伤，伤口还在冒着血泡，右手无力地垂着，神经明显受损。<div class='story-dialog'>\"基地…强制派我去拆弹…防护装备有问题…\"</div>他咳了一口血：<div class='story-dialog'>\"别让他们知道…只有你能救我…\"</div>",
    options: [
      {
        id: "check_reputation",
        text: "立即准备手术",
        action: () => {
          if (gameState.reputation >= 70) {
            gameState.currentNodeId = "success_rescue";
          } else if (gameState.reputation >= 50) {
            gameState.currentNodeId = "rescue_with_sequela";
          } else {
            gameState.currentNodeId = "rescue_failure";
          }
          updateStory(gameState.currentNodeId);
        }
      }
    ]
  },
  "success_rescue": {
    id: "success_rescue",
    text: "你立刻启动应急手术：<div class='story-dialog'>\"Leo，我去拿止血棉和麻醉剂！你来帮我固定他的身体！\"</div>你熟练地清创、缝合血管，用绝缘钳处理受损神经——之前König教你的防身术让你手部稳定性更强，Ghost透露的拆弹知识帮你避开了伤口附近的关键神经。手术进行了两个小时，黎明时分，Ghost的呼吸终于平稳。他醒来时，看着你布满血丝的眼睛，轻声说：<div class='story-dialog'>\"谢谢…我第一次，敢把后背交给别人。\"</div>",
    options: [
      {
        id: "end_crisis",
        text: "守在床边：\"好好休息\"",
        action: () => {
          gameState.favorability.ghost += 20;
          gameState.reputation = 100;
          gameState.currentNodeId = "final_epilogue";
          updateStatusUI();
          updateStory(gameState.currentNodeId);
        }
      }
    ]
  },

  // 第八幕：结局铺垫・救赎与和解（Day15 后）
  "final_epilogue": {
    id: "final_epilogue",
    text: "两周后，诊所门口挂起了新的牌匾——「基地外指定医疗点」。Ghost康复后带着证据公开对峙Hawk，基地高层正式道歉。这天下午，Ghost和König同时走进诊所，手里分别拿着锦旗和家乡零食。<div class='story-dialog'>\"141特遣队的体检安排在每周三。\"</div><div class='story-dialog'>\"骷髅团的康复训练定在周五如何？\"</div>你笑着合上病历本：<div class='story-dialog'>\"按先来后到。\"</div>",
    options: [
      {
        id: "perfect_end",
        text: "查看结局详情",
        action: () => {
          if (gameState.favorability.ghost >= 40 && gameState.favorability.konig >= 25) {
            gameState.currentNodeId = "perfect_ending";
          } else if (gameState.favorability.ghost >= 30 || gameState.favorability.konig >= 20) {
            gameState.currentNodeId = "normal_ending";
          } else {
            gameState.currentNodeId = "regret_ending";
          }
          updateStory(gameState.currentNodeId);
        }
      }
    ]
  }
};