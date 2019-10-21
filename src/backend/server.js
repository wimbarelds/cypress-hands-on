const express = require('express');
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');

const app = express();
const port = 8040;

const exploreRootPath = path.join(__dirname, '../..');
const distPath = path.join(__dirname, '../../dist');

app.post('*', (req, res, next) => {
    // Only allow reasonably legit values
    if (req.originalUrl.indexOf('..') >= 0) return next();
    if (req.originalUrl.indexOf('//') >= 0) return next();
    if (req.originalUrl.indexOf('node_modules') >= 0) return next();
    if (req.originalUrl.indexOf('.git') >= 0) return next();
    if (req.originalUrl[0] !== '/') return next();
    // Figure out which file were trying to get
    const filepath = path.join(exploreRootPath, `.${req.originalUrl}`).replace(/%20/g, ' ');
    // Last checks to make sure were actually inside the folder we want to browse and the file exists
    if (filepath.indexOf(exploreRootPath) !== 0) return next();
    if (!fs.existsSync(filepath)) return next();
    
    const stats = fs.lstatSync(filepath);
    const name = filepath.split(path.sep).pop();
    if (stats.isFile()) {
        setTimeout(() => {
            res.send({
                path: filepath,
                name,
                ext: (name.indexOf('.') >= 0) ? name.split('.').pop() : undefined,
                isFile: true,
                isDirectory: false,
                mime: mime.lookup(name),
                ...stats,
            });
        }, 250);
    } else if (stats.isDirectory()) {
        const content = fs.readdirSync(filepath)
            .filter((item) => item !== 'node_modules' && item !== '.git')
            .map((item) => {
                const itemPath = path.join(filepath, item);
                const itemStats = fs.lstatSync(itemPath);
                return {
                    filepath: (req.originalUrl.replace(/\\/g, '/') + '/' + item).replace('//', '/'),
                    path: itemPath,
                    name: item,
                    ext: (item.indexOf('.') >= 0) ? item.split('.').pop().toLowerCase() : undefined,
                    isFile: itemStats.isFile(),
                    isDirectory: itemStats.isDirectory(),
                    mime: itemStats.isFile() ? mime.lookup(itemPath) : undefined,
                    ...itemStats,
                };
            });
        
        setTimeout(() => {
            res.send(content);
        }, 250);
    } else {
        // Not sure if this can happen, but what the hell
        next();
    }
})

app.get('*', (req, res, next) => {
    if (req.originalUrl.indexOf('..') >= 0) return next();
    if (req.originalUrl.indexOf('//') >= 0) return next();
    if (req.originalUrl[0] !== '/') return next();
    // Figure out which file were trying to get
    const filepath = path.join(exploreRootPath, `.${req.originalUrl}`).replace(/%20/g, ' ');
    // Last checks to make sure were actually inside the folder we want to browse and the file exists
    if (filepath.indexOf(exploreRootPath) !== 0) return next();
    if (!fs.existsSync(filepath)) return next();

    const stats = fs.lstatSync(filepath);
    if (!stats.isFile()) return next();

    res.sendFile(filepath);
});

app.use(express.static(distPath));

app.listen(port, () => console.log(`vue-file-browser listening on http://localhost:${port}/`));