import { Question } from "./types";

export const questions: Question[] = [
  // ===== 数学：四則計算 =====
  { id: "m1",  subject: "math", category: "math_calc", difficulty: 1, question: "8 × 7 はいくつ？", choices: ["54","56","63","64"], answer: 1, explanation: "8 × 7 = 56！九九の「はちしち56」！", xpReward: 10 },
  { id: "m2",  subject: "math", category: "math_calc", difficulty: 1, question: "9 × 6 はいくつ？", choices: ["48","52","54","56"], answer: 2, explanation: "9 × 6 = 54！九九の「くろく54」！", xpReward: 10 },
  { id: "m3",  subject: "math", category: "math_calc", difficulty: 1, question: "72 ÷ 8 はいくつ？", choices: ["7","8","9","10"], answer: 2, explanation: "8 × 9 = 72 だから 72 ÷ 8 = 9 だよ！", xpReward: 10 },
  { id: "m4",  subject: "math", category: "math_calc", difficulty: 1, question: "345 + 278 はいくつ？", choices: ["513","623","633","643"], answer: 1, explanation: "345 + 278 = 623！くり上がりに注意。", xpReward: 10 },
  { id: "m5",  subject: "math", category: "math_calc", difficulty: 1, question: "503 − 247 はいくつ？", choices: ["246","256","266","354"], answer: 1, explanation: "503 − 247 = 256！くり下がりに注意。", xpReward: 10 },
  { id: "m6",  subject: "math", category: "math_calc", difficulty: 1, question: "2.4 × 3 はいくつ？", choices: ["6.2","7.0","7.2","7.4"], answer: 2, explanation: "2.4 × 3 = 7.2！小数点の位置に気をつけよう。", xpReward: 10 },

  // ===== 数学：分数 =====
  { id: "m7",  subject: "math", category: "math_frac", difficulty: 2, question: "1/3 + 1/3 はいくつ？", choices: ["1/6","1/3","2/3","2/6"], answer: 2, explanation: "分母が同じなら分子だけたす。1/3 + 1/3 = 2/3！", xpReward: 15 },
  { id: "m8",  subject: "math", category: "math_frac", difficulty: 2, question: "3/4 − 1/4 はいくつ？", choices: ["1/4","1/2","2/4","3/4"], answer: 1, explanation: "3/4 − 1/4 = 2/4 = 1/2！約分を忘れずに！", xpReward: 15 },
  { id: "m9",  subject: "math", category: "math_frac", difficulty: 2, question: "1/2 × 3/4 はいくつ？", choices: ["3/2","4/6","3/8","4/8"], answer: 2, explanation: "分数のかけ算は分子×分子、分母×分母。1×3/2×4 = 3/8！", xpReward: 15 },
  { id: "m10", subject: "math", category: "math_frac", difficulty: 3, question: "2/3 ÷ 4/5 はいくつ？", choices: ["8/15","5/6","10/12","6/8"], answer: 1, explanation: "÷は逆数をかける。2/3 × 5/4 = 10/12 = 5/6！", xpReward: 25 },

  // ===== 数学：図形・面積 =====
  { id: "m11", subject: "math", category: "math_shape", difficulty: 1, question: "三角形の面積の公式は？", choices: ["底辺×高さ","底辺×高さ÷2","底辺+高さ×2","底辺×高さ×2"], answer: 1, explanation: "三角形の面積 = 底辺×高さ÷2！長方形の半分と覚えよう。", xpReward: 10 },
  { id: "m12", subject: "math", category: "math_shape", difficulty: 2, question: "面積が24cm²の長方形、縦が4cmなら横は？", choices: ["4cm","6cm","8cm","20cm"], answer: 1, explanation: "横 = 24 ÷ 4 = 6cm！面積＝縦×横。", xpReward: 15 },
  { id: "m13", subject: "math", category: "math_shape", difficulty: 2, question: "半径5cmの円の面積は？（π=3.14）", choices: ["15.7cm²","31.4cm²","78.5cm²","157cm²"], answer: 2, explanation: "円の面積 = 半径×半径×π = 5×5×3.14 = 78.5cm²！", xpReward: 20 },
  { id: "m14", subject: "math", category: "math_shape", difficulty: 1, question: "正方形の1辺が6cmのとき、面積は？", choices: ["12cm²","24cm²","36cm²","48cm²"], answer: 2, explanation: "正方形の面積 = 辺×辺 = 6×6 = 36cm²！", xpReward: 10 },

  // ===== 数学：割合・百分率 =====
  { id: "m15", subject: "math", category: "math_percent", difficulty: 2, question: "40人のクラスで30人が好き。全体の何%？", choices: ["25%","30%","65%","75%"], answer: 3, explanation: "30÷40×100 = 75%！「÷全体×100」で出せる。", xpReward: 20 },
  { id: "m16", subject: "math", category: "math_percent", difficulty: 2, question: "1000円の品物が20%引きの値段は？", choices: ["200円","800円","900円","1200円"], answer: 1, explanation: "20%引き = 80%の値段。1000×0.8 = 800円！", xpReward: 20 },

  // ===== 数学：速さ・比 =====
  { id: "m17", subject: "math", category: "math_speed", difficulty: 2, question: "速さ60km/hで2時間30分走ると何km？", choices: ["90km","120km","150km","180km"], answer: 2, explanation: "2時間30分=2.5時間。60×2.5=150km！「道のり=速さ×時間」", xpReward: 20 },
  { id: "m18", subject: "math", category: "math_speed", difficulty: 3, question: "比例式 x:4=6:8 のとき x は？", choices: ["2","3","4","6"], answer: 1, explanation: "x×8=4×6=24。x=24÷8=3！内×内=外×外。", xpReward: 25 },

  // ===== 国語：漢字の読み =====
  { id: "j1",  subject: "japanese", category: "jp_read", difficulty: 1, question: "「快晴」の読み方は？", choices: ["かいすい","かいせい","こうせい","こうすい"], answer: 1, explanation: "「快晴」は「かいせい」！雲ひとつない晴れた天気。", xpReward: 10 },
  { id: "j2",  subject: "japanese", category: "jp_read", difficulty: 1, question: "「永遠」の読み方は？", choices: ["えいえん","ながとお","えいとお","ながえん"], answer: 0, explanation: "「永遠」は「えいえん」！いつまでも続くという意味。", xpReward: 10 },
  { id: "j3",  subject: "japanese", category: "jp_read", difficulty: 1, question: "「賛成」の読み方は？", choices: ["さんぜい","さんせい","さんじょう","ざんせい"], answer: 1, explanation: "「賛成」は「さんせい」！同意するときに使う。", xpReward: 10 },
  { id: "j4",  subject: "japanese", category: "jp_read", difficulty: 2, question: "「危険」の読み方は？", choices: ["きけん","ひけん","きがい","あぶけん"], answer: 0, explanation: "「危険」は「きけん」！あぶないことを表す。", xpReward: 15 },
  { id: "j5",  subject: "japanese", category: "jp_read", difficulty: 2, question: "「拡大」の読み方は？", choices: ["こうたい","かくだい","こうだい","かくたい"], answer: 1, explanation: "「拡大」は「かくだい」！大きく広げること。", xpReward: 15 },
  { id: "j6",  subject: "japanese", category: "jp_read", difficulty: 3, question: "「暖かい」と「温かい」の使い分けで正しいのは？", choices: ["どちらも同じ","「暖」は気候・「温」は物・気持ち","「温」は気候・「暖」は食べ物","「暖」は夏・「温」は冬"], answer: 1, explanation: "「暖かい春」など気候には「暖」、「温かいスープ」など物・気持ちには「温」！", xpReward: 25 },

  // ===== 国語：漢字の書き =====
  { id: "j7",  subject: "japanese", category: "jp_write", difficulty: 1, question: "「にっき」を漢字で書くと？", choices: ["日記","日紀","日季","日起"], answer: 0, explanation: "「日記」！毎日の出来事を書くもの。", xpReward: 10 },
  { id: "j8",  subject: "japanese", category: "jp_write", difficulty: 1, question: "「ひつよう」を漢字で書くと？", choices: ["必要","必葉","必用","必容"], answer: 0, explanation: "「必要」！「必ず要る」と覚えよう。", xpReward: 10 },
  { id: "j9",  subject: "japanese", category: "jp_write", difficulty: 2, question: "「ぞうか」（数が増えること）を漢字で書くと？", choices: ["増化","増加","層加","増果"], answer: 1, explanation: "「増加」！「増える＋加わる」で数が多くなること。", xpReward: 15 },
  { id: "j10", subject: "japanese", category: "jp_write", difficulty: 2, question: "「げんいん」を漢字で書くと？", choices: ["原員","元因","原因","源因"], answer: 2, explanation: "「原因」！何かが起こったもとの理由のこと。", xpReward: 15 },
  { id: "j11", subject: "japanese", category: "jp_write", difficulty: 2, question: "「せいかく」（正しくて間違いがない）を漢字で書くと？", choices: ["正格","精確","正確","正覚"], answer: 2, explanation: "「正確」！「正しく確か」と覚えよう。", xpReward: 15 },

  // ===== 国語：語彙・熟語 =====
  { id: "j12", subject: "japanese", category: "jp_vocab", difficulty: 2, question: "「縮小」の対義語は？", choices: ["減少","拡大","圧縮","延長"], answer: 1, explanation: "「縮小（縮める）」の反対は「拡大（広げる）」！", xpReward: 15 },
  { id: "j13", subject: "japanese", category: "jp_vocab", difficulty: 2, question: "「異常」の「異」と同じ読みの漢字は？", choices: ["以","移","意","医"], answer: 1, explanation: "「異（い）常」の「い」と同じ読みは「移（い）動」の「移」！", xpReward: 20 },
  { id: "j14", subject: "japanese", category: "jp_vocab", difficulty: 2, question: "「投票」の「票」の部首は？", choices: ["木","示","西","火"], answer: 1, explanation: "「票」の部首は「示（しめすへん）」！票・標・示などに使われる。", xpReward: 15 },

  // ===== 国語：四字熟語 =====
  { id: "j15", subject: "japanese", category: "jp_idiom", difficulty: 3, question: "「以心伝心」の意味は？", choices: ["心を込めて手紙を送る","言葉なしで気持ちが伝わる","心が広い人のこと","大切な伝言を伝える"], answer: 1, explanation: "「以心伝心（いしんでんしん）」は言葉なしで気持ちが通じ合うこと！", xpReward: 25 },
  { id: "j16", subject: "japanese", category: "jp_idiom", difficulty: 3, question: "「一石二鳥」の意味は？", choices: ["石を二つ投げる","一つの行動で二つの利益を得る","一羽の鳥を二人で追う","少ない努力で大きな成果"], answer: 1, explanation: "「一石二鳥（いっせきにちょう）」は1つの行動で2つの良いことを得ること！", xpReward: 25 },
  { id: "j17", subject: "japanese", category: "jp_idiom", difficulty: 3, question: "「七転八起」の意味は？", choices: ["7回転んで8回起き上がる＝何度失敗しても立ち上がる","7と8を合わせた数","8回勝って7回負ける","転んでも痛くない"], answer: 0, explanation: "「七転八起（しちてんはっき）」＝七転び八起き！何度倒れても立ち上がる不屈の精神。", xpReward: 25 },

  // ===== 論理思考：数列・パターン =====
  { id: "l1",  subject: "logic", category: "logic_seq", difficulty: 1, question: "1, 3, 5, 7, □ ── □に入る数は？", choices: ["8","9","10","11"], answer: 1, explanation: "2ずつ増える奇数の並び！7+2=9。", xpReward: 15 },
  { id: "l2",  subject: "logic", category: "logic_seq", difficulty: 1, question: "2, 4, 8, 16, □ ── □に入る数は？", choices: ["18","24","32","64"], answer: 2, explanation: "2倍ずつ増える！16×2=32。", xpReward: 15 },
  { id: "l3",  subject: "logic", category: "logic_seq", difficulty: 1, question: "1, 4, 9, 16, □ ── □に入る数は？", choices: ["20","25","36","49"], answer: 1, explanation: "1²=1, 2²=4, 3²=9, 4²=16, 5²=25。二乗の数列！", xpReward: 15 },
  { id: "l4",  subject: "logic", category: "logic_seq", difficulty: 1, question: "○△○△○△…の10番目は何？", choices: ["○","△","どちらでもない","わからない"], answer: 1, explanation: "2つのくり返し。10÷2=5でちょうど割り切れる→偶数番目→△！", xpReward: 15 },
  { id: "l5",  subject: "logic", category: "logic_seq", difficulty: 2, question: "1, 1, 2, 3, 5, 8, □ ── □に入る数は？", choices: ["10","11","13","15"], answer: 2, explanation: "前の2つを足した数！5+8=13。これはフィボナッチ数列だよ。", xpReward: 20 },

  // ===== 論理思考：推理・論法 =====
  { id: "l6",  subject: "logic", category: "logic_reason", difficulty: 1, question: "AはBより背が高い。BはCより背が高い。一番背が低いのは？", choices: ["A","B","C","わからない"], answer: 2, explanation: "A > B > C の順。一番低いのはC！順番に並べて考えよう。", xpReward: 15 },
  { id: "l7",  subject: "logic", category: "logic_reason", difficulty: 2, question: "「すべての犬は動物だ。ポチは犬だ。」→ポチは？", choices: ["動物ではない","動物だ","犬でないかも","わからない"], answer: 1, explanation: "「すべての犬は動物」＋「ポチは犬」→「ポチは動物」。三段論法！", xpReward: 20 },
  { id: "l8",  subject: "logic", category: "logic_reason", difficulty: 2, question: "「雨なら運動会は中止」「今日は運動会が行われた」。今日は？", choices: ["雨だった","雨でなかった","くもりだった","わからない"], answer: 1, explanation: "「雨→中止」の対偶は「中止でない→雨でない」。運動会あり→雨でなかった！", xpReward: 20 },
  { id: "l9",  subject: "logic", category: "logic_reason", difficulty: 2, question: "「AかBのどちらかは必ず参加する」「Aは参加しない」→Bは？", choices: ["参加しない","必ず参加する","するかもしれない","わからない"], answer: 1, explanation: "「AかB少なくとも一方が参加」＋「Aは参加しない」→Bは必ず参加！", xpReward: 20 },
  { id: "l10", subject: "logic", category: "logic_reason", difficulty: 3, question: "3人のうち1人だけ嘘つき。「太郎：私は正直」「次郎：太郎は嘘つき」「三郎：次郎は正直」。嘘つきは？", choices: ["太郎","次郎","三郎","わからない"], answer: 1, explanation: "太郎が正直→次郎の発言が嘘→次郎が嘘つき。矛盾なし！", xpReward: 25 },

  // ===== 論理思考：場合の数 =====
  { id: "l11", subject: "logic", category: "logic_count", difficulty: 2, question: "赤・青・黄の3色で左・中・右を塗る（隣に同じ色NG）。何通り？", choices: ["6通り","12通り","18通り","24通り"], answer: 1, explanation: "左：3通り→中：2通り→右：2通り。3×2×2=12通り！", xpReward: 20 },
  { id: "l12", subject: "logic", category: "logic_count", difficulty: 2, question: "100円・50円・10円を使って160円にする組み合わせは何通り？", choices: ["3通り","4通り","5通り","6通り"], answer: 0, explanation: "①100+50+10 ②100+60（10×6）③50×3+10 の3通り！表を作って整理しよう。", xpReward: 20 },
  { id: "l13", subject: "logic", category: "logic_count", difficulty: 3, question: "A・B・C・D・Eの5人から2人選ぶ組み合わせは何通り？", choices: ["8通り","10通り","12通り","20通り"], answer: 1, explanation: "5×4÷2=10通り！順番関係ない選び方は「組み合わせ」。", xpReward: 25 },
];

export function getQuestionsBySubject(subject: string): Question[] {
  return questions.filter((q) => q.subject === subject);
}

export function getRandomQuestions(subject: string, count: number): Question[] {
  const filtered = getQuestionsBySubject(subject);
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
