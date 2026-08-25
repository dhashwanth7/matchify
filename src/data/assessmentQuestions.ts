import { AssessmentQuestion, SkillLevel } from '../types';

export const QUESTION_BANKS: Record<string, AssessmentQuestion[]> = {
  'React': [
    {
      id: 'react-1',
      skillName: 'React',
      difficulty: 1,
      question: 'What is the primary purpose of the useEffect hook with an empty dependency array []?',
      options: [
        'It executes on every single component re-render.',
        'It runs once after the initial component mount.',
        'It prevents the component from rendering child elements.',
        'It automatically cleans up memory before state updates.'
      ],
      correctIndex: 1,
      explanation: 'An empty dependency array [] indicates that the effect has no reactive dependencies, so it only runs once after the initial render.'
    },
    {
      id: 'react-2',
      skillName: 'React',
      difficulty: 2,
      question: 'In React 18/19, how does state batching behave in asynchronous callbacks (such as setTimeout or fetch)?',
      options: [
        'State updates are never batched inside async callbacks.',
        'State updates are automatically batched across all event handlers and async callbacks.',
        'Batching only occurs if wrapped in flushSync().',
        'Batching causes an immediate synchronous DOM repaint.'
      ],
      correctIndex: 1,
      explanation: 'React 18+ introduced Automatic Batching, combining multiple state updates into a single render even inside promises, setTimeout, and native event handlers.'
    },
    {
      id: 'react-3',
      skillName: 'React',
      difficulty: 3,
      question: 'Consider the code below. Why is passing an inline object to a memoized child component problematic?',
      codeSnippet: `const Parent = () => {\n  const [count, setCount] = useState(0);\n  return <MemoizedChild config={{ theme: 'dark', size: 'lg' }} />;\n};`,
      options: [
        'It causes a syntax error in strict mode.',
        'A new object reference is created on every Parent render, breaking React.memo shallow equality check.',
        'React cannot serialize object props in Client Components.',
        'The child component will throw a null reference error.'
      ],
      correctIndex: 1,
      explanation: 'React.memo performs shallow comparison (`Object.is`). Inline object literals generate a new reference on every render, defeating the memoization.'
    },
    {
      id: 'react-4',
      skillName: 'React',
      difficulty: 4,
      question: 'When using useMemo, what is the trade-off you should evaluate before applying it?',
      options: [
        'useMemo completely prevents garbage collection of all parent variables.',
        'The memory and execution overhead of dependency comparison vs the actual computation cost.',
        'useMemo cannot be used with custom hooks.',
        'useMemo causes async race conditions during concurrent rendering.'
      ],
      correctIndex: 1,
      explanation: 'useMemo has overhead (allocating memory for deps, shallow equality checking). It is only beneficial for computationally heavy calculations or stable references.'
    },
    {
      id: 'react-5',
      skillName: 'React',
      difficulty: 5,
      question: 'How does React Fiber architecture handle concurrent rendering prioritization?',
      options: [
        'By running multiple JavaScript threads via Web Workers.',
        'By breaking rendering work into incremental fiber units that can be paused, aborted, or prioritized based on lane priorities.',
        'By using WebAssembly to bypass browser DOM manipulations.',
        'By converting JSX into raw Canvas pixel buffers.'
      ],
      correctIndex: 1,
      explanation: 'React Fiber represents the component tree as a linked list of fibers, allowing the scheduler to yield to the browser main thread and prioritize urgent user input over transitions.'
    }
  ],
  'Python': [
    {
      id: 'py-1',
      skillName: 'Python',
      difficulty: 1,
      question: 'What is the output of `[x**2 for x in range(5) if x % 2 == 0]`?',
      options: [
        '[0, 4, 16]',
        '[1, 9]',
        '[0, 1, 4, 9, 16]',
        '[4, 16]'
      ],
      correctIndex: 0,
      explanation: 'Even numbers in range(5) are 0, 2, 4. Their squares are 0, 4, 16.'
    },
    {
      id: 'py-2',
      skillName: 'Python',
      difficulty: 2,
      question: 'What is the fundamental difference between `list.append(item)` and `list.extend(iterable)`?',
      options: [
        '`append` adds the element as a single item; `extend` unpacks and appends each element of the iterable.',
        '`append` returns a new list; `extend` modifies in place.',
        '`append` is O(N); `extend` is O(1).',
        '`extend` only works with tuples.'
      ],
      correctIndex: 0,
      explanation: '`append` adds whatever object you pass as one item at the end. `extend` iterates over the argument and appends each element individually.'
    },
    {
      id: 'py-3',
      skillName: 'Python',
      difficulty: 3,
      question: 'In Python 3, how does a generator function using `yield` conserve memory compared to returning a list?',
      options: [
        'It compiles the bytecode to C memory pointers.',
        'It produces items on-demand (lazy evaluation) one at a time, maintaining state without storing the entire sequence in RAM.',
        'It compresses the output using gzip compression.',
        'It runs on a separate OS subprocess.'
      ],
      correctIndex: 1,
      explanation: 'Generators compute values lazily upon `next()`, maintaining their execution stack frame without allocating memory for the whole list at once.'
    },
    {
      id: 'py-4',
      skillName: 'Python',
      difficulty: 4,
      question: 'What is the Global Interpreter Lock (GIL) in CPython and its direct impact on multithreading?',
      options: [
        'A security lock preventing unauthorized network socket access.',
        'A mutex that allows only one native thread to execute Python bytecode at a time, making CPU-bound threads non-parallel.',
        'A garbage collection mechanism for circular references.',
        'A lock that prevents modification of built-in global variables.'
      ],
      correctIndex: 1,
      explanation: 'The GIL prevents multiple native threads from executing CPython bytecode simultaneously, which limits CPU-bound parallel execution (use multiprocessing instead).'
    },
    {
      id: 'py-5',
      skillName: 'Python',
      difficulty: 5,
      question: 'How do Python decorators with arguments work under the hood?',
      codeSnippet: `@rate_limit(max_requests=5)\ndef fetch_data():\n    pass`,
      options: [
        'They replace the function with an AST syntax tree.',
        'They are decorator factories: a higher-order function returning a decorator function that wraps the original callable.',
        'They execute the inner function at import time.',
        'They modify the Python bytecode directly via ctypes.'
      ],
      correctIndex: 1,
      explanation: 'A decorator taking arguments is called first with those arguments, and it returns the actual decorator function which then receives `fetch_data`.'
    }
  ],
  'Machine Learning': [
    {
      id: 'ml-1',
      skillName: 'Machine Learning',
      difficulty: 1,
      question: 'In a medical cancer detection model where missing a positive case is catastrophic, which metric should be prioritized?',
      options: [
        'High Precision',
        'High Recall (Sensitivity)',
        'Accuracy on imbalanced data',
        'Lowest training loss'
      ],
      correctIndex: 1,
      explanation: 'Recall measures the proportion of actual positives correctly identified. Minimizing false negatives (missed cancer cases) requires high recall.'
    },
    {
      id: 'ml-2',
      skillName: 'Machine Learning',
      difficulty: 2,
      question: 'What is the primary purpose of Dropout during neural network training?',
      options: [
        'To speed up gradient descent by reducing matrix dimensions.',
        'To regularize the model and reduce overfitting by randomly disabling a fraction of neurons per forward pass.',
        'To prevent gradient vanishing in deep architectures.',
        'To normalize input batch distributions.'
      ],
      correctIndex: 1,
      explanation: 'Dropout forces neurons to learn robust features without co-adapting, serving as an effective regularization technique against overfitting.'
    },
    {
      id: 'ml-3',
      skillName: 'Machine Learning',
      difficulty: 3,
      question: 'In Transformer architectures, what is the computational complexity of standard Multi-Head Self-Attention with respect to sequence length N?',
      options: [
        'O(N)',
        'O(N log N)',
        'O(N²)',
        'O(2^N)'
      ],
      correctIndex: 2,
      explanation: 'Standard self-attention computes query-key dot products for every token pair in the sequence, yielding quadratic O(N²) time and memory complexity.'
    },
    {
      id: 'ml-4',
      skillName: 'Machine Learning',
      difficulty: 4,
      question: 'When implementing Retrieval-Augmented Generation (RAG), what metric is typically used to measure embedding similarity between query and documents?',
      options: [
        'Cosine Similarity / Dot Product',
        'Cross-Entropy Loss',
        'Kullback-Leibler Divergence',
        'Gini Impurity'
      ],
      correctIndex: 0,
      explanation: 'Vector search compares normalized vector representations using cosine similarity or inner product to measure semantic proximity.'
    },
    {
      id: 'ml-5',
      skillName: 'Machine Learning',
      difficulty: 5,
      question: 'What is the key mechanism in LoRA (Low-Rank Adaptation) for efficient LLM fine-tuning?',
      options: [
        'Pruning 90% of model attention weights to zero.',
        'Decomposing weight update matrices ΔW into low-rank factor matrices A and B (ΔW = B × A) while freezing pretrained weights.',
        'Quantizing all weights to 1-bit integers.',
        'Training only the softmax classification head.'
      ],
      correctIndex: 1,
      explanation: 'LoRA freezes pretrained weights W and trains rank decomposition matrices A and B where rank r << d, dramatically cutting trainable parameters and memory.'
    }
  ],
  'UI/UX Design': [
    {
      id: 'ux-1',
      skillName: 'UI/UX Design',
      difficulty: 1,
      question: 'According to WCAG 2.1 AA standards, what is the minimum required contrast ratio for normal body text against its background?',
      options: [
        '2:1',
        '3:1',
        '4.5:1',
        '7:1'
      ],
      correctIndex: 2,
      explanation: 'WCAG 2.1 AA mandates a minimum contrast ratio of 4.5:1 for standard text and 3:1 for large text (18pt+ or 14pt bold).'
    },
    {
      id: 'ux-2',
      skillName: 'UI/UX Design',
      difficulty: 2,
      question: 'What does "Fitts\'s Law" state in the context of user interface and button placement?',
      options: [
        'The time to acquire a target is a function of the distance to and width of the target.',
        'Users spend most of their time on other sites, so your site should look familiar.',
        'The average person can only keep 7 items in working memory.',
        'Complex systems always contain an irreducible amount of complexity.'
      ],
      correctIndex: 0,
      explanation: 'Fitts\'s Law dictates that larger and closer interactive targets are faster and easier for users to click or tap.'
    },
    {
      id: 'ux-3',
      skillName: 'UI/UX Design',
      difficulty: 3,
      question: 'What is the primary advantage of establishing Design Tokens in a design system?',
      options: [
        'They replace the need for UX wireframes.',
        'They provide a single source of truth for design values (colors, spacing, typography) that sync seamlessly across Figma and code.',
        'They automatically translate web pages into multiple languages.',
        'They prevent layout shifts during image loading.'
      ],
      correctIndex: 1,
      explanation: 'Design tokens abstract visual properties into platform-agnostic key-value pairs, maintaining brand consistency across design and engineering.'
    },
    {
      id: 'ux-4',
      skillName: 'UI/UX Design',
      difficulty: 4,
      question: 'In UX research, when is a "Heuristic Evaluation" most appropriate compared to usability testing?',
      options: [
        'When you want actual end-users to test a live product.',
        'When expert evaluators review an interface against recognized usability principles (e.g. Nielsen\'s 10 Heuristics) quickly and cost-effectively before user testing.',
        'When calculating statistical quantitative conversion funnels.',
        'When auditing database schema constraints.'
      ],
      correctIndex: 1,
      explanation: 'Heuristic evaluation is an expert review method to catch obvious usability flaws before spending time and budget on recruiting test participants.'
    },
    {
      id: 'ux-5',
      skillName: 'UI/UX Design',
      difficulty: 5,
      question: 'What UX problem does "Progressive Disclosure" specifically solve?',
      options: [
        'Slow database query times.',
        'Cognitive overload by presenting only essential information initially and revealing advanced options on demand.',
        'Color blindness accessibility issues.',
        'Responsive viewport resizing lag.'
      ],
      correctIndex: 1,
      explanation: 'Progressive disclosure keeps interfaces simple and scan-friendly for novice users while providing deep power tools when requested.'
    }
  ],
  'SQL / Data Engineering': [
    {
      id: 'sql-1',
      skillName: 'SQL / Data Engineering',
      difficulty: 1,
      question: 'What is the difference between WHERE and HAVING clauses in SQL?',
      options: [
        'WHERE filters rows before grouping/aggregation; HAVING filters aggregated groups.',
        'WHERE only works with string columns; HAVING works with numbers.',
        'HAVING is faster than WHERE in all databases.',
        'They are completely identical synonyms.'
      ],
      correctIndex: 0,
      explanation: 'WHERE filters individual row records before GROUP BY aggregation occurs; HAVING filters the aggregated summary rows.'
    },
    {
      id: 'sql-2',
      skillName: 'SQL / Data Engineering',
      difficulty: 2,
      question: 'Which index type is best suited for querying high-cardinality equality lookups (e.g. searching user by UUID)?',
      options: [
        'B-Tree / Hash Index',
        'Bitmap Index',
        'Full-text soundex index',
        'Spatial R-Tree'
      ],
      correctIndex: 0,
      explanation: 'B-Tree and Hash indexes offer O(log N) or O(1) point lookups on high-cardinality keys like UUIDs.'
    },
    {
      id: 'sql-3',
      skillName: 'SQL / Data Engineering',
      difficulty: 3,
      question: 'What is the primary difference between an ETL (Extract, Transform, Load) and ELT (Extract, Load, Transform) architecture?',
      options: [
        'ELT transforms raw data inside the scalable cloud data warehouse after loading, leveraging massive parallel compute.',
        'ETL does not require a database.',
        'ELT is only used for batch files smaller than 1 MB.',
        'ETL cannot be automated.'
      ],
      correctIndex: 0,
      explanation: 'ELT loads raw data directly into modern cloud analytical engines (like BigQuery or Snowflake) and performs transformations in-engine.'
    },
    {
      id: 'sql-4',
      skillName: 'SQL / Data Engineering',
      difficulty: 4,
      question: 'How do SQL window functions (e.g. ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC)) differ from GROUP BY?',
      options: [
        'Window functions calculate aggregations across a set of rows while preserving individual row identity without collapsing rows.',
        'Window functions delete duplicate rows automatically.',
        'Window functions cannot use ORDER BY.',
        'Window functions only work in SQLite.'
      ],
      correctIndex: 0,
      explanation: 'Window functions perform calculations across partitions while retaining the full granularity of every individual row.'
    },
    {
      id: 'sql-5',
      skillName: 'SQL / Data Engineering',
      difficulty: 5,
      question: 'In distributed data pipelines, how does "Partition Pruning" optimize analytical query execution times and cloud costs?',
      options: [
        'By skipping entire storage chunks/partitions whose partition keys do not match query WHERE filters, avoiding expensive full-table scans.',
        'By compressing all string columns to 8-bit integers.',
        'By executing queries exclusively in L1 CPU cache.',
        'By converting relational data into unstructured text files.'
      ],
      correctIndex: 0,
      explanation: 'Partition pruning reads only matching partitions, slashing I/O, compute time, and query scan costs significantly.'
    }
  ]
};

export function calculateSkillLevelFromScore(scorePercentage: number): SkillLevel {
  if (scorePercentage >= 85) return 5;
  if (scorePercentage >= 70) return 4;
  if (scorePercentage >= 50) return 3;
  if (scorePercentage >= 30) return 2;
  return 1;
}

export function getSkillLevelLabel(level: SkillLevel): { label: string; description: string; color: string; badgeBg: string } {
  switch (level) {
    case 5:
      return { label: 'Expert (Lvl 5)', description: 'Mastery of advanced architecture & patterns', color: 'text-emerald-700 dark:text-emerald-400', badgeBg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30' };
    case 4:
      return { label: 'Advanced (Lvl 4)', description: 'Hands-on proficiency & problem solving', color: 'text-blue-700 dark:text-blue-400', badgeBg: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30' };
    case 3:
      return { label: 'Intermediate (Lvl 3)', description: 'Practical experience on real projects', color: 'text-indigo-700 dark:text-indigo-400', badgeBg: 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30' };
    case 2:
      return { label: 'Beginner (Lvl 2)', description: 'Fundamental knowledge & basic syntax', color: 'text-amber-700 dark:text-amber-400', badgeBg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30' };
    case 1:
    default:
      return { label: 'Novice (Lvl 1)', description: 'Introductory exposure & learning', color: 'text-slate-600 dark:text-slate-400', badgeBg: 'bg-slate-50 dark:bg-slate-500/10 border-slate-200 dark:border-slate-500/30' };
  }
}
