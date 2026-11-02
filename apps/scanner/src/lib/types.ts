export type Row = Record<string, string>

export interface ExtractionResult {
  /** Column names in display order. */
  columns: string[]
  /** One object per detected record. Keys should be a subset of `columns`. */
  rows: Row[]
  /** True when the server had no API key and returned sample data. */
  demo?: boolean
  /** Short human-readable note (e.g. why demo mode, or a warning). */
  note?: string
}

export interface ExtractRequest {
  /** data: URL (base64) of the image to read. */
  image: string
  /**
   * Optional list of column names the user wants. When provided, the model is
   * asked to map everything onto these columns. When empty, it infers columns.
   */
  columns?: string[]
  /** Optional hint describing what the document is (e.g. "event sign-up sheet"). */
  hint?: string
}
