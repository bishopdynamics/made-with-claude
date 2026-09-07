import { defineEcConfig } from 'astro-expressive-code';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import { bundledLanguages } from 'shiki/langs';

const languageLabels = {
  ts: 'TypeScript',
  typescript: 'TypeScript',
  js: 'JavaScript',
  javascript: 'JavaScript',
  cpp: 'C++',
  c: 'C',
  bash: 'Shell',
  sh: 'Shell',
  shell: 'Shell',
  shellscript: 'Shell',
};

export const markdownCodeOptions = defineEcConfig({
  themes: ['github-dark'],
  useDarkModeMediaQuery: false,
  tabWidth: 0,
  defaultProps: { frame: 'code', showLineNumbers: false, wrap: false },
  frames: {
    extractFileNameFromCode: false,
    removeCommentsWhenCopyingTerminalFrames: false,
  },
  styleOverrides: {
    codeBackground: '#141414',
    codeFontFamily: '"JetBrains Mono", ui-monospace, monospace',
    borderColor: '#343434',
    frames: {
      editorTabBarBackground: '#141414',
      editorActiveTabBackground: '#141414',
      editorActiveTabForeground: '#E5E3DE',
      editorActiveTabIndicatorTopColor: '#D4A15A',
    },
  },
  plugins: [
    {
      name: 'project-code-defaults',
      hooks: {
        preprocessLanguage: ({ codeBlock }) => {
          const language = codeBlock.language.toLowerCase();
          codeBlock.language = Object.hasOwn(bundledLanguages, language)
            ? language
            : 'text';
        },
        preprocessMetadata: ({ codeBlock }) => {
          codeBlock.props.title =
            codeBlock.metaOptions.getString('title') ||
            codeBlock.props.title ||
            languageLabels[codeBlock.language] ||
            (codeBlock.language === 'text' ? 'Plain text' : codeBlock.language);
        },
      },
    },
    pluginLineNumbers(),
  ],
});
