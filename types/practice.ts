export type MemoryGameQuestionType =
  | 'image-to-dish'
  | 'ingredients-to-dish'
  | 'missing-ingredient'
  | 'allergen'
  | 'dietary-tag'
  | 'dish-to-ingredients';

export interface MemoryGameOption {
  id: string; // Unique identifier of the option
  label: string; // The display label shown to the waiter
}

// Runtime validation in the question generator must ensure:
// - correctAnswerId exists exactly once in options
// - option IDs are unique
// - questions without enough valid distractors are skipped
export interface BaseMemoryGameQuestion {
  id: string;
  type: MemoryGameQuestionType;
  prompt: string;
  options: MemoryGameOption[];
  correctAnswerId: string; // Matches option.id
  dishId: string; // The target dish ID
  category?: string; // Optional: category of the dish (questions needing category matching will be skipped if missing)
  explanation?: string; // Optional feedback shown after answer selection
}

export interface ImageToDishQuestion extends BaseMemoryGameQuestion {
  type: 'image-to-dish';
  imageUrl: string; // Required for image questions
  imageSource: 'uploaded' | 'ai-illustration'; // Required for image questions
}

export interface NonImageQuestion extends BaseMemoryGameQuestion {
  type: Exclude<MemoryGameQuestionType, 'image-to-dish'>;
  imageUrl?: never; // Forbidden for non-image questions
  imageSource?: never; // Forbidden for non-image questions
}

export type MemoryGameQuestion = ImageToDishQuestion | NonImageQuestion;

export interface MemoryGameRound {
  questions: MemoryGameQuestion[];
  currentQuestionIndex: number;
}

export interface MemoryGameAnswerResult {
  questionId: string;
  selectedAnswerId: string;
  isCorrect: boolean;
}
