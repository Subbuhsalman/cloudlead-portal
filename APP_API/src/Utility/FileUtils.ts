
// import fs from "fs-extra";

// import { formatErr } from "./utils";
// import { logger } from "./Logger";
// export function uploadToStorageBucket(
//   pdf_file_name: string,
//   pdf_file_path: string,
//   oss: any
// ) {
//   let remote_path = `/Report_order/TH/${pdf_file_name}`;
//   //logger.info(`upload_pdf: oss upload..., file_path=${pdf_file_path}, remote_path=${remote_path}`);
//   //return oss.put(pdf_file_path, remote_path);
//   return "";
// }

// export function deleteDir(path) {
//   let files = [];
//   try {
//     if (fs.existsSync(path)) {
//       files = fs.readdirSync(path);
//       files.forEach((file) => {
//         let curPath = path + "/" + file;
//         if (fs.statSync(curPath).isDirectory()) {
//           deleteDir(curPath); //递归删除文件夹
//         } else {
//           fs.unlinkSync(curPath); //删除文件
//         }
//       });
//       fs.rmdirSync(path);
//     }
//   } catch (err) {
//     logger.error(
//       "deleteDir: 删除目录失败。path=" + path + ", err=" + formatErr(err)
//     );
//   }
// }

// export async function saveToDisk(path: string, content: any) {
//   fs.writeFile(`${path}`, content, (err) => {
//     if (err) {
//       console.error(err);
//     } else {
//       // file written successfully
//     }
//   });
// }

// export function unzip(zipPath, outPath) {
//   return new Promise((resolve, reject) => {
//     if (!fs.existsSync(outPath)) {
//       fs.mkdirSync(outPath);
//     }

//     var proc = child_process.exec(`unzip -o ${zipPath} -d ${outPath}`, (error, stdout, stderr) => {
//       if (error) {
//         console.log(error.stack);
//         console.log('Error code: ' + error.code);
//         console.log('Signal received: ' + error.signal);
//       }

//       console.log('stdout: ' + stdout);
//       console.log('stderr: ' + stderr);
//     });

//     proc.on('exit', code => {
//       if (code == 0) {
//         resolve();
//       }
//       else {
//         reject(`unzip failed, zipPath=${zipPath}, outPath=${outPath}, exit code=${code}`);
//       }
//     });
//   });
// }
export function getExtensionFromMimetype(mimetype) {
  const mimeToExtMap = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/svg+xml": "svg",
    "image/bmp": "bmp",
    "image/tiff": "tiff",
    // Add more MIME types as needed
    // PDFs
    "application/pdf": "pdf",

    // Word Documents
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",

    // Excel
    "application/vnd.ms-excel": "xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",

    // PowerPoint
    "application/vnd.ms-powerpoint": "ppt",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",

    // Text files
    "text/plain": "txt",
    "text/csv": "csv",
    "application/rtf": "rtf",

    // JSON and XML
    "application/json": "json",
    "application/xml": "xml"
  };

  return mimeToExtMap[mimetype] || null; // Return null if MIME type is not recognized
}
