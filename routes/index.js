import { Router } from "express";
import * as url from 'url'
const __dirname = url.fileURLToPath(new URL(".", import.meta.url))
import path from "path";

const router = Router()
/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

export {
  router as indexRouter
}
