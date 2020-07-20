/*
 * File: install-modules.js
 * Project: expressway
 * File Created: Saturday, 30th May 2020 6:46:02 am
 * Author: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Last Modified: Monday, 20th July 2020 11:36:40 am
 * Modified By: Temitayo Bodunrin (temitayo@camelcase.co)
 * -----
 * Copyright 2020, CamelCase Technologies Ltd
 */
require('colors');

const { exec } = require('child_process'),
    fs = require('fs'),
    path = require('path');

/**
 * Install npm dependencies
 * @param {Array} dependencies The dependencies to install
 *
 * @throws {TypeError}
 * @return {bool}    It is done
 */
const installModules = async (dependencies) => {
    if (!Array.isArray(dependencies)) {
        if (typeof dependencies === 'string') {
            dependencies = [dependencies];
        } else {
            throw new TypeError('Dependencies must be array or string');
        }
    }

    let toInstall = [...dependencies];

    try {
        // Please use require.resolve('module') later;
        const installedPackages = await new Promise((resolve, reject) => {
            let pkg = fs.readFileSync(path.join(appRoot, '../package.json'));

            if (pkg) {
                pkg = JSON.parse(pkg);

                resolve({
                    ...pkg.dependencies,
                    ...pkg.devDependencies,
                });

                reject(new ReferenceError('package.json not found'));
            }
        });

        for (var i = 0; i < dependencies.length; i++) {
            if (installedPackages[toInstall[0]]) {
                toInstall.splice(0, 1);
            }
        }
    } catch (error) {
        throw error;
    }

    if (!toInstall.length) {
        Promise.resolve(true);
        return;
    }

    console.log(`📦 Installing dependencies ${toInstall.join(',')}`.green);

    try {
        await new Promise((resolve, reject) => {
            exec(`yarn add ${toInstall.join(' ')}`, (err, stdout, stderr) => {
                if (err) {
                    reject(err);
                }

                // the *entire* stdout and stderr (buffered)
                // console.log(`stdout: ${stdout}`);
                // console.log(`stderr: ${stderr}`);

                resolve({
                    stdout,
                });
            });
        });
        console.log(`✅ Dependencies installed`.green);
        // console.log(`Restarting...`.green);

        // RESTART APPLICATION
        //CREDIT thekenyandev.com/blog/how-to-restart-a-node-js-app-programmatically/
        // setTimeout(function () {
        // 	process.on('exit', function () {
        // 		require('child_process').spawn(
        // 			process.argv.shift(),
        // 			process.argv,
        // 			{
        // 				cwd: process.cwd(),
        // 				detached: true,
        // 				stdio: 'inherit',
        // 			}
        // 		);
        // 	});
        // 	process.exit();
        // }, 1000);

        return Promise.resolve(true);
    } catch (error) {
        throw error;
    }
};
module.exports = installModules;
