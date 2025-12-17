// 纯UI渲染模块，仅处理DOM操作，无业务逻辑
(function() {
    // 1. 根据好感度获取角色对话
    function getCharacterDialog(character, type) {
        const favor = window.gameState.favorability[character];
        const dialogs = characterDialogs[character][type];
        // 匹配好感度区间（取第一个符合条件的对话）
        return dialogs.find(d => favor >= d.min && favor <= d.max).text;
    }

    // 2. 解析模板，替换占位符
    function parseTemplate(templateText) {
        // 匹配 {{角色.对话类型}} 格式的占位符
        const regex = /{{(\w+)\.(\w+)}}/g;
        return templateText.replace(regex, (match, character, type) => {
            return getCharacterDialog(character, type);
        });
    }

    // 3. 渲染当前剧情节点（改造原有方法）
    window.renderCurrentNode = function() {
        const nodeId = window.gameState.currentNodeId;
        const template = storyTemplates[nodeId]; // 从模板中获取节点
        if (!template) return;

        // 解析模板文本（替换动态内容）
        document.getElementById('storyText').innerHTML = parseTemplate(template.text);

        // 更新状态显示
        document.getElementById('ghostFavor').textContent = window.gameState.favorability.ghost;
        document.getElementById('konigFavor').textContent = window.gameState.favorability.konig;
        document.getElementById('clinicRep').textContent = window.gameState.reputation;

        // 渲染选项按钮（自动绑定好感度效果）
        const optionsArea = document.getElementById('optionsArea');
        optionsArea.innerHTML = '';
        template.options.forEach(option => {
            const btn = document.createElement('button');
            btn.className = option.id.includes('A') ? 'option-btn option-a' : 'option-btn option-b';
            btn.id = option.id;
            btn.textContent = option.text;
            btn.addEventListener('click', () => {
                // 应用选项效果（好感度/声誉值变化）
                Object.keys(option.effect).forEach(key => {
                    if (key === 'reputation') {
                        window.gameState.reputation += option.effect[key];
                    } else {
                        window.gameState.favorability[key] += option.effect[key];
                    }
                });
                // 记录选择（可选）
                window.gameState.choiceRecords[option.id] = true;
                // 跳转下一个节点
                window.gameState.currentNodeId = option.nextNode;
                updateStatusUI(); // 更新状态UI
                window.renderCurrentNode(); // 重新渲染节点
            });
            optionsArea.appendChild(btn);
        });
    };
  // 1. 动态生成页面结构（完全脱离HTML）
  window.generatePageStructure = function() {
    // 生成用户名页
    const usernamePage = document.getElementById('usernamePage');
    usernamePage.innerHTML = `
      <h2 class="page-title">请输入用户名</h2>
      <input type="text" class="username-input" id="usernameInput" placeholder="输入你的名字">
      <button class="btn" id="newGameBtn">开始新游戏</button>
    `;

    // 生成开屏页
    const gameStartPage = document.getElementById('gameStartPage');
    gameStartPage.innerHTML = `
      <h2 class="page-title">游戏开始</h2>
      <p class="page-desc">欢迎来到COD Galgame，请点击下方按钮进入剧情</p>
      <button class="btn" id="enterStoryBtn">进入剧情</button>
    `;

    // 生成剧情页
    const storyPage = document.getElementById('storyPage');
    storyPage.innerHTML = `
      <div class="status-bar">
        <div class="status-item">Ghost好感度: <span id="ghostFavor">0</span></div>
        <div class="status-item">诊所声望: <span id="clinicRep">0</span></div>
      </div>
      <div class="story-text" id="storyText"></div>
      <div class="options-area" id="optionsArea"></div>
      <div class="save-buttons">
        <button class="btn" id="restartBtn">重新开始</button>
        <button class="btn" id="saveBtn">保存游戏</button>
        <button class="btn secondary" id="loadBtn">读取存档</button>
      </div>
    `;

    // 设置背景图初始路径
    const bgImage = document.getElementById('bgImage');
    bgImage.src = 'assets/pic/default.jpg';
  };

  // 2. 背景图容错处理（纯UI逻辑）
  window.initBgImage = function() {
    const bgImage = document.getElementById('bgImage');
    bgImage.onerror = function() {
      this.src = 'assets/pic/default.jpg';
      this.alt = '默认背景图';
    };
  };

  // 3. 页面切换（纯UI操作）
  window.switchPage = function(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('show'));
    const targetPage = document.getElementById(pageId);
    if (targetPage) targetPage.classList.add('show');
  };

  // 4. 渲染当前剧情节点（纯UI渲染）
  window.renderCurrentNode = function() {
    const node = window.storyNodes[window.gameState.currentNodeId];
    if (!node) return;

    // 更新剧情文本
    document.getElementById('storyText').innerHTML = node.text;

    // 更新状态显示
    document.getElementById('ghostFavor').textContent = window.gameState.favorability.ghost;
    document.getElementById('clinicRep').textContent = window.gameState.reputation;

    // 渲染选项按钮
    const optionsArea = document.getElementById('optionsArea');
    optionsArea.innerHTML = '';
    node.options.forEach(option => {
      const btn = document.createElement('button');
      btn.className = option.id.includes('A') ? 'option-btn option-a' : 'option-btn option-b';
      btn.id = option.id;
      btn.textContent = option.text;
      btn.addEventListener('click', option.action);
      optionsArea.appendChild(btn);
    });
  };
})();