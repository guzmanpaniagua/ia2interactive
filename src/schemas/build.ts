export interface PageOutput {
  filename: string;
  html: string;
}

export interface BuildResult {
  outputDir: string;
  pages: PageOutput[];
  assets: string[];
  errors: string[];
}

export interface BuildOptions {
  inputDir: string;
  outputDir?: string;
}
