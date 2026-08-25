import React, { useState } from 'react';
import { X, Award, CheckCircle2, AlertCircle, ArrowRight, RotateCcw, Zap, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QUESTION_BANKS, calculateSkillLevelFromScore, getSkillLevelLabel } from '../../data/assessmentQuestions';
import { AssessmentResult, SkillLevel } from '../../types';

interface SkillAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssessmentComplete: (result: AssessmentResult) => void;
  initialSkill?: string;
}

export const SkillAssessmentModal: React.FC<SkillAssessmentModalProps> = ({
  isOpen,
  onClose,
  onAssessmentComplete,
  initialSkill = 'React',
}) => {
  const availableSkills = Object.keys(QUESTION_BANKS);
  const [selectedSkill, setSelectedSkill] = useState<string>(
    availableSkills.includes(initialSkill) ? initialSkill : availableSkills[0]
  );
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  if (!isOpen) return null;

  const questions = QUESTION_BANKS[selectedSkill] || [];
  const currentQuestion = questions[currentQuestionIndex];

  const handleStart = () => {
    setHasStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setUserAnswers([]);
    setIsFinished(false);
  };

  const handleOptionSelect = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    const updatedAnswers = [...userAnswers, selectedOption];
    setUserAnswers(updatedAnswers);

    if (currentQuestionIndex === questions.length - 1) {
      let correct = 0;
      questions.forEach((q, idx) => {
        if (updatedAnswers[idx] === q.correctIndex) {
          correct++;
        }
      });
      const scorePct = Math.round((correct / questions.length) * 100);
      const estLevel = calculateSkillLevelFromScore(scorePct);

      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#4f46e5', '#10b981', '#3b82f6'],
        });
      } catch (e) {}

      setIsFinished(true);
      onAssessmentComplete({
        skillName: selectedSkill,
        scorePercentage: scorePct,
        estimatedLevel: estLevel,
        totalQuestions: questions.length,
        correctCount: correct,
        completedAt: new Date().toISOString(),
      });
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setCurrentQuestionIndex(prev => prev + 1);
  };

  const handleRestart = () => {
    setHasStarted(false);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setUserAnswers([]);
    setIsFinished(false);
  };

  const correctCount = userAnswers.filter(
    (ans, idx) => ans === questions[idx]?.correctIndex
  ).length;
  const scorePct = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const finalLevel = calculateSkillLevelFromScore(scorePct);
  const levelInfo = getSkillLevelLabel(finalLevel);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden my-8 animate-fadeIn">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Matchify Skill Assessment
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Skill Calibration
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Answer technical questions to calibrate your estimated skill level (1–5).
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {!hasStarted ? (
            /* Skill Selection Screen */
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Select Technical Domain to Calibrate:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {availableSkills.map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => setSelectedSkill(skill)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedSkill === skill
                          ? 'border-brand-600 bg-brand-50/60 text-brand-900 font-semibold shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900">{skill}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {QUESTION_BANKS[skill]?.length || 5} Questions • Level 1–5
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Calibration Rules Note */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
                <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  How Skill Level is Estimated:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-slate-600">
                  <div><strong>≥ 85% Score:</strong> Estimated Level 5 (Expert ⭐)</div>
                  <div><strong>70%–84% Score:</strong> Estimated Level 4 (Advanced)</div>
                  <div><strong>50%–69% Score:</strong> Estimated Level 3 (Intermediate)</div>
                  <div><strong>30%–49% Score:</strong> Estimated Level 2 (Beginner)</div>
                </div>
                <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                  Assessment results provide transparent signals for teammate matching algorithms.
                </p>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary text-xs px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleStart}
                  className="btn-primary flex items-center gap-1.5 px-5 py-2 text-xs"
                >
                  Start Assessment ({selectedSkill})
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : isFinished ? (
            /* Results Screen */
            <div className="text-center py-4 space-y-5">
              <div className="inline-flex p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700">
                <Sparkles className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-xl font-bold text-slate-900">
                  Assessment Completed!
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your profile has been updated with your Matchify-assessed skill score.
                </p>
              </div>

              <div className="max-w-md mx-auto p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-around">
                  <div>
                    <div className="text-3xl font-extrabold text-emerald-700 font-mono">
                      {scorePct}%
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Accuracy ({correctCount}/{questions.length})
                    </div>
                  </div>

                  <div className="h-10 w-px bg-slate-200" />

                  <div>
                    <div className="text-xl font-extrabold text-brand-700 font-mono">
                      Level {finalLevel} / 5
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      {levelInfo.label.split(' ')[0]}
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 text-left">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <Award className="w-4 h-4 text-emerald-600" />
                    Matchify-Assessed {selectedSkill} (⭐ {scorePct}%)
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    {levelInfo.description}. This assessed status is now incorporated into your match scores.
                  </p>
                </div>
              </div>

              <div className="flex justify-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="btn-secondary flex items-center gap-1 text-xs px-4 py-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Test Another Skill
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-primary text-xs px-6 py-2"
                >
                  Done & View Profile
                </button>
              </div>
            </div>
          ) : (
            /* Active Quiz */
            <div className="space-y-5">
              <div className="flex items-center justify-between text-xs">
                <div className="font-semibold text-slate-500">
                  Question <strong className="text-slate-900">{currentQuestionIndex + 1}</strong> of {questions.length}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    Level {currentQuestion?.difficulty || 1}
                  </span>
                  <span className="text-brand-700 font-bold font-mono">{selectedSkill}</span>
                </div>
              </div>

              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-600 transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-900 leading-snug">
                  {currentQuestion?.question}
                </h4>

                {currentQuestion?.codeSnippet && (
                  <pre className="mt-2.5 p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed">
                    <code>{currentQuestion.codeSnippet}</code>
                  </pre>
                )}
              </div>

              <div className="space-y-2">
                {currentQuestion?.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQuestion.correctIndex;
                  let style = 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50';

                  if (isAnswerSubmitted) {
                    if (isCorrect) {
                      style = 'border-emerald-400 bg-emerald-50 text-emerald-900 font-medium';
                    } else if (isSelected && !isCorrect) {
                      style = 'border-rose-300 bg-rose-50 text-rose-800';
                    } else {
                      style = 'border-slate-100 bg-slate-50/60 text-slate-400';
                    }
                  } else if (isSelected) {
                    style = 'border-brand-600 bg-brand-50 text-brand-900 font-medium shadow-xs';
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isAnswerSubmitted}
                      onClick={() => handleOptionSelect(idx)}
                      className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 ${style}`}
                    >
                      <span className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5 text-slate-700 font-bold">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1 leading-relaxed">{option}</span>
                      {isAnswerSubmitted && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                      {isAnswerSubmitted && isSelected && !isCorrect && (
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {isAnswerSubmitted && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                  <strong className="text-slate-900 block mb-0.5">Explanation:</strong>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {currentQuestion?.explanation}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2.5 pt-2">
                {!isAnswerSubmitted ? (
                  <button
                    type="button"
                    disabled={selectedOption === null}
                    onClick={handleSubmitAnswer}
                    className="btn-primary text-xs px-5 py-2 disabled:opacity-40"
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="btn-primary flex items-center gap-1.5 text-xs px-5 py-2"
                  >
                    {currentQuestionIndex === questions.length - 1 ? 'Finish & View Score' : 'Next Question'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
