#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 获取package.json中的版本号
const packageJsonPath = path.resolve(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const currentVersion = packageJson.version;

console.log(`当前版本号: ${currentVersion}`);

// 自动递增版本号
function incrementVersion(version) {
  const parts = version.split('.');
  if (parts.length !== 3) {
    throw new Error('版本号格式不正确，应为 x.y.z');
  }

  // 递增补丁版本号
  const major = parseInt(parts[0], 10);
  const minor = parseInt(parts[1], 10);
  const patch = parseInt(parts[2], 10) + 1;

  return `${major}.${minor}.${patch}`;
}

// 自动递增版本号
const newVersion = incrementVersion(currentVersion);
console.log(`新版本号: ${newVersion}`);

// 询问提交信息
rl.question('请输入版本提交信息 (留空则使用默认信息): ', (commitMessage) => {
  commitMessage = commitMessage || `版本 ${newVersion} 发布`;

  try {
    // 更新package.json中的版本号
    packageJson.version = newVersion;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    console.log(`已更新package.json中的版本号为 ${newVersion}`);

    // 更新CHANGELOG.md
    updateChangelog(newVersion, commitMessage);

    // Git操作
    execSync('git add package.json CHANGELOG.md');
    execSync(`git commit -m "release: v${newVersion}"`);
    execSync(`git tag -a v${newVersion} -m "${commitMessage}"`);

    console.log(`\n版本 v${newVersion} 已创建并提交`);
    console.log('\n执行以下命令推送到远程仓库:');
    console.log('  git push origin main');
    console.log(`  git push origin v${newVersion}`);

    rl.close();
  } catch (error) {
    console.error('发布过程中出错:', error.message);
    rl.close();
  }
});

// 更新CHANGELOG.md
function updateChangelog(version, message) {
  const changelogPath = path.resolve(__dirname, '../CHANGELOG.md');
  const today = new Date().toISOString().split('T')[0];

  let changelog = fs.readFileSync(changelogPath, 'utf8');

  // 创建新的版本条目
  const newEntry = `## [${version}] - ${today}\n\n### 变更\n\n- ${message}\n\n`;

  // 在第一个版本条目前插入新条目
  const lines = changelog.split('\n');
  let insertIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('## [')) {
      insertIndex = i;
      break;
    }
  }

  if (insertIndex !== -1) {
    lines.splice(insertIndex, 0, newEntry);
  } else {
    // 如果没有找到现有版本条目，则添加到文件末尾
    lines.push(newEntry);
  }

  fs.writeFileSync(changelogPath, lines.join('\n'));
  console.log('已更新CHANGELOG.md');
}