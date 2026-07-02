"use client";

import Link from "next/link";
import { useState } from "react";
import type { MenuDishLearningCardV2 } from "../../../../types/learningPath";
import { generatePracticeRound, PracticeQuestion } from "@/lib/practice/generator";

interface WaiterDashboardClientProps {
  code: string;
  restaurantName: string;
  initialDishes: MenuDishLearningCardV2[];
}

export function WaiterDashboardClient({ code, restaurantName, initialDishes }: WaiterDashboardClientProps) {
  const [dishes] = useState<MenuDishLearningCardV2[]>(initialDishes);
  const [activeTab, setActiveTab] = useState<"knowledge" | "memory" | "practice">("knowledge");

  // Modals
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [showHelpConfirmModal, setShowHelpConfirmModal] = useState(false);

  // Shared preferences
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced" | null>(null);
  const [focus, setFocus] = useState<"all" | "ingredients" | "allergens" | "tags" | null>(null);

  // Temporary setup selections
  const [tempLevel, setTempLevel] = useState<"beginner" | "intermediate" | "advanced" | null>(null);
  const [tempFocus, setTempFocus] = useState<"all" | "ingredients" | "allergens" | "tags" | null>(null);

  // Active game states
  const [gameState, setGameState] = useState<"inactive" | "active" | "results">("inactive");
  const [seed, setSeed] = useState<string>("");
  const [gameQuestions, setGameQuestions] = useState<PracticeQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerLocked, setIsAnswerLocked] = useState<boolean>(false);
  
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [incorrectCount, setIncorrectCount] = useState<number>(0);
  const [weightedScore, setWeightedScore] = useState<number>(0);
  const [usedMenuHelp, setUsedMenuHelp] = useState<Record<string, boolean>>({});
  
  const [mistakes, setMistakes] = useState<{ family: string; prompt: string; correctAnswer: string; chosenAnswer: string }[]>([]);
  const [generationError, setGenerationError] = useState<boolean>(false);

  const hasPreferences = level !== null && focus !== null;

  const handleTabChange = (newTab: "knowledge" | "memory" | "practice") => {
    if (newTab === "memory" && !hasPreferences) return;

    if (activeTab === "memory" && newTab === "knowledge" && gameState === "active" && !isAnswerLocked) {
      const qId = gameQuestions[currentQuestionIndex]?.id;
      if (qId && !usedMenuHelp[qId]) {
        setShowHelpConfirmModal(true);
        return;
      }
    }
    setActiveTab(newTab);
  };

  const handleConfirmHelp = () => {
    const qId = gameQuestions[currentQuestionIndex].id;
    setUsedMenuHelp((prev) => ({ ...prev, [qId]: true }));
    setShowHelpConfirmModal(false);
    setActiveTab("knowledge");
  };

  const handleCancelHelp = () => {
    setShowHelpConfirmModal(false);
  };

  const handleStartGame = (customSeed?: string) => {
    if (!level || !focus) return;
    const gameSeed = customSeed || Date.now().toString();
    setSeed(gameSeed);

    const result = generatePracticeRound(dishes, {
      level,
      focus,
      seed: gameSeed,
      limit: 10,
    });

    if (result.questions.length === 0) {
      setGenerationError(true);
      setGameQuestions([]);
      setGameState("inactive");
    } else {
      setGenerationError(false);
      setGameQuestions(result.questions);
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setIsAnswerLocked(false);
      setCorrectCount(0);
      setIncorrectCount(0);
      setWeightedScore(0);
      setUsedMenuHelp({});
      setMistakes([]);
      setGameState("active");
    }
  };

  const handleSelectOption = (option: string) => {
    if (isAnswerLocked) return;
    setSelectedOption(option);
    setIsAnswerLocked(true);

    const question = gameQuestions[currentQuestionIndex];
    const isCorrect = option === question.correctAnswer;
    const usedHelp = usedMenuHelp[question.id] || false;

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      setWeightedScore((prev) => prev + (usedHelp ? 0.5 : 1));
    } else {
      setIncorrectCount((prev) => prev + 1);
      setMistakes((prev) => [
        ...prev,
        {
          prompt: question.prompt,
          correctAnswer: question.correctAnswer,
          chosenAnswer: option,
          family: question.family,
        },
      ]);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < gameQuestions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerLocked(false);
    } else {
      setGameState("results");
    }
  };

  const handleOpenSetup = () => {
    setTempLevel(level);
    setTempFocus(focus);
    setIsSetupModalOpen(true);
  };

  const handleConfirmSetup = () => {
    if (tempLevel && tempFocus) {
      setLevel(tempLevel);
      setFocus(tempFocus);
      setIsSetupModalOpen(false);
    }
  };

  const handleCancelSetup = () => {
    setIsSetupModalOpen(false);
  };

  const ingredientMistakes = mistakes.filter((m) => m.family === "dish_to_ingredient" || m.family === "ingredient_to_dish");
  const allergenMistakes = mistakes.filter((m) => m.family === "dish_to_allergen" || m.family === "allergen_to_dish");
  const tagMistakes = mistakes.filter((m) => m.family === "dish_to_tag" || m.family === "tag_to_dish");

  const formatScore = (num: number) => (num % 1 === 0 ? num.toString() : num.toFixed(1));
  const helpUsedCount = Object.values(usedMenuHelp).filter(Boolean).length;
  
  const currentQ = gameQuestions[currentQuestionIndex];

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-2 sm:p-4" dir="rtl">
      <div className="max-w-2xl mx-auto space-y-3 sm:space-y-4 relative">
        
        {/* HELP CONFIRM MODAL OVERLAY */}
        {showHelpConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 dark:bg-zinc-950/80 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-5 w-full max-w-sm">
              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">להיעזר בתפריט?</h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                  מעבר לתפריט ייחשב שימוש בעזרה. תשובה נכונה בשאלה הזאת תהיה שווה חצי נקודה במקום נקודה מלאה.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  onClick={handleCancelHelp}
                  className="flex-1 py-3 bg-zinc-950 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-950 font-bold rounded-xl active:scale-[0.98] transition-all text-sm shadow-sm"
                >
                  להישאר במשחק
                </button>
                <button
                  onClick={handleConfirmHelp}
                  className="flex-1 py-3 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl active:scale-[0.98] transition-all text-sm bg-white dark:bg-zinc-900"
                >
                  לעבור לתפריט
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SETUP MODAL OVERLAY */}
        {isSetupModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 dark:bg-zinc-950/80 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 space-y-5 sm:space-y-6 w-full max-w-md">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">התאמת מסלול הלמידה</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">בחר רמת קושי ומיקוד שאלות.</p>
              </div>

              <div className="space-y-2.5">
                <span className="block text-sm font-bold text-zinc-700 dark:text-zinc-300">רמת קושי:</span>
                <div className="grid grid-cols-3 gap-2">
                  {(["beginner", "intermediate", "advanced"] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => setTempLevel(l)}
                      className={`py-2.5 sm:py-3 rounded-xl border text-sm font-semibold transition-all ${
                        tempLevel === l
                          ? "bg-zinc-950 text-zinc-50 border-zinc-950 dark:bg-zinc-50 dark:text-zinc-950 dark:border-zinc-50"
                          : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-800 dark:hover:bg-zinc-800"
                      }`}
                    >
                      {l === "beginner" ? "מתחיל" : l === "intermediate" ? "בינוני" : "מתקדם"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5">
                <span className="block text-sm font-bold text-zinc-700 dark:text-zinc-300">מיקוד שאלות:</span>
                <div className="grid grid-cols-2 gap-2">
                  {(["all", "ingredients", "allergens", "tags"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setTempFocus(f)}
                      className={`py-2.5 sm:py-3 rounded-xl border text-sm font-semibold transition-all ${
                        tempFocus === f
                          ? "bg-zinc-950 text-zinc-50 border-zinc-950 dark:bg-zinc-50 dark:text-zinc-950 dark:border-zinc-50"
                          : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-800 dark:hover:bg-zinc-800"
                      }`}
                    >
                      {f === "all" ? "הכל" : f === "ingredients" ? "מרכיבים" : f === "allergens" ? "אלרגנים" : "תגיות"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  onClick={handleConfirmSetup}
                  disabled={!tempLevel || !tempFocus}
                  className="flex-1 py-3 bg-zinc-950 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-950 font-bold rounded-xl active:scale-[0.98] transition-all shadow-sm text-center disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  אישור הגדרות
                </button>

                <button
                  onClick={handleCancelSetup}
                  className="flex-1 py-3 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl active:scale-[0.98] transition-all text-center bg-white dark:bg-zinc-900 text-sm"
                >
                  ביטול
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Compact Header */}
        <div className="flex flex-row items-center justify-between gap-2 px-1">
          <h1 className="text-base sm:text-xl font-extrabold text-zinc-900 dark:text-zinc-50 truncate">{restaurantName}</h1>
          <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider text-zinc-500 dark:text-zinc-400 bg-zinc-200/50 dark:bg-zinc-800/50 px-2 py-0.5 rounded-md shrink-0">קוד: {code}</span>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => handleTabChange("knowledge")}
            className={`flex-1 min-w-[100px] pb-2.5 sm:pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all text-center ${
              activeTab === "knowledge"
                ? "border-zinc-950 dark:border-zinc-50 text-zinc-950 dark:text-zinc-50 font-extrabold"
                : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            }`}
          >
            הכרת המנות
          </button>
          <button
            onClick={() => handleTabChange("memory")}
            disabled={!hasPreferences}
            className={`flex-1 min-w-[100px] pb-2.5 sm:pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all text-center disabled:opacity-40 disabled:cursor-not-allowed ${
              activeTab === "memory"
                ? "border-zinc-950 dark:border-zinc-50 text-zinc-950 dark:text-zinc-50 font-extrabold"
                : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            }`}
            title={!hasPreferences ? "יש להגדיר מסלול למידה קודם" : ""}
          >
            משחק זיכרון
          </button>
          <button
            disabled
            className="flex-1 min-w-[140px] pb-2.5 sm:pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all text-center border-transparent text-zinc-400 opacity-40 cursor-not-allowed"
          >
            תרגול מול לקוח (בקרוב)
          </button>
        </div>

        {/* Tab Content: Knowledge */}
        {activeTab === "knowledge" && (
          <div className="space-y-4 pt-2 sm:pt-4">
            <div className="flex justify-between items-center px-1">
              <h2 className="text-base sm:text-lg font-bold text-zinc-800 dark:text-zinc-200">הכר את המנות</h2>
              <button
                onClick={handleOpenSetup}
                className="text-xs sm:text-sm font-bold text-zinc-50 dark:text-zinc-950 bg-zinc-950 dark:bg-zinc-50 px-3 sm:px-4 py-2 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-[0.98] shadow-sm"
              >
                {hasPreferences ? "שינוי הגדרות המסלול" : "צור מסלול למידה"}
              </button>
            </div>
            
            {dishes.length === 0 && (
              <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200/80 dark:border-zinc-800 p-8 text-center text-zinc-500 dark:text-zinc-400">
                אין מנות זמינות ללמידה במסעדה זו.
              </div>
            )}

            {dishes.map((dish, index) => (
              <div
                key={dish.id || index}
                className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200/80 dark:border-zinc-800 overflow-hidden flex flex-col sm:flex-row"
              >
                <div className="w-full sm:w-1/3 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center p-6 min-h-[120px] sm:min-h-[160px]">
                  <span className="text-zinc-400 dark:text-zinc-500 text-sm font-medium">{dish.name} (תמונה)</span>
                </div>

                <div className="p-4 sm:p-6 sm:w-2/3 space-y-3 sm:space-y-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-50">{dish.name}</h3>
                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">{dish.simpleDescription}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:gap-3 text-xs sm:text-sm">
                    {dish.ingredients && dish.ingredients.length > 0 && (
                      <div>
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">מרכיבים: </span>
                        <span className="text-zinc-600 dark:text-zinc-400">{dish.ingredients.join(", ")}</span>
                      </div>
                    )}

                    {dish.allergens && dish.allergens.length > 0 && (
                      <div>
                        <span className="font-semibold text-rose-600 dark:text-rose-400">אלרגנים: </span>
                        <span className="text-zinc-600 dark:text-zinc-400">{dish.allergens.join(", ")}</span>
                      </div>
                    )}

                    {dish.recognitionHint && (
                      <div>
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">זיהוי: </span>
                        <span className="text-zinc-600 dark:text-zinc-400">{dish.recognitionHint}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    {dish.memoryTip && (
                      <div className="bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400 p-2.5 sm:p-3 rounded-xl border border-amber-200/50 dark:border-amber-900/50 text-xs sm:text-sm">
                        💡 <strong>טיפ לזיכרון:</strong> {dish.memoryTip}
                      </div>
                    )}
                    {dish.familiarAssociation && (
                      <div className="bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-400 p-2.5 sm:p-3 rounded-xl border border-blue-200/50 dark:border-blue-900/50 text-xs sm:text-sm">
                        🔗 <strong>אסוציאציה:</strong> {dish.familiarAssociation}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab Content: Memory Game */}
        {activeTab === "memory" && hasPreferences && (
          <div className="space-y-4 pt-2 sm:pt-4">

            {gameState === "inactive" && (
              <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200/80 dark:border-zinc-800 p-6 sm:p-8 text-center space-y-4">
                <div className="text-3xl sm:text-4xl">🧠</div>
                <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-50">משחק ידע מוכן</h2>
                <div className="flex justify-center flex-wrap gap-2 mt-2 text-[10px] sm:text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1.5 rounded-lg">
                    רמת קושי: {level === "beginner" ? "מתחיל" : level === "intermediate" ? "בינוני" : "מתקדם"}
                  </span>
                  <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1.5 rounded-lg">
                    מיקוד: {focus === "all" ? "הכל" : focus === "ingredients" ? "מרכיבים" : focus === "allergens" ? "אלרגנים" : "תגיות"}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-2">הנך מוכן להתחיל משחק על בסיס העדפותיך.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 mt-4">
                  <button
                    onClick={() => handleStartGame()}
                    className="px-6 py-2.5 sm:py-3 bg-zinc-950 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-950 font-bold rounded-xl active:scale-[0.98] transition-all text-sm shadow-sm"
                  >
                    התחל משחק
                  </button>
                  <button
                    onClick={handleOpenSetup}
                    className="px-6 py-2.5 sm:py-3 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl active:scale-[0.98] transition-all text-sm bg-white dark:bg-zinc-900"
                  >
                    שינוי הגדרות
                  </button>
                </div>
              </div>
            )}

            {generationError && (
              <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200/80 dark:border-zinc-800 p-6 text-center space-y-4">
                <div className="text-3xl">⚠️</div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">חסרים נתונים בתפריט</h2>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                  אין מספיק נתונים בתפריט ליצירת שאלות. אנא ודא שיש לפחות 4 מנות עם מרכיבים, אלרגנים או תגיות.
                </p>
              </div>
            )}

            {!generationError && gameState === "active" && currentQ && (
              <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200/80 dark:border-zinc-800 p-3 sm:p-5 space-y-2.5">
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-[10px] sm:text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    <div className="flex gap-1.5 items-center">
                      <span>שאלה {currentQuestionIndex + 1} מתוך {gameQuestions.length}</span>
                      {usedMenuHelp[currentQ.id] && !isAnswerLocked && (
                        <span className="text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-950/30 px-1.5 py-0.5 rounded border border-amber-200/50 dark:border-amber-900/50 text-[9px] sm:text-[10px]">נעזרת בתפריט · עד 0.5 נק׳</span>
                      )}
                    </div>
                    <span>ניקוד: {formatScore(weightedScore)}</span>
                  </div>
                  {/* Slim Progress Bar */}
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1 overflow-hidden">
                    <div 
                      className="bg-zinc-900 dark:bg-zinc-50 h-full transition-all duration-300"
                      style={{ width: `${((currentQuestionIndex + (isAnswerLocked ? 1 : 0)) / gameQuestions.length) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="py-0.5">
                  <h3 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-zinc-50 leading-snug">
                    {currentQ.prompt}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                  {currentQ.options.map((option, idx) => {
                    const isCorrect = option === currentQ.correctAnswer;
                    const isSelected = option === selectedOption;

                    let btnStyles = "bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-900 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-50";
                    if (isAnswerLocked) {
                      if (isCorrect) {
                        btnStyles = "bg-emerald-50 border-emerald-500 text-emerald-900 dark:bg-emerald-950/20 dark:border-emerald-500 dark:text-emerald-400 font-bold";
                      } else if (isSelected) {
                        btnStyles = "bg-rose-50 border-rose-500 text-rose-900 dark:bg-rose-950/20 dark:border-rose-500 dark:text-rose-400 font-bold";
                      } else {
                        btnStyles = "bg-zinc-50 border-zinc-200 text-zinc-400 dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-600 opacity-60";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(option)}
                        disabled={isAnswerLocked}
                        className={`w-full p-2.5 sm:p-3 text-right rounded-xl border transition-all active:scale-[0.99] flex justify-between items-center text-sm font-semibold ${btnStyles}`}
                      >
                        <span className="pr-1 flex-1 text-right">{option}</span>
                        {isAnswerLocked && isCorrect && <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0 mr-2">✓</span>}
                        {isAnswerLocked && isSelected && !isCorrect && <span className="text-rose-600 dark:text-rose-400 font-bold shrink-0 mr-2">✗</span>}
                      </button>
                    );
                  })}
                </div>

                <div className="min-h-[90px] flex flex-col justify-end pt-2 mt-2 border-t border-zinc-100 dark:border-zinc-800 transition-all">
                  {isAnswerLocked ? (
                    <div className="space-y-2 h-full flex flex-col">
                      <div className="bg-zinc-50 dark:bg-zinc-800/40 p-2.5 sm:p-3 rounded-xl border border-zinc-200/50 dark:border-zinc-800/80 text-[11px] sm:text-xs leading-relaxed text-zinc-700 dark:text-zinc-300 overflow-y-auto max-h-[80px] flex-1">
                        💡 <strong>הסבר מדעי:</strong> {currentQ.explanation}
                      </div>
                      <button
                        onClick={handleNextQuestion}
                        className="w-full py-2.5 sm:py-3 bg-zinc-950 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-950 font-bold rounded-xl active:scale-[0.98] transition-all shadow-md text-center text-sm shrink-0"
                      >
                        {currentQuestionIndex + 1 < gameQuestions.length ? "לשאלה הבאה" : "לתוצאות המשחק"}
                      </button>
                    </div>
                  ) : (
                    <div className="h-full"></div>
                  )}
                </div>
              </div>
            )}

            {!generationError && gameState === "results" && (
              <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200/80 dark:border-zinc-800 p-4 sm:p-6 space-y-4">
                <div className="text-center py-2 sm:py-4 space-y-1 sm:space-y-2">
                  <div className="text-4xl sm:text-5xl">🏆</div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">תוצאות האימון</h2>
                  <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">השלמת את אימון הזיכרון בהצלחה!</p>
                </div>

                <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center border-y border-zinc-100 dark:border-zinc-800 py-4 sm:py-6">
                  <div className="space-y-1">
                    <span className="text-[9px] sm:text-xs text-zinc-400 dark:text-zinc-500 font-bold block">ציון משוקלל</span>
                    <span className="text-xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50 font-mono">
                      {formatScore(weightedScore)} <span className="text-[10px] sm:text-sm font-normal text-zinc-400">/ {gameQuestions.length}</span>
                    </span>
                  </div>
                  <div className="space-y-1 border-r border-zinc-100 dark:border-zinc-800">
                    <span className="text-[9px] sm:text-xs text-zinc-400 dark:text-zinc-500 font-bold block">נכון</span>
                    <span className="text-xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{correctCount}</span>
                  </div>
                  <div className="space-y-1 border-r border-zinc-100 dark:border-zinc-800">
                    <span className="text-[9px] sm:text-xs text-zinc-400 dark:text-zinc-500 font-bold block">לא נכון</span>
                    <span className="text-xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 font-mono">{incorrectCount}</span>
                  </div>
                  <div className="space-y-1 border-r border-zinc-100 dark:border-zinc-800">
                    <span className="text-[9px] sm:text-xs text-zinc-400 dark:text-zinc-500 font-bold block">נעזרו בתפריט</span>
                    <span className="text-xl sm:text-3xl font-black text-amber-500 font-mono">{helpUsedCount}</span>
                  </div>
                </div>

                {mistakes.length > 0 && (
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-zinc-50 px-1 font-sans">נושאים הדורשים חיזוק:</h3>

                    {ingredientMistakes.length > 0 && (
                      <div className="bg-zinc-50 dark:bg-zinc-800/30 rounded-xl p-3 sm:p-4 border border-zinc-100 dark:border-zinc-800 space-y-2">
                        <span className="text-[10px] sm:text-xs font-bold text-zinc-500 dark:text-zinc-400 block border-b border-zinc-200 dark:border-zinc-700 pb-1.5">
                          🍳 מרכיבים ומנות ({ingredientMistakes.length} שגיאות)
                        </span>
                        <div className="space-y-2.5 pt-1 text-xs sm:text-sm">
                          {ingredientMistakes.map((m, idx) => (
                            <div key={idx} className="space-y-0.5 sm:space-y-1">
                              <p className="font-semibold text-zinc-800 dark:text-zinc-200">{m.prompt}</p>
                              <p className="text-[10px] sm:text-xs text-rose-600 dark:text-rose-400 font-medium">ענית: {m.chosenAnswer}</p>
                              <p className="text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400 font-medium">תשובה נכונה: {m.correctAnswer}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {allergenMistakes.length > 0 && (
                      <div className="bg-rose-50/30 dark:bg-rose-950/10 rounded-xl p-3 sm:p-4 border border-rose-100/50 dark:border-rose-900/20 space-y-2">
                        <span className="text-[10px] sm:text-xs font-bold text-rose-600 dark:text-rose-400 block border-b border-rose-100 dark:border-rose-900/30 pb-1.5">
                          🚨 אלרגנים ובטיחות ({allergenMistakes.length} שגיאות)
                        </span>
                        <div className="space-y-2.5 pt-1 text-xs sm:text-sm">
                          {allergenMistakes.map((m, idx) => (
                            <div key={idx} className="space-y-0.5 sm:space-y-1">
                              <p className="font-semibold text-zinc-800 dark:text-zinc-200">{m.prompt}</p>
                              <p className="text-[10px] sm:text-xs text-rose-600 dark:text-rose-400 font-medium">ענית: {m.chosenAnswer}</p>
                              <p className="text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400 font-medium">תשובה נכונה: {m.correctAnswer}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {tagMistakes.length > 0 && (
                      <div className="bg-zinc-50 dark:bg-zinc-800/30 rounded-xl p-3 sm:p-4 border border-zinc-100 dark:border-zinc-800 space-y-2">
                        <span className="text-[10px] sm:text-xs font-bold text-zinc-500 dark:text-zinc-400 block border-b border-zinc-200 dark:border-zinc-700 pb-1.5">
                          🏷️ תגיות וסוגי מנות ({tagMistakes.length} שגיאות)
                        </span>
                        <div className="space-y-2.5 pt-1 text-xs sm:text-sm">
                          {tagMistakes.map((m, idx) => (
                            <div key={idx} className="space-y-0.5 sm:space-y-1">
                              <p className="font-semibold text-zinc-800 dark:text-zinc-200">{m.prompt}</p>
                              <p className="text-[10px] sm:text-xs text-rose-600 dark:text-rose-400 font-medium">ענית: {m.chosenAnswer}</p>
                              <p className="text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400 font-medium">תשובה נכונה: {m.correctAnswer}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                  <button
                    onClick={() => handleStartGame()}
                    className="flex-1 py-3 sm:py-3.5 bg-zinc-950 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-950 font-bold rounded-xl active:scale-[0.98] transition-all shadow-sm text-center text-sm"
                  >
                    משחק חדש (סיד חדש)
                  </button>

                  <button
                    onClick={() => handleStartGame(seed)}
                    className="flex-1 py-3 sm:py-3.5 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl active:scale-[0.98] transition-all text-center text-sm bg-white dark:bg-zinc-900"
                  >
                    שחק שוב (אותו סיד)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Back Link */}
        <div className="pt-1 sm:pt-2">
          <Link
            href="/"
            className="flex h-10 sm:h-11 w-full items-center justify-center rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold active:scale-[0.98] transition-all text-xs sm:text-sm"
          >
            חזרה לדף הבית
          </Link>
        </div>
      </div>
    </main>
  );
}
