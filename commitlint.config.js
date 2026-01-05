export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // Tính năng mới
        'fix',      // Sửa bug
        'docs',     // Cập nhật documentation
        'style',    // Thay đổi format code (không ảnh hưởng logic)
        'refactor', // Refactor code
        'test',     // Thêm hoặc sửa test
        'chore',    // Cập nhật build tools, dependencies
        'perf',     // Cải thiện performance
        'ci',       // Thay đổi CI/CD
        'build',    // Thay đổi build system
        'revert'    // Revert commit trước đó
      ]
    ],
    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],
    'subject-max-length': [2, 'always', 100],
    'body-max-line-length': [2, 'always', 100]
  }
};