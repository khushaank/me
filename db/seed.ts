import "dotenv/config";
import { getDb } from "../api/queries/connection";
import { posts, profileBio, cvEntries, localUsers, siteSettings } from "./schema";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Seeding database...");

  // 1. Seed admin user
  const existingUsers = await getDb().select().from(localUsers);
  if (existingUsers.length === 0) {
    const passwordHash = await bcrypt.hash("123456", 12);
    await getDb().insert(localUsers).values({
      username: "admin",
      passwordHash,
      name: "Admin",
      role: "admin",
    });
    console.log("  Created admin user (admin / 123456)");
  } else {
    console.log("  Admin user already exists");
  }

  // 2. Seed blog posts
  const existingPosts = await getDb().select().from(posts);
  if (existingPosts.length === 0) {
    const seedPosts = [
      {
        year: "2025",
        image: "/images/blog-ai.jpg",
        sortOrder: 1,
        zhTitle: "AI 不是敌人，而是镜子",
        zhSubtitle: "关于人工智能如何反射我们自身的恐惧与渴望",
        zhCollection: "人工智能",
        zhContent: "每一次重大的技术革命都会引发一轮集体焦虑。但如果我们换个角度看待AI——不是把它当作取代人类的威胁，而是当作一面映照我们自身能力的镜子，或许能获得完全不同的洞察。",
        zhDetailContent: "2023年初，当我第一次使用GPT-4完成一个复杂的产品策略分析时，我陷入了长达两周的存在主义危机。如果一台机器能在几分钟内完成我过去需要两天才能完成的工作，那么我的价值在哪里？\n\n这种焦虑并非个例。我认识的每一位知识工作者——从律师到设计师，从程序员到记者——都经历过类似的震荡。但几个月后，当我开始系统性地将AI融入我的工作流程时，我发现了一些意想不到的事情：AI并没有取代我的思考，反而让我更加清晰地意识到自己真正独特的能力是什么。\n\n具体来说，AI在信息整合、模式识别和基础内容生成方面表现出色。但它无法替代的是：对人性微妙之处的洞察、在不确定性中做出判断的勇气、以及将不同领域的知识创造性地融合的能力。当我把繁琐的研究和分析工作交给AI后，我有了更多时间去思考\"为什么\"和\"意味着什么\"，而不是仅仅忙于\"是什么\"。\n\n更重要的是，AI迫使我们重新追问一些根本性的问题：什么是智能？什么是创造力？什么是人类独有的价值？这些问题没有标准答案，但追问本身就已经是一种成长。\n\n我开始把AI想象成一面镜子。它反射出我们的知识边界、思维习惯和创造力局限。当我们看着这面镜子时，真正重要的不是镜中的影像，而是我们对影像的反应——是逃避、是恐惧，还是借此机会重新审视和提升自己。",
        enTitle: "AI Is Not the Enemy, But a Mirror",
        enSubtitle: "On How Artificial Intelligence Reflects Our Own Fears and Desires",
        enCollection: "Artificial Intelligence",
        enContent: "Every major technological revolution triggers a wave of collective anxiety. But if we view AI not as a threat that replaces humans, but as a mirror reflecting our own capabilities, we might gain entirely different insights.",
        enDetailContent: "In early 2023, when I first used GPT-4 to complete a complex product strategy analysis, I fell into an existential crisis that lasted two weeks. If a machine could do in minutes what used to take me two days, where did my value lie?\n\nThis anxiety was not unique to me. Every knowledge worker I knew — from lawyers to designers, from programmers to journalists — had experienced similar turbulence. But months later, when I began systematically integrating AI into my workflow, I discovered something unexpected: AI did not replace my thinking. Instead, it made me more acutely aware of what truly unique abilities I possessed.\n\nSpecifically, AI excels at information synthesis, pattern recognition, and basic content generation. But what it cannot replace is: insight into the subtle nuances of human nature, the courage to make judgments amid uncertainty, and the ability to creatively fuse knowledge from different domains. When I delegated tedious research and analysis to AI, I gained more time to think about \"why\" and \"what it means,\" rather than just busying myself with \"what is.\"\n\nMore importantly, AI forces us to revisit fundamental questions: What is intelligence? What is creativity? What is uniquely human value? There are no standard answers to these questions, but the asking itself is already a form of growth.\n\nI began to imagine AI as a mirror. It reflects the boundaries of our knowledge, our thinking habits, and the limitations of our creativity. When we look into this mirror, what matters is not the image within it, but our reaction to that image — whether we flee, fear, or seize the opportunity to re-examine and elevate ourselves.",
      },
      {
        year: "2025",
        image: "/images/blog-tech.jpg",
        sortOrder: 2,
        zhTitle: "技术极简主义",
        zhSubtitle: "在工具泛滥的时代，少即是多",
        zhCollection: "科技",
        zhContent: "我们生活在一个工具极度丰富的时代。每一位知识工作者都可能同时使用十几种不同的应用和平台。但更多的工具真的意味着更高的效率吗？我的经验恰恰相反。",
        zhDetailContent: "去年，我做了一个实验：将工作中使用的数字工具从23个削减到7个。这个决定最初让我感到焦虑——我会不会因为缺少某个专用工具而降低效率？结果出乎意料：我的产出不仅提高了，更重要的是，我的思考质量也提升了。\n\n这个现象背后有一个简单的原理：每一个工具都有其隐含的思维框架。当你使用Notion时，你被引导去构建层级化的知识库；当你使用Roam Research时，你被鼓励去建立 networked thought；当你使用传统的Word文档时，你被推向线性叙事。工具不只是中性的媒介，它们塑造我们思考的方式。\n\n当我们同时使用太多工具时，我们的思维被不断地在不同框架之间切换。这种上下文切换的代价是高昂的——研究表明，每次切换后需要平均23分钟才能完全恢复深度专注状态。\n\n我的解决方案是\"技术极简主义\"：选择少数几个通用性强、开放性高的工具，然后在它们之上建立自己的工作系统。我的当前配置是：Obsidian（知识管理）、Linear（项目管理）、Figma（设计与原型）、VS Code（开发）、以及一套简单的脚本自动化工具。\n\n这个系统的核心原则是一致性：所有的知识都以Markdown格式存储，所有的任务都以统一的方式追踪，所有的项目都遵循相同的协作流程。这种一致性大幅减少了认知负荷，让我能够把更多的精力投入到真正重要的创造性工作中。\n\n极简主义不是关于 deprivation，而是关于 intentionality。每一个保留在工具箱中的工具都必须回答一个问题：它是否真的让我更好地思考、创造和沟通？",
        enTitle: "Technological Minimalism",
        enSubtitle: "In an Age of Tool Abundance, Less Is More",
        enCollection: "Technology",
        enContent: "We live in an era of extreme tool abundance. Every knowledge worker likely uses a dozen different applications and platforms simultaneously. But do more tools truly mean higher productivity? My experience suggests the opposite.",
        enDetailContent: "Last year, I conducted an experiment: I reduced the number of digital tools I used for work from 23 to 7. This decision initially made me anxious — would I become less efficient without certain specialized tools? The results were unexpected: not only did my output increase, but more importantly, the quality of my thinking improved as well.\n\nThere is a simple principle behind this phenomenon: every tool carries an implicit frame of thinking. When you use Notion, you are guided to build hierarchical knowledge bases; when you use Roam Research, you are encouraged to develop networked thought; when you use traditional Word documents, you are pushed toward linear narrative. Tools are not neutral media — they shape the way we think.\n\nWhen we use too many tools simultaneously, our thinking is constantly switching between different frameworks. The cost of this context switching is high — research shows it takes an average of 23 minutes to fully recover deep focus after each switch.\n\nMy solution is \"technological minimalism\": choosing a small number of highly versatile, open-ended tools, and building my own work system on top of them. My current setup is: Obsidian (knowledge management), Linear (project management), Figma (design and prototyping), VS Code (development), and a set of simple script automation tools.\n\nThe core principle of this system is consistency: all knowledge is stored in Markdown format, all tasks are tracked in a unified way, and all projects follow the same collaboration workflow. This consistency dramatically reduces cognitive load, allowing me to devote more energy to truly important creative work.\n\nMinimalism is not about deprivation; it is about intentionality. Every tool that remains in the toolbox must answer one question: does it truly help me think, create, and communicate better?",
      },
      {
        year: "2025",
        image: "/images/blog-growth.jpg",
        sortOrder: 3,
        zhTitle: "复利思维的人生算法",
        zhSubtitle: "微小改进如何在时间中累积成巨大的差异",
        zhCollection: "个人成长",
        zhContent: "大多数人高估了一年内能做的事，却低估了十年内能达到的高度。复利——这个金融学概念——或许是个人成长领域最被低估的模型。",
        zhDetailContent: "五年前，我开始记录自己的\"每日1%改进\"。这个理念很简单：每天在某个方面比前一天进步1%。听起来微不足道，但复利效应意味着一年后你会比起点优秀37倍。\n\n我选择的第一个领域是公开写作。最初的几个月几乎没有任何读者。但我坚持每天写一篇短文，无论多忙。第一年结束时，我的Newsletter只有不到500个订阅者。但到第三年时，这个数字增长到了5万。更重要的是，写作能力的提升让我的工作本身变得更有效——更清晰的表达意味着更高效的沟通，更深入的思考意味着更好的决策。\n\n复利思维的关键在于三个要素：一致性、耐心和正确的方向。没有一致性，复利无从累积；没有耐心，你会在突破的前夕放弃；没有正确的方向，你只是在原地打转。\n\n我发现最有价值的复利投资往往不是技能本身，而是\"元技能\"——学习如何学习、思考如何思考、管理如何管理。这些底层能力的提升会像操作系统升级一样，让你在所有的应用软件中都变得更高效。\n\n另一个被忽视的复利领域是人际关系。每一个真诚的连接、每一次善意的帮助、每一段深入的对话，都在你的人际网络中存入了一笔\"社会资本\"。多年之后，这些积累会在你意想不到的时刻产生回报。\n\n最后，复利的反面是\"复亏\"。坏习惯同样会以指数方式累积——每天少睡半小时、每天多刷十分钟社交媒体、每天逃避一次困难对话。这些微小的负向选择，长期看来会产生毁灭性的后果。\n\n人生算法的关键不在于某一次的大手笔，而在于每天的小选择。你正在通过今天的选择，为五年后的自己编程。",
        enTitle: "The Compounding Algorithm of Life",
        enSubtitle: "How Tiny Improvements Accumulate Into Massive Differences Over Time",
        enCollection: "Personal Growth",
        enContent: "Most people overestimate what they can do in a year and underestimate what they can achieve in a decade. Compounding — this concept from finance — is perhaps the most underrated model in the realm of personal growth.",
        enDetailContent: "Five years ago, I started tracking my \"daily 1% improvement.\" The idea is simple: improve by just 1% in some area every day compared to the day before. It sounds trivial, but the power of compounding means you will be 37 times better than your starting point after one year.\n\nThe first domain I chose was public writing. The first few months had virtually no readers. But I insisted on writing one short piece every day, no matter how busy I was. By the end of the first year, my newsletter had fewer than 500 subscribers. But by the third year, that number had grown to 50,000. More importantly, the improvement in my writing ability made my work itself more effective — clearer expression meant more efficient communication, and deeper thinking meant better decisions.\n\nThe key to compounding thinking lies in three elements: consistency, patience, and the right direction. Without consistency, there is no compounding; without patience, you will quit just before the breakthrough; without the right direction, you are merely running in circles.\n\nI have found that the most valuable compounding investments are often not skills themselves, but \"meta-skills\" — learning how to learn, thinking about how to think, managing how to manage. Improvements in these underlying capabilities are like operating system upgrades, making you more efficient across all applications.\n\nAnother overlooked area of compounding is relationships. Every genuine connection, every act of kindness, every deep conversation deposits a unit of \"social capital\" into your network. Years later, these accumulations pay off at moments you never expected.\n\nFinally, the opposite of compounding is \"negative compounding.\" Bad habits also accumulate exponentially — sleeping half an hour less each day, scrolling social media for ten more minutes each day, avoiding one difficult conversation each day. These tiny negative choices, over the long term, have devastating consequences.\n\nThe key to life's algorithm lies not in one grand gesture, but in daily small choices. Through today's choices, you are programming the person you will become in five years.",
      },
      {
        year: "2024",
        image: "/images/blog-business.jpg",
        sortOrder: 4,
        zhTitle: "反脆弱创业",
        zhSubtitle: "在不确定性的风暴中，如何不仅生存而且更强",
        zhCollection: "商业",
        zhContent: "塔勒布提出了\"反脆弱\"的概念——有些系统不仅在冲击中存活，还会因为冲击而变得更强。这个理念对创业者而言，比任何商业计划书都重要。",
        zhDetailContent: "2022年的市场崩盘是我经历过的最残酷的商学院课程。当时我的投资组合在三个月内缩水了近40%，而我担任顾问的两家初创公司先后倒闭。那段时间我每天只睡四小时，在恐惧和焦虑中度过。\n\n但正是这次危机让我真正理解了\"反脆弱\"的含义。脆弱的东西在冲击中破碎；坚韧的东西在冲击中保持不变；而反脆弱的东西在冲击后变得更强大。\n\n我开始重新审视自己的商业模式和投资策略。我意识到，过去的我在追求\"稳定\"——稳定的收入、稳定的增长、稳定的市场。但这种稳定是虚假的，它建立在风险被隐藏而非被管理的基础上。真正的安全不是避免波动，而是建立能从波动中获益的系统。\n\n具体而言，我做出了三个关键改变：\n\n第一，从\"全押\"转向\"杠铃策略\"。将80%的资源投入极度安全的领域，用20%去追求高风险高回报的机会。这让我在保住底线的同时，不放弃指数增长的可能性。\n\n第二，将失败视为信息而非终点。每一次尝试，无论成败，都在压缩\"可能性空间\"——让我知道什么可行、什么不可行。我把这种思维称为\"选项价值\"思维：每一个实验都在购买一个未来可能变得有价值的期权。\n\n第三，建立冗余和缓冲。在个人财务上，我建立了覆盖18个月支出的应急基金；在商业上，我确保每一个关键系统都有备份方案。冗余不是浪费，而是为不确定性支付的保险费。\n\n两年后，这套反脆弱体系经历了真正的考验。当2024年的AI浪潮席卷而来时，许多同行措手不及，而我因为早就将AI实验纳入了我的\"杠铃策略\"中，不仅平稳过渡，还抓住了前所未有的机会。\n\n不确定性不是敌人，而是进化的动力。拥抱波动，构建反脆弱，这是我在商业世界学到的最重要一课。",
        enTitle: "Antifragile Entrepreneurship",
        enSubtitle: "How to Not Just Survive but Grow Stronger Through Storms of Uncertainty",
        enCollection: "Business",
        enContent: "Taleb introduced the concept of \"antifragility\" — some systems not only survive shocks but become stronger because of them. This idea is more important for entrepreneurs than any business plan.",
        enDetailContent: "The market crash of 2022 was the most brutal business school lesson I ever experienced. My investment portfolio shrank by nearly 40% in three months, and two startups I advised as a consultant went under successively. During that period, I slept only four hours a day, living in fear and anxiety.\n\nBut it was precisely this crisis that made me truly understand the meaning of \"antifragility.\" Fragile things break under shock; robust things remain unchanged; but antifragile things become stronger after the shock.\n\nI began to re-examine my business model and investment strategy. I realized that in the past, I had been pursuing \"stability\" — stable income, stable growth, stable markets. But this stability was illusory, built on hidden rather than managed risk. True safety is not about avoiding volatility, but about building systems that benefit from volatility.\n\nSpecifically, I made three key changes:\n\nFirst, shifting from \"all-in\" to a \"barbell strategy.\" Investing 80% of resources in extremely safe areas, while using 20% to pursue high-risk, high-reward opportunities. This allows me to protect my downside while not giving up the possibility of exponential growth.\n\nSecond, treating failure as information rather than an endpoint. Every attempt, whether successful or not, compresses the \"possibility space\" — teaching me what works and what doesn't. I call this way of thinking \"option value\" thinking: every experiment purchases an option that may become valuable in the future.\n\nThird, building redundancy and buffers. In personal finance, I built an emergency fund covering 18 months of expenses; in business, I ensured every critical system had a backup plan. Redundancy is not waste, but insurance paid for uncertainty.\n\nTwo years later, this antifragile system faced a real test. When the AI wave of 2024 swept through, many peers were caught off guard, while I — having long incorporated AI experiments into my \"barbell strategy\" — not only transitioned smoothly but also seized unprecedented opportunities.\n\nUncertainty is not the enemy, but the driving force of evolution. Embrace volatility. Build antifragility. This is the most important lesson I have learned in the business world.",
      },
      {
        year: "2024",
        image: "/images/blog-finance.jpg",
        sortOrder: 5,
        zhTitle: "财富的认知维度",
        zhSubtitle: "真正的财务自由始于思维方式的转变",
        zhCollection: "财务",
        zhContent: "大多数人追逐财富的方式就像狗追着自己的尾巴——跑得越快，离目标越远。直到我改变了对财富的认知框架，才真正开始积累有意义的资产。",
        zhDetailContent: "我的第一份工作的年薪是8万美元。按照当时的消费标准，这已经是相当优厚的收入。但三年下来，我的银行存款几乎没有增长。问题不在于赚得不够，而在于我对于\"有钱\"的定义完全是错误的。\n\n我当时的财富公式是：收入 - 支出 = 储蓄。这个公式隐含着一个危险的假设：生活水平会随着收入自然提升。结果是，每当我加薪时，我的支出也会相应增加——更好的公寓、更贵的餐厅、更频繁的国际旅行。我陷入了\"生活方式膨胀\"的陷阱。\n\n转折点来自我读到达利欧的一句话：\"财富的积累速度取决于你的储蓄率，而非你的收入水平。\"这句话让我重新审视自己的财务认知。\n\n我建立了新的财富公式：收入 - 投资 = 支出。这个看似微小的调整实际上是一个认知革命：它把投资放在了支出的前面，意味着每次收入到账时，首先被提取的是\"未来的自己\"应得的部分，剩下的才是\"现在的自己\"可以消费的。\n\n我将收入的至少40%用于投资——不是为了追求暴富，而是为了购买时间和选择权。真正的财富不是你能买得起什么，而是你可以拒绝什么。当你拥有足够的被动收入时，你获得了对时间的控制权，而时间是我们唯一真正稀缺的资源。\n\n在投资标的选择上，我遵循\"核心-卫星\"策略：70%投入低成本的指数基金（全球股市+债券），30%用于主动选择——包括个股、加密货币和早期项目投资。这种配置让我在享受市场长期增长的同时，保留了超额收益的可能性。\n\n但比具体的投资策略更重要的，是对于风险的理解。大多数人把风险等同于波动，因此追逐\"安全\"的储蓄账户。但长期来看，现金才是风险最高的资产——因为它被通货膨胀持续侵蚀。真正的风险管理不是避免波动，而是确保你的投资组合能在任何市场环境下都能维持你的生活标准。\n\n财富积累是一场马拉松，而不是短跑。它需要耐心、纪律和持续的认知升级。当你的思维发生转变时，你的银行账户也会跟着转变。",
        enTitle: "The Cognitive Dimension of Wealth",
        enSubtitle: "True Financial Freedom Begins With a Shift in Mindset",
        enCollection: "Finance",
        enContent: "Most people chase wealth the way a dog chases its own tail — the faster they run, the farther the goal seems. It wasn't until I changed my cognitive framework around money that I truly began to accumulate meaningful assets.",
        enDetailContent: "My first job paid $80,000 a year. By the standards of the time, this was already a generous income. But after three years, my bank account had barely grown. The problem was not that I didn't earn enough, but that my definition of \"being rich\" was completely wrong.\n\nMy wealth formula at the time was: Income - Expenses = Savings. This formula carried a dangerous implicit assumption: that living standards naturally rise with income. The result was that every time I got a raise, my spending increased accordingly — a better apartment, more expensive restaurants, more frequent international travel. I had fallen into the trap of \"lifestyle inflation.\"\n\nThe turning point came when I read a quote from Ray Dalio: \"The rate of wealth accumulation depends on your savings rate, not your income level.\" This made me re-examine my financial cognition.\n\nI established a new wealth formula: Income - Investments = Expenses. This seemingly minor adjustment was actually a cognitive revolution: it placed investment before expenses, meaning that every time income arrived, the first portion extracted was what \"your future self\" deserved, and only the remainder was what \"your present self\" could consume.\n\nI invest at least 40% of my income — not in pursuit of getting rich quick, but to buy time and optionality. True wealth is not what you can afford to buy, but what you can afford to refuse. When you have enough passive income, you gain control over your time, and time is the only truly scarce resource we have.\n\nIn choosing investment vehicles, I follow a \"core-satellite\" strategy: 70% goes into low-cost index funds (global equities + bonds), and 30% is used for active selection — including individual stocks, cryptocurrency, and early-stage investments. This allocation allows me to enjoy the market's long-term growth while retaining the possibility of outsized returns.\n\nBut more important than specific investment strategies is the understanding of risk. Most people equate risk with volatility, and therefore chase \"safe\" savings accounts. But in the long run, cash is the riskiest asset — because it is continuously eroded by inflation. True risk management is not about avoiding volatility, but about ensuring your investment portfolio can sustain your living standards in any market environment.\n\nWealth accumulation is a marathon, not a sprint. It requires patience, discipline, and continuous cognitive upgrading. When your thinking shifts, your bank account will follow.",
      },
      {
        year: "2024",
        image: "/images/blog-life.jpg",
        sortOrder: 6,
        zhTitle: "有意识的生活设计",
        zhSubtitle: "在这个 distracted 的时代，如何重新掌控注意力",
        zhCollection: "生活",
        zhContent: "我们的生活正在被无声地殖民。推送通知、无限滚动的信息流、以及永远在线的社交压力——这些设计精巧的注意力收割机正在剥夺我们最宝贵的资源：清醒的、自主的意识。",
        zhDetailContent: "去年我做了一个可能是我人生中最有价值的实验：进行为期一个月的\"数字排毒\"。具体规则很简单：删除手机上所有社交媒体应用，关闭所有非必要的推送通知，每天只在固定的时间段查看邮件和消息。\n\n第一周是痛苦的。我发现自己每隔几分钟就会下意识地去摸手机，就像吸烟者寻找香烟一样。这种无意识的冲动揭示了一个令人不安的事实：我的注意力已经不是我自己的了，它属于那些设计精密成瘾机制的产品经理们。\n\n但从第二周开始，一些奇妙的事情发生了。我开始注意到以前从未注意过的东西：清晨阳光穿过窗帘的角度、咖啡的香气在空气中的扩散、与陌生人目光相遇时的微妙表情。我的感知变得敏锐，我的思维变得清晰，我的创造力开始流动。\n\n更重要的是，我重新发现了\"深度无聊\"的价值。在现代社会，我们如此恐惧无聊，以至于用无尽的内容填满每一个空闲时刻。但神经科学研究表明，无聊是创造力的孵化器——当大脑从外部刺激中解放出来时，它会进入\"默认模式网络\"，在这个状态下，我们进行最有价值的联想、反思和洞察。\n\n这个实验促使我建立了一套系统性的\"注意力管理\"实践：\n\n第一，\"注意力预算\"。像管理金钱一样管理注意力——每天早上决定今天要投入到哪些活动中，以及投入多少。不要把注意力留给随机出现的需求。\n\n第二，\"数字 Sabbath\"。每周选择一天完全脱离数字设备。这一天用来阅读纸质书、进行户外活动、与朋友面对面交谈。这种定期的\"系统重置\"对于维持心理健康至关重要。\n\n第三，\"单任务法则\"。停止多任务处理。研究表明，多任务处理不仅降低效率，还会损害认知能力。一次只做一件事，但全身心地做。\n\n第四，\"环境设计\"。主动设计你的物理和数字环境，减少分心的诱惑。把手机放在另一个房间工作，使用网站拦截工具，在需要深度工作的时间段把手机设置为飞行模式。\n\n有意识的生活设计不是关于逃避技术，而是关于有选择地使用技术。技术应该是扩展我们能力的工具，而不是控制我们注意力的主人。当我们重新掌控注意力时，我们就重新掌控了生活本身。",
        enTitle: "Intentional Life Design",
        enSubtitle: "In This Age of Distraction, How to Reclaim Control of Your Attention",
        enCollection: "Life",
        enContent: "Our lives are being silently colonized. Push notifications, infinitely scrolling feeds, and the ever-present pressure to be online — these finely designed attention harvesters are depriving us of our most precious resource: wakeful, autonomous consciousness.",
        enDetailContent: "Last year, I conducted what may be the most valuable experiment of my life: a one-month \"digital detox.\" The rules were simple: delete all social media apps from my phone, turn off all non-essential push notifications, and only check emails and messages during designated time windows each day.\n\nThe first week was painful. I found myself reaching for my phone every few minutes, like a smoker searching for a cigarette. This unconscious impulse revealed a disturbing truth: my attention no longer belonged to me. It belonged to product managers who had engineered sophisticated addiction mechanisms.\n\nBut starting from the second week, something remarkable happened. I began noticing things I had never noticed before: the angle of morning sunlight passing through the curtains, the diffusion of coffee aroma in the air, the subtle expressions when making eye contact with strangers. My perception became sharper, my thinking clearer, and my creativity began to flow.\n\nMore importantly, I rediscovered the value of \"deep boredom.\" In modern society, we are so terrified of boredom that we fill every idle moment with endless content. But neuroscience research shows that boredom is the incubator of creativity — when the brain is freed from external stimuli, it enters the \"default mode network,\" the state in which we perform our most valuable associating, reflecting, and insight-generating.\n\nThis experiment led me to establish a systematic \"attention management\" practice:\n\nFirst, the \"attention budget.\" Manage attention the way you manage money — every morning, decide which activities to invest in today and how much. Don't leave your attention to randomly appearing demands.\n\nSecond, \"digital Sabbath.\" Choose one day each week to completely disconnect from digital devices. Use this day to read physical books, engage in outdoor activities, and have face-to-face conversations with friends. This regular \"system reset\" is essential for maintaining mental health.\n\nThird, the \"single-task rule.\" Stop multitasking. Research shows that multitasking not only reduces efficiency but also impairs cognitive ability. Do one thing at a time, but do it with your full presence.\n\nFourth, \"environment design.\" Actively design your physical and digital environment to reduce the temptation of distraction. Put your phone in another room while working, use website blockers, and set your phone to airplane mode during deep work periods.\n\nIntentional life design is not about escaping technology, but about using technology selectively. Technology should be a tool that amplifies our capabilities, not a master that controls our attention. When we reclaim control of our attention, we reclaim life itself.",
      },
    ];

    for (const post of seedPosts) {
      await getDb().insert(posts).values(post);
    }
    console.log(`  Seeded ${seedPosts.length} blog posts`);
  } else {
    console.log(`  ${existingPosts.length} blog posts already exist`);
  }

  // 3. Seed profile bio
  const existingBio = await getDb().select().from(profileBio);
  if (existingBio.length === 0) {
    await getDb().insert(profileBio).values({
      id: 1,
      zhText: "Khushaank Gupta，人工智能、科技与商业领域的写作者和思考者。我探索AI如何重塑我们的生活、工作方式以及思维模式，同时关注个人成长、商业策略和财务智慧。从硅谷的科技创新到华尔街的金融波动，从深度学习的前沿突破到日常生活的微小进步——我相信技术与人文的交汇点才是未来真正的增长点。曾在多家科技公司担任产品顾问，同时也是一名独立投资人。",
      enText: "Khushaank Gupta — writer and thinker at the intersection of AI, technology, business, and personal growth. I explore how artificial intelligence is reshaping our lives, careers, and patterns of thinking, while staying grounded in the timeless principles of business strategy and financial wisdom. From Silicon Valley innovations to Wall Street movements, from deep learning breakthroughs to the quiet gains of daily habits — I believe the real growth happens where technology meets humanity. Product advisor to tech startups and independent investor.",
      email: "khushaank@gmail.com",
      instagram: "https://instagram.com",
    });
    console.log("  Seeded profile bio");
  } else {
    console.log("  Profile bio already exists");
  }

  // 4. Seed CV entries
  const existingCv = await getDb().select().from(cvEntries);
  if (existingCv.length === 0) {
    const seedCv = [
      { category: "Education", zhTitle: "斯坦福大学", zhSubtitle: "计算机科学 / 硕士", enTitle: "Stanford University", enSubtitle: "Computer Science / M.S.", year: "2018 - 2020", sortOrder: 1 },
      { category: "Education", zhTitle: "印度理工学院德里分校", zhSubtitle: "电子工程 / 学士", enTitle: "IIT Delhi", enSubtitle: "Electrical Engineering / B.Tech", year: "2014 - 2018", sortOrder: 2 },
      { category: "Employment", zhTitle: "独立产品顾问", zhSubtitle: "AI 与科技战略 / 全球", enTitle: "Independent Product Advisor", enSubtitle: "AI & Technology Strategy / Global", year: "2022 - 至今", sortOrder: 3 },
      { category: "Employment", zhTitle: "Google", zhSubtitle: "产品经理 / 机器学习平台", enTitle: "Google", enSubtitle: "Product Manager / ML Platform", year: "2020 - 2022", sortOrder: 4 },
      { category: "Employment", zhTitle: "McKinsey & Company", zhSubtitle: "商业分析师 / 数字实践", enTitle: "McKinsey & Company", enSubtitle: "Business Analyst / Digital Practice", year: "2018 - 2020", sortOrder: 5 },
      { category: "Investment", zhTitle: "早期科技投资组合", zhSubtitle: "种子轮至A轮 / AI 与 SaaS", enTitle: "Early-Stage Tech Portfolio", enSubtitle: "Seed to Series A / AI & SaaS", year: "2021 - 至今", sortOrder: 6 },
      { category: "Writing", zhTitle: "AI 战略通讯", zhSubtitle: "Substack / 50,000+ 订阅者", enTitle: "AI Strategy Newsletter", enSubtitle: "Substack / 50,000+ subscribers", year: "2023 - 至今", sortOrder: 7 },
      { category: "Writing", zhTitle: "《AI 时代的商业思维》", zhSubtitle: "独立出版 / Amazon 畅销", enTitle: "'Business Thinking in the Age of AI'", enSubtitle: "Self-published / Amazon Bestseller", year: "2024", sortOrder: 8 },
      { category: "Speaking", zhTitle: "TEDx 演讲", zhSubtitle: "AI 与人类未来的工作", enTitle: "TEDx Talk", enSubtitle: "AI & the Future of Human Work", year: "2024", sortOrder: 9 },
      { category: "Speaking", zhTitle: "Web Summit", zhSubtitle: "主舞台 / AI 伦理小组", enTitle: "Web Summit", enSubtitle: "Main Stage / AI Ethics Panel", year: "2023", sortOrder: 10 },
      { category: "Featured", zhTitle: "福布斯 30 Under 30", zhSubtitle: "亚洲 / 科技与金融", enTitle: "Forbes 30 Under 30", enSubtitle: "Asia / Technology & Finance", year: "2023", sortOrder: 11 },
      { category: "Featured", zhTitle: "彭博商业周刊", zhSubtitle: "AI 投资新趋势 / 专访", enTitle: "Bloomberg Businessweek", enSubtitle: "New Trends in AI Investing / Interview", year: "2024", sortOrder: 12 },
      { category: "Featured", zhTitle: "TechCrunch", zhSubtitle: "创业公司AI转型指南", enTitle: "TechCrunch", enSubtitle: "Startup Guide to AI Transformation", year: "2024", sortOrder: 13 },
    ];

    for (const entry of seedCv) {
      await getDb().insert(cvEntries).values(entry);
    }
    console.log(`  Seeded ${seedCv.length} CV entries`);
  } else {
    console.log(`  ${existingCv.length} CV entries already exist`);
  }

  // 5. Seed site settings
  const existingSettings = await getDb().select().from(siteSettings);
  if (existingSettings.length === 0) {
    await getDb().insert(siteSettings).values({
      id: 1,
      avatarImage: "/images/portrait.jpg",
    });
    console.log("  Seeded site settings");
  } else {
    console.log("  Site settings already exist");
  }

  console.log("Seed complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
