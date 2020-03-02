import * as _fs from 'fs'
const fs = _fs.promises

/**
 * Returns all child directories of a parent directory
 * @param rootDir 
 */
export async function getDirs(rootDir: string) {
  const files = await fs.readdir(rootDir)
  const dirs = []
  for (var index = 0; index < files.length; ++index) { 
    const file = files[index]; 
    if (file[0] !== '.') { 
      const filePath = rootDir + '/' + file; 
      const stat = await fs.stat(filePath)
      if (stat.isDirectory()) { 
          dirs.push(file); 
      } 
    }
  }  
  return dirs
}