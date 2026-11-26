// Ambient globals loaded on demand by browser playgrounds and type-checked client scripts.
// Uses erasable TypeScript syntax only.

interface MonacoModel {
  uri: { toString(): string };
  getValue(): string;
  setValue(value: string): void;
  getPositionAt(offset: number): { lineNumber: number };
  onDidChangeContent(listener: () => void): void;
  dispose(): void;
}

interface MonacoEditorInstance {
  focus(): void;
  addCommand(keybinding: number, handler: () => void): void;
  dispose(): void;
}

interface MonacoMarker {
  severity: number;
  startLineNumber: number;
  message: string;
}

interface MonacoDiagnostic {
  category?: number;
  start?: number;
  messageText: string | { messageText: string };
}

interface MonacoTypeScriptWorker {
  getSemanticDiagnostics(fileName: string): Promise<MonacoDiagnostic[]>;
  getSyntacticDiagnostics(fileName: string): Promise<MonacoDiagnostic[]>;
}

interface MonacoNamespace {
  Uri: { parse(value: string): MonacoModel['uri'] };
  MarkerSeverity: { Error: number };
  KeyMod: { CtrlCmd: number };
  KeyCode: { Enter: number };
  editor: {
    defineTheme(name: string, data: Record<string, unknown>): void;
    setTheme(name: string): void;
    createModel(value: string, language: string, uri: MonacoModel['uri']): MonacoModel;
    create(host: HTMLElement, options: Record<string, unknown>): MonacoEditorInstance;
    getModelMarkers(filter: { resource: MonacoModel['uri'] }): MonacoMarker[];
    getModels(): MonacoModel[];
  };
  languages: {
    typescript: {
      ScriptTarget: { ESNext: number };
      ModuleKind: { ESNext: number };
      JsxEmit: { ReactJSX: number };
      typescriptDefaults: {
        setCompilerOptions(opts: Record<string, unknown>): void;
        addExtraLib(content: string, filePath?: string): void;
      };
      getTypeScriptWorker(): Promise<(uri: MonacoModel['uri']) => Promise<MonacoTypeScriptWorker>>;
    };
  };
}

interface TypeScriptGlobal {
  version: string;
  JsxEmit: { ReactJSX: number };
  transpileModule(
    input: string,
    transpileOptions: { fileName?: string; reportDiagnostics?: boolean; compilerOptions?: Record<string, unknown> },
  ): {
    outputText: string;
    diagnostics?: Array<{ messageText: string | { messageText: string } }>;
  };
  flattenDiagnosticMessageText(diag: string | { messageText: string } | undefined, newLine: string): string;
}

interface SqlJsDatabase {
  run(sql: string): void;
  exec(sql: string): Array<{ columns: string[]; values: unknown[][] }>;
  getRowsModified(): number;
  close(): void;
}

interface SqlJsModule {
  Database: new () => SqlJsDatabase;
}

interface AmdDefine {
  (...args: unknown[]): unknown;
  amd?: unknown;
}

interface RequireJsLoader {
  (deps: string[], onLoad: () => void, onError?: (err: unknown) => void): void;
  config(cfg: Record<string, unknown>): void;
}

interface Window {
  monaco?: MonacoNamespace;
  ts?: TypeScriptGlobal;
  initSqlJs?: (config: { locateFile: (file: string) => string }) => Promise<SqlJsModule>;
  define?: AmdDefine;
  require?: RequireJsLoader;
  MonacoEnvironment?: { getWorkerUrl: () => string };
}

interface HTMLTextAreaElement {
  typeErrors?: () => Promise<string[]>;
}
