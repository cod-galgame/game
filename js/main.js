// main.js - 统一管理用户名 + 主剧情渲染
(function () {
    // ========== 全局状态初始化（确保所有模块可访问） ==========
    window.gameGlobal = {
        currentUsername: "", // 全局用户名
        gameState: {
            username: "",
            favorability: { ghost: 0, konig: 0 },
            reputation: 0,
            choiceRecords: {},
            currentNodeId: "ghost_start"
        },
        // DOM元素缓存（全局可访问）
        dom: {
            storyText: null,
            optionsArea: null,
            ghostFavor: null,
            konigFavor: null,
            clinicRep: null
        }
    };

    // ========== DOM加载完成后初始化 ==========
    document.addEventListener('DOMContentLoaded', function () {
        // ========== 缓存DOM元素（全局可访问） ==========
        window.gameGlobal.dom = {
            // 用户名相关
            usernamePage: document.getElementById('usernamePage'),
            usernameInput: document.getElementById('usernameInput'),
            newGameBtn: document.getElementById('newGameBtn'),
            loadGameBtn: document.getElementById('loadGameBtn'),
            // 开屏页
            page1: document.getElementById('page1'),
            page2: document.getElementById('page2'),
            toPage2Btn: document.getElementById('toPage2'),
            enterGameBtn: document.getElementById('enterGame'),
            // 主剧情
            mainTitle: document.getElementById('mainTitle'),
            storyProgress: document.getElementById('storyProgress'),
            userSubTitle: document.getElementById('userSubTitle'),
            saveLoadGroup: document.getElementById('saveLoadGroup'),
            storyArea: document.getElementById('storyArea'),
            storyText: document.getElementById('storyText'),
            optionsArea: document.getElementById('optionsArea'),
            statusArea: document.getElementById('statusArea'),
            // 存档读档
            saveBtn: document.getElementById('saveBtn'),
            loadBtn: document.getElementById('loadBtn'),
            exportBtn: document.getElementById('exportBtn'),
            importBtn: document.getElementById('importBtn'),
            // 弹窗
            exportModal: document.getElementById('exportModal'),
            exportCodeInput: document.getElementById('exportCodeInput'),
            copyExportBtn: document.getElementById('copyExportBtn'),
            closeExportModal: document.getElementById('closeExportModal'),
            exportCopyTip: document.getElementById('exportCopyTip'),
            importModal: document.getElementById('importModal'),
            importCodeInput: document.getElementById('importCodeInput'),
            confirmImportBtn: document.getElementById('confirmImportBtn'),
            closeImportModal: document.getElementById('closeImportModal'),
            importCopyTip: document.getElementById('importCopyTip'),
            // 状态显示
            ghostFavor: document.getElementById('ghostFavor'),
            konigFavor: document.getElementById('konigFavor'),
            clinicRep: document.getElementById('clinicRep'),
            // 背景图
            bgImage: document.getElementById('bgImage')
        };

        const dom = window.gameGlobal.dom;
        const gameState = window.gameGlobal.gameState;

        // ========== 初始化配置 ==========
        // 背景图兜底
        dom.bgImage.onerror = function () {
            this.src = 'assets/pic/default.jpg';
            this.alt = '默认背景图';
        };

        // 初始隐藏主剧情区域
        dom.mainTitle.style.display = 'none';
        dom.saveLoadGroup.style.display = 'none';
        dom.storyArea.style.display = 'none';
        dom.optionsArea.style.display = 'none';
        dom.statusArea.style.display = 'none';

        // ========== 核心工具函数 ==========
        /**
         * 用户名清洗与校验
         * @param {string} username - 原始输入
         * @returns {object} {valid: boolean, msg: string, cleanName: string}
         */
        function validateUsername(username) {
            const cleanName = username.trim();
            if (!cleanName) return { valid: false, msg: "用户名不能为空！", cleanName: "" };
            if (cleanName.length > 20) return { valid: false, msg: "用户名长度不能超过20个字符！", cleanName: "" };
            const invalidChars = /[\\/:*?"<>|]/;
            if (invalidChars.test(cleanName)) return { valid: false, msg: "用户名不能包含 \\ / : * ? \" < > | 等特殊字符！", cleanName: "" };
            return { valid: true, msg: "", cleanName };
        }

        /**
         * 更新状态UI（全局可访问）
         */
        window.updateStatusUI = function () {
            dom.ghostFavor.textContent = gameState.favorability.ghost;
            dom.konigFavor.textContent = gameState.favorability.konig;
            dom.clinicRep.textContent = gameState.reputation;
        };

        /**
         * 渲染当前剧情节点（全局可访问）
         */
        window.renderCurrentNode = function () {
            if (!window.renderTemplate) {
                console.error("渲染函数未定义！请确保story-templates.js已加载");
                return;
            }
            // 渲染模板（替换{$username}占位符）
            const renderedNode = window.renderTemplate(gameState.currentNodeId, window.gameGlobal);
            if (!renderedNode) {
                dom.storyText.innerHTML = "⚠️ 剧情节点加载失败";
                dom.optionsArea.innerHTML = "";
                return;
            }
            dom.storyProgress.textContent = getStoryProgressText(gameState.currentNodeId);

            // 更新剧情文本
            dom.storyText.innerHTML = renderedNode.text;
            // 渲染选项按钮
            dom.optionsArea.innerHTML = "";
            renderedNode.options.forEach(opt => {
                const btn = document.createElement("button");
                btn.className = "option-btn";
                btn.textContent = opt.text;
                btn.onclick = opt.action;
                dom.optionsArea.appendChild(btn);
            });
        };

        // ========== 事件绑定 ==========
        // 新游戏：读取并校验用户名
        dom.newGameBtn.addEventListener('click', () => {
            const { valid, msg, cleanName } = validateUsername(dom.usernameInput.value);
            if (!valid) {
                alert(msg);
                return;
            }
            // 直接更新全局状态，不使用单独弹窗
            window.gameGlobal.gameState.username = cleanName;
            window.gameGlobal.currentUsername = cleanName;

            // 保存到localStorage作为全局存储
            localStorage.setItem('currentPlayer', cleanName);
            // 切换页面
            dom.usernamePage.style.display = 'none';
            dom.page1.classList.add('show');
            dom.usernameInput.value = ""; // 清空输入框
        });

        // 读档继续：读取用户名并加载存档
        dom.loadGameBtn.addEventListener('click', () => {
            const { valid, msg, cleanName } = validateUsername(dom.usernameInput.value);
            if (!valid) {
                alert(msg);
                return;
            }
            // 调用存档模块的读档函数
            const loadSuccess = window.loadGame ? window.loadGame(cleanName) : false;
            if (loadSuccess) {
                dom.usernamePage.style.display = 'none';
                // 更新副标题
                dom.userSubTitle.innerText = `欢迎回来，${window.gameGlobal.currentUsername} | 你的选择决定他的信任值`;
                // 显示主剧情区域
                dom.mainTitle.style.display = 'block';
                dom.saveLoadGroup.style.display = 'flex';
                dom.storyArea.style.display = 'block';
                dom.optionsArea.style.display = 'flex';
                dom.statusArea.style.display = 'flex';
                // 渲染剧情
                window.renderCurrentNode();
                window.updateStatusUI();
            }
        });

        // 开屏页切换
        dom.toPage2Btn.addEventListener('click', () => {
            dom.page1.classList.remove('show');
            dom.page2.classList.add('show');
        });

        // 进入游戏：确认用户名并初始化
        dom.enterGameBtn.addEventListener('click', () => {
            if (!window.gameGlobal.currentUsername) {
                alert("请先返回用户名页面输入昵称！");
                dom.page2.classList.remove('show');
                dom.usernamePage.style.display = 'block';
                return;
            }
            dom.page2.classList.remove('show');
            // 更新副标题
            dom.userSubTitle.innerText = `欢迎你，${window.gameGlobal.currentUsername} | 你的选择决定他的信任值`;
            // 显示主剧情区域
            dom.mainTitle.style.display = 'block';
            dom.saveLoadGroup.style.display = 'flex';
            dom.storyArea.style.display = 'block';
            dom.optionsArea.style.display = 'flex';
            dom.statusArea.style.display = 'flex';
            // 初始化游戏
            initGame();
        });

        // 存档按钮
        dom.saveBtn.addEventListener('click', () => {
            if (window.saveGame) window.saveGame();
        });

        // 读档按钮
        dom.loadBtn.addEventListener('click', () => {
            const inputName = prompt("请输入存档用户名：");
            if (!inputName) return;
            const { valid, msg, cleanName } = validateUsername(inputName);
            if (!valid) {
                alert(msg);
                return;
            }
            window.gameGlobal.currentUsername = cleanName;
            const loadSuccess = window.loadGame ? window.loadGame(cleanName) : false;
            if (loadSuccess) {
                window.renderCurrentNode();
                window.updateStatusUI();
            }
        });

        // 导出编码
        dom.exportBtn.addEventListener('click', () => {
            if (window.exportSaveCode) window.exportSaveCode();
        });

        // 复制导出编码
        dom.copyExportBtn.addEventListener('click', () => {
            dom.exportCodeInput.select();
            try {
                navigator.clipboard.writeText(dom.exportCodeInput.value);
                dom.exportCopyTip.textContent = "✓ 编码已复制到剪贴板！";
            } catch (e) {
                document.execCommand('copy');
                dom.exportCopyTip.textContent = "✓ 编码已复制到剪贴板！";
            }
        });

        // 关闭导出弹窗
        dom.closeExportModal.addEventListener('click', () => {
            dom.exportModal.style.display = 'none';
            dom.exportCodeInput.value = "";
        });

        // 打开导入弹窗
        dom.importBtn.addEventListener('click', () => {
            dom.importModal.style.display = 'flex';
            dom.importCodeInput.value = "";
            dom.importCopyTip.textContent = "";
        });

        // 确认导入编码
        dom.confirmImportBtn.addEventListener('click', () => {
            if (window.importSaveCode) window.importSaveCode();
        });

        // 关闭导入弹窗
        dom.closeImportModal.addEventListener('click', () => {
            dom.importModal.style.display = 'none';
            dom.importCodeInput.value = "";
        });

        // ========== 游戏初始化 ==========
        function initGame() {
            // 重置游戏状态（保留用户名）
            gameState.favorability = { ghost: 0, konig: 0 };
            gameState.reputation = 0;
            gameState.currentNodeId = "day1_morning_clinic";
            gameState.choiceRecords = {};
            gameState.username = window.gameGlobal.currentUsername;
            // 更新UI
            window.updateStatusUI();
            // 渲染初始剧情
            window.renderCurrentNode();
        }

        // 暴露初始化函数到全局
        window.initGame = initGame;
    });
})();

const dayTitleMap = {
    "day1": "晨雾诊所 危机初现",
    "day2": "晨光余温 暗流涌动",
    "day3": "深夜叩门 抉择时刻",
    "day4": "纸页锋芒 风雨欲来",
    "day11": "血色午夜 生死营救",
    "day15": "暖阳归期 尘埃落定"
};

// 动态提取天数并生成标题
function getStoryProgressText(nodeId) {
    // 正则匹配节点ID开头的 "day+数字"（兼容 day1/day11/day15 等）
    const dayRegex = /^day\d+/;
    const dayPrefix = nodeId.match(dayRegex)?.[0];

    if (dayPrefix && dayTitleMap[dayPrefix]) {
        return dayTitleMap[dayPrefix];
    }
    // 兜底：无匹配时显示节点ID
    return `当前剧情：未知章节（${nodeId}）`;
}