const fs = require('fs').promises;
const path = require('path');
const sass = require('sass');
const chokidar = require('chokidar');

async function compileFile(sourceFilePath, outputFilePath) {
  try {
    // 修改输出文件的扩展名为 '.ttss'
    const outputPath = path.resolve(path.dirname(sourceFilePath), path.basename(sourceFilePath, '.scss') + '.ttss');

    // 在异步操作之前检查文件是否存在，使用数字值 4 代表 R_OK
    await fs.access(sourceFilePath, 4);

    const result = sass.renderSync({
      file: sourceFilePath,
      outputStyle: 'expanded',
    });

    await fs.writeFile(outputPath, result.css);
    console.log(`Compiled: ${sourceFilePath}`);
  } catch (error) {
    console.error(`Error compiling ${sourceFilePath}:`, error.message);
  }
}

async function compileAllFiles() {
  const rootFolderPath = process.cwd(); // 获取当前工作目录
  const scssFiles = await getAllScssFiles(rootFolderPath);

  const compilePromises = scssFiles.map(async (scssFile) => {
    // 修改输出文件的扩展名为 '.ttss'
    const outputFilePath = path.join(rootFolderPath, scssFile.replace('.scss', '.ttss'));

    await compileFile(scssFile, outputFilePath);
  });

  await Promise.all(compilePromises);
  console.log('Compilation complete.');
}

async function getAllScssFiles(folderPath) {
  const allFiles = await fs.readdir(folderPath, { withFileTypes: true });
  const scssFiles = [];

  for (const file of allFiles) {
    const filePath = path.join(folderPath, file.name);

    if (file.isDirectory()) {
      // 如果是目录，递归获取其中的 scss 文件
      const nestedScssFiles = await getAllScssFiles(filePath);
      scssFiles.push(...nestedScssFiles);
    } else if (file.isFile() && filePath.toLowerCase().endsWith('.scss')) {
      // 如果是文件并且是 scss 文件，加入到列表中
      scssFiles.push(filePath);
    }
  }

  return scssFiles;
}

// Watch for changes and trigger compilation
const watcher = chokidar.watch(path.join(process.cwd(), '**/*.scss'), {
  persistent: true,
});

watcher.on('change', (changedFilePath) => {
  const resolvedPath = path.resolve(changedFilePath);
//   console.log(233, resolvedPath);
  compileFile(resolvedPath, resolvedPath.replace('.scss', '.ttss'))
    .then(() => {
      console.log('Compilation triggered by file change.');
    })
    .catch(error => {
      console.error('Error during compilation:', error);
    });
});

compileAllFiles();
