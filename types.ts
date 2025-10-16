export enum OptimizationCategory {
  NORMALIZATION = 'Normalization',
  INDEXING = 'Indexing',
  QUERY_OPTIMIZATION = 'Query Optimization',
  STORAGE = 'Storage',
  DATA_TYPES = 'Data Types',
  OTHER = 'Other'
}

export enum SuggestionSeverity {
  CRITICAL = 'Critical',
  MODERATE = 'Moderate',
  GOOD = 'Good',
}

export interface OptimizationSuggestion {
  category: OptimizationCategory;
  suggestion: string;
  rationale: string;
  severity: SuggestionSeverity;
}

export interface ERFile {
  name: string;
  type: string;
  content: string; // base64 for images, text for others
}